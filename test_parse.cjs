/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

// Import the parser
const { BitmarkParser } = require('./dist/index.cjs');

const bitmarkContent = fs.readFileSync(path.join(__dirname, 'test_issue.bitmark'), 'utf8');

const parser = new BitmarkParser();
const ast = parser.toAst(bitmarkContent);

console.log(JSON.stringify(ast, null, 2));
