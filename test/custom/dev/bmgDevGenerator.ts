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
import { BitmarkVersion } from '../../../src/model/enum/BitmarkVersion';
import { JsonParser } from '../../../src/parser/json/JsonParser';

const jsonParser = new JsonParser();
const ast = new Ast();
const bitmarkParserGenerator = new BitmarkParserGenerator();

class BmgDevGenerator {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(__dirname, '../../..', 'assets', 'test.json');

    if (debug) {
      // Read in the test file
      const json = await fs.readJson(filename);

      // Preprocess and log
      console.log('\n');
      const bitWrappers = jsonParser.preprocessJson(json);
      for (const bitWrapper of bitWrappers) {
        const { bitmark } = bitWrapper;

        if (bitmark) {
          console.log(`${bitmark}`);
          console.log('\n\n');
        }
      }

      // Convert the bitmark JSON to bitmark AST
      const bitmarkAst = jsonParser.toAst(json);

      console.log(JSON.stringify(bitmarkAst, null, 2));
      ast.printTree(bitmarkAst);

      // // Generate markup code from AST
      // const fileName = './bitmark.txt';
      // const generator = new FileBitmapMarkupGenerator(fileName, undefined, {
      //   explicitTextFormat: false,
      // });

      // await generator.generate(bitmarkAst);

      // Generate markup code from AST
      const generator = new BitmarkStringGenerator({
        bitmarkVersion: BitmarkVersion.v3,
        explicitTextFormat: false,
      });

      const res = await generator.generate(bitmarkAst);
      console.log(res);
    } else {
      const res = await bitmarkParserGenerator.convert(filename, {
        bitmarkOptions: {
          bitmarkVersion: BitmarkVersion.v3,
        },
        jsonOptions: {
          bitmarkVersion: BitmarkVersion.v3,
          textAsPlainText: false,
        },
      });
      // BitmarkGenerator.convert(json);
      console.log(res);
    }
  }
}

const generator = new BmgDevGenerator();

generator.test(true).then(() => {
  // Done
});
