import { Breakscape } from '../../breakscaping/Breakscape';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { JsonText, TextAst } from '../../model/ast/TextNodes';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { TextNodeType } from '../../model/enum/TextNodeType';
import { BodyBitJson } from '../../model/json/BodyBitJson';
import { StringUtils } from '../../utils/StringUtils';

import { parse as bitmarkTextParse } from './peg/TextPegParser';

export interface BitmarkTextParserOptions {
  textFormat?: TextFormatType;
}

const START_HAT_REGEX = new RegExp('^\\^\\n', 'gm');
const MIDDLE_HAT_REGEX = new RegExp('\\n\\^\\n', 'gm');
const END_HAT_REGEX = new RegExp('\\n\\^$', 'gm');

class TextParser {
  /**
   * Get the version of the text parser
   */
  version(): string {
    return bitmarkTextParse('', {
      startRule: 'version',
    }) as string;
  }

  /**
   * Preprocess bitmark text AST into a standard format (TextAst object) from bitmark text AST either as a string
   * or a plain JS object
   *
   * @param ast - bitmark text AST as a string or a plain JS object
   * @returns bitmark text AST in a standard format (BitmarkAst object)
   */
  preprocessAst(ast: string | unknown): TextAst | undefined {
    if (StringUtils.isString(ast)) {
      const str = ast as string;
      try {
        ast = JSON.parse(str);
      } catch (e) {
        // Failed to parse JSON, return empty array
        return undefined;
      }
    }

    if (this.isAst(ast)) {
      return ast as TextAst;
    }
    return undefined;
  }

  /**
   * Check if a plain JS object is valid text AST
   *
   * @param ast - a plain JS object that might be text AST
   * @returns true if text AST, otherwise false
   */
  isAst(ast: unknown): boolean {
    if (Array.isArray(ast)) {
      if (ast.length === 0) return true;

      if (Object.prototype.hasOwnProperty.call(ast[0], 'type')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Convert Bitmark text to text AST.
   *
   * The Bitmark text should be a string.
   * If parsed bitmark text AST is passed to this function, it will be returned as is.
   *
   * @param text - bitmark text
   * @returns bitmark text AST as plain JS object
   */
  toAst(text: string | TextAst | undefined, options?: BitmarkTextParserOptions): TextAst {
    // If input is not a string, return it as is
    if (Array.isArray(text)) return text;
    let str = (text as string) ?? '';

    // If the str is empty, return an empty array (as otherwise the parser will
    // return an empty paragraph which is unnecessary)
    if (!str) return [];

    // Ensure options is an object
    const opts = Object.assign({}, options);

    // Default text format to bitmark-- if not specified
    if (!opts.textFormat) opts.textFormat = TextFormat.bitmarkMinusMinus;

    const startRule = opts.textFormat === TextFormat.bitmarkPlusPlus ? 'bitmarkPlusPlus' : 'bitmarkMinusMinus';

    // There is a special case for pre-processing the string passed to the text parser
    // If the string contains starts with ^/n, contains /n^/n or ends with /n^, the parser will generated
    // an empty text block:
    // {
    //   "text": "",
    //   "type": "text"
    // },
    //
    // This happens because the single ^ is removed by the breakscaping algorithm.
    // This in itself is not wrong, but it is undesired because it will be lost when converting back to text.
    // Therefore the string is pre-processed to remove these empty text blocks.
    str = str.replace(START_HAT_REGEX, '\n').replace(END_HAT_REGEX, '\n').replace(MIDDLE_HAT_REGEX, '\n\n').trim();

    return bitmarkTextParse(str, {
      startRule,
    }) as TextAst;
  }

  /**
   * Convert breakscaped text to the JSON format using the text parser:
   * Input:
   *  - breakscaped string
   * Output:
   *  - text: plain text
   *  - json: bitmark text JSON (TextAst)
   *
   * @param text
   * @returns
   */
  public breakscapedStringToJsonText(
    text: BreakscapedString | undefined,
    format: TextFormatType, // = TextFormat.bitmarkMinusMinus,
  ): JsonText {
    if (!text) undefined;

    const isBitmarkText = format === TextFormat.bitmarkMinusMinus || format === TextFormat.bitmarkPlusPlus;

    if (!isBitmarkText) {
      // Not bitmark text, so plain text, so  unbreakscape only the start of bit tags
      return (
        Breakscape.unbreakscape(text, {
          bitTagOnly: true,
        }) || Breakscape.EMPTY_STRING
      );
    }

    // const asPlainText = this.options.textAsPlainText;
    // if (asPlainText) {
    //   return Breakscape.unbreakscape(text) || Breakscape.EMPTY_STRING;
    // }

    // Use the text parser to parse the text
    const textAst = this.toAst(text, {
      textFormat: format,
    });

    return textAst;
  }

  /**
   * Extract all the body bits from the text AST
   *
   * @param text
   * @returns
   */
  public extractBodyBits(text: JsonText): BodyBitJson[] {
    if (!Array.isArray(text)) return [];

    const bodyBits: BodyBitJson[] = [];
    const textAst = text as TextAst;
    for (const node of textAst) {
      switch (node.type) {
        case TextNodeType.gap:
        case TextNodeType.select:
        case TextNodeType.highlight:
        case TextNodeType.mark:
          bodyBits.push(node as BodyBitJson);
          break;
        default: {
          // Recurse into children
          const bits = this.extractBodyBits(node.content as TextAst);
          for (const bit of bits) {
            bodyBits.push(bit);
          }
        }
      }
    }

    return bodyBits;
  }
}

export { TextParser };
