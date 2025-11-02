import { Builder } from './src/ast/Builder.ts';

const builder = new Builder();

// Test with property
const jsonProperty = {
  type: 'book',
  id: ['test-123'],
  title: 'Test Book',
  coverImage: 'https://example.com/cover-property.jpg'
};

console.log('Building AST from JSON with property coverImage:');
const astProperty = builder.bit(jsonProperty);
console.log('AST coverImage:', JSON.stringify(astProperty.bit.coverImage, null, 2));
console.log('AST coverImage type:', typeof astProperty.bit.coverImage);

console.log('\n===========================================\n');

// Test with resource
const jsonResource = {
  type: 'book',
  id: ['test-456'],
  title: 'Test Book',
  coverImage: {
    type: 'image',
    image: {
      src: 'https://example.com/cover-resource.jpg'
    }
  }
};

console.log('Building AST from JSON with resource coverImage:');
const astResource = builder.bit(jsonResource);
console.log('AST coverImage:', JSON.stringify(astResource.bit.coverImage, null, 2));
console.log('AST coverImage type:', typeof astResource.bit.coverImage);
