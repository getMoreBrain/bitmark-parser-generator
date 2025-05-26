/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';
import { Ast } from '../../../src/ast/Ast';
import { NodeType } from '../../../src/model/ast/NodeType';
import { TextFormat } from '../../../src/model/enum/TextFormat';
import { TextLocation } from '../../../src/model/enum/TextLocation';
import { TextParser } from '../../../src/parser/text/TextParser';

const bitmarkParserGenerator = new BitmarkParserGenerator();
const ast = new Ast();
const textParser = new TextParser();

class DevTextParser {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(__dirname, '../../..', 'assets', 'test.text.bitmark.body');

    if (debug) {
      // Read in the test file
      const bitStr = fs.readFileSync(filename, {
        encoding: 'utf8',
      });

      // Preprocess and log
      console.log(`\n${bitStr}\n\n`);

      // Generate AST from the Bitmark Text markup
      const textAst = textParser.toAst(bitStr, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.body,
      });

      const jsonStr = JSON.stringify(textAst, undefined, 2);

      console.log(JSON.stringify(textAst, null, 2));
      ast.printTree(textAst, NodeType.textAst);

      console.log(jsonStr);
    } else {
      const res = await bitmarkParserGenerator.convertText(filename, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.body,
        jsonOptions: {
          prettify: true,
        },
      });
      console.log(res);
    }
  }
}

const parser = new DevTextParser();

void parser.test(true).then(() => {
  // Done
});
