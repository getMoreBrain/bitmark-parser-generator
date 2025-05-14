import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';

import { TextGenerator } from '../../src/generator/text/TextGenerator';
import { TextFormat } from '../../src/model/enum/TextFormat';
import { TextParser } from '../../src/parser/text/TextParser';
import { FileUtils } from '../../src/utils/FileUtils';
import { deepDiffMapper } from '../utils/deepDiffMapper';

import { isDebugPerformance } from './config/config-test';
import { getTestFiles, getTestFilesDir } from './config/config-text-minusminus-files';

const DEBUG_PERFORMANCE = isDebugPerformance();

const TEST_FILES = getTestFiles();
const TEST_INPUT_DIR = getTestFilesDir();
// const JSON_INPUT_DIR = path.resolve(TEST_INPUT_DIR, './json');
const TEST_OUTPUT_DIR = path.resolve(__dirname, './results/text-minusminus-generator/output');

const textGenerator = new TextGenerator();
const textParser = new TextParser();

// DISABLE TESTS
// return false;

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

describe('text-minusminus-generation', () => {
  describe('JSON => Text => JSON: Tests', () => {
    // Ensure required folders
    fs.ensureDirSync(TEST_OUTPUT_DIR);

    let allTestFiles = getTestFilenames();

    // Filter out the files that are not in the test list
    allTestFiles = allTestFiles.filter((testFile) => {
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      // const id = path.basename(partFolderAndFile, '.bitmark');
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
      // const fullJsonInputFolder = path.join(JSON_INPUT_DIR, partFolder);
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      const id = path.basename(partFolderAndFile, '.bitmark');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        // Calculate the filenames
        // const testJsonFile = path.resolve(fullJsonInputFolder, `${id}.json`);
        const originalMarkupFile = path.resolve(fullFolder, `${id}.text`);
        const originalJsonFile = path.resolve(fullFolder, `${id}.json`);
        const generatedMarkupFile = path.resolve(fullFolder, `${id}.gen.text`);
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        // Generate JSON from breakscaped markup text
        const textAst = textParser.toAst(originalMarkup, {
          textFormat: TextFormat.bitmarkMinusMinus,
          isProperty: false,
        });

        // Write JSON file
        fs.writeFileSync(originalJsonFile, JSON.stringify(textAst, null, 2), {
          encoding: 'utf8',
        });

        // Read in the test JSON file
        const originalJson = fs.readJsonSync(originalJsonFile, 'utf8');

        // Remove uninteresting JSON items
        // JsonCleanupUtils.cleanupBitJson(originalJson, { removeParser: true, removeErrors: true });

        // Convert the JSON to text
        performance.mark('GEN:Start');
        const text = textGenerator.generateSync(originalJson, TextFormat.bitmarkMinusMinus);

        // Write the new text to file
        fs.writeFileSync(generatedMarkupFile, text, {
          encoding: 'utf8',
        });

        performance.mark('GEN:End');

        // Read in the generated text file
        const newMarkup = fs.readFileSync(generatedMarkupFile, 'utf8');

        // Generate JSON from generated text
        const newTextAst = textParser.toAst(newMarkup, {
          textFormat: TextFormat.bitmarkMinusMinus,
          isProperty: false,
        });

        // Write the new JSON file
        fs.writeFileSync(generatedJsonFile, JSON.stringify(newTextAst, null, 2), {
          encoding: 'utf8',
        });

        // Read in the generated JSON file
        const newJson = fs.readJsonSync(generatedJsonFile, 'utf8');

        // Remove uninteresting JSON items
        // JsonCleanupUtils.cleanupBitJson(originalJson, { removeMarkup: true });
        // JsonCleanupUtils.cleanupBitJson(newJson, { removeMarkup: true, removeParser: true, removeErrors: true });

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
          const genTimeSecs = Math.round(performance.measure('GEN', 'GEN:Start', 'GEN:End').duration) / 1000;
          console.log(`'${fileId}' timing; GEN: ${genTimeSecs} s`);
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
