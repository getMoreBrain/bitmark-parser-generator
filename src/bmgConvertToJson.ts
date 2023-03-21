/*

ISC License

Copyright ©2023 Get More Brain

*/

import { BitmarkParser } from 'bitmark-grammar/src';
import fs from 'fs-extra';
import path from 'path';

import { FileUtils } from './utils/FileUtils';

const BASE = 'assets/test/books';
const BASE_DIR = path.resolve(__dirname, '..', BASE);
const BITS_DIR = path.resolve(BASE_DIR, 'bits');
const JSON_OUTPUT_DIR = path.resolve(BASE_DIR, 'json');

class BmgConvertToJson {
  async test(): Promise<void> {
    const files = FileUtils.getFilenamesSync(BITS_DIR, {
      // match: new RegExp()
      recursive: true,
    });

    for (const markupFile of files) {
      console.log(markupFile);
    }

    // let i = 0;
    for (const markupFile of files) {
      let id = 'unknown';

      try {
        // id = path.basename(markupFile, '.bit');
        id = markupFile.replace(BITS_DIR, '');

        console.log(`Parsing file: ${id}`);

        // Read in the test file
        const markup = fs.readFileSync(markupFile, 'utf8');

        // Preprocess and log

        // Generate JSON from generated bitmark markup using the parser
        // const newJson = bitmarkGrammer.parse(markupFile);
        const parser = new BitmarkParser(markup, {
          trace: false,
          debug: false,
          need_error_report: false,
        });

        let newJson = [];
        try {
          const newJsonStr = parser.parse();
          newJson = JSON.parse(newJsonStr);
        } catch {
          throw new Error('Failed to parse bitmark-grammer output');
        }

        // Calculate the new JSON file path
        const outputDir = path.join(JSON_OUTPUT_DIR, path.dirname(id));
        fs.ensureDirSync(outputDir);
        const fileNewJson = path.resolve(outputDir, `${path.basename(id)}.json`);

        // Write the new JSON
        fs.writeFileSync(fileNewJson, JSON.stringify(newJson, null, 2), {
          encoding: 'utf8',
        });
      } catch (e) {
        console.error(`Failed to convert: ${id}`);
      }

      // i++;
      // if (i > 0) return;
    }
  }
}

const bmgConvertToJson = new BmgConvertToJson();

bmgConvertToJson.test().then(() => {
  // Done
});

export { bmgConvertToJson };
export type { BmgConvertToJson };
