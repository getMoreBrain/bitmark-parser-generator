import { EnumType, superenum } from '@ncoderz/superenum';

const TextFormat = superenum({
  text: 'text', // plain text
  latex: 'latex', // LaTeX text
  json: 'json', // json as text
  bitmarkMinusMinus: 'bitmark--',
  bitmarkPlusPlus: 'bitmark++',
});

export type TextFormatType = EnumType<typeof TextFormat>;

export { TextFormat };
