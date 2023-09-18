import { EnumType, superenum } from '@ncoderz/superenum';

const ResourceKey = superenum({
  unknown: 'unknown',

  image: 'image',
  imageResponsive: 'imageResponsive',
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
  stillImageFilm: 'stillImageFilm',
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
});

export type ResourceKeyType = EnumType<typeof ResourceKey>;

export { ResourceKey };
