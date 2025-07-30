/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { Ast } from '../../../src/ast/Ast.ts';
import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';
import { BitmarkStringGenerator } from '../../../src/generator/bitmark/BitmarkStringGenerator.ts';
import { JsonParser } from '../../../src/parser/json/JsonParser.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const jsonParser = new JsonParser();
const ast = new Ast();
const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevGenerator {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(dirname, '../../..', 'assets', 'test.json');

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
        bitmarkOptions: {
          explicitTextFormat: false,
          prettifyJson: true,
          spacesAroundValues: true,
          // spacesAroundValues: false,
          // spacesAroundValues: 2,
        },
      });

      const res = await generator.generate(bitmarkAst);
      console.log(res);
    } else {
      const res = bitmarkParserGenerator.convert(filename, {
        bitmarkOptions: {
          explicitTextFormat: false,
        },
      });
      // BitmarkGenerator.convert(json);
      console.log(res);
    }
  }
}

const generator = new DevGenerator();

void generator.test(true).then(() => {
  // Done
});
