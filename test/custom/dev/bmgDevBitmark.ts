/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';
import { Ast } from '../../../src/ast/Ast';
// import { BitmarkFileGenerator } from '../../..src/generator/bitmark/BitmarkFileGenerator';
import { BitmarkStringGenerator } from '../../../src/generator/bitmark/BitmarkStringGenerator';
import { JsonObjectGenerator } from '../../../src/generator/json/JsonObjectGenerator';
import { BitmarkParserType } from '../../../src/model/enum/BitmarkParserType';
import { BitmarkParser } from '../../../src/parser/bitmark/BitmarkParser';
import { JsonParser } from '../../../src/parser/json/JsonParser';

const jsonParser = new JsonParser();
const ast = new Ast();
const bitmarkParserGenerator = new BitmarkParserGenerator();
const bitmarkParser = new BitmarkParser();

class BmgDevBitmark {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(__dirname, '../../..', 'assets', 'test.bit');

    if (debug) {
      // Read in the test file
      const bitStr = fs.readFileSync(filename, {
        encoding: 'utf8',
      });

      // Preprocess and log
      console.log(`\n${bitStr}\n\n`);

      // Generate AST from the Bitmark markup
      const bitmarkAst = bitmarkParser.toAst(bitStr, {
        parserType: BitmarkParserType.peggy,
      });

      // AST ==> Bitmark
      const generator = new JsonObjectGenerator();
      const json = await generator.generate(bitmarkAst);
      const jsonStr = JSON.stringify(json, undefined, 2);

      console.log(JSON.stringify(bitmarkAst, null, 2));
      ast.printTree(bitmarkAst);

      console.log(jsonStr);
    } else {
      const res = await bitmarkParserGenerator.convert(filename);
      const resStr = JSON.stringify(res, undefined, 2);
      console.log(resStr);
    }
  }
}

const bmg = new BmgDevBitmark();

bmg.test(true).then(() => {
  // Done
});
