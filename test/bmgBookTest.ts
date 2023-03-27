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

import { BitJsonUtils } from './utils/BitJsonUtils';
import { deepDiffMapper } from './utils/deepDiffMapper';

// Passed: 0-26, 28-37, 39-58, 60, 76-78, 81-92, 94-99, 101-102, 104-106, 108-109, 111-120, 122-143
// 150-154, 157-174, 177-198
// Failed:
// - 27: berufsbildner_qualicarte (bullet, parser error?)
// - 38: zentrale_aufnahmepruefung_2019_mathe (.interview->questions, parser error?)
// - 59: bumbacher_vier_facetten (.self-assesment->bullet, parser error?)
// - 61-74: card2brain/* (.flashcard-1-> no === / == so cards interpreted as body, parser error?)
// - 75: fage_band8 (.match-solution-grouped, body incorrectly filled with === / ==, parser error?)
// - 79-80: marketing (.match-solution-grouped, parser error?)
// - 93: match (.match, parser error - body corrupted if before matches)
// - 100: englisch_helfen_adjektiv (.match-solution-grouped, body incorrectly filled with === / ==, parser error?)
// - 103: englisch_hilfen_adjektiv (.match-solution-grouped, body incorrectly filled with === / ==, parser error?)
// - 107: englisch_hilfen_fragen (.cloze, not parsed fully by the parser (might be invalid))
// - 110: englisch_hilfen_if_saetze (there is an extra ] in the original (likely invalid))
// - 121: englisch_hilfen_zeitformen (.cloze, not parsed fully by the parser (might be invalid))
// - 144: gmb_quizzes (.multiple-choice, parser error due to @example, record-audio -> record, parser error)
// - 145: gmb_quizzes_for_design (.match-solution-grouped, body incorrectly filled with === / ==, parser error?)
// - 146: gmb_quizzes_v2 (.match-solution-grouped, body incorrectly filled with === / ==, parser error?)
// - 147: gmb_release_notes (@authors.name is not implemented (not sure if we should implement it))
// - 148: gmb_test_book_utf8 (@authors.name is not implemented (not sure if we should implement it))
// - 149: gmb_test_book_utf8 (@authors.name @quoter (quotedPerson?) are not implemented (not sure if we should implement it))
// - 155: hgf_pauli_band_2 (failing because .interview has empty question with @shortAnswer which is currently being ignored due to a parser error)
// - 156: hgf_pauli_band_3 (failing because .interview has empty question with @shortAnswer which is currently being ignored due to a parser error)
// - 175: lernen_will_mehr_betriebswirtschaft (Unsupported @image tag)
// - 176: medium_artwork_personalization (Typo in @language tag (@languge))

// TODO - delete bits with errors before testing (as bits with errors will cause issues in the test for sure!)

const SINGLE_FILE_START = 199;
const SINGLE_FILE_COUNT = 1;

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

describe('bitmark-gen', () => {
  describe('JSON => Markup => JSON: Books', () => {
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

      test(`${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        const json = fs.readJsonSync(testFile, 'utf8');

        // Remove uninteresting JSON items
        BitJsonUtils.cleanupJson(json, { removeParser: true, removeErrors: true });

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
        BitJsonUtils.cleanupJson(json, { removeMarkup: true });
        BitJsonUtils.cleanupJson(newJson, { removeMarkup: true, removeParser: true, removeErrors: true });

        // Compare old and new JSONs
        const diffMap = deepDiffMapper.map(json, newJson, {
          ignoreUnchanged: true,
        });

        // Write the diff Map JSON
        const fileDiffMap = path.resolve(fullFolder, `${id}.diff.json`);
        fs.writeFileSync(fileDiffMap, JSON.stringify(diffMap, null, 2), {
          encoding: 'utf8',
        });

        expect(newJson).toEqual(json);

        // If we get to here, we can delete the diff file as there were no important differences
        fs.removeSync(fileDiffMap);

        // const equal = deepEqual(newJson, json, { strict: true });
        // expect(equal).toEqual(true);
      });
    });
  });
});
