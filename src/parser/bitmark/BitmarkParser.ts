import { parse } from 'bitmark-grammar';

import { BitmarkAst } from '../../model/ast/Nodes';
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

    return json;
  }
}

export { BitmarkParser };
