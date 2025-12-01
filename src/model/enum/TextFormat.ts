import { type EnumType } from '@ncoderz/superenum';

const TextFormat = {
  // plain text
  plainText: 'text',
  latex: 'latex', // LaTeX code, alias for text
  json: 'json', // json, alias for text
  xml: 'xml', // xml, alias for text

  // bitmarkText
  // bitmarkText in the body is bitmark++ and bitmarkText in a tag is bitmark+
  bitmarkText: 'bitmark++',
} as const;

export type TextFormatType = EnumType<typeof TextFormat>;

export { TextFormat };
