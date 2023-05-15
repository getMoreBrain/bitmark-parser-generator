/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';
import { Ast } from '../../../src/ast/Ast';
// import { BitmarkFileGenerator } from '../../..src/generator/bitmark/BitmarkFileGenerator';
// import { BitmarkStringGenerator } from '../../../src/generator/bitmark/BitmarkStringGenerator';
import { BitmarkParser } from '../../../src/parser/bitmark/BitmarkParser';
import { JsonParser } from '../../../src/parser/json/JsonParser';

const jsonParser = new JsonParser();
const ast = new Ast();
const bitmarkParserGenerator = new BitmarkParserGenerator();
const bitmarkParser = new BitmarkParser();

class BmgDevBitmarkAntlr {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(__dirname, '../../..', 'assets', 'test.bit');

    if (debug) {
      // Read in the test file
      const bitStr = fs.readFileSync(filename, {
        encoding: 'utf8',
      });

      // Preprocess and log
      console.log(`\n${bitStr}\n\n`);

      // Bitmark ==> JSON
      // Convert the bitmark to JSON
      const json = bitmarkParser.parseUsingAntlr(bitStr);
      const jsonStr = JSON.stringify(json, undefined, 2);

      // Convert the bitmark JSON to bitmark AST
      const bitmarkAst = jsonParser.toAst(json);

      console.log(JSON.stringify(bitmarkAst, null, 2));
      ast.printTree(bitmarkAst);

      console.log(jsonStr);
    } else {
      const res = await bitmarkParserGenerator.convert(filename, {
        bitmarkParserType: 'antlr',
      });
      const resStr = JSON.stringify(res, undefined, 2);
      console.log(resStr);
    }
  }
}

const bmg = new BmgDevBitmarkAntlr();

bmg.test(false).then(() => {
  // Done
});
