/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevTextbreakscape {
  async test(): Promise<void> {
    const filename = path.resolve(__dirname, '../../..', 'assets', 'test.text.breakscape');

    // Read in the test file
    const str = fs.readFileSync(filename, {
      encoding: 'utf8',
    });

    const res = bitmarkParserGenerator.breakscapeText(str);
    console.log(res);
  }
}

const parser = new DevTextbreakscape();

void parser.test().then(() => {
  // Done
});
