import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * Config keys for resources
 */
const resourceConfigKeys = {
  image: 'image',
  // imageResponsive: 'imageResponsive',
  imagePortrait: 'imagePortrait',
  imageLandscape: 'imageLandscape',
  imageEmbed: 'imageEmbed',
  imageLink: 'imageLink',
  audio: 'audio',
  audioEmbed: 'audioEmbed',
  audioLink: 'audioLink',
  video: 'video',
  videoEmbed: 'videoEmbed',
  videoLink: 'videoLink',
  // stillImageFilm: 'stillImageFilm',
  stillImageFilmEmbed: 'stillImageFilmEmbed',
  stillImageFilmLink: 'stillImageFilmLink',
  article: 'article',
  articleEmbed: 'articleEmbed',
  articleLink: 'articleLink',
  document: 'document',
  documentEmbed: 'documentEmbed',
  documentLink: 'documentLink',
  documentDownload: 'documentDownload',
  appLink: 'appLink',
  websiteLink: 'websiteLink',
} as const;

const ResourceConfigKey = superenum(resourceConfigKeys);

export type ResourceConfigKeyType = EnumType<typeof ResourceConfigKey>;

export { ResourceConfigKey, resourceConfigKeys };
