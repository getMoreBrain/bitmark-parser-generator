// import deepEqual from 'deep-equal';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';
import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { BitmarkFileGenerator } from '../../src/generator/bitmark/BitmarkFileGenerator.ts';
import { JsonFileGenerator } from '../../src/generator/json/JsonFileGenerator.ts';
import { BitmarkParser } from '../../src/parser/bitmark/BitmarkParser.ts';
import { JsonParser } from '../../src/parser/json/JsonParser.ts';
import { FileUtils } from '../../src/utils/FileUtils.ts';
import { deepDiffMapper } from '../utils/deepDiffMapper.ts';
import { JsonCleanupUtils } from '../utils/JsonCleanupUtils.ts';
import { getTestFiles, getTestFilesDir } from './config/config-bitmark-files.ts';
import { isDebugPerformance } from './config/config-test.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const DEBUG_PERFORMANCE = isDebugPerformance();

const TEST_FILES = getTestFiles();
const TEST_INPUT_DIR = getTestFilesDir();
// const JSON_INPUT_DIR = path.resolve(TEST_INPUT_DIR, './json');
const TEST_OUTPUT_DIR = path.resolve(dirname, './results/bitmark-generator/output');

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
    match: new RegExp('.+\\.bitmark$'),
    recursive: true,
  });

  return files;
}

describe('bitmark-generator', () => {
  test('JSON => Bitmark (convert API)', () => {
    //
    const bpg = new BitmarkParserGenerator();

    const bitmark = bpg.convert(
      '[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark++", "bitLevel": 1, "body": "Hello World" }}]',
    ) as string;

    expect(bitmark.replace(new RegExp('[\\n]', 'g'), '')).to.equal('[.article]Hello World');
  });

  describe('JSON => Bitmark => JSON', () => {
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
          textAsPlainText: false, // For testing the BITMARK generator, use use v3 json text rather than plain text in the JSON
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
        const originalJsonGenerator = new JsonFileGenerator(originalJsonFile, {
          jsonOptions,
        });

        await originalJsonGenerator.generate(originalBitmarkAst);

        // Read in the test JSON file
        const originalJson = fs.readJsonSync(originalJsonFile, 'utf8');

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

        // Generate JSON from generated bitmark markup using the PEG parser
        const newBitmarkAst = bitmarkParser.toAst(newMarkup);

        // Write the new AST
        fs.writeFileSync(generatedAstFile, JSON.stringify(newBitmarkAst, null, 2), {
          encoding: 'utf8',
        });

        // Generate JSON from AST
        const newJsonGenerator = new JsonFileGenerator(generatedJsonFile, {
          jsonOptions,
        });

        await newJsonGenerator.generate(newBitmarkAst);

        // Read in the generated JSON file
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
          const genTimeSecs =
            Math.round(performance.measure('GEN', 'GEN:Start', 'GEN:End').duration) / 1000;
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
