import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import peggy, { type SourceBuildOptions } from 'peggy';

import { init } from '../../../src/init/init.ts';

type SourceOptions = SourceBuildOptions<'source'> & {
  // tspegjs: {
  //   customHeader?: string;
  //   returnTypes?: unknown;
  // };
};

// const customHeader = `
// None for now
// `;

const dirname = path.dirname(fileURLToPath(import.meta.url));

const dependencies = {
  '{ Breakscape }': '../../../breakscaping/Breakscape.ts',
};

const inputPath = path.resolve(dirname, '../../..', 'assets/grammar/text/', 'text-grammar.pegjs');
const outputPath = path.resolve(
  dirname,
  '../../..',
  'src/generated/parser/text/',
  'text-peggy-parser.js',
);
const testFilePath = path.resolve(dirname, '../../..', 'assets/', 'test.text.plusplus');

// Process command line options
const commandLineOptions = process.argv.slice(2);
const optTest = commandLineOptions.includes('--test');
const allowedStartRules = [
  'version',
  'bitmarkPlusPlus',
  'bitmarkPlus',
  'bitmarkMinusMinus',
  'bitmarkPlusString',
  'bitmarkMinusMinusString',
];
const startRule = 'bitmarkPlusPlus';

// Initialised the environment
init();

console.log('Generating Text Parser');
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
  // tspegjs: {
  //   customHeader,
  //   // returnTypes: TODO,
  // },
};

// Generate parser source
const parserSource = peggy.generate(grammar, options);

// Write parser source to file
fs.writeFileSync(outputPath, parserSource);

// Test parser
if (optTest) {
  const testText = fs.readFileSync(testFilePath, 'utf8');
  // eslint-disable-next-line  @typescript-eslint/no-require-imports
  const parser = require(outputPath);
  // const result = parser.parse('            \n\r\n\r\r\n       \t', {
  const result = parser.parse(testText, {
    startRule,
  });

  const resultString = JSON.stringify(result, null, 2);

  console.log(resultString);
}
