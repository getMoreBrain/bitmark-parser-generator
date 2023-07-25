/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator, Output } from '../../../src/BitmarkParserGenerator';
import { FileUtils } from '../../../src/utils/FileUtils';

const INPUT_DIR = path.resolve(__dirname, '../../..', 'assets/classtime/all/bitmark');
const OUTPUT_DIR = path.resolve(__dirname, '../../..', 'assets/classtime/all/json');

const bitmarkParserGenerator = new BitmarkParserGenerator();

/**
 * Get the list of files in the INPUT_DIR (bitmark files)
 * @returns
 */
function getInputFilenames(): string[] {
  const files = FileUtils.getFilenamesSync(INPUT_DIR, {
    match: new RegExp('.+\\.txt$'),
    recursive: true,
  });

  return files;
}

/**
 * Convert all files in the folder assets/classtime/all to Classtime JSON
 */
class DevParserClasstimeAll {
  async run(): Promise<void> {
    // Ensure required folders
    fs.ensureDirSync(OUTPUT_DIR);

    const inputFiles = getInputFilenames();

    console.info(`File count: ${inputFiles.length}`);

    for (const inputFile of inputFiles) {
      const partFolderAndFile = inputFile.replace(INPUT_DIR, '');
      const partFolder = path.dirname(partFolderAndFile);
      const fullFolder = path.join(OUTPUT_DIR, partFolder);
      // const fullJsonInputFolder = path.join(INPUT_DIR, partFolder);
      const fileId = inputFile.replace(INPUT_DIR + '/', '');
      const id = path.basename(partFolderAndFile, '.txt');

      console.log(`Converting: ${fileId}`);

      // Calculate the filenames
      const outputFile = path.resolve(fullFolder, `${id}.json`);

      // Convert
      await bitmarkParserGenerator.convert(inputFile, {
        outputFile,
        outputFormat: Output.jsonClasstime,
        jsonOptions: {
          textAsPlainText: false,
          prettify: true,
        },
      });
    }
  }
}

const parser = new DevParserClasstimeAll();

parser.run().then(() => {
  // Done
});
