/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { Ast } from '../../../src/ast/Ast.ts';
import { NodeType } from '../../../src/model/ast/NodeType.ts';
import { TextFormat } from '../../../src/model/enum/TextFormat.ts';
import { TextLocation } from '../../../src/model/enum/TextLocation.ts';
import { TextParser } from '../../../src/parser/text/TextParser.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const ast = new Ast();
const textParser = new TextParser();

class DevTextParser {
  async test(debug?: boolean): Promise<void> {
    const filename = path.resolve(dirname, '../../..', 'assets', 'test.text.bitmark.tag');

    if (debug) {
      // Read in the test file
      const bitStr = fs.readFileSync(filename, {
        encoding: 'utf8',
      });

      // Preprocess and log
      console.log(`\n${bitStr}\n\n`);

      // Generate AST from the Bitmark Text markup
      const textAst = textParser.toAst(bitStr.trim(), {
        format: TextFormat.bitmarkText,
        location: TextLocation.tag,
      });

      const jsonStr = JSON.stringify(textAst, undefined, 2);

      console.log(JSON.stringify(textAst, null, 2));
      ast.printTree(textAst, NodeType.textAst);

      console.log(jsonStr);
    } else {
      // const res = await bitmarkParserGenerator.convertText(filename, {
      //   jsonOptions: {
      //     prettify: true,
      //     textAsPlainText: false,
      //   },
      // });
      // console.log(res);
    }
  }
}

const parser = new DevTextParser();

void parser.test(true).then(() => {
  // Done
});
