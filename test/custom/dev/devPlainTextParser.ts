/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevExtractPlainText {
  async test(_debug?: boolean): Promise<void> {
    const filename = path.resolve(dirname, '../../..', 'assets', 'test.text');

    const str = fs.readFileSync(filename, {
      encoding: 'utf8',
    });

    const res = bitmarkParserGenerator.extractPlainText(str, {
      //
    });
    console.log(res);
  }
}

const parser = new DevExtractPlainText();

void parser.test(true).then(() => {
  // Done
});
