import fs from 'fs';
import path from 'path';
import peggy, { SourceBuildOptions } from 'peggy';

type SourceOptions = SourceBuildOptions<'source'> & {
  tspegjs: {
    customHeader?: string;
    returnTypes?: unknown;
  };
};

const customHeader = `
import { BitmarkParserHelper, TypeKey } from '../../../parser/bitmark/BitmarkParserHelper';
`;

const dependencies = {
  '{ BitmarkParserHelper, TypeKey }': '../../../parser/bitmark/BitmarkParserHelper',
};

const inputTextPath = path.resolve(__dirname, '../../..', 'assets/grammar/bitmark/', 'text-grammar.pegjs');
const inputBitmarkPath = path.resolve(__dirname, '../../..', 'assets/grammar/bitmark/', 'bit-grammar.pegjs');
const outputPath = path.resolve(__dirname, '../../..', 'src/generated/parser/bitmark/', 'bitmark-peggy-parser.js');
const testFilePath = path.resolve(__dirname, '../../..', 'assets/', 'test.bit');

// Process command line options
const commandLineOptions = process.argv.slice(2);
const optTest = commandLineOptions.includes('--test');
const optBitmark = commandLineOptions.includes('--bit');
const allowedStartRules = optBitmark
  ? ['bitmark', 'bit', 'cardContent']
  : ['bitmarkPlus', 'bitmarkPlusPlus', 'bitmarkMinusMinus'];
const startRule = optBitmark ? 'bitmark' : 'bitmarkPlus';

// Select input file
const inputPath = optBitmark ? inputBitmarkPath : inputTextPath;

console.log('Generating Bitmark Parser');
console.log(`For: ${optBitmark ? 'Bitmark' : 'Text'}`);
console.log(`Input: ${inputPath}`);
console.log(`Output: ${outputPath}`);
console.log(`Allowed start rules: ${allowedStartRules.join(', ')}`);
if (optTest) {
  console.log(`Test: ${optTest ? testFilePath : 'None'}`);
  console.log(`Text start rule: ${startRule}`);
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
  tspegjs: {
    customHeader,
    // returnTypes: TODO,
  },
};

// Generate parser source
const parserSource = peggy.generate(grammar, options);

// Write parser source to file
fs.writeFileSync(outputPath, parserSource);

// Test parser
if (optTest) {
  const testText = fs.readFileSync(testFilePath, 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const parser = require(outputPath);
  // const result = parser.parse('            \n\r\n\r\r\n       \t', {
  const result = parser.parse(testText, {
    startRule,
  });

  const resultString = JSON.stringify(result, null, 2);

  console.log(resultString);
}
