import { EnumType, superenum } from '@ncoderz/superenum';

const BitTextFormat = superenum({
  bitmarkMinusMinus: 'bitmark--',
  bitmarkPlusPlus: 'bitmark++',
});

export type BitTextFormatType = EnumType<typeof BitTextFormat>;

export { BitTextFormat };
