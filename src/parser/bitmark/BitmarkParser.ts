import { parse } from 'bitmark-grammar';

import { BitmarkAst } from '../../model/ast/Nodes';
import { BitmarkParserType, BitmarkParserTypeType } from '../../model/enum/BitmarkParserType';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { JsonParser } from '../json/JsonParser';

import { parse as bitmarkParse } from './BitmarkPegParser';

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
   * @returns bitmark AST
   */
  toAst(bitmark: string, options?: BitmarkParserOptions): BitmarkAst {
    const opts = Object.assign({}, options);

    if (opts.parserType === BitmarkParserType.antlr) {
      return this.jsonParser.toAst(this.parse(bitmark as string));
    }

    return bitmarkParse(bitmark);
  }

  parse(pathOrMarkup: string): BitWrapperJson[] {
    const jsonStr = parse(pathOrMarkup);
    const json = JSON.parse(jsonStr) as BitWrapperJson[];

    // for (const bitWrapper of json) {
    //   const pegFormat =
    //     TextFormat.keyFromValue(bitWrapper.bit.format) ?? TextFormat.keyFromValue(TextFormat.bitmarkMinusMinus);
    //   const content = pegParse(bitWrapper.bitmark ?? '', {
    //     startRule: pegFormat,
    //   });

    //   (bitWrapper.bit as any).content = content;
    // }

    return json;
  }
}

export { BitmarkParser };
