import { type EnumType, superenum } from '@ncoderz/superenum';

const BitmarkParserType = superenum({
  peggy: 'peggy',
});

export type BitmarkParserTypeType = EnumType<typeof BitmarkParserType>;

export { BitmarkParserType };
