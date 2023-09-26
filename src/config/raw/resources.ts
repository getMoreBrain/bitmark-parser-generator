import { _ResourcesConfig } from '../../model/config/_Config';
import { ConfigKey } from '../../model/config/enum/ConfigKey';
import { ResourceJsonKey } from '../../model/enum/ResourceJsonKey';
import { ResourceTag } from '../../model/enum/ResourceTag';

const RESOURCES: _ResourcesConfig = {
  [ConfigKey._resource_image]: {
    tag: ResourceTag.image,
  },
  [ConfigKey._resource_imagePortrait]: {
    tag: ResourceTag.imagePortrait,
    jsonKey: ResourceJsonKey.imagePortrait,
  },
  [ConfigKey._resource_imageLandscape]: {
    tag: ResourceTag.imageLandscape,
    jsonKey: ResourceJsonKey.imageLandscape,
  },
  [ConfigKey._resource_imageEmbed]: {
    tag: ResourceTag.imageEmbed,
    jsonKey: ResourceJsonKey.imageEmbed,
  },
  [ConfigKey._resource_imageLink]: {
    tag: ResourceTag.imageLink,
    jsonKey: ResourceJsonKey.imageLink,
  },
  [ConfigKey._resource_audio]: {
    tag: ResourceTag.audio,
  },
  [ConfigKey._resource_audioEmbed]: {
    tag: ResourceTag.audioEmbed,
    jsonKey: ResourceJsonKey.audioEmbed,
  },
  [ConfigKey._resource_audioLink]: {
    tag: ResourceTag.audioLink,
    jsonKey: ResourceJsonKey.audioLink,
  },
  [ConfigKey._resource_video]: {
    tag: ResourceTag.video,
  },
  [ConfigKey._resource_videoEmbed]: {
    tag: ResourceTag.videoEmbed,
    jsonKey: ResourceJsonKey.videoEmbed,
  },
  [ConfigKey._resource_videoLink]: {
    tag: ResourceTag.videoLink,
    jsonKey: ResourceJsonKey.videoLink,
  },
  [ConfigKey._resource_stillImageFilmEmbed]: {
    tag: ResourceTag.stillImageFilmEmbed,
    jsonKey: ResourceJsonKey.stillImageFilmEmbed,
  },
  [ConfigKey._resource_stillImageFilmLink]: {
    tag: ResourceTag.stillImageFilmLink,
    jsonKey: ResourceJsonKey.stillImageFilmLink,
  },
  [ConfigKey._resource_article]: {
    tag: ResourceTag.article,
  },
  [ConfigKey._resource_articleEmbed]: {
    tag: ResourceTag.articleEmbed,
    jsonKey: ResourceJsonKey.articleEmbed,
  },
  [ConfigKey._resource_articleLink]: {
    tag: ResourceTag.articleLink,
    jsonKey: ResourceJsonKey.articleLink,
  },
  [ConfigKey._resource_document]: {
    tag: ResourceTag.document,
  },
  [ConfigKey._resource_documentEmbed]: {
    tag: ResourceTag.documentEmbed,
    jsonKey: ResourceJsonKey.documentEmbed,
  },
  [ConfigKey._resource_documentLink]: {
    tag: ResourceTag.documentLink,
    jsonKey: ResourceJsonKey.documentLink,
  },
  [ConfigKey._resource_documentDownload]: {
    tag: ResourceTag.documentDownload,
    jsonKey: ResourceJsonKey.documentDownload,
  },
  [ConfigKey._resource_appLink]: {
    tag: ResourceTag.appLink,
    jsonKey: ResourceJsonKey.appLink,
  },
  [ConfigKey._resource_websiteLink]: {
    tag: ResourceTag.websiteLink,
    jsonKey: ResourceJsonKey.websiteLink,
  },
};

export { RESOURCES };
