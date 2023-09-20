import { EnumType, superenum } from '@ncoderz/superenum';

const ResourceConfigKey = superenum({
  _unknown: '_unknown',

  _image: '_image',
  // _imageResponsive: '_imageResponsive',
  _imagePortrait: '_imagePortrait',
  _imageLandscape: '_imageLandscape',
  _imageEmbed: '_imageEmbed',
  _imageLink: '_imageLink',
  _audio: '_audio',
  _audioEmbed: '_audioEmbed',
  _audioLink: '_audioLink',
  _video: '_video',
  _videoEmbed: '_videoEmbed',
  _videoLink: '_videoLink',
  // _stillImageFilm: '_stillImageFilm',
  _stillImageFilmEmbed: '_stillImageFilmEmbed',
  _stillImageFilmLink: '_stillImageFilmLink',
  _article: '_article',
  _articleEmbed: '_articleEmbed',
  _articleLink: '_articleLink',
  _document: '_document',
  _documentEmbed: '_documentEmbed',
  _documentLink: '_documentLink',
  _documentDownload: '_documentDownload',
  _appLink: '_appLink',
  _websiteLink: '_websiteLink',
});

export type ResourceConfigKeyType = EnumType<typeof ResourceConfigKey>;

export { ResourceConfigKey };
