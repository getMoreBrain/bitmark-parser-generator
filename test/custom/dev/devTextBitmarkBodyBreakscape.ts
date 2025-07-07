/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';
import { TextFormat } from '../../../src/model/enum/TextFormat.ts';
import { TextLocation } from '../../../src/model/enum/TextLocation.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevTextbreakscape {
  async test(): Promise<void> {
    const filename = path.resolve(
      dirname,
      '../../..',
      'assets',
      'test.text.bitmark.body.breakscape',
    );

    // Read in the test file
    const str = fs.readFileSync(filename, {
      encoding: 'utf8',
    });

    const res = bitmarkParserGenerator.breakscapeText(str, {
      textFormat: TextFormat.bitmarkText,
      textLocation: TextLocation.body,
    });
    console.log(res);
  }
}

const parser = new DevTextbreakscape();

void parser.test().then(() => {
  // Done
});
