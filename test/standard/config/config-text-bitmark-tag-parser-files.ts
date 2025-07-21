import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FileUtils } from '../../../src/utils/FileUtils.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const TEST_FILES_DIR = path.resolve(dirname, '../input/text-bitmark-tag-parser');

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

export { getTestFiles, getTestFilesDir };
