import { type EnumType, superenum } from '@ncoderz/superenum';

const BodyTextFormat = superenum({
  plainText: 'text', // plain text
  latex: 'latex', // LaTeX code
  json: 'json', // json
  xml: 'xml', // xml

  // bitmark++ text
  bitmarkPlusPlus: 'bitmark++',
});

export type BodyTextFormatType = EnumType<typeof BodyTextFormat>;

export { BodyTextFormat };
