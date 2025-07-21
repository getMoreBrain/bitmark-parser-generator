import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import peggy, { type SourceBuildOptions } from 'peggy';

import { init } from '../../../src/init/init.ts';

type SourceOptions = SourceBuildOptions<'source'> & {
  //
};

const dirname = path.dirname(fileURLToPath(import.meta.url));

const dependencies = {
  '{ TypeKey }': '../../../parser/bitmark/peg/BitmarkPegParserTypes.ts',
  '{ BitmarkPegParserHelper }': '../../../parser/bitmark/peg/BitmarkPegParserHelper.ts',
  '{ BitmarkPegParserProcessor }': '../../../parser/bitmark/peg/BitmarkPegParserProcessor.ts',
  '{ Breakscape }': '../../../breakscaping/Breakscape.ts',
};

const inputPath = path.resolve(dirname, '../../..', 'assets/grammar/bitmark/', 'bit-grammar.pegjs');
const outputPath = path.resolve(
  dirname,
  '../../..',
  'src/generated/parser/bitmark/',
  'bitmark-peggy-parser.js',
);
const testFilePath = path.resolve(dirname, '../../..', 'assets/', 'test.bitmark');

// Process command line options
const commandLineOptions = process.argv.slice(2);
const optTest = commandLineOptions.includes('--test');
const allowedStartRules = ['bitmark', 'bit', 'cardContent'];
const startRule = 'bitmark';

// Initialised the environment
init();

console.log('Generating Bitmark Parser');
console.log(`Input: ${inputPath}`);
console.log(`Output: ${outputPath}`);
console.log(`Allowed start rules: ${allowedStartRules.join(', ')}`);
if (optTest) {
  console.log(`Test: ${testFilePath}`);
}
console.log('\n');

// Read grammar file
const grammar = fs.readFileSync(inputPath, 'utf8');

// Build parser options
const options: SourceOptions = {
  output: 'source',
  format: 'es',
  allowedStartRules,
  plugins: [],
  dependencies,
};

// Generate parser source
const parserSource = peggy.generate(grammar, options);

// Write parser source to file
fs.writeFileSync(outputPath, parserSource);

// Test parser
if (optTest) {
  const testText = fs.readFileSync(testFilePath, 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const parser = require(outputPath);
  // const result = parser.parse('            \n\r\n\r\r\n       \t', {
  const result = parser.parse(testText, {
    startRule,
  });

  const resultString = JSON.stringify(result, null, 2);

  console.log(resultString);
}
