import { _ResourcesConfig } from '../../model/config/_Config';
import { ResourceConfigKey } from '../../model/config/enum/ResourceConfigKey';
import { ResourceJsonKey } from '../../model/enum/ResourceJsonKey';
import { ResourceTag } from '../../model/enum/ResourceTag';

const RESOURCES: _ResourcesConfig = {
  [ResourceConfigKey.icon]: {
    tag: ResourceTag.icon,
  },
  [ResourceConfigKey.backgroundWallpaper]: {
    tag: ResourceTag.backgroundWallpaper,
  },
  [ResourceConfigKey.image]: {
    tag: ResourceTag.image,
  },
  [ResourceConfigKey.imagePortrait]: {
    tag: ResourceTag.imagePortrait,
    jsonKey: ResourceJsonKey.imagePortrait,
  },
  [ResourceConfigKey.imageLandscape]: {
    tag: ResourceTag.imageLandscape,
    jsonKey: ResourceJsonKey.imageLandscape,
  },
  [ResourceConfigKey.imageEmbed]: {
    tag: ResourceTag.imageEmbed,
    jsonKey: ResourceJsonKey.imageEmbed,
  },
  [ResourceConfigKey.imageLink]: {
    tag: ResourceTag.imageLink,
    jsonKey: ResourceJsonKey.imageLink,
  },
  [ResourceConfigKey.audio]: {
    tag: ResourceTag.audio,
  },
  [ResourceConfigKey.audioEmbed]: {
    tag: ResourceTag.audioEmbed,
    jsonKey: ResourceJsonKey.audioEmbed,
  },
  [ResourceConfigKey.audioLink]: {
    tag: ResourceTag.audioLink,
    jsonKey: ResourceJsonKey.audioLink,
  },
  [ResourceConfigKey.video]: {
    tag: ResourceTag.video,
  },
  [ResourceConfigKey.videoEmbed]: {
    tag: ResourceTag.videoEmbed,
    jsonKey: ResourceJsonKey.videoEmbed,
  },
  [ResourceConfigKey.videoLink]: {
    tag: ResourceTag.videoLink,
    jsonKey: ResourceJsonKey.videoLink,
  },
  [ResourceConfigKey.stillImageFilmEmbed]: {
    tag: ResourceTag.stillImageFilmEmbed,
    jsonKey: ResourceJsonKey.stillImageFilmEmbed,
  },
  [ResourceConfigKey.stillImageFilmLink]: {
    tag: ResourceTag.stillImageFilmLink,
    jsonKey: ResourceJsonKey.stillImageFilmLink,
  },
  [ResourceConfigKey.article]: {
    tag: ResourceTag.article,
  },
  [ResourceConfigKey.articleEmbed]: {
    tag: ResourceTag.articleEmbed,
    jsonKey: ResourceJsonKey.articleEmbed,
  },
  [ResourceConfigKey.articleLink]: {
    tag: ResourceTag.articleLink,
    jsonKey: ResourceJsonKey.articleLink,
  },
  [ResourceConfigKey.document]: {
    tag: ResourceTag.document,
  },
  [ResourceConfigKey.documentEmbed]: {
    tag: ResourceTag.documentEmbed,
    jsonKey: ResourceJsonKey.documentEmbed,
  },
  [ResourceConfigKey.documentLink]: {
    tag: ResourceTag.documentLink,
    jsonKey: ResourceJsonKey.documentLink,
  },
  [ResourceConfigKey.documentDownload]: {
    tag: ResourceTag.documentDownload,
    jsonKey: ResourceJsonKey.documentDownload,
  },
  [ResourceConfigKey.appLink]: {
    tag: ResourceTag.appLink,
    jsonKey: ResourceJsonKey.appLink,
  },
  [ResourceConfigKey.websiteLink]: {
    tag: ResourceTag.websiteLink,
    jsonKey: ResourceJsonKey.websiteLink,
  },
};

export { RESOURCES };
