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

class DevTextUnbreakscape {
  async test(): Promise<void> {
    const filename = path.resolve(
      dirname,
      '../../..',
      'assets',
      'test.text.plain.tag.unbreakscape',
    );

    // Read in the test file
    const str = fs.readFileSync(filename, {
      encoding: 'utf8',
    });

    const res = bitmarkParserGenerator.unbreakscapeText(str, {
      textFormat: TextFormat.plainText,
      textLocation: TextLocation.tag,
    });
    console.log(res);
  }
}

const parser = new DevTextUnbreakscape();

void parser.test().then(() => {
  // Done
});
