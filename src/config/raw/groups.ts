import { _GroupsConfig } from '../../model/config/_Config';
import { GroupConfigKey } from '../../model/config/enum/GroupConfigKey';
import { GroupConfigType } from '../../model/config/enum/GroupConfigType';
import { PropertyConfigKey } from '../../model/config/enum/PropertyConfigKey';
import { ResourceConfigKey } from '../../model/config/enum/ResourceConfigKey';
import { TagConfigKey } from '../../model/config/enum/TagConfigKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { Count } from '../../model/enum/Count';
import { ResourceTag } from '../../model/enum/ResourceTag';

const GROUPS: _GroupsConfig = {
  [GroupConfigKey._standardAllBits]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._id,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._externalId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._aiGenerated,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._ageRange,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._language,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._target,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._tag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._icon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._iconTag,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._colorTag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._anchor,
      },
    ],
  },
  [GroupConfigKey._standardItemLeadInstructionHint]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._itemLead,
        maxCount: 2,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._instruction,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._hint,
      },
    ],
  },
  [GroupConfigKey._standardExample]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._example,
      },
    ],
  },
  [GroupConfigKey._standardTags]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardAllBits,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardItemLeadInstructionHint,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardExample,
      },
    ],
  },
  [GroupConfigKey._imageSource]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._imageSource,
        chain: [
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey._mockupId,
          },
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey._size,
          },
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey._format,
          },
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey._trim,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._partner]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._partner,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceImage,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._gap]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._gap,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            configKey: TagConfigKey._gap,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._standardExample,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._trueFalse]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._true,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            configKey: TagConfigKey._true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            configKey: TagConfigKey._false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._standardExample,
          },
        ],
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._false,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            configKey: TagConfigKey._true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            configKey: TagConfigKey._false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._standardExample,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._markConfig]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._markConfig,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey._color,
          },
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey._emphasis,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._mark]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._mark,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey._mark,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._standardExample,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._learningPathCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._action,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._duration,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._date,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._location,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._list,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._textReference,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._isTracked,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._isInfoOnly,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._book,
        chain: [
          {
            type: BitTagType.tag,
            configKey: TagConfigKey._reference,
            maxCount: 2,
          },
        ],
      },
    ],
  },
  //
  // Common resource properties
  //
  [GroupConfigKey._resourceCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._license,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._copyright,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._caption,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._showInIndex,
      },
    ],
  },
  [GroupConfigKey._resourceImageCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._src1x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._src2x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._src3x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._src4x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._width,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._height,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._alt,
      },
    ],
  },
  [GroupConfigKey._resourceAudioCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._duration,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._mute,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._autoplay,
      },
    ],
  },
  [GroupConfigKey._resourceVideoCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._width,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._height,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._duration,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._mute,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._autoplay,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._allowSubtitles,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._showSubtitles,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._alt,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._posterImage,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._src1x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._src2x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._src3x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._src4x,
      },
    ],
  },
  //
  // Single resources
  //
  [GroupConfigKey._resourceImage]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._image,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceImagePortrait]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._imagePortrait,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceImageLandscape]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._imageLandscape,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceImageEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._imageEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceImageLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._imageLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceAudio]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._audio,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceAudioEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._audioEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceAudioLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._audioLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceVideo]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._video,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceVideoEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._videoEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceVideoLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._videoLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceStillImageFilmEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._stillImageFilmEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceStillImageFilmLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._stillImageFilmLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceArticle]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._article,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceArticleEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._articleEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceArticleLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._articleLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceDocument]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._document,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceDocumentEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._documentEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceDocumentLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._documentLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceDocumentDownload]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._documentDownload,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceAppLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._appLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceWebsiteLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey._websiteLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  //
  // Combo resources - these are resources made up of a combination of multiple resources.
  //
  [GroupConfigKey._resourceStillImageFilm]: {
    type: GroupConfigType.comboResource,
    comboResourceType: ResourceTag.stillImageFilm,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImage,
        maxCount: 1,
        minCount: 1,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceAudio,
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
  [GroupConfigKey._resourceImageResponsive]: {
    type: GroupConfigType.comboResource,
    comboResourceType: ResourceTag.imageResponsive,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImagePortrait,
        maxCount: 1,
        minCount: 1,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImageLandscape,
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
};

export { GROUPS };
