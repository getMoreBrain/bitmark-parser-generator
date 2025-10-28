#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { BitmarkParserGenerator } from './dist/index.js';

const bpg = new BitmarkParserGenerator();

const files = [
  'catalog-item-book',
  'catalog-item-external-book',
  'catalog-item-product',
];

for (const file of files) {
  const bitmarkPath = `test/standard/input/bitmark/${file}.bitmark`;
  const jsonPath = `test/standard/input/bitmark/json/${file}.json`;
  
  console.log(`Processing ${file}...`);
  
  const bitmark = readFileSync(bitmarkPath, 'utf-8');
  const result = bpg.convert(bitmark, { outputFormat: 'json' });
  
  if (Array.isArray(result)) {
    const formatted = JSON.stringify(result, null, 2);
    writeFileSync(jsonPath, formatted + '\n', 'utf-8');
    console.log(`  ✓ Generated ${jsonPath}`);
  } else {
    console.error(`  ✗ Failed to convert ${file}`);
    console.error(`  Result:`, JSON.stringify(result, null, 2));
  }
}

console.log('\nDone!');
