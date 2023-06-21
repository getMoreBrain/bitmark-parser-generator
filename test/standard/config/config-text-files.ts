import path from 'path';

// Enable or disable testing of specific files
let TEST_ALL = true;

const TEST_FILES_DIR = path.resolve(__dirname, '../text');

let TEST_FILES: string[] = [
  // 'plain.text',
  // 'breakscaping.text',
  // 'list.text',
  // 'bold.text',
  // 'light.text',
  // 'italic.text',
  // 'highlight.text',
  // 'title.text',
  // 'image.text',
  // 'link.text',
  'code.text',
  // 'inline.text',
  // 'latex.text',
];

// ALL tests for CI
if (TEST_ALL) {
  TEST_FILES = [
    'plain.text',
    'breakscaping.text',
    'list.text',
    'bold.text',
    'light.text',
    'italic.text',
    'highlight.text',
    'title.text',
    'image.text',
    'link.text',
    // Code currently broken (in text parser) 'code.text',
    'inline.text',
    // 'latex.text',
  ];
}

if (process.env.CI) {
  TEST_ALL = true;
}

export { TEST_FILES_DIR, TEST_FILES };
