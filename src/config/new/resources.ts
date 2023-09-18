import { ResourcesConfig } from '../../model/config/NewConfig';
import { ResourceKey } from '../../model/config/ResourceKey';

const RESOURCES: ResourcesConfig = {
  [ResourceKey.unknown]: {
    tag: 'unknown',
  },
  [ResourceKey.image]: {
    tag: 'image',
  },
  [ResourceKey.imageResponsive]: {
    tag: 'image-responsive',
  },
  [ResourceKey.imagePortrait]: {
    tag: 'image-portrait',
  },
  [ResourceKey.imageLandscape]: {
    tag: 'image-landscape',
  },
  [ResourceKey.imageEmbed]: {
    tag: 'image-embed',
  },
  [ResourceKey.imageLink]: {
    tag: 'image-link',
  },
  [ResourceKey.audio]: {
    tag: 'audio',
  },
  [ResourceKey.audioEmbed]: {
    tag: 'audio-embed',
  },
  [ResourceKey.audioLink]: {
    tag: 'audio-link',
  },
  [ResourceKey.video]: {
    tag: 'video',
  },
  [ResourceKey.videoEmbed]: {
    tag: 'video-embed',
  },
  [ResourceKey.videoLink]: {
    tag: 'video-link',
  },
  [ResourceKey.stillImageFilm]: {
    tag: 'still-image-film',
  },
  [ResourceKey.stillImageFilmEmbed]: {
    tag: 'still-image-film-embed',
  },
  [ResourceKey.stillImageFilmLink]: {
    tag: 'still-image-film-link',
  },
  [ResourceKey.article]: {
    tag: 'article',
  },
  [ResourceKey.articleEmbed]: {
    tag: 'article-embed',
  },
  [ResourceKey.articleLink]: {
    tag: 'article-link',
  },
  [ResourceKey.document]: {
    tag: 'document',
  },
  [ResourceKey.documentEmbed]: {
    tag: 'document-embed',
  },
  [ResourceKey.documentLink]: {
    tag: 'document-link',
  },
  [ResourceKey.documentDownload]: {
    tag: 'document-download',
  },
  [ResourceKey.appLink]: {
    tag: 'app-link',
  },
  [ResourceKey.websiteLink]: {
    tag: 'website-link',
  },
};

export { RESOURCES };
