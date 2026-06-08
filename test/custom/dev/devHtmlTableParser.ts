/*

ISC License

Copyright ©2023 Get More Brain

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

import { BitmarkParserGenerator, InputFormat } from '../../../src/BitmarkParserGenerator.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const bitmarkParserGenerator = new BitmarkParserGenerator();

/**
 * Manual dev test: HTML tables -> bitmark / JSON.
 *
 * Reads assets/test.table.html and prints the extracted bitmark and JSON.
 * Run with: npm run start-html-table-parser
 */
class DevHtmlTableParser {
  test(): void {
    const filename = path.resolve(dirname, '../../..', 'assets', 'test.table.html');
    const html = fs.readFileSync(filename, { encoding: 'utf8' });

    console.log('\n=== INPUT (HTML) ===\n');
    console.log(html);

    console.log('\n=== OUTPUT (bitmark) ===\n');
    console.log(
      bitmarkParserGenerator.convertHtmlTable(html, {
        inputFormat: InputFormat.html,
      }),
    );

    console.log('\n=== OUTPUT (JSON) ===\n');
    console.log(
      bitmarkParserGenerator.convertHtmlTable(html, {
        inputFormat: InputFormat.html,
        outputFormat: 'json',
        jsonOptions: {
          prettify: true,
        },
      }),
    );
  }
}

const parser = new DevHtmlTableParser();
parser.test();
