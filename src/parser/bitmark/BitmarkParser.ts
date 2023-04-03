import { parse } from 'bitmark-grammar';

import { BitmarkAst } from '../../model/ast/Nodes';
import { JsonParser } from '../json/JsonParser';

class BitmarkParser {
  protected jsonParser = new JsonParser();

  toAst(bitmark: unknown): BitmarkAst {
    // TODO - NON-Antlr implementation?

    return this.jsonParser.toAst(this.parse(bitmark as string));
  }

  parse(pathOrMarkup: string): string {
    return parse(pathOrMarkup);
  }
}

export { BitmarkParser };
