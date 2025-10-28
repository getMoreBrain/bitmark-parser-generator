#!/usr/bin/env node

import { readFileSync } from 'fs';
import { BitmarkParserGenerator } from './dist/index.js';

const bpg = new BitmarkParserGenerator();

const bitmarkPath = 'test/standard/input/bitmark/catalog-item-book.bitmark';

const bitmark = readFileSync(bitmarkPath, 'utf-8');

// Just parse the first bit
const firstBit = bitmark.split('\n\n')[0];
console.log('Bitmark:', firstBit);
console.log('\n---\n');

const ast = bpg.createAst(firstBit);
console.log('AST:', JSON.stringify(ast, null, 2));

