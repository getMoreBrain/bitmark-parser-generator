import { type EnumType, superenum } from '@ncoderz/superenum';

const DeprecatedTextFormat = superenum({
  bitmarkMinusMinus: 'bitmark--', // bitmark-- text format, deprecated
});

export type DeprecatedTextFormatType = EnumType<typeof DeprecatedTextFormat>;

export { DeprecatedTextFormat };
