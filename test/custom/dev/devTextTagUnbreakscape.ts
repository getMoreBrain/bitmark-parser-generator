/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';
import { TextFormat } from '../../../src/model/enum/TextFormat';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevTextUnbreakscape {
  async test(): Promise<void> {
    const filename = path.resolve(__dirname, '../../..', 'assets', 'test.text.tag.unbreakscape');

    // Read in the test file
    const str = fs.readFileSync(filename, {
      encoding: 'utf8',
    });

    const res = bitmarkParserGenerator.unbreakscapeText(str, {
      textFormat: TextFormat.tag,
    });
    console.log(res);
  }
}

const parser = new DevTextUnbreakscape();

void parser.test().then(() => {
  // Done
});
