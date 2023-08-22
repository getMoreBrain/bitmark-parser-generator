import { TagDataMap } from '../../../model/config/TagData';
import { PropertyKey } from '../../../model/enum/PropertyKey';
import { ResourceType } from '../../../model/enum/ResourceType';

// Default resource chain
const TAGS_DEFAULT_RESOURCE_CHAIN: TagDataMap = {
  [PropertyKey.license]: { isProperty: true },
  [PropertyKey.copyright]: { isProperty: true },
  [PropertyKey.caption]: { isProperty: true },
  [PropertyKey.showInIndex]: { isProperty: true },
};

// Image chain (reused for image, image-responsive, image-portrait, image-landscape, image-embed, image-link)
const TAGS_IMAGE_CHAIN = {
  ...TAGS_DEFAULT_RESOURCE_CHAIN,
  [PropertyKey.src1x]: { isProperty: true },
  [PropertyKey.src2x]: { isProperty: true },
  [PropertyKey.src3x]: { isProperty: true },
  [PropertyKey.src4x]: { isProperty: true },
  [PropertyKey.width]: { isProperty: true },
  [PropertyKey.height]: { isProperty: true },
  [PropertyKey.alt]: { isProperty: true },
};

// Image

const TAGS_CHAIN_IMAGE_RESOURCE: TagDataMap = {
  [ResourceType.image]: {
    isResource: true,
    chain: {
      ...TAGS_IMAGE_CHAIN,
    },
  },
};

const TAGS_CHAIN_IMAGE_EMBED_RESOURCE: TagDataMap = {
  [ResourceType.imageEmbed]: {
    isResource: true,
    chain: {
      // Might not be correct
      ...TAGS_IMAGE_CHAIN,
    },
  },
};

const TAGS_CHAIN_IMAGE_LINK_RESOURCE: TagDataMap = {
  [ResourceType.imageLink]: {
    isResource: true,
    chain: {
      // Might not be correct
      ...TAGS_IMAGE_CHAIN,
    },
  },
};

// Image Responsive

const TAGS_CHAIN_IMAGE_RESPONSIVE_RESOURCE: TagDataMap = {
  [ResourceType.imagePortrait]: {
    isResource: true,
    chain: {
      ...TAGS_IMAGE_CHAIN,
    },
  },
  [ResourceType.imageLandscape]: {
    isResource: true,
    chain: {
      ...TAGS_IMAGE_CHAIN,
    },
  },
};

// Audio

// Audio chain (reused for audio, audio-embed, audio-link)
const TAGS_AUDIO_CHAIN = {
  ...TAGS_DEFAULT_RESOURCE_CHAIN,
  [PropertyKey.duration]: { isProperty: true },
  [PropertyKey.mute]: { isProperty: true },
  [PropertyKey.autoplay]: { isProperty: true },
};

const TAGS_CHAIN_AUDIO_RESOURCE: TagDataMap = {
  [ResourceType.audio]: {
    isResource: true,
    chain: {
      ...TAGS_AUDIO_CHAIN,
    },
  },
};

const TAGS_CHAIN_AUDIO_EMBED_RESOURCE: TagDataMap = {
  [ResourceType.audioEmbed]: {
    isResource: true,
    chain: {
      ...TAGS_AUDIO_CHAIN,
    },
  },
};

const TAGS_CHAIN_AUDIO_LINK_RESOURCE: TagDataMap = {
  [ResourceType.audioLink]: {
    isResource: true,
    chain: {
      ...TAGS_AUDIO_CHAIN,
    },
  },
};

// Video

// Video chain (reused for video, video-embed, video-link)
const TAGS_VIDEO_CHAIN = {
  ...TAGS_DEFAULT_RESOURCE_CHAIN,
  [PropertyKey.width]: { isProperty: true },
  [PropertyKey.height]: { isProperty: true },
  [PropertyKey.duration]: { isProperty: true },
  [PropertyKey.mute]: { isProperty: true },
  [PropertyKey.autoplay]: { isProperty: true },
  [PropertyKey.allowSubtitles]: { isProperty: true },
  [PropertyKey.showSubtitles]: { isProperty: true },
  [PropertyKey.alt]: { isProperty: true },
  [PropertyKey.posterImage]: { isProperty: true },
  // For thumbnails - not sure they make sense the way they are
  [PropertyKey.src1x]: { isProperty: true },
  [PropertyKey.src2x]: { isProperty: true },
  [PropertyKey.src3x]: { isProperty: true },
  [PropertyKey.src4x]: { isProperty: true },
};

const TAGS_CHAIN_VIDEO_RESOURCE: TagDataMap = {
  [ResourceType.video]: {
    isResource: true,
    chain: {
      ...TAGS_VIDEO_CHAIN,
    },
  },
};

const TAGS_CHAIN_VIDEO_EMBED_RESOURCE: TagDataMap = {
  [ResourceType.videoEmbed]: {
    isResource: true,
    chain: {
      // Might not be correct
      ...TAGS_VIDEO_CHAIN,
    },
  },
};

const TAGS_CHAIN_VIDEO_LINK_RESOURCE: TagDataMap = {
  [ResourceType.videoLink]: {
    isResource: true,
    chain: {
      // Might not be correct
      ...TAGS_VIDEO_CHAIN,
    },
  },
};

// Still Image

const TAGS_CHAIN_STILL_IMAGE_FILM_RESOURCE: TagDataMap = {
  [ResourceType.image]: {
    isResource: true,
    chain: {
      ...TAGS_IMAGE_CHAIN,
    },
  },
  [ResourceType.audio]: {
    isResource: true,
    chain: {
      ...TAGS_AUDIO_CHAIN,
    },
  },
};

const TAGS_CHAIN_STILL_IMAGE_FILM_EMBED_RESOURCE: TagDataMap = {
  [ResourceType.stillImageFilmEmbed]: {
    isResource: true,
    chain: {
      // Might not be correct
      ...TAGS_VIDEO_CHAIN,
    },
  },
};

const TAGS_CHAIN_STILL_IMAGE_FILM_LINK_RESOURCE: TagDataMap = {
  [ResourceType.stillImageFilmLink]: {
    isResource: true,
    chain: {
      // Might not be correct
      ...TAGS_VIDEO_CHAIN,
    },
  },
};

// Article

const TAGS_CHAIN_ARTICLE_RESOURCE: TagDataMap = {
  [ResourceType.article]: {
    isResource: true,
    chain: {
      ...TAGS_DEFAULT_RESOURCE_CHAIN,
    },
  },
};

const TAGS_CHAIN_ARTICLE_EMBED_RESOURCE: TagDataMap = {
  [ResourceType.articleEmbed]: {
    isResource: true,
    chain: {
      ...TAGS_DEFAULT_RESOURCE_CHAIN,
    },
  },
};

const TAGS_CHAIN_ARTICLE_LINK_RESOURCE: TagDataMap = {
  [ResourceType.articleLink]: {
    isResource: true,
    chain: {
      ...TAGS_DEFAULT_RESOURCE_CHAIN,
    },
  },
};

// Document

const TAGS_CHAIN_DOCUMENT_RESOURCE: TagDataMap = {
  [ResourceType.document]: {
    isResource: true,
    chain: {
      ...TAGS_DEFAULT_RESOURCE_CHAIN,
    },
  },
};

const TAGS_CHAIN_DOCUMENT_EMBED_RESOURCE: TagDataMap = {
  [ResourceType.documentEmbed]: {
    isResource: true,
    chain: {
      ...TAGS_DEFAULT_RESOURCE_CHAIN,
    },
  },
};

const TAGS_CHAIN_DOCUMENT_LINK_RESOURCE: TagDataMap = {
  [ResourceType.documentLink]: {
    isResource: true,
    chain: {
      ...TAGS_DEFAULT_RESOURCE_CHAIN,
    },
  },
};

const TAGS_CHAIN_DOCUMENT_DOWNLOAD_RESOURCE: TagDataMap = {
  [ResourceType.documentDownload]: {
    isResource: true,
    chain: {
      ...TAGS_DEFAULT_RESOURCE_CHAIN,
    },
  },
};

// App

const TAGS_CHAIN_APP_LINK_RESOURCE: TagDataMap = {
  [ResourceType.appLink]: {
    isResource: true,
    chain: {
      ...TAGS_DEFAULT_RESOURCE_CHAIN,
    },
  },
};

// Website

const TAGS_CHAIN_WEBSITE_LINK_RESOURCE: TagDataMap = {
  [ResourceType.websiteLink]: {
    isResource: true,
    chain: {
      ...TAGS_DEFAULT_RESOURCE_CHAIN,
      [PropertyKey.siteName]: { isProperty: true },
    },
  },
};

// All resources

const TAGS_CHAIN_ANY_RESOURCE: TagDataMap = {
  ...TAGS_CHAIN_IMAGE_RESOURCE,
  ...TAGS_CHAIN_IMAGE_EMBED_RESOURCE,
  ...TAGS_CHAIN_IMAGE_LINK_RESOURCE,
  ...TAGS_CHAIN_IMAGE_RESPONSIVE_RESOURCE,
  ...TAGS_CHAIN_AUDIO_RESOURCE,
  ...TAGS_CHAIN_AUDIO_EMBED_RESOURCE,
  ...TAGS_CHAIN_AUDIO_LINK_RESOURCE,
  ...TAGS_CHAIN_VIDEO_RESOURCE,
  ...TAGS_CHAIN_VIDEO_EMBED_RESOURCE,
  ...TAGS_CHAIN_VIDEO_LINK_RESOURCE,
  ...TAGS_CHAIN_STILL_IMAGE_FILM_RESOURCE,
  ...TAGS_CHAIN_STILL_IMAGE_FILM_EMBED_RESOURCE,
  ...TAGS_CHAIN_STILL_IMAGE_FILM_LINK_RESOURCE,
  ...TAGS_CHAIN_ARTICLE_RESOURCE,
  ...TAGS_CHAIN_ARTICLE_EMBED_RESOURCE,
  ...TAGS_CHAIN_ARTICLE_LINK_RESOURCE,
  ...TAGS_CHAIN_DOCUMENT_RESOURCE,
  ...TAGS_CHAIN_DOCUMENT_EMBED_RESOURCE,
  ...TAGS_CHAIN_DOCUMENT_LINK_RESOURCE,
  ...TAGS_CHAIN_DOCUMENT_DOWNLOAD_RESOURCE,
  ...TAGS_CHAIN_APP_LINK_RESOURCE,
  ...TAGS_CHAIN_WEBSITE_LINK_RESOURCE,
};

export {
  TAGS_CHAIN_IMAGE_RESOURCE,
  TAGS_CHAIN_IMAGE_EMBED_RESOURCE,
  TAGS_CHAIN_IMAGE_LINK_RESOURCE,
  TAGS_CHAIN_IMAGE_RESPONSIVE_RESOURCE,
  TAGS_CHAIN_AUDIO_RESOURCE,
  TAGS_CHAIN_AUDIO_EMBED_RESOURCE,
  TAGS_CHAIN_AUDIO_LINK_RESOURCE,
  TAGS_CHAIN_VIDEO_RESOURCE,
  TAGS_CHAIN_VIDEO_EMBED_RESOURCE,
  TAGS_CHAIN_VIDEO_LINK_RESOURCE,
  TAGS_CHAIN_STILL_IMAGE_FILM_RESOURCE,
  TAGS_CHAIN_STILL_IMAGE_FILM_EMBED_RESOURCE,
  TAGS_CHAIN_STILL_IMAGE_FILM_LINK_RESOURCE,
  TAGS_CHAIN_ARTICLE_RESOURCE,
  TAGS_CHAIN_ARTICLE_EMBED_RESOURCE,
  TAGS_CHAIN_ARTICLE_LINK_RESOURCE,
  TAGS_CHAIN_DOCUMENT_RESOURCE,
  TAGS_CHAIN_DOCUMENT_EMBED_RESOURCE,
  TAGS_CHAIN_DOCUMENT_LINK_RESOURCE,
  TAGS_CHAIN_DOCUMENT_DOWNLOAD_RESOURCE,
  TAGS_CHAIN_APP_LINK_RESOURCE,
  TAGS_CHAIN_WEBSITE_LINK_RESOURCE,
  TAGS_CHAIN_ANY_RESOURCE,
};
