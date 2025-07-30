/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { Ast } from '../../../src/ast/Ast.ts';
import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';
import { JsonObjectGenerator } from '../../../src/generator/json/JsonObjectGenerator.ts';
import { BitmarkParserType } from '../../../src/model/enum/BitmarkParserType.ts';
import { BitmarkVersion } from '../../../src/model/enum/BitmarkVersion.ts';
import { BitmarkParser } from '../../../src/parser/bitmark/BitmarkParser.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const ast = new Ast();
const bitmarkParserGenerator = new BitmarkParserGenerator();
const bitmarkParser = new BitmarkParser();

class DevParser {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(dirname, '../../..', 'assets', 'test.bitmark');

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
      const res = bitmarkParserGenerator.convert(filename, {
        // bitmarkVersion: BitmarkVersion.v2,
        bitmarkVersion: BitmarkVersion.v3,
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

void parser.test(false).then(() => {
  // Done
});
