import { EnumType, superenum } from '@ncoderz/superenum';

const BitPlaceholderType = superenum({
  gap: 'gap',
  select: 'select',
});

export type BitPlaceholderTypeType = EnumType<typeof BitPlaceholderType>;

export { BitPlaceholderType };
