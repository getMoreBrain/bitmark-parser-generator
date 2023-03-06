import { EnumType, superenum } from '@ncoderz/superenum';

const TextFormat = superenum({
  bitmarkMinusMinus: 'bitmark--',
  bitmarkPlusPlus: 'bitmark++',
});

export type TextFormatType = EnumType<typeof TextFormat>;

export { TextFormat };
