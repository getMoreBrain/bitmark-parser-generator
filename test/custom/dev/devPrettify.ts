/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';
// import { Ast } from '../../../src/ast/Ast.ts';
// import { BitmarkFileGenerator } from '../../..src/generator/bitmark/BitmarkFileGenerator.ts';
import { BitmarkStringGenerator } from '../../../src/generator/bitmark/BitmarkStringGenerator.ts';
// import { JsonObjectGenerator } from '../../../src/generator/json/JsonObjectGenerator.ts';
import { BitmarkParserType } from '../../../src/model/enum/BitmarkParserType.ts';
import { BitmarkParser } from '../../../src/parser/bitmark/BitmarkParser.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// import { JsonParser } from '../../../src/parser/json/JsonParser.ts';

// const jsonParser = new JsonParser();
// const ast = new Ast();
const bitmarkParserGenerator = new BitmarkParserGenerator();
const bitmarkParser = new BitmarkParser();

class DevPrettify {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(dirname, '../../..', 'assets', 'test.bitmark');
    // const filename = path.resolve(dirname, '../../..', 'assets', 'test.json');

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
        bitmarkOptions: {
          explicitTextFormat: false,
        },
      });
      const res = await generator.generate(bitmarkAst);
      console.log(res);
    } else {
      const res = bitmarkParserGenerator.upgrade(filename, {
        bitmarkOptions: {
          explicitTextFormat: false,
        },
        jsonOptions: {
          prettify: true,
        },
      });
      console.log(res);
    }
  }
}

const parser = new DevPrettify();

void parser.test(false).then(() => {
  // Done
});
