import { BitmarkAst } from '../../model/ast/Nodes';
import { BitmarkParserType, BitmarkParserTypeType } from '../../model/enum/BitmarkParserType';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { JsonParser } from '../json/JsonParser';

import { parse as bitmarkParse } from './BitmarkPegParser';

/*
 * NOTE:
 *
 * We want to be able to strip out the ANTLR parser from the final bundle.
 * Any code between the comments STRIP:START and STRIP:END will be removed.
 *
 * However, the Typescript compiler will remove comments that it does not believe are associated with code.
 * Therefore we have to use some dummy code to prevent it from removing the ANTLR stripping comments.
 */

const STRIP = 0;
/* STRIP:START */
STRIP;

// eslint-disable-next-line arca/import-ordering
import { parse } from 'bitmark-grammar';

/* STRIP:END */
STRIP;

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
      return this.jsonParser.toAst(this.parseUsingAntlr(bitmark as string));
    }

    return bitmarkParse(bitmark);
  }

  /**
   * Perform parsing using the ANTLR parser.
   *
   * @param pathOrMarkup path to bitmark markup file, or bitmark markup as a string
   * @returns JSON object representing the bitmark markup
   */
  parseUsingAntlr(pathOrMarkup: string): BitWrapperJson[] {
    if (!haveAntlr()) {
      throw new Error('ANTLR parser is not available');
    }

    const jsonStr = parse(pathOrMarkup);
    const json = JSON.parse(jsonStr) as BitWrapperJson[];

    return json;
  }
}

function haveAntlr(): boolean {
  let haveAntlr = false;

  /* STRIP:START */
  STRIP;

  haveAntlr = true;

  /* STRIP:END */
  STRIP;

  return haveAntlr;
}

export { BitmarkParser };
