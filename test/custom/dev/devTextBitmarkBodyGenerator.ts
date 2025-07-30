/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { Ast } from '../../../src/ast/Ast.ts';
import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';
import { TextGenerator } from '../../../src/generator/text/TextGenerator.ts';
import { NodeType } from '../../../src/model/ast/NodeType.ts';
import { TextFormat } from '../../../src/model/enum/TextFormat.ts';
import { TextLocation } from '../../../src/model/enum/TextLocation.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const bitmarkParserGenerator = new BitmarkParserGenerator();
const ast = new Ast();
const textGenerator = new TextGenerator();

class DevTextGenerator {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(dirname, '../../..', 'assets', 'test.text.bitmark.body.json');

    if (debug) {
      // Read in the test file
      const textAst = await fs.readJson(filename);

      // Preprocess and log
      console.log(`\n${textAst}\n\n`);

      // Convert the text JSON to text
      const text = textGenerator.generateSync(textAst, TextFormat.bitmarkText, TextLocation.body);

      ast.printTree(textAst, NodeType.textAst);
      console.log(text);
    } else {
      const res = bitmarkParserGenerator.convertText(filename, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.body,
      });
      console.log(res);
    }
  }
}

const generator = new DevTextGenerator();

void generator.test(true).then(() => {
  // Done
});
