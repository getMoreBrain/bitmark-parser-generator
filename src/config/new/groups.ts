import { GroupKey } from '../../model/config/GroupKey';
import { GroupsConfig } from '../../model/config/NewConfig';
import { ResourceKey } from '../../model/config/ResourceKey';
import { TagKey } from '../../model/config/TagKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { Count } from '../../model/enum/Count';
import { PropertyKey } from '../../model/enum/PropertyKey';

const GROUPS: GroupsConfig = {
  [GroupKey.standardAllBits]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyKey.id,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.externalId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.aiGenerated,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.ageRange,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.language,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.target,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.tag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.icon,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.iconTag,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.colorTag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        id: TagKey.anchor,
      },
    ],
  },
  [GroupKey.standardItemLeadInstructionHint]: {
    tags: [
      {
        type: BitTagType.tag,
        id: TagKey.itemLead,
        maxCount: 2,
      },
      {
        type: BitTagType.tag,
        id: TagKey.instruction,
      },
      {
        type: BitTagType.tag,
        id: TagKey.hint,
      },
    ],
  },
  [GroupKey.standardExample]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyKey.example,
      },
    ],
  },
  [GroupKey.standardTags]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardAllBits,
      },
      {
        type: BitTagType.group,
        id: GroupKey.standardItemLeadInstructionHint,
      },
      {
        type: BitTagType.group,
        id: GroupKey.standardExample,
      },
    ],
  },
  [GroupKey.imageSource]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyKey.imageSource,
        chain: [
          {
            type: BitTagType.property,
            id: PropertyKey.mockupId,
          },
          {
            type: BitTagType.property,
            id: PropertyKey.size,
          },
          {
            type: BitTagType.property,
            id: PropertyKey.format,
          },
          {
            type: BitTagType.property,
            id: PropertyKey.trim,
          },
        ],
      },
    ],
  },
  [GroupKey.partner]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyKey.partner,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceImage,
          },
        ],
      },
    ],
  },
  [GroupKey.gap]: {
    tags: [
      {
        type: BitTagType.tag,
        id: TagKey.gap,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            id: TagKey.gap,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            id: GroupKey.standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            id: GroupKey.standardExample,
          },
        ],
      },
    ],
  },
  [GroupKey.trueFalse]: {
    tags: [
      {
        type: BitTagType.tag,
        id: TagKey.true,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            id: TagKey.true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            id: TagKey.false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            id: GroupKey.standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            id: GroupKey.standardExample,
          },
        ],
      },
      {
        type: BitTagType.tag,
        id: TagKey.false,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            id: TagKey.true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            id: TagKey.false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            id: GroupKey.standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            id: GroupKey.standardExample,
          },
        ],
      },
    ],
  },
  [GroupKey.markConfig]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyKey.mark,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            id: PropertyKey.color,
          },
          {
            type: BitTagType.property,
            id: PropertyKey.emphasis,
          },
        ],
      },
    ],
  },
  [GroupKey.mark]: {
    tags: [
      {
        type: BitTagType.tag,
        id: TagKey.mark,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            id: PropertyKey.mark,
          },
          {
            type: BitTagType.group,
            id: GroupKey.standardExample,
          },
        ],
      },
    ],
  },
  [GroupKey.learningPathCommon]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyKey.action,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.duration,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.date,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.location,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.list,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.textReference,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.isTracked,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.isInfoOnly,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.book,
        chain: [
          {
            type: BitTagType.tag,
            id: TagKey.reference,
            maxCount: 2,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceCommon]: {
    tags: [
      {
        type: BitTagType.property,
        id: PropertyKey.license,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.copyright,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.caption,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.showInIndex,
      },
    ],
  },
  [GroupKey.resourceImageCommon]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.resourceCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.src1x,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.src2x,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.src3x,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.src4x,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.width,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.height,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.alt,
      },
    ],
  },
  [GroupKey.resourceAudioCommon]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.resourceCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.duration,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.mute,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.autoplay,
      },
    ],
  },
  [GroupKey.resourceVideoCommon]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.resourceCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.width,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.height,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.duration,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.mute,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.autoplay,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.allowSubtitles,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.showSubtitles,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.alt,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.posterImage,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.src1x,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.src2x,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.src3x,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.src4x,
      },
    ],
  },
  [GroupKey.resourceImage]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.image,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceImageEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.imageEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceImageLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.imageLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceImageResponsive]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.imagePortrait,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceImageCommon,
          },
        ],
      },
      {
        type: BitTagType.resource,
        id: ResourceKey.imageLandscape,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceAudio]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.audio,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceAudioEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.audioEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceAudioLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.audioLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceVideo]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.audio,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceVideoEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.audioEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceVideoLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.audioLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceStillImageFilm]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.image,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceImageCommon,
          },
        ],
      },
      {
        type: BitTagType.resource,
        id: ResourceKey.audio,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceStillImageFilmEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.stillImageFilmEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceStillImageFilmLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.stillImageFilmLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceArticle]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.article,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceArticleEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.articleEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceArticleLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.articleLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceDocument]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.document,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceDocumentEmbed]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.documentEmbed,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceDocumentLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.documentLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceDocumentDownload]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.documentDownload,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceAppLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.appLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupKey.resourceWebsiteLink]: {
    tags: [
      {
        type: BitTagType.resource,
        id: ResourceKey.websiteLink,
        chain: [
          {
            type: BitTagType.group,
            id: GroupKey.resourceCommon,
          },
        ],
      },
    ],
  },
  // All resources
  [GroupKey.resourceAll]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.resourceImage,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImageEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImageLink,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImageResponsive,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAudio,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAudioEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAudioLink,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceVideo,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceVideoEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceVideoLink,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceStillImageFilm,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceStillImageFilmEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceStillImageFilmLink,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceArticleEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceArticleLink,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceDocument,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceDocumentEmbed,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceDocumentLink,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceDocumentDownload,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAppLink,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceWebsiteLink,
      },
    ],
  },
};

export { GROUPS };
