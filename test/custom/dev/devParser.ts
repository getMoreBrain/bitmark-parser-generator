/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';
import { Ast } from '../../../src/ast/Ast';
import { JsonObjectGenerator } from '../../../src/generator/json/JsonObjectGenerator';
import { BitmarkParserType } from '../../../src/model/enum/BitmarkParserType';
import { BitmarkParser } from '../../../src/parser/bitmark/BitmarkParser';
import { BitmarkVersion } from '../../../src/model/enum/BitmarkVersion';

const ast = new Ast();
const bitmarkParserGenerator = new BitmarkParserGenerator();
const bitmarkParser = new BitmarkParser();

class DevParser {
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

      // AST ==> JSON
      const generator = new JsonObjectGenerator({
        // bitmarkVersion: BitmarkVersion.v2,
        bitmarkVersion: BitmarkVersion.v3,
        jsonOptions: {
          enableWarnings: true,
          // textAsPlainText: false,
          // textAsPlainText: true,
          prettify: true,
        },
      });
      const json = await generator.generate(bitmarkAst);
      const jsonStr = JSON.stringify(json, undefined, 2);

      console.log(JSON.stringify(bitmarkAst, null, 2));
      ast.printTree(bitmarkAst);

      console.log(jsonStr);
    } else {
      const res = await bitmarkParserGenerator.convert(filename, {
        jsonOptions: {
          enableWarnings: true,
          textAsPlainText: false,
          prettify: true,
        },
      });
      console.log(res);
    }
  }
}

const parser = new DevParser();

void parser.test(true).then(() => {
  // Done
});
