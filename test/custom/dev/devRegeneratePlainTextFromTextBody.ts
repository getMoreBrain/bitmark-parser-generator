/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { BitmarkParserGenerator, InputFormat } from '../../../src/index.ts';
import { FileUtils } from '../../../src/utils/FileUtils.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const bpg = new BitmarkParserGenerator();

class DevRegeneratePlainTextFromTextBody {
  async test(_debug?: boolean): Promise<void> {
    const textFilesDir = path.resolve(dirname, '../../..', 'test/standard/input/plain-text-body');

    const textFiles = FileUtils.getFilenamesSync(textFilesDir, {
      match: new RegExp('.+\\.text$'),
      recursive: false,
    });

    for (const textFile of textFiles) {
      const basename = path.basename(textFile);
      const id = path.basename(textFile, '.text');
      const txtFile = path.join(textFilesDir, `${id}.txt`);

      console.log(`Processing: ${basename}`);

      const input = fs.readFileSync(textFile, 'utf8');
      const plainText = bpg.extractPlainText(input, { inputFormat: InputFormat.bitmarkText });

      fs.writeFileSync(txtFile, plainText, { encoding: 'utf8' });
    }
  }
}

const regenerator = new DevRegeneratePlainTextFromTextBody();

void regenerator.test(true).then(() => {
  // Done
});
