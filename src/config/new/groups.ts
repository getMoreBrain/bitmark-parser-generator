import { GroupConfigKey } from '../../model/config/GroupConfigKey';
import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { _GroupsConfig } from '../../model/config/RawConfig';
import { ResourceConfigKey } from '../../model/config/ResourceConfigKey';
import { TagConfigKey } from '../../model/config/TagConfigKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { Count } from '../../model/enum/Count';

const GROUPS: _GroupsConfig = {
  [GroupConfigKey._standardAllBits]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyConfigKey._id,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._externalId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._aiGenerated,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._ageRange,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._language,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._target,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._tag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._icon,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._iconTag,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._colorTag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._anchor,
      },
    ],
  },
  [GroupConfigKey._standardItemLeadInstructionHint]: {
    tags: [
      {
        type: BitTagType.tag,
        id: TagConfigKey._itemLead,
        maxCount: 2,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._instruction,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._hint,
      },
    ],
  },
  [GroupConfigKey._standardExample]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyConfigKey._example,
      },
    ],
  },
  [GroupConfigKey._standardTags]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardAllBits,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardItemLeadInstructionHint,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardExample,
      },
    ],
  },
  [GroupConfigKey._imageSource]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyConfigKey._imageSource,
        chain: [
          {
            type: BitTagType.property,
            id: PropertyConfigKey._mockupId,
          },
          {
            type: BitTagType.property,
            id: PropertyConfigKey._size,
          },
          {
            type: BitTagType.property,
            id: PropertyConfigKey._format,
          },
          {
            type: BitTagType.property,
            id: PropertyConfigKey._trim,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._partner]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyConfigKey._partner,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceImage,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._gap]: {
    tags: [
      {
        type: BitTagType.tag,
        id: TagConfigKey._gap,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            id: TagConfigKey._gap,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            id: GroupConfigKey._standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            id: GroupConfigKey._standardExample,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._trueFalse]: {
    tags: [
      {
        type: BitTagType.tag,
        id: TagConfigKey._true,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            id: TagConfigKey._true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            id: TagConfigKey._false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            id: GroupConfigKey._standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            id: GroupConfigKey._standardExample,
          },
        ],
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._false,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            id: TagConfigKey._true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            id: TagConfigKey._false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            id: GroupConfigKey._standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            id: GroupConfigKey._standardExample,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._markConfig]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyConfigKey._mark,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            id: PropertyConfigKey._color,
          },
          {
            type: BitTagType.property,
            id: PropertyConfigKey._emphasis,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._mark]: {
    tags: [
      {
        type: BitTagType.tag,
        id: TagConfigKey._mark,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            id: PropertyConfigKey._mark,
          },
          {
            type: BitTagType.group,
            id: GroupConfigKey._standardExample,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._learningPathCommon]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyConfigKey._action,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._duration,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._date,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._location,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._list,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._textReference,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._isTracked,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._isInfoOnly,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._book,
        chain: [
          {
            type: BitTagType.tag,
            id: TagConfigKey._reference,
            maxCount: 2,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceCommon]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyConfigKey._license,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._copyright,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._caption,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._showInIndex,
      },
    ],
  },
  [GroupConfigKey._resourceImageCommon]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._src1x,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._src2x,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._src3x,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._src4x,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._width,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._height,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._alt,
      },
    ],
  },
  [GroupConfigKey._resourceAudioCommon]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._duration,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._mute,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._autoplay,
      },
    ],
  },
  [GroupConfigKey._resourceVideoCommon]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._width,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._height,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._duration,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._mute,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._autoplay,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._allowSubtitles,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._showSubtitles,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._alt,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._posterImage,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._src1x,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._src2x,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._src3x,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._src4x,
      },
    ],
  },
  [GroupConfigKey._resourceImage]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._image,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceImageEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._imageEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceImageLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._imageLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceImageResponsive]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._imagePortrait,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._imageLandscape,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceAudio]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._audio,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceAudioEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._audioEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceAudioLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._audioLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceVideo]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._audio,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceVideoEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._audioEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceVideoLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._audioLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceStillImageFilm]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._image,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceImageCommon,
          },
        ],
      },
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._audio,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceStillImageFilmEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._stillImageFilmEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceStillImageFilmLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._stillImageFilmLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceArticle]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._article,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceArticleEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._articleEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceArticleLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._articleLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceDocument]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._document,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceDocumentEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._documentEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceDocumentLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._documentLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceDocumentDownload]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._documentDownload,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceAppLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._appLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey._resourceWebsiteLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceConfigKey._websiteLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupConfigKey._resourceCommon,
          },
        ],
      },
    ],
  },
  // All resources
  [GroupConfigKey._resourceAll]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImage,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImageEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImageLink,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImageResponsive,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAudio,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAudioEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAudioLink,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceVideo,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceVideoEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceVideoLink,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceStillImageFilm,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceStillImageFilmEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceStillImageFilmLink,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceArticleEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceArticleLink,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceDocument,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceDocumentEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceDocumentLink,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceDocumentDownload,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAppLink,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceWebsiteLink,
      },
    ],
  },
};

export { GROUPS };
