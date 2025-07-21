import { type BitmarkAst } from '../../model/ast/Nodes.ts';
import { type BitmarkParserTypeType } from '../../model/enum/BitmarkParserType.ts';
import { JsonParser } from '../json/JsonParser.ts';
import { parse as bitmarkParse } from './peg/BitmarkPegParser.ts';

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
