/*

ISC License

Copyright ©2023 Get More Brain

*/

// import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';
import { FileUtils } from '../../../src/utils/FileUtils.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevRegenerateBitmarkTestBitmark {
  async test(_debug?: boolean): Promise<void> {
    const bitmarkFilesDir = path.resolve(dirname, '../../..', 'test/standard/input/bitmark');
    const jsonFilesDir = path.resolve(bitmarkFilesDir, 'json');

    const jsonFiles = FileUtils.getFilenamesSync(jsonFilesDir, {
      match: new RegExp('.+\\.json$'),
      recursive: false,
    });

    for (const jsonFile of jsonFiles) {
      const basename = path.basename(jsonFile);
      const bitmarkFile = path.join(bitmarkFilesDir, `${path.basename(jsonFile, '.json')}.bitmark`);

      console.log(`Processing: ${basename}`);
      bitmarkParserGenerator.convert(jsonFile, {
        outputFile: bitmarkFile,
        bitmarkOptions: {
          cardSetVersion: 2,
          spacesAroundValues: false,
          prettifyJson: true,
        },
        fileOptions: {
          encoding: 'utf8',
        },
      });
    }
  }
}

const parser = new DevRegenerateBitmarkTestBitmark();

void parser.test(true).then(() => {
  // Done
});
