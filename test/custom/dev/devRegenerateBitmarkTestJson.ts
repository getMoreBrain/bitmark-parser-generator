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

class DevRegenerateBitmarkTestJson {
  async test(_debug?: boolean): Promise<void> {
    const bitmarkFilesDir = path.resolve(dirname, '../../..', 'test/standard/input/bitmark');
    const jsonFilesDir = path.resolve(bitmarkFilesDir, 'json');

    const bitmarkFiles = FileUtils.getFilenamesSync(bitmarkFilesDir, {
      match: new RegExp('.+\\.bitmark$'),
      recursive: false,
    });

    for (const bitmarkFile of bitmarkFiles) {
      const basename = path.basename(bitmarkFile);
      const jsonFile = path.join(jsonFilesDir, `${path.basename(bitmarkFile, '.bitmark')}.json`);

      console.log(`Processing: ${basename}`);
      bitmarkParserGenerator.convert(bitmarkFile, {
        outputFile: jsonFile,
        jsonOptions: {
          enableWarnings: true,
          textAsPlainText: false,
          prettify: true,
        },
        fileOptions: {
          encoding: 'utf8',
        },
      });
    }
  }
}

const parser = new DevRegenerateBitmarkTestJson();

void parser.test(true).then(() => {
  // Done
});
