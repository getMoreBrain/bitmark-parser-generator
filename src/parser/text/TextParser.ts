import { TextAst } from '../../model/ast/TextNodes';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { StringUtils } from '../../utils/StringUtils';

import { parse as bitmarkTextParse } from './peg/TextPegParser';

export interface BitmarkTextParserOptions {
  textFormat?: TextFormatType;
}

class TextParser {
  /**
   * Convert Bitmark text to text AST, o.
   *
   * The Bitmark text should be a string.
   * If parsed bitmark text AST is passed to this function, it will be returned as is.
   *
   * @param bitmarkText - bitmark text
   * @returns bitmark text AST as plain JS object
   */
  toAst(bitmarkText: string | TextAst, options?: BitmarkTextParserOptions): TextAst {
    // If input is not a string, return it as is
    if (!StringUtils.isString(bitmarkText)) return bitmarkText;
    const text = bitmarkText as string;

    // Ensure options is an object
    const opts = Object.assign({}, options);

    // Default text format to bitmark-- if not specified
    if (!opts.textFormat) opts.textFormat = TextFormat.bitmarkMinusMinus;

    const startRule = opts.textFormat === TextFormat.bitmarkPlusPlus ? 'bitmarkPlusPlus' : 'bitmarkMinusMinus';

    return bitmarkTextParse(text, {
      startRule,
    });
  }
}

export { TextParser };
