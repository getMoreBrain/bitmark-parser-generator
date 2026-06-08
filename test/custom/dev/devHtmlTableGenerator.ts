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

/**
 * Manual dev test: bitmark tables -> HTML.
 *
 * Reads assets/test.table.bitmark and prints the generated HTML tables.
 * Run with: npm run start-html-table-generator
 */
class DevHtmlTableGenerator {
  test(): void {
    const filename = path.resolve(dirname, '../../..', 'assets', 'test.table.bitmark');
    const bitmark = fs.readFileSync(filename, { encoding: 'utf8' });

    console.log('\n=== INPUT (bitmark) ===\n');
    console.log(bitmark);

    console.log('\n=== OUTPUT (HTML) ===\n');
    console.log(bitmarkParserGenerator.convertHtmlTable(bitmark));
  }
}

const generator = new DevHtmlTableGenerator();
generator.test();
