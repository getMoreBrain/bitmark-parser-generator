import { type EnumType } from '@ncoderz/superenum';

const DeprecatedTextFormat = {
  bitmarkMinusMinus: 'bitmark--', // bitmark-- text format, deprecated
} as const;

export type DeprecatedTextFormatType = EnumType<typeof DeprecatedTextFormat>;

export { DeprecatedTextFormat };
