import { type EnumType } from '@ncoderz/superenum';

const BitmarkParserType = {
  peggy: 'peggy',
} as const;

export type BitmarkParserTypeType = EnumType<typeof BitmarkParserType>;

export { BitmarkParserType };
