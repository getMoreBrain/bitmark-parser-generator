import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { type Body, type BodyPart } from '../../../../model/ast/Nodes.ts';
import { type JsonText, type TextAst } from '../../../../model/ast/TextNodes.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { type BitTypeType } from '../../../../model/enum/BitType.ts';
import { BodyBitType } from '../../../../model/enum/BodyBitType.ts';
import { TextFormat, type TextFormatType } from '../../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import {
  type BodyBitJson,
  type GapJson,
  type HighlightJson,
  type MarkJson,
  type SelectJson,
} from '../../../../model/json/BodyBitJson.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import { TextParser } from '../../../text/TextParser.ts';
import {
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
} from '../BitmarkPegParserTypes.ts';
import { BitmarkPegParserValidator } from '../BitmarkPegParserValidator.ts';
import { ContentProcessorUtils } from './ContentProcessorUtils.ts';

export interface BodyText extends BodyPart {
  type: 'text';
  data: {
    bodyText: BreakscapedString;
    isPlain: boolean;
  };
}

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
  ): Partial<Body> | undefined {
    const bodyBits: BodyBitJson[] = [];
    let finalBody: JsonText | unknown | undefined;
    let finalBodyString: string | undefined;
    //
    const trimmedBodyParts = bodyParts.length > 0 ? this.trimBodyParts(bodyParts) : undefined;
    const validatedBodyParts = isCardBody
      ? trimmedBodyParts
      : BitmarkPegParserValidator.checkBody(
          context,
          contentDepth,
          bitType,
          textFormat,
          trimmedBodyParts,
        );

    // If the text format is JSON, check the body is valid JSON
    // In this case, the body will already have been 'squashed' so will not contain any parsed inline body tags
    if (textFormat === TextFormat.json && validatedBodyParts) {
      finalBody = validatedBodyParts.reduce((acc, val) => {
        if (val.type === BodyBitType.text && val.data) {
          const bodyTextVal = val as BodyText;
          return (acc + (bodyTextVal.data.bodyText ?? '')) as string;
        }
        return acc;
      }, '');
      try {
        finalBody = JSON.parse(finalBody as string);
      } catch (_e) {
        finalBody = null;
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
            bodyBits.push(bodyPart as BodyBitJson);

            placeholderIndex++;
          }
        }
      }

      // Create the body text AST
      const isBitmarkText = textFormat === TextFormat.bitmarkText;

      const parsedBodyText: JsonText = isBitmarkText
        ? textParser.toAst(bodyTextStr, {
            //
            format: textFormat,
            location: TextLocation.body,
          })
        : Breakscape.unbreakscape(bodyTextStr, {
            format: TextFormat.plainText,
            location: TextLocation.body,
          });

      const parserPlainText: JsonText = Breakscape.unbreakscape(plainBodyTextStr, {
        format: TextFormat.plainText,
        location: TextLocation.body,
      });

      // Newlines will have been lost from the end of bodyTextStr, and start of plainBodyTextStr
      // Count then and add them back when merging
      const newlines =
        StringUtils.countOccurrencesAtEnd(bodyTextStr, '\n') +
        StringUtils.countOccurrencesAtStart(plainBodyTextStr, '\n');

      finalBody = ContentProcessorUtils.concatenatePlainTextWithAstTexts(
        parsedBodyText,
        newlines,
        parserPlainText,
      );
      finalBodyString = Breakscape.unbreakscape(bodyStr, {
        format: textFormat,
        location: TextLocation.body,
      }).trim() as BreakscapedString;
      const finalBodyIsAst = Array.isArray(finalBody);
      const bodyAst = finalBodyIsAst ? (finalBody as TextAst) : undefined;

      // Loop the body parts again to create the body bits:
      // - The body bits are inserted into body AST, replacing the placeholders created by the text parser
      if (bodyAst && validatedBodyParts) {
        placeholderIndex = 0;
        for (let i = 0; i < validatedBodyParts.length; i++) {
          const bodyPart = validatedBodyParts[i];

          // Skip text body parts as they are handled above
          const isText = bodyPart.type === BodyBitType.text;
          if (isText) continue;

          const bodyBit = bodyPart as BodyBitJson;
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
    return {
      body: finalBody,
      bodyBits: bodyBits.length > 0 ? bodyBits : undefined,
      bodyString: finalBodyString,
    };
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
  protected replacePlaceholderWithBodyBit(
    bodyAst: TextAst,
    bodyBitJson: BodyBitJson,
    index: number,
  ) {
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
}

const instance = new BodyContentProcessor();
export { instance as BodyContentProcessor };
