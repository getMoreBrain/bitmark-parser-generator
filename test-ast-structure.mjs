import { BitmarkParserGenerator } from './src/index.ts';

const bpg = new BitmarkParserGenerator();

const bitmarkProperty = `[.book]
[@id:test-123]
[#Test Book]
[@coverImage:https://example.com/cover-property.jpg]`;

console.log('Property version internal AST structure:');
const ast = bpg.toAst(bitmarkProperty);
console.log('AST bits[0]:', JSON.stringify(ast.bits[0], null, 2));
