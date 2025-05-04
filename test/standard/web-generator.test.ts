/**
 * @jest-environment jsdom
 */

import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';
import { performance } from 'perf_hooks';

import * as bpgLib from '../../dist/browser/bitmark-parser-generator.min';
import { FileUtils } from '../../src/utils/FileUtils';
import { JsonCleanupUtils } from '../utils/JsonCleanupUtils';
import { deepDiffMapper } from '../utils/deepDiffMapper';

import { getTestFiles, getTestFilesDir } from './config/config-bitmark-files';
import { isDebugPerformance } from './config/config-test';

const DEBUG_PERFORMANCE = isDebugPerformance();

const TEST_FILES = getTestFiles();
const TEST_INPUT_DIR = getTestFilesDir();
// const JSON_INPUT_DIR = path.resolve(TEST_INPUT_DIR, './json');
const TEST_OUTPUT_DIR = path.resolve(__dirname, './results/web-bitmark-generator/output');

const jsonParser = new bpgLib.JsonParser();
const bitmarkParser = new bpgLib.BitmarkParser();

// DISABLE TESTS
// return false;

/**
 * Get the list of files in the TEST_INPUT_DIR (bitmark files)
 * @returns
 */
function getTestFilenames(): string[] {
  const files = FileUtils.getFilenamesSync(TEST_INPUT_DIR, {
    match: new RegExp('.+\\.bitmark$'),
    recursive: true,
  });

  return files;
}

describe('web-bitmark-generator', () => {
  describe('JSON => Markup => JSON: Tests', () => {
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
        const originalMarkupFile = path.resolve(fullFolder, `${id}.bitmark`);
        const originalJsonFile = path.resolve(fullFolder, `${id}.json`);
        const generatedMarkupFile = path.resolve(fullFolder, `${id}.gen.bitmark`);
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        const generatedAstFile = path.resolve(fullFolder, `${id}.ast.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        const jsonOptions = {
          textAsPlainText: true, // For testing the WEB generator, use plain text rather than JSON for text
          prettify: true, // For testing the output is easier to read if it is prettified
        };

        const bitmarkOptions = {
          explicitTextFormat: false,
        };

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        // Generate JSON from original bitmark markup using the PEG parser
        const originalBitmarkAst = bitmarkParser.toAst(originalMarkup);

        // Generate JSON from AST
        const originalGenerator = new bpgLib.JsonStringGenerator({
          jsonOptions,
        });

        const originalJsonStr = await originalGenerator.generate(originalBitmarkAst);
        const originalJson = JSON.parse(originalJsonStr);

        // Write the original JSON file
        fs.writeFileSync(originalJsonFile, originalJsonStr, {
          encoding: 'utf8',
        });

        // Remove uninteresting JSON items
        JsonCleanupUtils.cleanupBitJson(originalJson, {
          removeParser: true,
          removeErrors: true,
          removeTemporaryProperties: true,
        });

        // // Write original bitmark (and JSON?)
        // writeTestJsonAndBitmark(originalJson, fullFolder, id);

        // Convert the bitmark JSON to bitmark AST
        performance.mark('GEN:Start');
        const newBitmarkAst = jsonParser.toAst(originalJson);

        // Generate markup code from AST
        const bitmarkGenerator = new bpgLib.BitmarkStringGenerator({
          bitmarkOptions,
        });

        const newMarkup = await bitmarkGenerator.generate(newBitmarkAst);

        performance.mark('GEN:End');

        // Write the generated markup file
        fs.writeFileSync(generatedMarkupFile, newMarkup, {
          encoding: 'utf8',
        });

        // Generate JSON from generated bitmark markup using the parser

        // Generate JSON from generated bitmark markup using the PEG parser
        const newMarkupBitmarkAst = bitmarkParser.toAst(newMarkup);

        // Write the new AST
        fs.writeFileSync(generatedAstFile, JSON.stringify(newMarkupBitmarkAst, null, 2), {
          encoding: 'utf8',
        });

        // Generate JSON from AST
        const generator = new bpgLib.JsonStringGenerator({
          jsonOptions,
        });

        const newJsonStr = await generator.generate(newMarkupBitmarkAst);
        const newJson = JSON.parse(newJsonStr);

        // Write in the generated JSON file
        fs.writeFileSync(generatedJsonFile, newJsonStr, {
          encoding: 'utf8',
        });

        // Remove uninteresting JSON items
        JsonCleanupUtils.cleanupBitJson(originalJson, { removeMarkup: true, removeTemporaryProperties: true });
        JsonCleanupUtils.cleanupBitJson(newJson, {
          removeMarkup: true,
          removeParser: true,
          removeErrors: true,
          removeTemporaryProperties: true,
        });

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
