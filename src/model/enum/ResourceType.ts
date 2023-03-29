import { EnumType, superenum } from '@ncoderz/superenum';

const ResourceTypeRaw = {
  unknown: 'unknown',

  image: 'image',
  imageLink: 'image-link',
  audio: 'audio',
  audioLink: 'audio-link',
  video: 'video',
  videoLink: 'video-link',
  stillImageFilm: 'still-image-film',
  stillImageFilmLink: 'still-image-film-link',
  article: 'article',
  articleLink: 'article-link',
  document: 'document',
  documentLink: 'document-link',
  app: 'app',
  appLink: 'app-link',
  websiteLink: 'website-link',
} as const;

const ResourceType = superenum(ResourceTypeRaw);

export type ResourceTypeKeys = keyof typeof ResourceTypeRaw;
export type ResourceTypeType = EnumType<typeof ResourceType>;

export { ResourceType };
