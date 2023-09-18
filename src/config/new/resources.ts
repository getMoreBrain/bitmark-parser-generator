import { _ResourcesConfig } from '../../model/config/RawConfig';
import { ResourceConfigKey } from '../../model/config/ResourceConfigKey';

const RESOURCES: _ResourcesConfig = {
  [ResourceConfigKey._unknown]: {
    tag: 'unknown',
  },
  [ResourceConfigKey._image]: {
    tag: 'image',
  },
  [ResourceConfigKey._imageResponsive]: {
    tag: 'image-responsive',
  },
  [ResourceConfigKey._imagePortrait]: {
    tag: 'image-portrait',
  },
  [ResourceConfigKey._imageLandscape]: {
    tag: 'image-landscape',
  },
  [ResourceConfigKey._imageEmbed]: {
    tag: 'image-embed',
  },
  [ResourceConfigKey._imageLink]: {
    tag: 'image-link',
  },
  [ResourceConfigKey._audio]: {
    tag: 'audio',
  },
  [ResourceConfigKey._audioEmbed]: {
    tag: 'audio-embed',
  },
  [ResourceConfigKey._audioLink]: {
    tag: 'audio-link',
  },
  [ResourceConfigKey._video]: {
    tag: 'video',
  },
  [ResourceConfigKey._videoEmbed]: {
    tag: 'video-embed',
  },
  [ResourceConfigKey._videoLink]: {
    tag: 'video-link',
  },
  [ResourceConfigKey._stillImageFilm]: {
    tag: 'still-image-film',
  },
  [ResourceConfigKey._stillImageFilmEmbed]: {
    tag: 'still-image-film-embed',
  },
  [ResourceConfigKey._stillImageFilmLink]: {
    tag: 'still-image-film-link',
  },
  [ResourceConfigKey._article]: {
    tag: 'article',
  },
  [ResourceConfigKey._articleEmbed]: {
    tag: 'article-embed',
  },
  [ResourceConfigKey._articleLink]: {
    tag: 'article-link',
  },
  [ResourceConfigKey._document]: {
    tag: 'document',
  },
  [ResourceConfigKey._documentEmbed]: {
    tag: 'document-embed',
  },
  [ResourceConfigKey._documentLink]: {
    tag: 'document-link',
  },
  [ResourceConfigKey._documentDownload]: {
    tag: 'document-download',
  },
  [ResourceConfigKey._appLink]: {
    tag: 'app-link',
  },
  [ResourceConfigKey._websiteLink]: {
    tag: 'website-link',
  },
};

export { RESOURCES };
