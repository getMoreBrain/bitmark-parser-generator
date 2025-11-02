import { BitmarkParserGenerator } from './src/index.ts';

const bpg = new BitmarkParserGenerator();

const bitmarkProperty = `[.book]
[@id:test-123]
[#Test Book]
[@coverImage:https://example.com/cover-property.jpg]`;

const bitmarkResource = `[.book]
[@id:test-456]
[#Test Book]
[&coverImage:https://example.com/cover-resource.jpg]`;

console.log('Property version AST:');
let ast = bpg.convert(bitmarkProperty, { from: 'bitmark', to: 'ast' });
console.log(JSON.stringify(ast, null, 2));

console.log('\n\n===========================================');
console.log('Resource version AST:');
ast = bpg.convert(bitmarkResource, { from: 'bitmark', to: 'ast' });
console.log(JSON.stringify(ast, null, 2));
