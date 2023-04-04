/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkFileGenerator } from '../../../src/generator/bitmark/BitmarkFileGenerator';
import { BitmarkParser } from '../../../src/parser/bitmark/BitmarkParser';
import { JsonParser } from '../../../src/parser/json/JsonParser';
import { FileUtils } from '../../../src/utils/FileUtils';
import { BitJsonUtils } from '../../utils/BitJsonUtils';
import { deepDiffMapper } from '../../utils/deepDiffMapper';

// Passed: 0-26, 28-37, 39-58, 60, 76-78, 81-92, 94-99, 101-102, 104-106, 108-109, 111-120, 122-143
// 150-154, 157-174, 177-209, 211, 214-216, 218-220, 225, 227-235, 237-
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
// - 147: gmb_release_notes (@authors.name is not implemented (not sure if I should implement it))
// - 148: gmb_test_book_utf8 (@authors.name is not implemented (not sure if I should implement it))
// - 149: gmb_test_book_utf8 (@authors.name @quoter (quotedPerson?) are not implemented (not sure if we should implement it))
// - 155: hgf_pauli_band_2 (failing because .interview has empty question with @shortAnswer which is currently being ignored due to a parser error)
// - 156: hgf_pauli_band_3 (failing because .interview has empty question with @shortAnswer which is currently being ignored due to a parser error)
// - 175: lernen_will_mehr_betriebswirtschaft (Unsupported @image tag)
// - 176: medium_artwork_personalization (Typo in @language tag (@languge))
// - 210: the_art_of_art_history_final (parser error due to unescaped [...] at end of body)
// - 212: beltz_paedagogik (parser error due to unescaped [...] within body)
// - 213: eeo (parser error due to unescaped [...] within body)
// - 217: psychologie_heute (unsupported tag @trimmedImages - not sure if I should implement it)
// - 221: rolang_exercises_book_2022 (parser error in [.interview] - see "question": "viitor) weekendul următor.")
// - 222: schubert_erkundungen_b2 - TODO - code generator bitmark kills parser
// - 223: schubert_erkundungen_b2_sl_design - TODO - code generator bitmark kills parser
// - 224: schubert_online_a2_spektrum -(.match-solution-grouped, body incorrectly filled with === / ==, parser error?)
// - 226: schubert_online_b2 -(.match-solution-grouped, body incorrectly filled with === / ==, parser error?)
// - 236: sofatutor_unregelmaeßige_verben -(.match-solution-grouped, body incorrectly filled with === / ==, parser error?)
// - 246: informatik - TODO - code generator bitmark kills parser
// - 249: wiss_aufgabensammlung_business_engineering (parser error, [.interview] Body is incorrect - has the first question attached to it.)

const SINGLE_FILE_START = 0;
const SINGLE_FILE_COUNT = 1;

const TEST_INPUT_DIR = path.resolve(__dirname, '../../../assets/test/books/bits');
const TEST_OUTPUT_DIR = path.resolve(__dirname, '../../../assets/test/books/results');

const jsonParser = new JsonParser();
const bitmarkParser = new BitmarkParser();

/**
 * Get the list of files in the TEST_INPUT_DIR (bitmark files)
 * @returns
 */
function getTestFilenames(): string[] {
  const files = FileUtils.getFilenamesSync(TEST_INPUT_DIR, {
    // match: new RegExp('.+.json'),
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
  describe('JSON => Markup => JSON: Books', () => {
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
