import { EnumType, superenum } from '@ncoderz/superenum';

const ResourceTypeRaw = {
  unknown: 'unknown',

  image: 'image',
  imageLink: 'image-link',
  imageEmbed: 'image-embed',
  audio: 'audio',
  audioLink: 'audio-link',
  audioEmbed: 'audio-embed',
  video: 'video',
  videoLink: 'video-link',
  videoEmbed: 'video-embed',
  stillImageFilm: 'still-image-film',
  stillImageFilmLink: 'still-image-film-link',
  stillImageFilmEmbed: 'still-image-film-embed',
  article: 'article',
  articleLink: 'article-link',
  articleEmbed: 'article-embed',
  document: 'document',
  documentLink: 'document-link',
  documentEmbed: 'document-embed',
  documentDownload: 'document-download',
  app: 'app',
  appLink: 'app-link',
  websiteLink: 'website-link',
} as const;

const ResourceType = superenum(ResourceTypeRaw);

export type ResourceTypeKeys = keyof typeof ResourceTypeRaw;
export type ResourceTypeType = EnumType<typeof ResourceType>;

export { ResourceType };
