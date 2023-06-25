import path from 'path';

// Enable or disable testing of specific files
let TEST_ALL = true;

const TEST_FILES_DIR = path.resolve(__dirname, '../input/text-minusminus');

if (process.env.CI) {
  TEST_ALL = true;
}

let TEST_FILES: string[] = [
  //
  // 'minusminus-plain.text',
  // 'minusminus-breakscaping.text',
  // 'minusminus-bold.text',
  // 'minusminus-light.text',
  // 'minusminus-italic.text',
  // 'minusminus-highlight.text',
];

// ALL tests for CI
if (TEST_ALL) {
  TEST_FILES = [
    //
    'minusminus-plain.text',
    'minusminus-breakscaping.text',
    'minusminus-bold.text',
    'minusminus-light.text',
    'minusminus-italic.text',
    'minusminus-highlight.text',
  ];
}

function getTestFilesDir(): string {
  return TEST_FILES_DIR;
}

function getTestFiles(): string[] {
  return TEST_FILES;
}

export { getTestFilesDir, getTestFiles };
