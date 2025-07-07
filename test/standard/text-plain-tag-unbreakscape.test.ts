import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { diffChars } from 'diff';
// import deepEqual from 'deep-equal';
import fs from 'fs-extra';
import { performance } from 'perf_hooks';
import { describe, expect, test } from 'vitest';

import { Breakscape } from '../../src/breakscaping/Breakscape.ts';
import { type BreakscapedString } from '../../src/model/ast/BreakscapedString.ts';
import { TextFormat } from '../../src/model/enum/TextFormat.ts';
import { TextLocation } from '../../src/model/enum/TextLocation.ts';
import { FileUtils } from '../../src/utils/FileUtils.ts';
import { isDebugPerformance } from './config/config-test.ts';
import { getTestFiles, getTestFilesDir } from './config/config-text-plain-tag-breakscape-files.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const DEBUG_PERFORMANCE = isDebugPerformance();

const TEST_FILES = getTestFiles();
const TEST_INPUT_DIR = getTestFilesDir();
const BREAKSCAPED_INPUT_DIR = path.resolve(TEST_INPUT_DIR, './breakscaped');
const TEST_OUTPUT_DIR = path.resolve(dirname, './results/text-plain-tag-unbreakscape/output');

/**
 * Get the list of files in the TEST_INPUT_DIR (text files)
 * @returns
 */
function getTestFilenames(): string[] {
  const files = FileUtils.getFilenamesSync(TEST_INPUT_DIR, {
    match: new RegExp('.+\\.text$'),
    recursive: true,
  });

  return files;
}

describe('text-plain-tag-unbreakscape', () => {
  describe('Breakscaped Text (plain, tag) => Text', () => {
    // Ensure required folders
    fs.ensureDirSync(TEST_OUTPUT_DIR);

    let allTestFiles = getTestFilenames();

    // Filter out the files that are not in the test list
    allTestFiles = allTestFiles.filter((testFile) => {
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      // const id = path.basename(partFolderAndFile, '.text');
      if (TEST_FILES.includes(fileId)) {
        return true;
      } else {
        // FOR DEBUG
        // console.log(`Skipping test file: ${fileId}`);
      }
    });

    console.info(`Tests found: ${allTestFiles.length}`);

    allTestFiles.forEach((testFile: string) => {
      performance.clearMarks();
      performance.clearMeasures();

      const partFolderAndFile = testFile.replace(TEST_INPUT_DIR, '');
      const partFolder = path.dirname(partFolderAndFile);
      const fullFolder = path.join(TEST_OUTPUT_DIR, partFolder);
      const fullBreakscapedInputFolder = path.join(BREAKSCAPED_INPUT_DIR, partFolder);
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      const id = path.basename(partFolderAndFile, '.text');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        // Calculate the filenames
        const testBreakscapedFile = path.resolve(fullBreakscapedInputFolder, `${id}.breakscaped`);
        const originalFile = path.resolve(fullFolder, `${id}.text`);
        const originalBreakscapedFile = path.resolve(fullFolder, `${id}.breakscaped`);
        const generatedTextFile = path.resolve(fullFolder, `${id}.gen.text`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        // Copy the original test file to the output folder
        fs.copySync(testFile, originalFile);

        // Read in the test file
        const originalText = fs.readFileSync(originalFile, 'utf8').trim();

        // Copy the original expected breakscaped file to the output folder
        fs.copySync(testBreakscapedFile, originalBreakscapedFile);

        // Read in the test expected breakscaped file
        const originalBreakscaped = fs.readFileSync(originalBreakscapedFile, 'utf8').trim();

        // Unbreakscape the text
        performance.mark('PEG:Start');
        const text = Breakscape.unbreakscape(originalBreakscaped.trim() as BreakscapedString, {
          format: TextFormat.plainText,
          location: TextLocation.tag,
        });

        // Write the unbreakscaped text
        fs.writeFileSync(generatedTextFile, text.trim(), {
          encoding: 'utf8',
        });

        performance.mark('PEG:End');

        const newText = fs.readFileSync(generatedTextFile, 'utf8');

        // Compare old and new unbreakscaped text
        const diff = diffChars(originalText, newText);

        // Write the diff Map JSON
        fs.writeFileSync(jsonDiffFile, JSON.stringify(diff, null, 2), {
          encoding: 'utf8',
        });

        // Print performance information
        if (DEBUG_PERFORMANCE) {
          const pegTimeSecs =
            Math.round(performance.measure('PEG', 'PEG:Start', 'PEG:End').duration) / 1000;
          console.log(`'${fileId}' timing; PEG: ${pegTimeSecs} s`);
        }

        expect(newText).toEqual(originalText);

        // If we get to here, we can delete the diff file as there were no important differences
        fs.removeSync(jsonDiffFile);

        // const equal = deepEqual(newJson, json, { strict: true });
        // expect(equal).toEqual(true);
      });
    });
  });
});
