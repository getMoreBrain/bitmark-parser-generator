import { type EnumType, superenum } from '@ncoderz/superenum';

const BitmarkVersion = superenum({
  v2: 2,
  v3: 3,
});

export type BitmarkVersionType = EnumType<typeof BitmarkVersion>;

const DEFAULT_BITMARK_VERSION = BitmarkVersion.v3;

export { BitmarkVersion, DEFAULT_BITMARK_VERSION };
