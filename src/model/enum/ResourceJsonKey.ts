import { EnumType, superenum } from '@ncoderz/superenum';

const ResourceJsonKey = superenum({
  imageResponsive: 'imageResponsive',
  imagePortrait: 'imagePortrait',
  imageLandscape: 'imageLandscape',
  imageEmbed: 'imageEmbed',
  imageLink: 'imageLink',
  audioEmbed: 'audioEmbed',
  audioLink: 'audioLink',
  videoEmbed: 'videoEmbed',
  videoLink: 'videoLink',
  stillImageFilm: 'stillImageFilm',
  stillImageFilmEmbed: 'stillImageFilmEmbed',
  stillImageFilmLink: 'stillImageFilmLink',
  articleEmbed: 'articleEmbed',
  articleLink: 'articleLink',
  documentEmbed: 'documentEmbed',
  documentLink: 'documentLink',
  documentDownload: 'documentDownload',
  appLink: 'appLink',
  websiteLink: 'websiteLink',
});

export type ResourceJsonKeyType = EnumType<typeof ResourceJsonKey>;

export { ResourceJsonKey };
