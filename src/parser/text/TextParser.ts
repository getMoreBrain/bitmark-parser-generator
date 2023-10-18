import { TextAst } from '../../model/ast/TextNodes';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { StringUtils } from '../../utils/StringUtils';

import { parse as bitmarkTextParse } from './peg/TextPegParser';

export interface BitmarkTextParserOptions {
  textFormat?: TextFormatType;
}

class TextParser {
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
    const str = (text as string) ?? '';

    // If the str is empty, return an empty array (as otherwise the parser will
    // return an empty paragraph which is unnecessary)
    if (!str) return [];

    // Ensure options is an object
    const opts = Object.assign({}, options);

    // Default text format to bitmark-- if not specified
    if (!opts.textFormat) opts.textFormat = TextFormat.bitmarkMinusMinus;

    const startRule = opts.textFormat === TextFormat.bitmarkPlusPlus ? 'bitmarkPlusPlus' : 'bitmarkMinusMinus';

    return bitmarkTextParse(str, {
      startRule,
    });
  }
}

export { TextParser };
