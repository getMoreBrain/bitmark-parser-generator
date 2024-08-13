import path from 'path';

// Enable or disable testing of specific files
let TEST_ALL = true;

const TEST_FILES_DIR = path.resolve(__dirname, '../input/text-plusplus');

if (process.env.CI) {
  TEST_ALL = true;
}

let TEST_FILES: string[] = [
  // 'plain.text',
  // 'paragraphs.text',
  // 'breakscaping.text',
  // 'list.text',
  // 'bold.text',
  // 'light.text',
  // 'italic.text',
  // 'highlight.text',
  // 'bold-italic.text',
  // 'title.text',
  // 'image.text',
  // 'link.text',
  'var.text',
  // 'code.text',
  // 'timer.text',
  // 'duration.text',
  // 'color.text',
  // 'inline.text',
  // 'bad-unterminated-image.text',
  // 'latex.text',
];

// ALL tests for CI
if (TEST_ALL) {
  TEST_FILES = [
    'plain.text',
    'paragraphs.text',
    'breakscaping.text',
    'list.text',
    'bold.text',
    'light.text',
    'italic.text',
    'highlight.text',
    'bold-italic.text',
    'title.text',
    'image.text',
    'link.text',
    'var.text',
    'code.text',
    'timer.text',
    'duration.text',
    'color.text',
    'inline.text',
    'ref.text',
    'xref.text',
    'footnote.text',
    'bad-unterminated-image.text',
    // 'latex.text',
  ];
}

function getTestFilesDir(): string {
  return TEST_FILES_DIR;
}

function getTestFiles(): string[] {
  return TEST_FILES;
}

export { getTestFilesDir, getTestFiles };
