/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';
import { performance } from 'perf_hooks';

import { JsonFileGenerator } from '../../src/generator/json/JsonFileGenerator';
import { BitmarkParser } from '../../src/parser/bitmark/BitmarkParser';
// import { JsonParser } from '../../src/parser/json/JsonParser';
import { FileUtils } from '../../src/utils/FileUtils';
import { BitJsonUtils } from '../utils/BitJsonUtils';
import { deepDiffMapper } from '../utils/deepDiffMapper';

const SINGLE_FILE_START = 0;
const SINGLE_FILE_COUNT = 1;

const TEST_INPUT_DIR = path.resolve(__dirname, './bitmark');
const TEST_OUTPUT_DIR = path.resolve(__dirname, './results/bitmark-parser/output');

// const jsonParser = new JsonParser();
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

describe('json-gen', () => {
  describe('Markup => JSON (both parsers): Tests', () => {
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
      performance.clearMarks();
      performance.clearMeasures();

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
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        const generatedAstFile = path.resolve(fullFolder, `${id}.ast.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        // Generate JSON from generated bitmark markup using the ANTLR parser
        performance.mark('ANTLR:Start');
        const originalJson = bitmarkParser.parse(originalMarkup);

        // Write the new JSON
        fs.writeFileSync(originalJsonFile, JSON.stringify(originalJson, null, 2), {
          encoding: 'utf8',
        });

        performance.mark('ANTLR:End');

        // Remove uninteresting JSON items
        BitJsonUtils.cleanupJson(originalJson, { removeParser: true, removeErrors: true });

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
        const generator = new JsonFileGenerator(generatedJsonFile, undefined, {
          prettify: true,
        });

        await generator.generate(bitmarkAst);

        performance.mark('PEG:End');

        const newJson = fs.readJsonSync(generatedJsonFile, 'utf8');

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

        const antlrTimeSecs = Math.round(performance.measure('ANTLR', 'ANTLR:Start', 'ANTLR:End').duration) / 1000;
        const pegTimeSecs = Math.round(performance.measure('PEG', 'PEG:Start', 'PEG:End').duration) / 1000;
        const speedUp = Math.round((antlrTimeSecs / pegTimeSecs) * 100) / 100;
        console.log(`'${id}' timing; ANTLR: ${antlrTimeSecs} s, PEG: ${pegTimeSecs} s, speedup: x${speedUp}`);

        expect(newJson).toEqual(originalJson);

        // If we get to here, we can delete the diff file as there were no important differences
        fs.removeSync(jsonDiffFile);

        // const equal = deepEqual(newJson, json, { strict: true });
        // expect(equal).toEqual(true);
      });
    });
  });
});
