import { EnumType, superenum } from '@ncoderz/superenum';

const BitType = superenum({
  article: 'article',
  cloze: 'cloze',
});

export type BitTypeType = EnumType<typeof BitType>;

export { BitType };
