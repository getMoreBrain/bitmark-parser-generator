import { type EnumType, superenum } from '@ncoderz/superenum';

const resourceKeys = {
  resource_image: '&image',
  resource_imageResponsive: '&imageResponsive',
  resource_imagePortrait: '&imagePortrait',
  resource_imageLandscape: '&imageLandscape',
  resource_imageEmbed: '&imageEmbed',
  resource_imageLink: '&imageLink',
  resource_audio: '&audio',
  resource_audioEmbed: '&audioEmbed',
  resource_audioLink: '&audioLink',
  resource_video: '&video',
  resource_videoEmbed: '&videoEmbed',
  resource_videoLink: '&videoLink',
  resource_stillImageFilm: '&stillImageFilm',
  resource_stillImageFilmEmbed: '&stillImageFilmEmbed',
  resource_stillImageFilmLink: '&stillImageFilmLink',
  resource_article: '&article',
  resource_articleEmbed: '&articleEmbed',
  resource_articleLink: '&articleLink',
  resource_document: '&document',
  resource_documentEmbed: '&documentEmbed',
  resource_documentLink: '&documentLink',
  resource_documentDownload: '&documentDownload',
  resource_appLink: '&appLink',
  resource_websiteLink: '&websiteLink',

  resource_icon: '&icon',
  resource_backgroundWallpaper: '&backgroundWallpaper',
  resource_imagePlaceholder: '&imagePlaceholder',
} as const;

const ResourceKey = superenum(resourceKeys);

export type ResourceKeyType = EnumType<typeof ResourceKey>;

export { ResourceKey, resourceKeys };
