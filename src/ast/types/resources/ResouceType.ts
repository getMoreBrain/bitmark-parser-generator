import { EnumType, superenum } from '@ncoderz/superenum';

const ResourceTypeRaw = {
  websiteLink: 'website-link',
  image: 'image',
  imageLink: 'image-link',
  audio: 'audio',
  video: 'video',
  videoLink: 'video-link',
  stillImageFilm: 'still-image-film',
  stillImageFilmLink: 'still-image-film-link',
  article: 'article',
  articleLink: 'article-link',
  articleOnline: 'article-online',
  app: 'app',
  appLink: 'app-link',
} as const;

const ResourceType = superenum(ResourceTypeRaw);

export type ResourceTypeKeys = keyof typeof ResourceTypeRaw;
export type ResourceTypeType = EnumType<typeof ResourceType>;

export { ResourceType };
