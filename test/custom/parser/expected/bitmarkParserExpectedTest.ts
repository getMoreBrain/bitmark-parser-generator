/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';
import { performance } from 'perf_hooks';

import { JsonFileGenerator } from '../../../../src/generator/json/JsonFileGenerator';
import { BitmarkParser } from '../../../../src/parser/bitmark/BitmarkParser';
// import { JsonParser } from '../../../../src/parser/json/JsonParser';
import { FileUtils } from '../../../../src/utils/FileUtils';
import { BitJsonUtils } from '../../../utils/BitJsonUtils';
import { deepDiffMapper } from '../../../utils/deepDiffMapper';

// Passed: 0
// Failed:
// - 0: akad_2_aufgabenset_1 (.interview missing last ===)

// const SINGLE_FILE_START = 55;
// const SINGLE_FILE_COUNT = 1;

const SINGLE_FILE_START = 0;
const SINGLE_FILE_COUNT = 1000;

// Use the following flag to test against the ANTLR parser. This is a slow process.
const TEST_AGAINST_ANTLR_PARSER = false;

// Set to true to generate performance debug output
const DEBUG_PERFORMANCE = true;

const NODE_MODULES_DIR = path.resolve(__dirname, '../../../../node_modules');
const BITMARK_GRAMMAR_DIR = path.resolve(NODE_MODULES_DIR, 'bitmark-grammar');
const TEST_INPUT_DIR = path.resolve(BITMARK_GRAMMAR_DIR, 'src/tests');
const JSON_INPUT_DIR = path.resolve(__dirname, 'json');
const TEST_OUTPUT_DIR = path.resolve(__dirname, 'results/output');

const TEST_FILES = [
  // 'annotate1.bit',
  'appresource.bit',
  // 'article-online.bit',
  // 'article0.bit',
  'article1.bit',
  'article2.bit',
  // 'article3.bit',
  // 'article4.bit',
  // 'article5.bit',
  'article6.bit',
  'assign1.bit',
  // 'b.bit',
  // 'b2-mod1.bit',
  // 'b2-orig.bit',
  // 'b2.bit',
  // 'bb1.bit',
  // 'bbbbug.bit',
  // 'bbbug.bit',
  // 'bbug.bit',
  'bit-alias1.bit',
  'bit-alias2.bit',
  // 'blocktags.bit',
  // 'blocktags2.bit',
  'book-bits.bit',
  'book1.bit',
  'book2.bit',
  'book3.bit',
  'book4.bit',
  // 'bot-action-rating-number.bit',
  'bot-action-response.bit',
  // 'bot-action-true-false.bit',
  // 'bot-action1.bit',
  // 'botinterview1.bit',
  // 'botinterview2.bit',
  // 'bug-img.bit',
  // 'bug.bit',
  // 'bug0.bit',
  // 'bug00.bit',
  // 'bug0603-3.bit',
  // 'bug1.bit',
  // 'bug10.bit',
  // 'bug11.bit',
  // 'bug12.bit',
  // 'bug13.bit',
  // 'bug14.bit',
  // 'bug15.bit',
  // 'bug16.bit',
  // 'bug17.bit',
  // 'bug18.bit',
  // 'bug19.bit',
  // 'bug2.bit',
  // 'bug3.bit',
  // 'bug4.bit',
  // 'bug5.bit',
  // 'bug6.bit',
  // 'bug7.bit',
  // 'bug8.bit',
  // 'bug9.bit',
  // 'bugx.js.bit',
  // 'bugx.bit',
  // 'bugx1.bit',
  // 'bugx2.bit',
  // 'bugxx.bit',
  // 'chapter1.bit',
  // 'chapter2.bit',
  // 'chapter3.bit',
  'chat1.bit',
  'chat2.bit',
  'chat3.bit',
  // 'close10-error.bit',
  // 'cloze-emoji-ne.bit',
  'cloze-emoji.bit',
  // 'cloze-emoji0.bit',
  'cloze-emoji2.bit',
  // 'cloze-emoji3.bit',
  // 'cloze-error.bit',
  'cloze.bit',
  'cloze10.bit',
  // 'cloze100.bit',
  // 'cloze11-error.bit',
  'cloze11.bit',
  'cloze12.bit',
  'cloze13.bit',
  // 'cloze14.bit',
  'cloze2.bit',
  'cloze3.bit',
  'cloze4.bit',
  'cloze5.bit',
  // 'clozeandmul0.bit',
  // 'clozeandmul1.bit',
  // 'clozeandmul2.bit',
  // 'clozeandmul3.bit',
  'clozeig.bit',
  'clozenmultx.bit',
  'clozesg1.bit',
  // 'clozesolgrp1.bit',
  // 'clozeX.bit',
  // 'clozeXX.bit',
  'code.bit',
  // 'comment.bit',
  'conversation1.bit',
  'conversation2.bit',
  'conversation3.bit',
  // 'corr1.bit',
  // 'corr2.bit',
  // 'corr3.bit',
  // 'document-online-cloze.bit',
  // 'document-online-match.bit',
  // 'document-online.bit',
  'document.bit',
  // 'docup1.bit',
  // 'emo.bit',
  // 'Erkun.bit',
  // 'ErkunS.bit',
  'essay1.bit',
  'essay2.bit',
  'essay3.bit',
  'essay4.bit',
  'essay5.bit',
  'essay6.bit',
  'essay7.bit',
  'essay8.bit',
  'essay9.bit',
  // 'flashcard-language-1.bit',
  // 'flashcard-language-set.bit',
  'flashcard-set.bit',
  'flashcard1.bit',
  'flashcard2.bit',
  'flashcard3.bit',
  'flashcard4.bit',
  // 'flashcard5.bit',
  'highlighttext1.bit',
  'highlighttext2.bit',
  'image-audio-video.bit',
  // 'inp1.bit',
  // 'inp2.bit',
  'interview-image1.bit',
  'interview1.bit',
  'interview100.bit',
  // 'interview101.bit',
  'interview102.bit',
  'interview103.bit',
  'interview104.bit',
  'interview105.bit',
  // 'interview106.bit',
  'interview107.bit',
  // 'interview108.bit',
  'interview109.bit',
  'interview110.bit',
  'interview2.bit',
  'interview3.bit',
  'interview4.bit',
  'interview5.bit',
  'interview6.bit',
  'interview7.bit',
  'interview8.bit',
  // 'kanji.bit',
  // 'kanji2.bit',
  // 'kanji3.bit',
  'learning-path1.bit',
  'learning-path3.bit',
  'learning-path4.bit',
  'learning-path5.bit',
  'learning-path6.bit',
  'learning-path7.bit',
  'links.bit',
  // 'list1.bit',
  // 'list2.bit',
  // 'list3.bit',
  // 'list4.bit',
  'mark1.bit',
  // 'mark2.bit',
  'match-article1.bit',
  'match-audio1.bit',
  // 'match-group.bit',
  // 'match-image1.bit',
  'match-matrix1.bit',
  'match-matrix3.bit',
  'match-pict1.bit',
  'match-pict2.bit',
  'match1.bit',
  // 'match2.bit',
  'match3.bit',
  'match4.bit',
  // 'match5.bit',
  'matchsg1.bit',
  'menu1.bit',
  // 'merge-test.bit',
  // 'message0.bit',
  // 'message1.bit',
  // 'message2.bit',
  // 'message3.bit',
  // 'message4.bit',
  // 'mulc100.bit',
  // 'mulc101.bit',
  // 'mulc102.bit',
  'multich-1-2.bit',
  'multich-1.bit',
  'multich1.bit',
  'multich2.bit',
  // 'multich3.bit',
  // 'multichoice100.bit',
  'multichtx1.bit',
  'multichtx2.bit',
  'multichtx3.bit',
  'multichtx4.bit',
  'multires-1-2.bit',
  'multires-1.bit',
  'multires1.bit',
  'multires2.bit',
  // 'multires3.bit',
  'multitxt1.bit',
  'multitxt2.bit',
  'multitxt3.bit',
  'multitxt4.bit',
  // 'new020622-bug.bit',
  // 'new020622.bit',
  'page1.bit',
  'page2.bit',
  // 'ph1.bit',
  'prepnote1.bit',
  'rating1.bit',
  'rec1.bit',
  'resource-all.bit',
  // 'S1.bit',
  // 'S1x.bit',
  // 'S2.bit',
  // 'S3.bit',
  // 'S4.bit',
  // 'S5.bit',
  // 'S6.bit',
  // 'S7.bit',
  // 'S8.bit',
  // 'S9.bit',
  // 'sample-soln.bit',
  'selfass1.bit',
  'selfass2.bit',
  // 'sep02-orig.bit',
  'seq1.bit',
  'seq2.bit',
  // 'seq3.bit',
  // 'seq4.bit',
  // 'sss1.bit',
  // 'sss2.bit',
  'survey-anon1.bit',
  'survey1.bit',
  'takepic1.bit',
  // 'tmp.bit',
  // 'truefalse-image.bit',
  'truefalse1.bit',
  // 'truefalse100.bit',
  // 'truefalse101.bit',
  // 'truefalse102.bit',
  // 'truefalse103.bit',
  'truefalse2.bit',
  'truefalse3.bit',
  'truefalse4.bit',
  'truefalse5.bit',
  'url-regex.bit',
  'utfgpun.bit',
  'vendor-amchart.bit',
  'vocab1.bit',
  'vocab2.bit',
  // 'x.bit',

  'GMB/bitmark_example.bit',
  'GMB/cloze_attachment.bit',
  'GMB/cloze_bitmark--.bit',
  'GMB/cloze_emoticons.bit',
  'GMB/cloze.bit',
  'GMB/essay.bit',
  // 'GMB/ex1.bit',

  // 'britaAssets/complete_spanish.txt',
  // 'britaAssets/delete_again',
  // 'britaAssets/dw_a2_familie.txt',
  // 'britaAssets/inlingua.txt',
  // 'britaAssets/khan_bighistory.txt',
  // 'britaAssets/khan_fairytales.txt',
  // 'britaAssets/las_artikel.txt',
  // 'britaAssets/las_s1_aufgaben.txt',
  // 'britaAssets/lost souls',
  // 'britaAssets/rav_rechte_und_pflichten.txt',
  // 'britaAssets/schub_erkundungen_k4.txt',
  // 'britaAssets/schubert_b2-full.txt',
  // 'britaAssets/schubert_online',
  // 'britaAssets/test.txt',
  // 'britaAssets/test2.txt',
  // 'britaAssets/tipps.txt',
  // 'britaAssets/yoshi-sep02-fixed.txt',
  // 'britaAssets/Yoshi/bug.txt',
  // 'britaAssets/Yoshi/bug10.txt',
  // 'britaAssets/Yoshi/bug11.txt',
  // 'britaAssets/Yoshi/bug12.txt',
  // 'britaAssets/Yoshi/bug13.txt',
  // 'britaAssets/Yoshi/bug14.txt',
  // 'britaAssets/Yoshi/bug15.txt',
  // 'britaAssets/Yoshi/bug16.txt',
  // 'britaAssets/Yoshi/bug2.txt',
  // 'britaAssets/Yoshi/bug3.txt',
  // 'britaAssets/Yoshi/bug4.txt',
  // 'britaAssets/Yoshi/bug5.txt',
  // 'britaAssets/Yoshi/bug6.txt',
  // 'britaAssets/Yoshi/bug7.txt',
  // 'britaAssets/Yoshi/bug7-ok.txt',
  // 'britaAssets/Yoshi/bug8.txt',
  // 'britaAssets/Yoshi/bug9.txt',
  // 'britaAssets/Yoshi/but10.txt',
  // 'britaAssets/Yoshi/full-book-0.txt',
  // 'britaAssets/Yoshi/full-book-1.txt',
  // 'britaAssets/Yoshi/K1.txt',
  // 'britaAssets/Yoshi/K1.v2.txt',
  // 'britaAssets/Yoshi/K2.txt',
  // 'britaAssets/Yoshi/K3.txt',
  // 'britaAssets/Yoshi/K4.txt',
  // 'britaAssets/Yoshi/K5.txt',
  // 'britaAssets/Yoshi/K6.txt',
  // 'britaAssets/Yoshi/K7.txt',
  // 'britaAssets/Yoshi/K8.txt',
];

// const jsonParser = new JsonParser();
const bitmarkParser = new BitmarkParser();

/**
 * Get the list of files in the TEST_INPUT_DIR (bitmark files)
 * @returns
 */
function getTestFilenames(): string[] {
  const files = FileUtils.getFilenamesSync(TEST_INPUT_DIR, {
    // match: new RegExp('.+.bit'),
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

describe('bitmark-parser', () => {
  describe('Markup => JSON: Books', () => {
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
        // console.log(`Skipping test file: ${partFolderAndFile}`);
      }
    });

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
      const fullJsonInputFolder = path.join(JSON_INPUT_DIR, partFolder);
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      const id = path.basename(partFolderAndFile, '.bit');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`${fileId}`, async () => {
        fs.ensureDirSync(fullFolder);

        // Calculate the filenames
        const testJsonFile = path.resolve(fullJsonInputFolder, `${id}.json`);
        const originalMarkupFile = path.resolve(fullFolder, `${id}.bit`);
        const originalJsonFile = path.resolve(fullFolder, `${id}.json`);
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        const generatedAstFile = path.resolve(fullFolder, `${id}.ast.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        let originalJson: unknown;

        if (TEST_AGAINST_ANTLR_PARSER) {
          // Generate JSON from generated bitmark markup using the ANTLR parser
          performance.mark('ANTLR:Start');
          originalJson = bitmarkParser.parse(originalMarkup);

          // Write the new JSON
          fs.writeFileSync(originalJsonFile, JSON.stringify(originalJson, null, 2), {
            encoding: 'utf8',
          });

          performance.mark('ANTLR:End');
        } else {
          // TEST AGAINST JSON FILES

          // Copy the original expected JSON file to the output folder
          fs.copySync(testJsonFile, originalJsonFile);

          // Read in the test expected JSON file
          originalJson = fs.readJsonSync(originalJsonFile, 'utf8');
        }

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

        // Print performance information
        if (DEBUG_PERFORMANCE) {
          const pegTimeSecs = Math.round(performance.measure('PEG', 'PEG:Start', 'PEG:End').duration) / 1000;
          if (TEST_AGAINST_ANTLR_PARSER) {
            const antlrTimeSecs = Math.round(performance.measure('ANTLR', 'ANTLR:Start', 'ANTLR:End').duration) / 1000;
            const speedUp = Math.round((antlrTimeSecs / pegTimeSecs) * 100) / 100;
            console.log(`'${fileId}' timing; ANTLR: ${antlrTimeSecs} s, PEG: ${pegTimeSecs} s, speedup: x${speedUp}`);
          } else {
            console.log(`'${fileId}' timing; PEG: ${pegTimeSecs} s`);
          }
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
