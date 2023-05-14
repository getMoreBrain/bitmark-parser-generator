import { EnumType, superenum } from '@ncoderz/superenum';

const BitmarkParserType = superenum({
  antlr: 'antlr',
  peggy: 'peggy',
});

export type BitmarkParserTypeType = EnumType<typeof BitmarkParserType>;

export { BitmarkParserType };
