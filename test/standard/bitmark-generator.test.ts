/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkFileGenerator } from '../../src/generator/bitmark/BitmarkFileGenerator';
import { JsonFileGenerator } from '../../src/generator/json/JsonFileGenerator';
import { BitmarkParser } from '../../src/parser/bitmark/BitmarkParser';
import { JsonParser } from '../../src/parser/json/JsonParser';
import { FileUtils } from '../../src/utils/FileUtils';
import { BitJsonUtils } from '../utils/BitJsonUtils';
import { deepDiffMapper } from '../utils/deepDiffMapper';

import { getTestFiles, getTestFilesDir } from './config/config-bitmark-files';
import { isDebugPerformance, isTestAgainstAntlrParser } from './config/config-test';

const DEBUG_PERFORMANCE = isDebugPerformance();
const TEST_AGAINST_ANTLR_PARSER = isTestAgainstAntlrParser();

const TEST_FILES = getTestFiles();
const TEST_INPUT_DIR = getTestFilesDir();
// const JSON_INPUT_DIR = path.resolve(TEST_INPUT_DIR, './json');
const TEST_OUTPUT_DIR = path.resolve(__dirname, './results/bitmark-generator/output');

const jsonParser = new JsonParser();
const bitmarkParser = new BitmarkParser();

// DISABLE TESTS
// return false;

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

describe('bitmark-generator', () => {
  describe('JSON => Markup => JSON: Tests', () => {
    // Ensure required folders
    fs.ensureDirSync(TEST_OUTPUT_DIR);

    let allTestFiles = getTestFilenames();

    // Filter out the files that are not in the test list
    allTestFiles = allTestFiles.filter((testFile) => {
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      // const id = path.basename(partFolderAndFile, '.bit');
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
      const id = path.basename(partFolderAndFile, '.bit');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        // Calculate the filenames
        // const testJsonFile = path.resolve(fullJsonInputFolder, `${id}.json`);
        const originalMarkupFile = path.resolve(fullFolder, `${id}.bit`);
        const originalJsonFile = path.resolve(fullFolder, `${id}.json`);
        const generatedMarkupFile = path.resolve(fullFolder, `${id}.gen.bit`);
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        const generatedAstFile = path.resolve(fullFolder, `${id}.ast.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        const jsonOptions = {
          textAsPlainText: true, // For testing the generator, use plain text rather than JSON for text
          prettify: true, // For testing the output is easier to read if it is prettified
        };

        const bitmarkOptions = {
          explicitTextFormat: false,
        };

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        // Generate JSON from original bitmark markup using the parser
        let originalJson: unknown;

        if (TEST_AGAINST_ANTLR_PARSER) {
          // Generate JSON from original bitmark markup using the ANTLR parser
          performance.mark('ANTLR:Start');
          originalJson = bitmarkParser.parseUsingAntlr(originalMarkup);

          // Write the new JSON
          fs.writeFileSync(originalJsonFile, JSON.stringify(originalJson, null, 2), {
            encoding: 'utf8',
          });

          performance.mark('ANTLR:End');
        } else {
          // Generate JSON from original bitmark markup using the PEG parser
          const bitmarkAst = bitmarkParser.toAst(originalMarkup);

          // Generate JSON from AST
          const generator = new JsonFileGenerator(originalJsonFile, {
            jsonOptions,
          });

          await generator.generate(bitmarkAst);

          // Read in the test JSON file
          originalJson = fs.readJsonSync(originalJsonFile, 'utf8');
        }

        // Remove uninteresting JSON items
        BitJsonUtils.cleanupJson(originalJson, { removeParser: true, removeErrors: true });

        // // Write original bitmark (and JSON?)
        // writeTestJsonAndBitmark(originalJson, fullFolder, id);

        // Convert the bitmark JSON to bitmark AST
        performance.mark('GEN:Start');
        const bitmarkAst = jsonParser.toAst(originalJson);

        // Write the new AST
        fs.writeFileSync(generatedAstFile, JSON.stringify(bitmarkAst, null, 2), {
          encoding: 'utf8',
        });

        // Generate markup code from AST
        const generator = new BitmarkFileGenerator(generatedMarkupFile, {
          bitmarkOptions,
        });

        await generator.generate(bitmarkAst);

        performance.mark('GEN:End');

        // Read in the generated markup file
        const newMarkup = fs.readFileSync(generatedMarkupFile, 'utf8');

        // Generate JSON from generated bitmark markup using the parser
        let newJson: unknown;

        if (TEST_AGAINST_ANTLR_PARSER) {
          // Generate JSON from generated bitmark markup using the ANTLR parser
          newJson = bitmarkParser.parseUsingAntlr(newMarkup);

          // Write the new JSON
          fs.writeFileSync(generatedJsonFile, JSON.stringify(newJson, null, 2), {
            encoding: 'utf8',
          });
        } else {
          // Generate JSON from generated bitmark markup using the PEG parser
          const bitmarkAst = bitmarkParser.toAst(newMarkup);

          // Write the new AST
          fs.writeFileSync(generatedAstFile, JSON.stringify(bitmarkAst, null, 2), {
            encoding: 'utf8',
          });

          // Generate JSON from AST
          const generator = new JsonFileGenerator(generatedJsonFile, {
            jsonOptions,
          });

          await generator.generate(bitmarkAst);

          // Read in the generated JSON file
          newJson = fs.readJsonSync(generatedJsonFile, 'utf8');
        }

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
