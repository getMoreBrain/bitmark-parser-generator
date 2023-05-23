/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator, Output } from '../../../src/BitmarkParserGenerator';
import { Ast } from '../../../src/ast/Ast';
// import { BitmarkFileGenerator } from '../../..src/generator/bitmark/BitmarkFileGenerator';
import { BitmarkStringGenerator } from '../../../src/generator/bitmark/BitmarkStringGenerator';
import { JsonObjectGenerator } from '../../../src/generator/json/JsonObjectGenerator';
import { BitmarkParserType } from '../../../src/model/enum/BitmarkParserType';
import { BitmarkParser } from '../../../src/parser/bitmark/BitmarkParser';

// import { JsonParser } from '../../../src/parser/json/JsonParser';

// const jsonParser = new JsonParser();
const ast = new Ast();
const bitmarkParserGenerator = new BitmarkParserGenerator();
const bitmarkParser = new BitmarkParser();

class BmgDevParser {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(__dirname, '../../..', 'assets', 'test.bit');
    // const filename = path.resolve(__dirname, '../../..', 'assets', 'test.json');

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
      const generator = new BitmarkStringGenerator({
        explicitTextFormat: false,
      });
      const res = await generator.generate(bitmarkAst);
      console.log(res);
    } else {
      const res = await bitmarkParserGenerator.prettify(filename, {
        jsonOptions: {
          prettify: true,
        },
      });
      console.log(res);
    }
  }
}

const parser = new BmgDevParser();

parser.test(false).then(() => {
  // Done
});
