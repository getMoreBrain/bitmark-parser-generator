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
  [GroupConfigKey.group_standardAllBits]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.id,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.externalId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.aiGenerated,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.ageRange,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.lang,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.publisher,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.publisherName,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.theme,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.target,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.tag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.icon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.iconTag,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.colorTag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.anchor,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.search,
      },
    ],
  },
  [GroupConfigKey.group_standardItemLeadInstructionHint]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.itemLead,
        chain: [
          {
            type: BitTagType.tag,
            configKey: TagConfigKey.itemLead,
            maxCount: 3,
          },
        ],
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.instruction,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.hint,
      },
    ],
  },
  [GroupConfigKey.group_standardExample]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.example,
      },
    ],
  },
  [GroupConfigKey.group_standardTags]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardAllBits,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardExample,
      },
    ],
  },
  [GroupConfigKey.group_imageSource]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.imageSource,
        chain: [
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.mockupId,
          },
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.size,
          },
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.format,
          },
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.trim,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_technicalTerm]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.technicalTerm,
        chain: [
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.lang,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_person]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.person,
        chain: [
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.property_title,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceImage,
          },
        ],
      },
      {
        // Deprecated (parter renamed to person)
        type: BitTagType.property,
        configKey: PropertyConfigKey.partner,
        chain: [
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.property_title,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceImage,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_gap]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.gap,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            configKey: TagConfigKey.gap,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_standardExample,
          },
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.isCaseSensitive,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_trueFalse]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.true,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            configKey: TagConfigKey.true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            configKey: TagConfigKey.false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_standardExample,
          },
        ],
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.false,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            configKey: TagConfigKey.true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            configKey: TagConfigKey.false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_standardExample,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_markConfig]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.markConfig,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.color,
          },
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.emphasis,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_mark]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.tag_mark,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            configKey: PropertyConfigKey.property_mark,
          },
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_standardExample,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_bookCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.language,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.spaceId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.kind,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.hasMarkAsDone,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.isPublic,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.title,
        maxCount: 2,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.subtype,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.coverImage,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.coverColor,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.subject,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.author,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.publications,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.duration,
      },
    ],
  },
  [GroupConfigKey.group_learningPathCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.action,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.duration,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.date,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.location,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.list,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.textReference,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.isTracked,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.isInfoOnly,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.deeplink,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.buttonCaption,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.book,
        chain: [
          {
            type: BitTagType.tag,
            configKey: TagConfigKey.tag_reference,
            maxCount: 2,
          },
        ],
      },
    ],
  },
  //
  // Common resource properties
  //
  [GroupConfigKey.group_resourceCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.license,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.copyright,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.caption,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.showInIndex,
      },
    ],
  },
  [GroupConfigKey.group_resourceImageCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.src1x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.src2x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.src3x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.src4x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.width,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.height,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.alt,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.zoomDisabled,
      },
    ],
  },
  [GroupConfigKey.group_resourceAudioCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.duration,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.mute,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.autoplay,
      },
    ],
  },
  [GroupConfigKey.group_resourceVideoCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.width,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.height,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.duration,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.mute,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.autoplay,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.allowSubtitles,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.showSubtitles,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.alt,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.posterImage,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.src1x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.src2x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.src3x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.src4x,
      },
    ],
  },
  //
  // Single resources
  //
  [GroupConfigKey.group_resourceImage]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.image,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceImagePortrait]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.imagePortrait,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceImageLandscape]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.imageLandscape,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceImageEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.imageEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceImageLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.imageLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceAudio]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.audio,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceAudioEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.audioEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceAudioLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.audioLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceVideo]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.video,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceVideoEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.videoEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceVideoLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.videoLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceStillImageFilmEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.stillImageFilmEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceStillImageFilmLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.stillImageFilmLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceArticle]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.article,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceArticleEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.articleEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceArticleLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.articleLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceDocument]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.document,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceDocumentEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.documentEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceDocumentLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.documentLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceDocumentDownload]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.documentDownload,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceAppLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.appLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [GroupConfigKey.group_resourceWebsiteLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ResourceConfigKey.websiteLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: GroupConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  //
  // Combo resources - these are resources made up of a combination of multiple resources.
  //
  [GroupConfigKey.group_resourceStillImageFilm]: {
    type: GroupConfigType.comboResource,
    comboResourceType: ResourceTag.stillImageFilm,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImage,
        maxCount: 1,
        minCount: 1,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceAudio,
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
  [GroupConfigKey.group_resourceImageResponsive]: {
    type: GroupConfigType.comboResource,
    comboResourceType: ResourceTag.imageResponsive,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImagePortrait,
        maxCount: 1,
        minCount: 1,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImageLandscape,
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
};

export { GROUPS };
