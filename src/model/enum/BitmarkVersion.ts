import { type EnumType } from '@ncoderz/superenum';

const BitmarkVersion = {
  v2: 2,
  v3: 3,
} as const;

export type BitmarkVersionType = EnumType<typeof BitmarkVersion>;

const DEFAULT_BITMARK_VERSION = BitmarkVersion.v3;

export { BitmarkVersion, DEFAULT_BITMARK_VERSION };
