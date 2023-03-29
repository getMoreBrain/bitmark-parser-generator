import { parse } from 'bitmark-grammar';

import { BitmarkAst } from '../../model/ast/Nodes';
import { JsonParser } from '../json/JsonParser';

class BitmarkParserClass {
  toAst(bitmark: unknown): BitmarkAst {
    // TODO - NON-Antlr implementation?

    return JsonParser.toAst(this.parse(bitmark as string));
  }

  parse(pathOrMarkup: string): string {
    return parse(pathOrMarkup);
  }
}

const BitmarkParser = new BitmarkParserClass();

export { BitmarkParser };
export type { BitmarkParserClass };
