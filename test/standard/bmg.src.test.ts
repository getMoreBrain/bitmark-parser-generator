/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkFileGenerator } from '../../src/generator/bitmark/BitmarkFileGenerator';
import { BitmarkParser } from '../../src/parser/bitmark/BitmarkParser';
import { JsonParser } from '../../src/parser/json/JsonParser';
import { FileUtils } from '../../src/utils/FileUtils';
import { BitJsonUtils } from '../utils/BitJsonUtils';
import { deepDiffMapper } from '../utils/deepDiffMapper';

const SINGLE_FILE_START = 0;
const SINGLE_FILE_COUNT = 100;

const TEST_INPUT_DIR = path.resolve(__dirname, './bitmark');
const TEST_OUTPUT_DIR = path.resolve(__dirname, './results/output');

const jsonParser = new JsonParser();
const bitmarkParser = new BitmarkParser();

/**
 * Get the list of files in the TEST_INPUT_DIR (bitmark files)
 * @returns
 */
function getTestFilenames(): string[] {
  const files = FileUtils.getFilenamesSync(TEST_INPUT_DIR, {
    match: new RegExp('.+\\.bit$'),
    recursive: true,
  });

  return files;
}

// function writeTestJsonAndBitmark(json: unknown, fullFolder: string, id: string): void {
//   // // Write original JSON
//   const jsonFile = path.resolve(fullFolder, `${id}.json`);
//   fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2));

//   // Write original Bitmark
//   const bitwrappers = BitmarkJson.preprocessJson(json);

//   const markupFile = path.resolve(fullFolder, `${id}.bit`);
//   let markup = '';
//   for (let i = 0, len = bitwrappers.length; i < len; i++) {
//     const bw = bitwrappers[i];
//     const first = i === 0;

//     if (!first && bw.bitmark) {
//       markup += '\n\n\n';
//     }

//     markup += bw.bitmark || '';
//   }
//   fs.writeFileSync(markupFile, markup);
// }

describe('bitmark-gen', () => {
  describe('JSON => Markup => JSON: Tests', () => {
    // Ensure required folders
    fs.ensureDirSync(TEST_OUTPUT_DIR);

    let allTestFiles = getTestFilenames();

    if (Number.isInteger(SINGLE_FILE_START)) {
      allTestFiles = allTestFiles.slice(SINGLE_FILE_START, SINGLE_FILE_START + SINGLE_FILE_COUNT);
    }

    console.info(`Tests found: ${allTestFiles.length}`);

    // describe.each(allTestFiles)('Test file: %s', (testFile: string) => {
    //   test('JSON ==> Markup ==> JSON', async () => {

    allTestFiles.forEach((testFile: string) => {
      const partFolderAndFile = testFile.replace(TEST_INPUT_DIR, '');
      const partFolder = path.dirname(partFolderAndFile);
      const fullFolder = path.join(TEST_OUTPUT_DIR, partFolder);
      const id = path.basename(partFolderAndFile, '.bit');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        // Calculate the filenames
        const originalMarkupFile = path.resolve(fullFolder, `${id}.bit`);
        const originalJsonFile = path.resolve(fullFolder, `${id}.json`);
        const generatedMarkupFile = path.resolve(fullFolder, `${id}.gen.bit`);
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        // Generate JSON from generated bitmark markup using the parser
        const originalJson = bitmarkParser.parse(originalMarkup);

        // Write the new JSON
        fs.writeFileSync(originalJsonFile, JSON.stringify(originalJson, null, 2), {
          encoding: 'utf8',
        });

        // Remove uninteresting JSON items
        BitJsonUtils.cleanupJson(originalJson, { removeParser: true, removeErrors: true });

        // // Write original bitmark (and JSON?)
        // writeTestJsonAndBitmark(originalJson, fullFolder, id);

        // Convert the bitmark JSON to bitmark AST
        const bitmarkAst = jsonParser.toAst(originalJson);

        // Generate markup code from AST
        const generator = new BitmarkFileGenerator(generatedMarkupFile, undefined, {
          explicitTextFormat: false,
        });

        await generator.generate(bitmarkAst);

        const newMarkup = fs.readFileSync(generatedMarkupFile, 'utf8');

        // Generate JSON from generated bitmark markup using the parser
        const newJson = bitmarkParser.parse(newMarkup);

        // Write the new JSON
        fs.writeFileSync(generatedJsonFile, JSON.stringify(newJson, null, 2), {
          encoding: 'utf8',
        });

        // Remove uninteresting JSON items
        BitJsonUtils.cleanupJson(originalJson, { removeMarkup: true });
        BitJsonUtils.cleanupJson(newJson, { removeMarkup: true, removeParser: true, removeErrors: true });

        // Compare old and new JSONs
        const diffMap = deepDiffMapper.map(originalJson, newJson, {
          ignoreUnchanged: true,
        });

        // Write the diff Map JSON
        fs.writeFileSync(jsonDiffFile, JSON.stringify(diffMap, null, 2), {
          encoding: 'utf8',
        });

        expect(newJson).toEqual(originalJson);

        // If we get to here, we can delete the diff file as there were no important differences
        fs.removeSync(jsonDiffFile);

        // const equal = deepEqual(newJson, json, { strict: true });
        // expect(equal).toEqual(true);
      });
    });
  });
});
