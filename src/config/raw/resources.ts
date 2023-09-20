import { _ResourcesConfig } from '../../model/config/_Config';
import { ResourceConfigKey } from '../../model/config/enum/ResourceConfigKey';
import { ResourceJsonKey } from '../../model/enum/ResourceJsonKey';
import { ResourceTag } from '../../model/enum/ResourceTag';

const RESOURCES: _ResourcesConfig = {
  [ResourceConfigKey._unknown]: {
    tag: ResourceTag.unknown,
  },
  [ResourceConfigKey._image]: {
    tag: ResourceTag.image,
  },
  [ResourceConfigKey._imagePortrait]: {
    tag: ResourceTag.imagePortrait,
    jsonKey: ResourceJsonKey.imagePortrait,
  },
  [ResourceConfigKey._imageLandscape]: {
    tag: ResourceTag.imageLandscape,
    jsonKey: ResourceJsonKey.imageLandscape,
  },
  [ResourceConfigKey._imageEmbed]: {
    tag: ResourceTag.imageEmbed,
    jsonKey: ResourceJsonKey.imageEmbed,
  },
  [ResourceConfigKey._imageLink]: {
    tag: ResourceTag.imageLink,
    jsonKey: ResourceJsonKey.imageLink,
  },
  [ResourceConfigKey._audio]: {
    tag: ResourceTag.audio,
  },
  [ResourceConfigKey._audioEmbed]: {
    tag: ResourceTag.audioEmbed,
    jsonKey: ResourceJsonKey.audioEmbed,
  },
  [ResourceConfigKey._audioLink]: {
    tag: ResourceTag.audioLink,
    jsonKey: ResourceJsonKey.audioLink,
  },
  [ResourceConfigKey._video]: {
    tag: ResourceTag.video,
  },
  [ResourceConfigKey._videoEmbed]: {
    tag: ResourceTag.videoEmbed,
    jsonKey: ResourceJsonKey.videoEmbed,
  },
  [ResourceConfigKey._videoLink]: {
    tag: ResourceTag.videoLink,
    jsonKey: ResourceJsonKey.videoLink,
  },
  [ResourceConfigKey._stillImageFilmEmbed]: {
    tag: ResourceTag.stillImageFilmEmbed,
    jsonKey: ResourceJsonKey.stillImageFilmEmbed,
  },
  [ResourceConfigKey._stillImageFilmLink]: {
    tag: ResourceTag.stillImageFilmLink,
    jsonKey: ResourceJsonKey.stillImageFilmLink,
  },
  [ResourceConfigKey._article]: {
    tag: ResourceTag.article,
  },
  [ResourceConfigKey._articleEmbed]: {
    tag: ResourceTag.articleEmbed,
    jsonKey: ResourceJsonKey.articleEmbed,
  },
  [ResourceConfigKey._articleLink]: {
    tag: ResourceTag.articleLink,
    jsonKey: ResourceJsonKey.articleLink,
  },
  [ResourceConfigKey._document]: {
    tag: ResourceTag.document,
  },
  [ResourceConfigKey._documentEmbed]: {
    tag: ResourceTag.documentEmbed,
    jsonKey: ResourceJsonKey.documentEmbed,
  },
  [ResourceConfigKey._documentLink]: {
    tag: ResourceTag.documentLink,
    jsonKey: ResourceJsonKey.documentLink,
  },
  [ResourceConfigKey._documentDownload]: {
    tag: ResourceTag.documentDownload,
    jsonKey: ResourceJsonKey.documentDownload,
  },
  [ResourceConfigKey._appLink]: {
    tag: ResourceTag.appLink,
    jsonKey: ResourceJsonKey.appLink,
  },
  [ResourceConfigKey._websiteLink]: {
    tag: ResourceTag.websiteLink,
    jsonKey: ResourceJsonKey.websiteLink,
  },
};

export { RESOURCES };
