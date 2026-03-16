/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { BitmarkParserGenerator, Output } from '../../../src/BitmarkParserGenerator.ts';
import { BitmarkVersion } from '../../../src/model/enum/BitmarkVersion.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevPlainTextParser {
  async test(_debug?: boolean): Promise<void> {
    const filename = path.resolve(dirname, '../../..', 'assets', 'test.text');

    const str = fs.readFileSync(filename, {
      encoding: 'utf8',
    });

    const res = bitmarkParserGenerator.bitmarkTextToPlainText(str, {
      // bitmarkVersion: BitmarkVersion.v2,
      bitmarkVersion: BitmarkVersion.v3,
      outputFormat: Output.text,
      jsonOptions: {
        prettify: true,
      },
    });
    console.log(res);
  }
}

const parser = new DevPlainTextParser();

void parser.test(true).then(() => {
  // Done
});
