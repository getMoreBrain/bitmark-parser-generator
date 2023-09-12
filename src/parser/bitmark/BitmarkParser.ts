import { BitmarkAst } from '../../model/ast/Nodes';
import { BitmarkParserTypeType } from '../../model/enum/BitmarkParserType';
import { JsonParser } from '../json/JsonParser';

import { parse as bitmarkParse } from './peg/BitmarkPegParser';

export interface BitmarkParserOptions {
  parserType?: BitmarkParserTypeType;
}

class BitmarkParser {
  protected jsonParser = new JsonParser();

  /**
   * Convert Bitmark markup to AST.
   *
   * The Bitmark markup should be a string.
   *
   * @param json - bitmark JSON as a string or a plain JS object
   * @param _options - unused
   * @returns bitmark AST
   */
  toAst(bitmark: string, _options?: BitmarkParserOptions): BitmarkAst {
    // const opts = Object.assign({}, options);

    return bitmarkParse(bitmark);
  }
}

export { BitmarkParser };
