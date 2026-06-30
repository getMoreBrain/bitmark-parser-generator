import { type JsonText, type TextAst } from '../../model/ast/TextNodes.ts';
import { type TextFormatType } from '../../model/enum/TextFormat.ts';
import { TextLocation, type TextLocationType } from '../../model/enum/TextLocation.ts';
import { TextNodeType } from '../../model/enum/TextNodeType.ts';
import { type BodyBitJson } from '../../model/json/BodyBitJson.ts';
import { StringUtils } from '../../utils/StringUtils.ts';
import { parse as bitmarkTextParse } from './peg/TextPegParser.ts';

export interface BitmarkTextParserOptions {
  format: TextFormatType;
  location: TextLocationType;
}

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
      } catch (_e) {
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
  toAst(text: string | TextAst | undefined, options: BitmarkTextParserOptions): TextAst {
    // If input is not a string, return it as is
    if (Array.isArray(text)) return text;
    let str = (text as string) ?? '';

    // If the str is empty, return an empty array (as otherwise the parser will
    // return an empty paragraph which is unnecessary)
    if (!str) return [];

    // Ensure options is an object
    const opts = Object.assign({}, options);

    // Set the start rule.
    // The start rule is bitmark++ for the body, and bitmark+ for the tags
    // Otherwise, the start rule is bitmarkMinusMinus
    let startRule = 'bitmarkPlusPlus';
    if (opts.location === TextLocation.tag) {
      startRule = 'bitmarkPlus';
    }

    // Always trim the string before parsing (parser handles leading/trailing whitespace inconsistently)
    str = str.trim();

    return bitmarkTextParse(str, {
      startRule,
    }) as TextAst;
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

  /**
   * Walk all the body bits from the text AST
   *
   * @param text
   * @returns
   */
  public walkBodyBits(
    text: JsonText,
    callback: (parent: TextAst, index: number, bodyBit: BodyBitJson) => void,
  ): void {
    if (!Array.isArray(text)) return;

    const textAst = text as TextAst;
    for (let i = 0; i < textAst.length; i++) {
      const node = textAst[i];
      switch (node.type) {
        case TextNodeType.gap:
        case TextNodeType.select:
        case TextNodeType.highlight:
        case TextNodeType.mark:
          callback(textAst, i, node as BodyBitJson);
          break;
        default: {
          // Recurse into children
          this.walkBodyBits(node.content as TextAst, callback);
        }
      }
    }
  }
}

export { TextParser };
