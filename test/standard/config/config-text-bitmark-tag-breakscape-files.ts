import path from 'path';

import { FileUtils } from '../../../src/utils/FileUtils';

const TEST_FILES_DIR = path.resolve(__dirname, '../input/text-bitmark-tag-breakscape');

// List all test files in the directory
const TEST_FILES = (() => {
  return FileUtils.getFilenamesSync(TEST_FILES_DIR, {
    match: new RegExp('.+\\.text$'),
    recursive: false,
  }).map((file) => path.basename(file));
})();

function getTestFilesDir(): string {
  return TEST_FILES_DIR;
}

function getTestFiles(): string[] {
  return TEST_FILES;
}

export { getTestFilesDir, getTestFiles };
