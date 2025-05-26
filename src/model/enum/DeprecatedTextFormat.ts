import { EnumType, superenum } from '@ncoderz/superenum';

const DeprecatedTextFormat = superenum({
  bitmarkMinusMinus: 'bitmark--',
  bitmarkPlusPlus: 'bitmark++',
});

export type DeprecatedTextFormatType = EnumType<typeof DeprecatedTextFormat>;

export { DeprecatedTextFormat };
