import { EnumType, superenum } from '@ncoderz/superenum';

const PlaceholderType = superenum({
  gap: 'gap',
});

export type PlaceholderTypeType = EnumType<typeof PlaceholderType>;

export { PlaceholderType };
