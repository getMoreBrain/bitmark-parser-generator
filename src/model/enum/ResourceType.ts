import { EnumType, superenum } from '@ncoderz/superenum';

const ResourceTypeRaw = {
  unknown: 'unknown',

  image: 'image',
  imageResponsive: 'image-responsive',
  imagePortrait: 'image-portrait',
  imageLandscape: 'image-landscape',
  imageEmbed: 'image-embed',
  imageLink: 'image-link',
  audio: 'audio',
  audioEmbed: 'audio-embed',
  audioLink: 'audio-link',
  video: 'video',
  videoEmbed: 'video-embed',
  videoLink: 'video-link',
  stillImageFilm: 'still-image-film',
  stillImageFilmEmbed: 'still-image-film-embed',
  stillImageFilmLink: 'still-image-film-link',
  article: 'article',
  articleEmbed: 'article-embed',
  articleLink: 'article-link',
  document: 'document',
  documentEmbed: 'document-embed',
  documentLink: 'document-link',
  documentDownload: 'document-download',
  appLink: 'app-link',
  websiteLink: 'website-link',
} as const;

const ResourceType = superenum(ResourceTypeRaw);

export type ResourceTypeKeys = keyof typeof ResourceTypeRaw;
export type ResourceTypeType = EnumType<typeof ResourceType>;

export { ResourceType };
