import { EnumType, superenum } from '@ncoderz/superenum';

const BitResourceTypeRaw = {
  image: 'image',
  audio: 'audio',
  article: 'article',
  articleOnline: 'article-online',
  app: 'app',
} as const;

const BitResourceType = superenum(BitResourceTypeRaw);

export type BitResourceTypeKeys = keyof typeof BitResourceTypeRaw;
export type BitResourceTypeType = EnumType<typeof BitResourceType>;

export { BitResourceType };
