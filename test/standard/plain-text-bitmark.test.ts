import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';
import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator, InputFormat } from '../../src/index.ts';
import { FileUtils } from '../../src/utils/FileUtils.ts';
import { getTestFiles, getTestFilesDir } from './config/config-plain-text-bitmark-files.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const TEST_FILES = getTestFiles();
const TEST_INPUT_DIR = getTestFilesDir();
const TEST_OUTPUT_DIR = path.resolve(dirname, './results/plain-text-bitmark/output');

const bpg = new BitmarkParserGenerator();

/**
 * Get the list of files in the TEST_INPUT_DIR (bitmark files)
 */
function getTestFilenames(): string[] {
  return FileUtils.getFilenamesSync(TEST_INPUT_DIR, {
    match: new RegExp('.+\\.bitmark$'),
    recursive: false,
  });
}

describe('plain-text-bitmark', () => {
  describe('Bitmark => Plain Text', () => {
    fs.ensureDirSync(TEST_OUTPUT_DIR);

    let allTestFiles = getTestFilenames();

    // Filter out the files that are not in the test list
    allTestFiles = allTestFiles.filter((testFile) => {
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      if (TEST_FILES.includes(fileId)) {
        return true;
      }
    });

    console.info(`Tests found: ${allTestFiles.length}`);

    allTestFiles.forEach((testFile: string) => {
      const partFolderAndFile = testFile.replace(TEST_INPUT_DIR, '');
      const partFolder = path.dirname(partFolderAndFile);
      const fullFolder = path.join(TEST_OUTPUT_DIR, partFolder);
      const id = path.basename(partFolderAndFile, '.bitmark');

      test(`${id}`, () => {
        fs.ensureDirSync(fullFolder);

        const expectedTxtFile = path.resolve(TEST_INPUT_DIR, `${id}.txt`);
        const originalMarkupFile = path.resolve(fullFolder, `${id}.bitmark`);
        const generatedTxtFile = path.resolve(fullFolder, `${id}.gen.txt`);
        const diffFile = path.resolve(fullFolder, `${id}.diff.json`);

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        // Read in the expected plain text file
        let expectedText = fs.readFileSync(expectedTxtFile, 'utf8');
        if (expectedText) expectedText = expectedText.trim();

        // Generate plain text from bitmark
        let generatedText = bpg.extractPlainText(originalMarkup, {
          inputFormat: InputFormat.bitmark,
        });
        if (generatedText) generatedText = generatedText.trim();

        // Write generated plain text to the output folder
        fs.writeFileSync(generatedTxtFile, generatedText, { encoding: 'utf8' });

        // Write diff file if there are differences
        if (generatedText !== expectedText) {
          fs.writeFileSync(
            diffFile,
            JSON.stringify(
              { match: false, expected: expectedText, actual: generatedText },
              null,
              2,
            ),
            { encoding: 'utf8' },
          );
        }

        expect(generatedText).toEqual(expectedText);

        // If we get to here, delete the diff file as there were no important differences
        fs.removeSync(diffFile);
      });
    });
  });
});
