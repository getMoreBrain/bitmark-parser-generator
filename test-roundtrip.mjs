import { BitmarkParserGenerator } from './src/index.ts';

const bpg = new BitmarkParserGenerator();

const bitmarkProperty = `[.book]
[@id:test-123]
[#Test Book with Property CoverImage]
[@coverImage:https://example.com/cover-property.jpg]`;

const bitmarkResource = `[.book]
[@id:test-456]
[#Test Book with Resource CoverImage]
[&coverImage:https://example.com/cover-resource.jpg]`;

console.log('Testing property coverImage round-trip...\n');
console.log('Original:', bitmarkProperty);

let result = bpg.convert(bitmarkProperty, { from: 'bitmark', to: 'json' });
let backToBitmark = bpg.convert(result[0].bit, { from: 'json', to: 'bitmark' });

console.log('\nConverted back to bitmark:');
console.log(backToBitmark);

console.log('\n\n===========================================');
console.log('Testing resource coverImage round-trip...\n');
console.log('Original:', bitmarkResource);

result = bpg.convert(bitmarkResource, { from: 'bitmark', to: 'json' });
backToBitmark = bpg.convert(result[0].bit, { from: 'json', to: 'bitmark' });

console.log('\nConverted back to bitmark:');
console.log(backToBitmark);
