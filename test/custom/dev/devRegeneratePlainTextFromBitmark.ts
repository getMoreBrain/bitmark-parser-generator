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

class DevRegeneratePlainTextFromBitmark {
  async test(_debug?: boolean): Promise<void> {
    const bitmarkFilesDir = path.resolve(
      dirname,
      '../../..',
      'test/standard/input/plain-text-bitmark',
    );

    const bitmarkFiles = FileUtils.getFilenamesSync(bitmarkFilesDir, {
      match: new RegExp('.+\\.bitmark$'),
      recursive: false,
    });

    for (const bitmarkFile of bitmarkFiles) {
      const basename = path.basename(bitmarkFile);
      const id = path.basename(bitmarkFile, '.bitmark');
      const txtFile = path.join(bitmarkFilesDir, `${id}.txt`);

      console.log(`Processing: ${basename}`);

      const input = fs.readFileSync(bitmarkFile, 'utf8');
      const plainText = bpg.extractPlainText(input, { inputFormat: InputFormat.bitmark });

      fs.writeFileSync(txtFile, plainText, { encoding: 'utf8' });
    }
  }
}

const regenerator = new DevRegeneratePlainTextFromBitmark();

void regenerator.test(true).then(() => {
  // Done
});
