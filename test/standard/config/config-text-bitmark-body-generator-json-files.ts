import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FileUtils } from '../../../src/utils/FileUtils.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const TEST_FILES_DIR = path.resolve(dirname, '../input/text-bitmark-body-generator-json');
const EXPECTED_FILES_DIR = path.resolve(TEST_FILES_DIR, 'expected');

// List all test files in the directory (JSON inputs; expected outputs live in ./expected)
const TEST_FILES = (() => {
  return FileUtils.getFilenamesSync(TEST_FILES_DIR, {
    match: new RegExp('.+\\.json$'),
    recursive: false,
  }).map((file) => path.basename(file));
})();

function getTestFilesDir(): string {
  return TEST_FILES_DIR;
}

function getExpectedFilesDir(): string {
  return EXPECTED_FILES_DIR;
}

function getTestFiles(): string[] {
  return TEST_FILES;
}

export { getExpectedFilesDir, getTestFiles, getTestFilesDir };
