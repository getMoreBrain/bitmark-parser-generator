import { Builder } from '../../../../ast/Builder';
import { Breakscape } from '../../../../breakscaping/Breakscape';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { Body, BodyBit, BodyPart } from '../../../../model/ast/Nodes';
import { JsonText, TextAst } from '../../../../model/ast/TextNodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { BodyBitType } from '../../../../model/enum/BodyBitType';
import { TextFormat, TextFormatType } from '../../../../model/enum/TextFormat';
import { BodyBitJson, GapJson, HighlightJson, MarkJson, SelectJson } from '../../../../model/json/BodyBitJson';
import { StringUtils } from '../../../../utils/StringUtils';
import { TextParser } from '../../../text/TextParser';
import { BitContentProcessorResult, BitmarkPegParserContext, ContentDepthType } from '../BitmarkPegParserTypes';
import { BitmarkPegParserValidator } from '../BitmarkPegParserValidator';

import { ContentProcessorUtils } from './ContentProcessorUtils';

export interface BodyText extends BodyPart {
  type: 'text';
  data: {
    bodyText: BreakscapedString;
    isPlain: boolean;
  };
}

const builder = new Builder();
const textParser = new TextParser();

class BodyContentProcessor {
  public process(
    context: BitmarkPegParserContext,
    contentDepth: ContentDepthType,
    bitType: BitTypeType,
    textFormat: TextFormatType,
    _tagsConfig: TagsConfig | undefined,
    _target: BitContentProcessorResult,
    bodyParts: BodyPart[],
    isCardBody: boolean,
  ): Body {
    let bodyJson: unknown | undefined | null;
    const bodyBits: BodyBit[] = [];
    let finalBodyText: JsonText | undefined;
    let finalBodyString: string | undefined;
    //
    const trimmedBodyParts = bodyParts.length > 0 ? this.trimBodyParts(bodyParts) : undefined;
    const validatedBodyParts = isCardBody
      ? trimmedBodyParts
      : BitmarkPegParserValidator.checkBody(context, contentDepth, bitType, textFormat, trimmedBodyParts);

    // If the text format is JSON, check the body is valid JSON
    // In this case, the body will already have been 'squashed' so will not contain any parsed inline body tags
    if (textFormat === TextFormat.json && validatedBodyParts) {
      bodyJson = validatedBodyParts.reduce((acc, val) => {
        if (val.type === BodyBitType.text && val.data) {
          const bodyTextVal = val as BodyText;
          return (acc + (bodyTextVal.data.bodyText ?? '')) as string;
        }
        return acc;
      }, '');
      try {
        bodyJson = JSON.parse(bodyJson as string);
      } catch (e) {
        bodyJson = null;
        context.addError(`Body JSON is invalid.`);
      }
    } else {
      // Standard body

      let bodyTextStr: BreakscapedString = '' as BreakscapedString;
      let plainBodyTextStr: BreakscapedString = '' as BreakscapedString;
      let bodyStr: BreakscapedString = '' as BreakscapedString;
      let placeholderIndex = 0;

      // Function for creating the placeholder keys
      const createPlaceholderKey = (i: number): BreakscapedString => `[!${i}]` as BreakscapedString;

      // Loop the text bodyParts creating full body text with the correct placeholders
      //
      // fullBodyTextStr:
      // - is created and passed into the text parser to create the body text AST
      // - has placeholders inserted into 'fullBodyTextStr' in the format [!0] to allow the text parser to identify
      //   where the body bits should be inserted.
      //
      if (validatedBodyParts) {
        for (let i = 0; i < validatedBodyParts.length; i++) {
          const bodyPart = validatedBodyParts[i];

          const isText = bodyPart.type === BodyBitType.text;

          if (isText) {
            const asText = bodyPart as BodyText;
            const bodyTextPart = asText.data.bodyText;

            // Append the text part to the full text body
            if (asText.data.isPlain) {
              plainBodyTextStr = Breakscape.concatenate(plainBodyTextStr, bodyTextPart);
            } else {
              bodyTextStr = Breakscape.concatenate(bodyTextStr, bodyTextPart);
            }
            bodyStr = Breakscape.concatenate(bodyStr, bodyTextPart);
          } else {
            const placeholderKey = createPlaceholderKey(placeholderIndex);

            // Append the placeholder to the full text body
            bodyTextStr = Breakscape.concatenate(bodyTextStr, placeholderKey);

            // Add the body bit to the body bits
            bodyBits.push(bodyPart as BodyBit);

            placeholderIndex++;
          }
        }
      }

      // Create the body text AST
      const isBitmarkText = textFormat === TextFormat.bitmarkMinusMinus || textFormat === TextFormat.bitmarkPlusPlus;

      const parsedBodyText: JsonText = isBitmarkText
        ? textParser.toAst(bodyTextStr, {
            //
            textFormat,
          })
        : Breakscape.unbreakscape(bodyTextStr, {
            bitTagOnly: !isBitmarkText,
          });

      const parserPlainText: JsonText = Breakscape.unbreakscape(plainBodyTextStr, {
        bitTagOnly: true,
      });

      // Newlines will have been lost from the end of bodyTextStr, and start of plainBodyTextStr
      // Count then and add them back when merging
      const newlines =
        StringUtils.countOccurrencesAtEnd(bodyTextStr, '\n') +
        StringUtils.countOccurrencesAtStart(plainBodyTextStr, '\n');

      finalBodyText = ContentProcessorUtils.concatenatePlainTextWithAstTexts(parsedBodyText, newlines, parserPlainText);
      finalBodyString = Breakscape.unbreakscape(bodyStr).trim() as BreakscapedString;
      const finalBodyIsAst = Array.isArray(finalBodyText);
      const bodyAst = finalBodyIsAst ? (finalBodyText as TextAst) : undefined;

      // Loop the body parts again to create the body bits:
      // - The body bits are inserted into body AST, replacing the placeholders created by the text parser
      if (bodyAst && validatedBodyParts) {
        placeholderIndex = 0;
        for (let i = 0; i < validatedBodyParts.length; i++) {
          const bodyPart = validatedBodyParts[i];

          // Skip text body parts as they are handled above
          const isText = bodyPart.type === BodyBitType.text;
          if (isText) continue;

          const bodyBit = bodyPart as BodyBit;
          let bodyBitJson: BodyBitJson | undefined;

          switch (bodyPart.type) {
            case BodyBitType.gap: {
              // const gap = bodyBit as Gap;
              // bodyBitJson = this.createGapJson(gap);
              bodyBitJson = bodyBit as GapJson;
              break;
            }

            case BodyBitType.mark: {
              // const mark = bodyBit as Mark;
              // bodyBitJson = this.createMarkJson(mark);
              bodyBitJson = bodyBit as MarkJson;
              break;
            }

            case BodyBitType.select: {
              // const select = bodyBit as SelectJson;
              // bodyBitJson = this.createSelectJson(select);
              bodyBitJson = bodyBit as SelectJson;
              break;
            }

            case BodyBitType.highlight: {
              // const highlight = bodyBit as Highlight;
              // bodyBitJson = this.createHighlightJson(highlight);
              bodyBitJson = bodyBit as HighlightJson;
              break;
            }
          }

          // Add the gap to the placeholders
          if (bodyBitJson) {
            // Insert the body bit into the body AST
            this.replacePlaceholderWithBodyBit(bodyAst, bodyBitJson, placeholderIndex);
          }

          placeholderIndex++;
        }
      }
    } // Standard body

    // Return the body in the target
    return builder.body({
      body: finalBodyText,
      bodyBits: bodyBits.length > 0 ? bodyBits : undefined,
      bodyString: finalBodyString,
      bodyJson,
    });
  }

  public buildBodyText(bodyTextPart: BreakscapedString, isPlain: boolean): BodyText {
    const bodyText: BodyText = {
      type: BodyBitType.text,
      data: {
        bodyText: bodyTextPart,
        isPlain,
      },
    };
    return bodyText;
  }

  /**
   * Walk the body AST to find the placeholder and replace it with the body bit.
   *
   * @param bodyAst the body AST
   * @param bodyBitJson the body bit json to insert at the placeholder position
   * @param index the index of the placeholder to replace
   */
  protected replacePlaceholderWithBodyBit(bodyAst: TextAst, bodyBitJson: BodyBitJson, index: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walkRecursive = (node: any, parent: any, parentKey: any): boolean => {
      if (Array.isArray(node)) {
        // Walk the array of nodes
        for (let i = 0; i < node.length; i++) {
          const child = node[i];
          const done = walkRecursive(child, node, i);
          if (done) return true;
        }
      } else {
        if (node.type === 'bit' && node.index === index) {
          // Found the placeholder, replace it with the body bit
          parent[parentKey] = bodyBitJson;
          return true;
        }
        if (node.content) {
          // Walk the child content
          const done = walkRecursive(node.content, node, 'content');
          if (done) return true;
        }
      }
      return false;
    };

    walkRecursive(bodyAst, null, null);
  }

  /**
   * Trim the body parts, removing any whitespace only parts at start and end of body
   *
   * @param parts the body parts to trim
   * @returns the trimmed body parts
   */
  private trimBodyParts(parts: BodyPart[]): BodyPart[] {
    // Trim start
    let foundText = false;
    let trimmedParts: BodyPart[] = parts.reduce((acc, part) => {
      const text = part as BodyText;
      if (!foundText && text.type === BodyBitType.text) {
        const t = text.data.bodyText.trimStart() as BreakscapedString;
        if (t) {
          foundText = true;
          text.data.bodyText = t;
          acc.push(text);
        }
      } else {
        // Not body text, so add it
        foundText = true;
        acc.push(part);
      }
      return acc;
    }, [] as BodyPart[]);

    // Trim end
    foundText = false;
    trimmedParts = trimmedParts.reduceRight((acc, part) => {
      const text = part as BodyText;
      if (!foundText && text.type === BodyBitType.text) {
        const t = text.data.bodyText.trimEnd() as BreakscapedString;
        if (t) {
          foundText = true;
          text.data.bodyText = t;
          acc.unshift(text);
        }
      } else {
        // Not body text, so add it
        foundText = true;
        acc.unshift(part);
      }
      return acc;
    }, [] as BodyPart[]);

    return trimmedParts;
  }

  // protected createGapJson(gap: Gap): GapJson {
  //   const data = gap.data;

  //   const defaultExample = data.solutions && data.solutions.length > 0 ? data.solutions[0] : '';

  //   // Create the gap
  //   const gapJson: Partial<GapJson> = {
  //     type: 'gap',
  //     ...ContentProcessorUtils.toItemLeadHintInstruction(data),
  //     isCaseSensitive: data.isCaseSensitive ?? true,
  //     ...ContentProcessorUtils.toExample(data, {
  //       defaultExample,
  //       isBoolean: false,
  //     }),
  //     solutions: data.solutions,
  //   };

  //   // Remove unwanted properties
  //   // if (!data.itemLead?.lead) delete gapJson.lead;

  //   return gapJson as GapJson;
  // }

  // protected createMarkJson(mark: Mark): MarkJson {
  //   const data = mark.data;

  //   // Create the mark
  //   const markJson: Partial<MarkJson> = {
  //     type: 'mark',
  //     solution: data.solution,
  //     mark: data.mark,
  //     ...ContentProcessorUtils.toItemLeadHintInstruction(data),
  //     ...ContentProcessorUtils.toExample(data, {
  //       defaultExample: true,
  //       isBoolean: true,
  //     }),
  //     //
  //   };

  //   // Remove unwanted properties
  //   // if (!data.itemLead?.lead) delete markJson.lead;

  //   return markJson as MarkJson;
  // }

  // protected createSelectJson(select: Select): SelectJson {
  //   const data = select.data;

  //   // Create the select options
  //   const options: SelectOptionJson[] = [];
  //   for (const option of data.options) {
  //     const optionJson: Partial<SelectOptionJson> = {
  //       text: option.text,
  //       isCorrect: option.isCorrect ?? false,
  //       ...ContentProcessorUtils.toItemLeadHintInstruction(option),
  //       ...ContentProcessorUtils.toExample(option, {
  //         defaultExample: !!option.isCorrect,
  //         isBoolean: true,
  //       }),
  //     };

  //     // Remove unwanted properties
  //     // if (!option.itemLead?.item) delete optionJson.item;
  //     // if (!option.itemLead?.lead) delete optionJson.lead;
  //     // if (!option.instruction) delete optionJson.instruction;

  //     options.push(optionJson as SelectOptionJson);
  //   }

  //   // Create the select
  //   const selectJson: Partial<SelectJson> = {
  //     type: 'select',
  //     prefix: data.prefix ?? '',
  //     postfix: data.postfix ?? '',
  //     ...ContentProcessorUtils.toItemLeadHintInstruction(data),
  //     isExample: data.isExample ?? false,
  //     options,
  //   };

  //   // Remove unwanted properties
  //   // if (!data.itemLead?.lead) delete selectJson.lead;

  //   return selectJson as SelectJson;
  // }

  // protected createHighlightJson(highlight: Highlight): HighlightJson {
  //   const data = highlight.data;

  //   // Create the highlight options
  //   const texts: HighlightTextJson[] = [];
  //   for (const text of data.texts) {
  //     const textJson: Partial<HighlightTextJson> = {
  //       text: text.text,
  //       isCorrect: text.isCorrect ?? false,
  //       isHighlighted: text.isHighlighted ?? false,
  //       ...ContentProcessorUtils.toItemLeadHintInstruction(text),
  //       ...ContentProcessorUtils.toExample(text, {
  //         defaultExample: !!text.isCorrect,
  //         isBoolean: true,
  //       }),
  //     };

  //     // Remove unwanted properties
  //     // if (!text.itemLead?.item) delete textJson.item;
  //     // if (!text.itemLead?.lead) delete textJson.lead;
  //     // if (!text.hint) delete textJson.hint;

  //     texts.push(textJson as HighlightTextJson);
  //   }

  //   // Create the select
  //   const highlightJson: Partial<HighlightJson> = {
  //     type: 'highlight',
  //     prefix: data.prefix ?? '',
  //     postfix: data.postfix ?? '',
  //     ...ContentProcessorUtils.toItemLeadHintInstruction(data),
  //     isExample: data.isExample ?? false,
  //     texts,
  //   };

  //   // Remove unwanted properties
  //   // if (!data.itemLead?.lead) delete highlightJson.lead;

  //   return highlightJson as HighlightJson;
  // }
}

const instance = new BodyContentProcessor();
export { instance as BodyContentProcessor };
