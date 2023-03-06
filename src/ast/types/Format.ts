import { EnumType, superenum } from '@ncoderz/superenum';

const Format = superenum({
  bitmarkMinusMinus: 'bitmark--',
  bitmarkPlusPlus: 'bitmark++',
});

export type FormatType = EnumType<typeof Format>;

export { Format };
