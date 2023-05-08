import { EnumType, superenum } from '@ncoderz/superenum';

const TextFormat = superenum({
  text: 'text', // plain text - only seen this in one test example - ANTLR parser supports it.
  bitmarkMinusMinus: 'bitmark--',
  bitmarkPlusPlus: 'bitmark++',
});

export type TextFormatType = EnumType<typeof TextFormat>;

export { TextFormat };
