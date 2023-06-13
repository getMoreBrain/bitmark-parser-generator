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

// Enable or disable testing of specific files
const TEST_ALL = process.env.CI || true;

// Set to true to generate performance debug output
const DEBUG_PERFORMANCE = !process.env.CI;

// Set to true to test against the ANTLR parser rather than static JSON This is a slow process.
const TEST_AGAINST_ANTLR_PARSER = false;

const TEST_INPUT_DIR = path.resolve(__dirname, './bitmark');
const JSON_INPUT_DIR = path.resolve(__dirname, './bitmark/json');
const TEST_OUTPUT_DIR = path.resolve(__dirname, './results/bitmark-parser/output');

let TEST_FILES: string[] = [
  '_simple.bit',
  // 'app-link.bit',
  // 'article.bit',
  // 'assignment.bit',
  // 'audio-embed.bit',
  // 'audio-link.bit',
  // 'audio.bit',
  // 'bit-alias.bit',
  // 'bit-book-ending.bit',
  // 'bit-book-summary.bit',
  // 'blog-article.bit',
  // 'book-acknowledgments.bit',
  // 'book-addendum.bit',
  // 'book-afterword.bit',
  // 'book-appendix.bit',
  // 'book-article.bit',
  // 'book-author-bio.bit',
  // 'book-bibliography.bit',
  // 'book-coming-soon.bit',
  // 'book-conclusion.bit',
  // 'book-copyright-permissions.bit',
  // 'book-copyright.bit',
  // 'book-dedication.bit',
  // 'book-endnotes.bit',
  // 'book-epigraph.bit',
  // 'book-epilogue.bit',
  // 'book-foreword.bit',
  // 'book-frontispace.bit',
  // 'book-inciting-incident.bit',
  // 'book-introduction.bit',
  // 'book-list-of-contibutors.bit',
  // 'book-notes.bit',
  // 'book-postscript.bit',
  // 'book-preface.bit',
  // 'book-prologue.bit',
  // 'book-read-more.bit',
  // 'book-reference-list.bit',
  // 'book-request-for-a-book-review.bit',
  // 'book-summary.bit',
  // 'book-teaser.bit',
  // 'book-title.bit',
  // 'book.bit',
  // 'bot-action-announce.bit',
  // 'bot-action-remind.bit',
  // 'bot-action-response.bit',
  // 'bot-action-save.bit',
  // 'bot-action-send.bit',
  // 'browser-image.bit',
  // 'bug.bit',
  // 'button-copy-text.bit',
  // 'card-1.bit',
  // 'chapter.bit',
  // 'chapter-subject-matter.bit',
  // 'cloze-and-multiple-choice-text.bit',
  // 'cloze-instruction-grouped.bit',
  // 'cloze-solution-grouped.bit',
  // 'cloze.bit',
  // 'code.bit',
  // 'conclusion.bit',
  // 'conversation-left-1-scream.bit',
  // 'conversation-left-1-thought.bit',
  // 'conversation-left-1.bit',
  // 'conversation-right-1-scream.bit',
  // 'conversation-right-1-thought.bit',
  // 'conversation-right-1.bit',
  // 'correction.bit',
  // 'danger.bit',
  // 'details1.bit',
  // 'document-download.bit',
  // 'document-embed.bit',
  // 'document-link.bit',
  // 'document.bit',
  // 'editorial.bit',
  // 'essay.bit',
  // 'example.bit',
  // 'featured.bit',
  // 'focus-image.bit',
  // 'foot-note.bit',
  // 'help.bit',
  // 'highlight-text.bit',
  // 'hint.bit',
  // 'image-link.bit',
  // 'image-prototype.bit',
  // 'image-super-wide.bit',
  // 'image-zoom.bit',
  // 'image.bit',
  // 'info.bit',
  // 'internalLink.bit',
  // 'interview-instruction-grouped.bit',
  // 'interview.bit',
  // 'learning-path-book.bit',
  // 'learning-path-classroom-event.bit',
  // 'learning-path-classroom-training.bit',
  // 'learning-path-closing.bit',
  // 'learning-path-external-link.bit',
  // 'learning-path-learning-goal.bit',
  // 'learning-path-lti.bit',
  // 'learning-path-step.bit',
  // 'learning-path-video-call.bit',
  // 'mark.bit',
  // 'match-all-reverse.bit',
  // 'match-all.bit',
  // 'match-matrix.bit',
  // 'match-reverse.bit',
  // 'match-solution-grouped.bit',
  // 'match.bit',
  // 'message.bit',
  // 'multiple-choice-1.bit',
  // 'multiple-choice-text.bit',
  // 'multiple-choice.bit',
  // 'multiple-response-1.bit',
  // 'multiple-response.bit',
  // 'newspaper-article.bit',
  // 'note.bit',
  // 'notebook-article.bit',
  // 'page.bit',
  // 'photo.bit',
  // 'preparation-note.bit',
  // 'question-1.bit',
  // 'quote.bit',
  // 'release-note.bit',
  // 'remark.bit',
  // 'sample-solution.bit',
  // 'sequence.bit',
  // 'side-note.bit',
  // 'statement.bit',
  // 'sticky-note.bit',
  // 'still-image-film-embed.bit',
  // 'still-image-film-link.bit',
  // 'still-image-film.bit',
  // 'summary.bit',
  // 'survey.bit',
  // 'take-picture.bit',
  // 'toc.bit',
  // 'true-false-1.bit',
  // 'true-false.bit',
  // 'vendor-padlet-embed.bit',
  // 'video-embed.bit',
  // 'video-landscape.bit',
  // 'video-link.bit',
  // 'video-portrait.bit',
  // 'video.bit',
  // 'warning.bit',
  // 'website-link.bit',
  // 'workbook-article.bit',
];

// ALL tests for CI
if (TEST_ALL) {
  TEST_FILES = [
    'app-link.bit',
    'article.bit',
    'assignment.bit',
    'audio-embed.bit',
    'audio-link.bit',
    'audio.bit',
    'bit-alias.bit',
    'bit-book-ending.bit',
    'bit-book-summary.bit',
    'blog-article.bit',
    'book-acknowledgments.bit',
    'book-addendum.bit',
    'book-afterword.bit',
    'book-appendix.bit',
    'book-article.bit',
    'book-author-bio.bit',
    'book-bibliography.bit',
    'book-coming-soon.bit',
    'book-conclusion.bit',
    'book-copyright-permissions.bit',
    'book-copyright.bit',
    'book-dedication.bit',
    'book-endnotes.bit',
    'book-epigraph.bit',
    'book-epilogue.bit',
    'book-foreword.bit',
    'book-frontispace.bit',
    'book-inciting-incident.bit',
    'book-introduction.bit',
    'book-list-of-contibutors.bit',
    'book-notes.bit',
    'book-postscript.bit',
    'book-preface.bit',
    'book-prologue.bit',
    'book-read-more.bit',
    'book-reference-list.bit',
    'book-request-for-a-book-review.bit',
    'book-summary.bit',
    'book-teaser.bit',
    'book-title.bit',
    'book.bit',
    // 'bot-action-announce.bit',
    // 'bot-action-remind.bit',
    'bot-action-response.bit',
    // 'bot-action-save.bit',
    'bot-action-send.bit',
    'browser-image.bit',
    'bug.bit',
    // 'button-copy-text.bit',
    'card-1.bit',
    'chapter.bit',
    'chapter-subject-matter.bit',
    'cloze-and-multiple-choice-text.bit',
    'cloze-instruction-grouped.bit',
    'cloze-solution-grouped.bit',
    'cloze.bit',
    'code.bit',
    'conclusion.bit',
    'conversation-left-1-scream.bit',
    'conversation-left-1-thought.bit',
    'conversation-left-1.bit',
    'conversation-right-1-scream.bit',
    'conversation-right-1-thought.bit',
    'conversation-right-1.bit',
    // 'correction.bit',
    'danger.bit',
    'details1.bit',
    'document-download.bit',
    'document-embed.bit',
    'document-link.bit',
    'document.bit',
    'editorial.bit',
    'essay.bit',
    'example.bit',
    'featured.bit',
    'focus-image.bit',
    'foot-note.bit',
    'help.bit',
    'highlight-text.bit',
    'hint.bit',
    'image-link.bit',
    'image-prototype.bit',
    'image-super-wide.bit',
    'image-zoom.bit',
    'image.bit',
    'info.bit',
    'internalLink.bit',
    'interview-instruction-grouped.bit',
    'interview.bit',
    'learning-path-book.bit',
    'learning-path-classroom-event.bit',
    'learning-path-classroom-training.bit',
    'learning-path-closing.bit',
    'learning-path-external-link.bit',
    'learning-path-learning-goal.bit',
    'learning-path-lti.bit',
    'learning-path-step.bit',
    'learning-path-video-call.bit',
    // 'mark.bit',
    'match-all-reverse.bit',
    'match-all.bit',
    'match-matrix.bit',
    'match-reverse.bit',
    'match-solution-grouped.bit',
    'match.bit',
    // 'message.bit',
    'multiple-choice-1.bit',
    'multiple-choice-text.bit',
    'multiple-choice.bit',
    'multiple-response-1.bit',
    'multiple-response.bit',
    'newspaper-article.bit',
    'note.bit',
    'notebook-article.bit',
    'page.bit',
    'photo.bit',
    'preparation-note.bit',
    'question-1.bit',
    'quote.bit',
    'release-note.bit',
    'remark.bit',
    'sample-solution.bit',
    'sequence.bit',
    'side-note.bit',
    'statement.bit',
    'sticky-note.bit',
    'still-image-film-embed.bit',
    'still-image-film-link.bit',
    'still-image-film.bit',
    'summary.bit',
    // 'survey.bit',
    'take-picture.bit',
    'toc.bit',
    'true-false-1.bit',
    'true-false.bit',
    'vendor-padlet-embed.bit',
    'video-embed.bit',
    'video-landscape.bit',
    'video-link.bit',
    'video-portrait.bit',
    'video.bit',
    'warning.bit',
    'website-link.bit',
    'workbook-article.bit',
  ];
}

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

describe('bitmark-parser', () => {
  describe('Markup => JSON (both parsers): Tests', () => {
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
      const fullJsonInputFolder = path.join(JSON_INPUT_DIR, partFolder);
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      const id = path.basename(partFolderAndFile, '.bit');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        // Calculate the filenames
        const testJsonFile = path.resolve(fullJsonInputFolder, `${id}.json`);
        const originalMarkupFile = path.resolve(fullFolder, `${id}.bit`);
        const originalJsonFile = path.resolve(fullFolder, `${id}.json`);
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        const generatedAstFile = path.resolve(fullFolder, `${id}.ast.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        const jsonOptions = {
          textAsPlainText: true, // For testing the parser, use plain text rather than JSON for text
          prettify: true, // For testing the output is easier to read if it is prettified
          includeExtraProperties: true, // Include extra properties in the JSON when testing
        };

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        let originalJson: unknown;

        if (TEST_AGAINST_ANTLR_PARSER) {
          // Generate JSON from generated bitmark markup using the ANTLR parser
          performance.mark('ANTLR:Start');
          originalJson = bitmarkParser.parseUsingAntlr(originalMarkup);

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
        const generator = new JsonFileGenerator(generatedJsonFile, {
          jsonOptions,
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
