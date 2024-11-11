import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { Example, ItemLead } from '../../../../model/ast/Nodes';
import { BitmarkTextNode, JsonText, TextAst, TextNode, TextNodeAttibutes } from '../../../../model/ast/TextNodes';
import { TextFormat, TextFormatType } from '../../../../model/enum/TextFormat';
import { TextNodeType } from '../../../../model/enum/TextNodeType';
import { ExampleJson } from '../../../../model/json/BitJson';
import { BooleanUtils } from '../../../../utils/BooleanUtils';
import { TextParser } from '../../../text/TextParser';

interface ItemLeadHintInstructionNode {
  itemLead?: ItemLead;
  hint?: BitmarkTextNode;
  instruction?: BitmarkTextNode;
}

interface ItemLeadHintInstuction {
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
}

interface ExampleNode {
  isExample: boolean;
  example?: Example | undefined;
  isDefaultExample: boolean;
}

interface ExampleJsonWrapper {
  isExample: boolean;
  example: ExampleJson;
}

// const builder = new Builder();
const textParser = new TextParser();

class ContentProcessorUtils {
  /**
   * Concatenates a plain JSON text with a JsonText that may be plain (v2) or BitmarkText (v3)
   * Returns the combined text.
   *
   * @param text the text to concatenate
   * @param extraBreaks extra breaks to add between concatenated texts
   * @param textPlain the plain text to concatenate
   */
  public concatenatePlainTextWithAstTexts(text: JsonText, extraBreaks: number, textPlain: string): JsonText {
    if (Array.isArray(text)) {
      textPlain = textPlain && textPlain.trim();
      if (textPlain) {
        const splitText = textPlain.split('\n');
        const content: TextNode[] = [];

        for (let i = 0; i < extraBreaks; i++) {
          content.push({
            type: TextNodeType.hardBreak,
          });
        }

        for (let i = 0; i < splitText.length; i++) {
          const t = splitText[i];
          if (t) {
            content.push({
              text: t,
              type: TextNodeType.text,
            });
          }
          // Add a hard break after each paragraph, except the last one
          if (i < splitText.length - 1) {
            content.push({
              type: TextNodeType.hardBreak,
            });
          }
        }

        // Add the content to the final paragraph, or create a new one if there none
        const lastNode = text[text.length - 1];
        if (lastNode && lastNode.type === TextNodeType.paragraph) {
          lastNode.content = [...(lastNode.content ?? []), ...content];
        } else {
          text.push({
            type: TextNodeType.paragraph,
            content,
            attrs: {} as TextNodeAttibutes,
          });
        }
      }
      return text;
    }

    return `${text ?? ''}${'\n'.repeat(extraBreaks)}${textPlain ?? ''}`;
  }

  public toItemLeadHintInstruction(item: ItemLeadHintInstructionNode): ItemLeadHintInstuction {
    return {
      item: this.getBitmarkTextAst(item.itemLead?.item),
      lead: this.getBitmarkTextAst(item.itemLead?.lead),
      hint: this.getBitmarkTextAst(item.hint),
      instruction: this.getBitmarkTextAst(item.instruction),
    };
  }

  public toExample(
    node: ExampleNode,
    options: {
      defaultExample: string | boolean | null;
      isBoolean: boolean;
    },
  ): ExampleJsonWrapper {
    const { isExample, example, isDefaultExample } = node;
    const { defaultExample, isBoolean } = options;

    if (!isExample) {
      return {
        isExample: false,
        example: null,
      };
    }

    let exampleValue;
    if (isDefaultExample) {
      exampleValue = isBoolean
        ? BooleanUtils.toBoolean(defaultExample)
        : this.convertBreakscapedStringToJsonText(defaultExample as BreakscapedString, TextFormat.bitmarkMinusMinus);
    } else {
      exampleValue = isBoolean
        ? BooleanUtils.toBoolean(example)
        : this.convertBreakscapedStringToJsonText(example as BreakscapedString, TextFormat.bitmarkMinusMinus);
    }

    return {
      isExample: true,
      example: exampleValue,
    };
  }

  /**
   * Convert the text from the AST to the JSON format:
   * Input:
   *  - breakscaped string
   * Output:
   *  - text: plain text
   *  - json: bitmark text JSON
   *  - Bitmark v2: breakscaped string
   *  - Bitmark v3: bitmark text JSON (TextAst)
   *
   * In the case of Bitmark v2 type texts, there is nothing to do but cast the type.
   *
   * @param text
   * @returns
   */
  public convertBreakscapedStringToJsonText(
    text: BreakscapedString | undefined,
    format: TextFormatType, // = TextFormat.bitmarkMinusMinus,
  ): JsonText {
    if (!text) undefined;

    const isBitmarkText = format === TextFormat.bitmarkMinusMinus || format === TextFormat.bitmarkPlusPlus;

    if (!isBitmarkText) {
      // Not bitmark text, so plain text, so  unbreakscape only the start of bit tags
      return text || '';
    }

    // Use the text parser to parse the text
    const textAst = textParser.toAst(text, {
      textFormat: format,
    });

    return textAst;
  }

  public getBitmarkTextAst(textNode: BitmarkTextNode | undefined): TextAst {
    if (textNode != null) {
      if (Array.isArray(textNode.__text__)) {
        return textNode.__text__;
      }
    }

    return [];
  }
}

const instance = new ContentProcessorUtils();
export { instance as ContentProcessorUtils };
