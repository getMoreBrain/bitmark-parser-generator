import fs from 'fs';
import path from 'path';
import peggy, { SourceBuildOptions } from 'peggy';
import tspegjs from 'ts-pegjs';

type SourceOptions = SourceBuildOptions<'source'> & {
  tspegjs: {
    customHeader?: string;
    returnTypes?: unknown;
  };
};

const customHeader = `
import { EnumType, superenum } from '@ncoderz/superenum';
import { BitType, BitTypeType } from '../../../src/model/enum/BitType';
import { TextFormat, TextFormatType } from '../../../src/model/enum/TextFormat';
import { ResourceType, ResourceTypeType } from '../../../src/model/enum/ResourceType';
import { PropertyKey, PropertyKeyType } from '../../../src/model/enum/PropertyKey';
import { ParserError } from '../../../src/model/ParserError';
import { BitmarkAst, Bit } from '../../../src/model/ast/Nodes';
import { Builder } from '../../../src/ast/Builder';
`;

const inputPath = path.resolve(__dirname, '../../..', 'assets/grammar/test/', 'test-grammar.pegjs');
const outputPath = path.resolve(__dirname, '../../..', 'assets/grammar/test/', 'test-peggy-parser.ts');
const testFilePath = path.resolve(__dirname, '../../..', 'assets/grammar/test/', 'test-grammar-test.in');

// Process command line options
const commandLineOptions = process.argv.slice(2);
const optTest = commandLineOptions.includes('--test');
const allowedStartRules = ['test'];
const startRule = 'test';

console.log('Generating Test Parser');
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
  format: 'commonjs',
  allowedStartRules,
  plugins: [tspegjs],
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
