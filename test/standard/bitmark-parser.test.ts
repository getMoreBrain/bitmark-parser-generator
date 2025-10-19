// import deepEqual from 'deep-equal';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';
import { performance } from 'perf_hooks';
import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { JsonFileGenerator } from '../../src/generator/json/JsonFileGenerator.ts';
import { BitmarkVersion, type BitWrapperJson } from '../../src/index.ts';
import { BitmarkParser } from '../../src/parser/bitmark/BitmarkParser.ts';
// import { JsonParser } from '../../src/parser/json/JsonParser.ts';
import { FileUtils } from '../../src/utils/FileUtils.ts';
import { deepDiffMapper } from '../utils/deepDiffMapper.ts';
import { JsonCleanupUtils } from '../utils/JsonCleanupUtils.ts';
import { getTestFiles, getTestFilesDir } from './config/config-bitmark-files.ts';
import { isDebugPerformance } from './config/config-test.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const DEBUG_PERFORMANCE = isDebugPerformance();

const TEST_FILES = getTestFiles();
const TEST_INPUT_DIR = getTestFilesDir();
const JSON_INPUT_DIR = path.resolve(TEST_INPUT_DIR, './json');
const TEST_OUTPUT_DIR = path.resolve(dirname, './results/bitmark-parser/output');

// const jsonParser = new JsonParser();
const bitmarkParser = new BitmarkParser();

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

describe('bitmark-parser', () => {
  test('Bitmark => JSON (convert API)', () => {
    //
    const bpg = new BitmarkParserGenerator();

    const json = bpg.convert('[.article]\nHello World', {
      bitmarkVersion: BitmarkVersion.v2,
    }) as BitWrapperJson[];

    expect(json[0].bit).to.deep.equal({
      type: 'article',
      format: 'bitmark++',
      bitLevel: 1,
      item: '',
      lead: '',
      pageNumber: '',
      marginNumber: '',
      hint: '',
      instruction: '',
      body: 'Hello World',
    });
  });

  describe('Bitmark => JSON', () => {
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
      const fullJsonInputFolder = path.join(JSON_INPUT_DIR, partFolder);
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      const id = path.basename(partFolderAndFile, '.bitmark');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        // Calculate the filenames
        const testJsonFile = path.resolve(fullJsonInputFolder, `${id}.json`);
        const originalMarkupFile = path.resolve(fullFolder, `${id}.bitmark`);
        const originalJsonFile = path.resolve(fullFolder, `${id}.json`);
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        // const generatedJsonFile = path.resolve(fullFolder, 'hack', `${id}.json`); // For regenerating JSON to compare against
        const generatedAstFile = path.resolve(fullFolder, `${id}.ast.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        const jsonOptions = {
          textAsPlainText: false, // For testing the parser, use v3 json text rather than plain text in the JSON
          prettify: true, // For testing the output is easier to read if it is prettified
        };

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        // TEST AGAINST JSON FILES

        // Copy the original expected JSON file to the output folder
        fs.copySync(testJsonFile, originalJsonFile);

        // Read in the test expected JSON file
        const originalJson = fs.readJsonSync(originalJsonFile, 'utf8');

        // Remove uninteresting JSON items
        JsonCleanupUtils.cleanupBitJson(originalJson, {
          removeParser: true,
          removeErrors: true,
          removeTemporaryProperties: true,
        });

        // // Write original bitmark (and JSON?)
        // writeTestJsonAndBitmark(originalJson, fullFolder, id);

        // Convert the Bitmark markup to bitmark AST
        performance.mark('PEG:Start');
        const bitmarkAst = bitmarkParser.toAst(originalMarkup);

        // Write the new AST
        fs.writeFileSync(generatedAstFile, JSON.stringify(bitmarkAst, null, 2), {
          encoding: 'utf8',
        });

        // Generate JSON from AST
        const generator = new JsonFileGenerator(generatedJsonFile, {
          jsonOptions,
        });

        await generator.generate(bitmarkAst);

        performance.mark('PEG:End');

        const newJson = fs.readJsonSync(generatedJsonFile, 'utf8');

        // Remove uninteresting JSON items
        JsonCleanupUtils.cleanupBitJson(originalJson, {
          removeMarkup: true,
          removeTemporaryProperties: true,
        });
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
          const pegTimeSecs =
            Math.round(performance.measure('PEG', 'PEG:Start', 'PEG:End').duration) / 1000;
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
