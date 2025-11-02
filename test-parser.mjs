import { BitmarkParserGenerator } from './src/index.ts';

const bpg = new BitmarkParserGenerator();

const bitmark = `[.book]
[@id:test-123]
[#Test Book with Property CoverImage]
[@coverImage:https://example.com/cover-property.jpg]

[.book]
[@id:test-456]
[#Test Book with Resource CoverImage]
[&coverImage:https://example.com/cover-resource.jpg]`;

console.log('Testing coverImage parsing...\n');

const result = bpg.convert(bitmark, { from: 'bitmark', to: 'json' });

if (result && Array.isArray(result)) {
  console.log('First bit (property coverImage):');
  console.log('  coverImage type:', typeof result[0].bit.coverImage);
  console.log('  coverImage value:', result[0].bit.coverImage);
  console.log('\nSecond bit (resource coverImage):');
  console.log('  coverImage type:', typeof result[1].bit.coverImage);
  console.log('  coverImage value:', JSON.stringify(result[1].bit.coverImage, null, 2));
}
