import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';
import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator, InputFormat } from '../../src/index.ts';
import { FileUtils } from '../../src/utils/FileUtils.ts';
import { getTestFiles, getTestFilesDir } from './config/config-plain-text-body-files.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const TEST_FILES = getTestFiles();
const TEST_INPUT_DIR = getTestFilesDir();
const TEST_OUTPUT_DIR = path.resolve(dirname, './results/plain-text-body/output');

const bpg = new BitmarkParserGenerator();

/**
 * Get the list of files in the TEST_INPUT_DIR (text files)
 */
function getTestFilenames(): string[] {
  return FileUtils.getFilenamesSync(TEST_INPUT_DIR, {
    match: new RegExp('.+\\.text$'),
    recursive: false,
  });
}

describe('plain-text-body', () => {
  describe('Bitmark Text (body) => Plain Text', () => {
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
      const id = path.basename(partFolderAndFile, '.text');

      test(`${id}`, () => {
        fs.ensureDirSync(fullFolder);

        const expectedTxtFile = path.resolve(TEST_INPUT_DIR, `${id}.txt`);
        const originalTextFile = path.resolve(fullFolder, `${id}.text`);
        const generatedTxtFile = path.resolve(fullFolder, `${id}.gen.txt`);
        const diffFile = path.resolve(fullFolder, `${id}.diff.json`);

        // Copy the original test text file to the output folder
        fs.copySync(testFile, originalTextFile);

        // Read in the test text file
        const originalText = fs.readFileSync(originalTextFile, 'utf8');

        // Read in the expected plain text file
        let expectedPlainText = fs.readFileSync(expectedTxtFile, 'utf8');
        if (expectedPlainText) expectedPlainText = expectedPlainText.trim();

        // Generate plain text from bitmark text
        let generatedPlainText = bpg.extractPlainText(originalText, {
          inputFormat: InputFormat.bitmarkText,
        });
        if (generatedPlainText) generatedPlainText = generatedPlainText.trim();

        // Write generated plain text to the output folder
        fs.writeFileSync(generatedTxtFile, generatedPlainText, { encoding: 'utf8' });

        // Write diff file if there are differences
        if (generatedPlainText !== expectedPlainText) {
          fs.writeFileSync(
            diffFile,
            JSON.stringify(
              { match: false, expected: expectedPlainText, actual: generatedPlainText },
              null,
              2,
            ),
            { encoding: 'utf8' },
          );
        }

        expect(generatedPlainText).toEqual(expectedPlainText);

        // If we get to here, delete the diff file as there were no important differences
        fs.removeSync(diffFile);
      });
    });
  });
});
