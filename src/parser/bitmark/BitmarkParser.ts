import { parse } from 'bitmark-grammar';

import { parse as pegParse } from '../../generated/parser/bitmark/bitmark-peggy-parser';
import { BitmarkAst } from '../../model/ast/Nodes';
import { TextFormat } from '../../model/enum/TextFormat';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { JsonParser } from '../json/JsonParser';

class BitmarkParser {
  protected jsonParser = new JsonParser();

  toAst(bitmark: unknown): BitmarkAst {
    // TODO - NON-Antlr implementation?

    return this.jsonParser.toAst(this.parse(bitmark as string));
  }

  parse(pathOrMarkup: string): BitWrapperJson[] {
    const jsonStr = parse(pathOrMarkup);
    const json = JSON.parse(jsonStr) as BitWrapperJson[];

    for (const bitWrapper of json) {
      const pegFormat =
        TextFormat.keyFromValue(bitWrapper.bit.format) ?? TextFormat.keyFromValue(TextFormat.bitmarkMinusMinus);
      const content = pegParse(bitWrapper.bitmark ?? '', {
        startRule: pegFormat,
      });

      (bitWrapper.bit as any).content = content;
    }

    return json;
  }
}

export { BitmarkParser };
