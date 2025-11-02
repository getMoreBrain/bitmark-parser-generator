import { BitmarkParserGenerator } from './src/index.ts';

const bpg = new BitmarkParserGenerator();

// Test with property
const jsonProperty = {
  type: 'book',
  id: ['test-123'],
  title: 'Test Book',
  coverImage: 'https://example.com/cover-property.jpg'
};

console.log('Converting JSON with property coverImage to bitmark:');
const bitmarkFromProperty = bpg.convert(jsonProperty, { from: 'json', to: 'bitmark' });
console.log(bitmarkFromProperty);

console.log('\n===========================================\n');

// Test with resource
const jsonResource = {
  type: 'book',
  id: ['test-456'],
  title: 'Test Book',
  coverImage: {
    type: 'image',
    image: {
      format: 'jpg',
      provider: 'example.com',
      src: 'https://example.com/cover-resource.jpg',
      width: null,
      height: null,
      alt: '',
      zoomDisabled: false,
      license: '',
      copyright: '',
      showInIndex: false,
      caption: []
    }
  }
};

console.log('Converting JSON with resource coverImage to bitmark:');
const bitmarkFromResource = bpg.convert(jsonResource, { from: 'json', to: 'bitmark' });
console.log(bitmarkFromResource);
