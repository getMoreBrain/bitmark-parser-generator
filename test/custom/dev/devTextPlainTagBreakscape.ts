/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';
import { TextFormat } from '../../../src/model/enum/TextFormat';
import { TextLocation } from '../../../src/model/enum/TextLocation';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevTextbreakscape {
  async test(): Promise<void> {
    const filename = path.resolve(__dirname, '../../..', 'assets', 'test.text.plain.tag.breakscape');

    // Read in the test file
    const str = fs.readFileSync(filename, {
      encoding: 'utf8',
    });

    const res = bitmarkParserGenerator.breakscapeText(str, {
      textFormat: TextFormat.plainText,
      textLocation: TextLocation.tag,
    });
    console.log(res);
  }
}

const parser = new DevTextbreakscape();

void parser.test().then(() => {
  // Done
});
