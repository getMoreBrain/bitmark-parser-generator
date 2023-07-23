/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator, Output } from '../../../src/BitmarkParserGenerator';
import { Ast } from '../../../src/ast/Ast';
import { ClasstimeJsonObjectGenerator } from '../../../src/generator/json-classtime/ClasstimeJsonObjectGenerator';
import { BitmarkParserType } from '../../../src/model/enum/BitmarkParserType';
import { BitmarkParser } from '../../../src/parser/bitmark/BitmarkParser';

const ast = new Ast();
const bitmarkParserGenerator = new BitmarkParserGenerator();
const bitmarkParser = new BitmarkParser();

class DevParserClasstime {
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
      const generator = new ClasstimeJsonObjectGenerator({
        jsonOptions: {
          textAsPlainText: true,
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
        outputFormat: Output.jsonClasstime,
        jsonOptions: {
          textAsPlainText: false,
          prettify: true,
        },
      });
      console.log(res);
    }
  }
}

const parser = new DevParserClasstime();

parser.test(true).then(() => {
  // Done
});
