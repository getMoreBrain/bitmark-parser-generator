/*

ISC License

Copyright ©2023 Get More Brain

*/

// import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';
import { FileUtils } from '../../../src/utils/FileUtils';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevRegenerateBitmarkTests {
  async test(_debug?: boolean): Promise<void> {
    const bitmarkFilesDir = path.resolve(__dirname, '../../..', 'test/standard/input/bitmark');
    const jsonFilesDir = path.resolve(bitmarkFilesDir, 'json');

    const bitmarkFiles = FileUtils.getFilenamesSync(bitmarkFilesDir, {
      match: new RegExp('.+\\.bitmark$'),
      recursive: false,
    });

    for (const bitmarkFile of bitmarkFiles) {
      const basename = path.basename(bitmarkFile);
      const jsonFile = path.join(jsonFilesDir, `${path.basename(bitmarkFile, '.bitmark')}.json`);

      console.log(`Processing: ${basename}`);
      await bitmarkParserGenerator.convert(bitmarkFile, {
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

const parser = new DevRegenerateBitmarkTests();

void parser.test(true).then(() => {
  // Done
});
