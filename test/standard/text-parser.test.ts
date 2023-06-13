/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';
import { performance } from 'perf_hooks';

import { TextFormat } from '../../src/model/enum/TextFormat';
import { TextParser } from '../../src/parser/text/TextParser';
import { FileUtils } from '../../src/utils/FileUtils';
import { deepDiffMapper } from '../utils/deepDiffMapper';

// Enable or disable testing of specific files
const TEST_ALL = process.env.CI || true;

// Set to true to generate performance debug output
const DEBUG_PERFORMANCE = !process.env.CI;

const TEST_INPUT_DIR = path.resolve(__dirname, './text');
const JSON_INPUT_DIR = path.resolve(__dirname, './text/json');
const TEST_OUTPUT_DIR = path.resolve(__dirname, './results/text-parser/output');

let TEST_FILES: string[] = [
  //
  // 'plain.text',
];

// ALL tests for CI
if (TEST_ALL) {
  TEST_FILES = [
    //
    'plain.text',
  ];
}

const textParser = new TextParser();

/**
 * Get the list of files in the TEST_INPUT_DIR (text files)
 * @returns
 */
function getTestFilenames(): string[] {
  const files = FileUtils.getFilenamesSync(TEST_INPUT_DIR, {
    match: new RegExp('.+\\.text$'),
    recursive: true,
  });

  return files;
}

describe('text-parser', () => {
  describe('Text => JSON (text): Tests', () => {
    // Ensure required folders
    fs.ensureDirSync(TEST_OUTPUT_DIR);

    let allTestFiles = getTestFilenames();

    // Filter out the files that are not in the test list
    allTestFiles = allTestFiles.filter((testFile) => {
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      // const id = path.basename(partFolderAndFile, '.text');
      if (TEST_FILES.includes(fileId)) {
        return true;
      } else {
        // FOR DEBUG
        // console.log(`Skipping test file: ${fileId}`);
      }
    });

    console.info(`Tests found: ${allTestFiles.length}`);

    // describe.each(allTestFiles)('Test file: %s', (testFile: string) => {
    //   test('JSON ==> Markup ==> JSON', async () => {

    allTestFiles.forEach((testFile: string) => {
      performance.clearMarks();
      performance.clearMeasures();

      const partFolderAndFile = testFile.replace(TEST_INPUT_DIR, '');
      const partFolder = path.dirname(partFolderAndFile);
      const fullFolder = path.join(TEST_OUTPUT_DIR, partFolder);
      const fullJsonInputFolder = path.join(JSON_INPUT_DIR, partFolder);
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      const id = path.basename(partFolderAndFile, '.text');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        // Calculate the filenames
        const testJsonFile = path.resolve(fullJsonInputFolder, `${id}.json`);
        const originalMarkupFile = path.resolve(fullFolder, `${id}.text`);
        const originalJsonFile = path.resolve(fullFolder, `${id}.json`);
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        // Copy the original expected JSON file to the output folder
        fs.copySync(testJsonFile, originalJsonFile);

        // Read in the test expected JSON file
        const originalJson = fs.readJsonSync(originalJsonFile, 'utf8');

        // Remove uninteresting JSON items
        // BitJsonUtils.cleanupJson(originalJson, { removeParser: true, removeErrors: true });

        // // Write original bitmark (and JSON?)
        // writeTestJsonAndBitmark(originalJson, fullFolder, id);

        // Convert the Bitmark markup to bitmark AST
        performance.mark('PEG:Start');
        const textAst = textParser.toAst(originalMarkup, {
          textFormat: TextFormat.bitmarkPlusPlus,
        });

        // Write the new AST
        fs.writeFileSync(generatedJsonFile, JSON.stringify(textAst, null, 2), {
          encoding: 'utf8',
        });

        performance.mark('PEG:End');

        const newJson = fs.readJsonSync(generatedJsonFile, 'utf8');

        // Remove uninteresting JSON items
        // BitJsonUtils.cleanupJson(originalJson, { removeMarkup: true });
        // BitJsonUtils.cleanupJson(newJson, { removeMarkup: true, removeParser: true, removeErrors: true });

        // Compare old and new JSONs
        const diffMap = deepDiffMapper.map(originalJson, newJson, {
          ignoreUnchanged: true,
        });

        // Write the diff Map JSON
        fs.writeFileSync(jsonDiffFile, JSON.stringify(diffMap, null, 2), {
          encoding: 'utf8',
        });

        // Print performance information
        if (DEBUG_PERFORMANCE) {
          const pegTimeSecs = Math.round(performance.measure('PEG', 'PEG:Start', 'PEG:End').duration) / 1000;
          console.log(`'${fileId}' timing; PEG: ${pegTimeSecs} s`);
        }

        expect(newJson).toEqual(originalJson);

        // If we get to here, we can delete the diff file as there were no important differences
        fs.removeSync(jsonDiffFile);

        // const equal = deepEqual(newJson, json, { strict: true });
        // expect(equal).toEqual(true);
      });
    });
  });
});
