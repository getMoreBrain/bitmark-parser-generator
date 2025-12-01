import { type EnumType } from '@ncoderz/superenum';

const BodyTextFormat = {
  plainText: 'text', // plain text
  latex: 'latex', // LaTeX code
  json: 'json', // json
  xml: 'xml', // xml

  // bitmark++ text
  bitmarkPlusPlus: 'bitmark++',
} as const;

export type BodyTextFormatType = EnumType<typeof BodyTextFormat>;

export { BodyTextFormat };
