/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import bitmarkGrammer from 'bitmark-grammar';
import { BitmarkParser } from 'bitmark-grammar/src';
// import deepEqual from 'deep-equal';
import fs from 'fs-extra';
import path from 'path';

import { BitmarkJson } from '../src/ast/tools/BitmarkJson';
import { FileBitmapMarkupGenerator } from '../src/ast/tools/FileBitmapMarkupGenerator';
import { FileUtils } from '../src/utils/FileUtils';

import { deepDiffMapper } from './utils/deepDiffMapper';

// Passed: 0-2, 4-26, 28
// Failed:
// - 3: akad_2_aufgabenset_4 (parser error?)
// - 27: berufsbildner_qualicarte (bullet, parser error?)
// - 29: berufsbildner_quiz_bewertungsgespraech (multiple-response-1, parser error?)

const SINGLE_FILE_START = 30;
const SINGLE_FILE_COUNT = 50;

// TODO should use 'require.resolve()' rather than direct node_modules
const JSON_TEST_INPUT_DIR = path.resolve(__dirname, '../assets/test/books/json');
const JSON_TEST_OUTPUT_DIR = path.resolve(__dirname, '../assets/test/books/results');

function getTestJsonFilenames(): string[] {
  const files = FileUtils.getFilenamesSync(JSON_TEST_INPUT_DIR, {
    match: new RegExp('.+.json'),
    recursive: true,
  });

  return files;
}

function writeTestJsonAndBitmark(json: unknown, fullFolder: string, id: string): void {
  // // Write original JSON
  const jsonFile = path.resolve(fullFolder, `${id}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2));

  // Write original Bitmark
  const bitwrappers = BitmarkJson.preprocessJson(json);

  const markupFile = path.resolve(fullFolder, `${id}.bit`);
  let markup = '';
  for (let i = 0, len = bitwrappers.length; i < len; i++) {
    const bw = bitwrappers[i];
    const first = i === 0;

    if (!first && bw.bitmark) {
      markup += '\n\n\n';
    }

    markup += bw.bitmark || '';
  }
  fs.writeFileSync(markupFile, markup);
}

function removeMarkup(obj: any, options?: { removeErrors?: boolean }): void {
  options = Object.assign({}, options);

  if (obj) {
    if (!Array.isArray(obj)) {
      obj = [obj];
    }
    for (const item of obj) {
      delete item.bitmark;
      delete item.parser;
      if (options.removeErrors) delete item.errors;
      if (item.resource) {
        delete item.resource.private;
      }
    }
  }
}

describe('bitmark-generator', () => {
  describe('JSON', () => {
    // Ensure required folders
    fs.ensureDirSync(JSON_TEST_OUTPUT_DIR);

    let allTestFiles = getTestJsonFilenames();

    if (Number.isInteger(SINGLE_FILE_START)) {
      allTestFiles = allTestFiles.slice(SINGLE_FILE_START, SINGLE_FILE_START + SINGLE_FILE_COUNT);
    }

    console.info(`JSON tests found: ${allTestFiles.length}`);

    // describe.each(allTestFiles)('Test file: %s', (testFile: string) => {
    //   test('JSON ==> Markup ==> JSON', async () => {

    allTestFiles.forEach((testFile: string) => {
      const partFolderAndFile = testFile.replace(JSON_TEST_INPUT_DIR, '');
      const partFolder = path.dirname(partFolderAndFile);
      const fullFolder = path.join(JSON_TEST_OUTPUT_DIR, partFolder);
      const id = path.basename(partFolderAndFile, '.json');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`JSON ==> Markup ==> JSON: ${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        const json = fs.readJsonSync(testFile, 'utf8');

        // Write original bitmark (and JSON?)
        writeTestJsonAndBitmark(json, fullFolder, id);

        // Convert the bitmark JSON to bitmark AST
        const bitmarkAst = BitmarkJson.toAst(json);

        // Generate markup code from AST
        const markupFile = path.resolve(fullFolder, `${id}.gen.bit`);
        const generator = new FileBitmapMarkupGenerator(
          markupFile,
          {
            flags: 'w',
          },
          {
            explicitTextFormat: false,
          },
        );

        await generator.generate(bitmarkAst);

        const markup = fs.readFileSync(markupFile, 'utf8');

        // Generate JSON from generated bitmark markup using the parser
        // const newJson = bitmarkGrammer.parse(markupFile);
        const parser = new BitmarkParser(markup, {
          trace: false,
          debug: false,
          need_error_report: false,
        });

        let newJson = [];
        try {
          const newJsonStr = parser.parse();
          newJson = JSON.parse(newJsonStr);
        } catch {
          throw new Error('Failed to parse bitmark-grammer output');
        }

        // Write the new JSON
        const fileNewJson = path.resolve(fullFolder, `${id}.gen.json`);
        fs.writeFileSync(fileNewJson, JSON.stringify(newJson, null, 2), {
          encoding: 'utf8',
        });

        // Remove uninteresting JSON items
        removeMarkup(json, { removeErrors: true });
        removeMarkup(newJson, { removeErrors: true });

        // Compare old and new JSONs
        const diffMap = deepDiffMapper.map(json, newJson, {
          ignoreUnchanged: true,
        });

        // Write the diff Map JSON
        const fileDiffMap = path.resolve(fullFolder, `${id}.diff.json`);
        fs.writeFileSync(fileDiffMap, JSON.stringify(diffMap, null, 2), {
          encoding: 'utf8',
        });

        // // Remove uninteresting JSON items
        // removeMarkup(json, { removeErrors: true });
        // removeMarkup(newJson);

        expect(newJson).toEqual(json);

        // If we get to here, we can delete the diff file as there were no important differences
        fs.removeSync(fileDiffMap);

        // const equal = deepEqual(newJson, json, { strict: true });
        // expect(equal).toEqual(true);
      });
    });
  });
});
