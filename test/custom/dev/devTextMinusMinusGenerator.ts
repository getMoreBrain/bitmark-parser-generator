/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { Ast } from '../../../src/ast/Ast';
import { TextGenerator } from '../../../src/generator/text/TextGenerator';
import { NodeType } from '../../../src/model/ast/NodeType';
import { TextFormat } from '../../../src/model/enum/TextFormat';

const ast = new Ast();
const textGenerator = new TextGenerator();

class DevTextGenerator {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(__dirname, '../../..', 'assets', 'test.text.minusminus.json');

    if (debug) {
      // Read in the test file
      const textAst = await fs.readJson(filename);

      // Preprocess and log
      console.log(`\n${textAst}\n\n`);

      // Convert the text JSON to text
      const text = textGenerator.generateSync(textAst, TextFormat.bitmarkMinusMinus);

      ast.printTree(textAst, NodeType.textAst);
      console.log(text);
    } else {
      // const res = await bitmarkParserGenerator.convertText(filename);
      // // BitmarkGenerator.convert(json);
      // console.log(res);
    }
  }
}

const generator = new DevTextGenerator();

generator.test(true).then(() => {
  // Done
});
