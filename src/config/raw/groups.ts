import { _GroupsConfig } from '../../model/config/_Config';
import { ConfigKey } from '../../model/config/enum/ConfigKey';
import { GroupConfigType } from '../../model/config/enum/GroupConfigType';
import { BitTagType } from '../../model/enum/BitTagType';
import { Count } from '../../model/enum/Count';
import { ResourceTag } from '../../model/enum/ResourceTag';

const GROUPS: _GroupsConfig = {
  [ConfigKey._group_standardAllBits]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_id,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_externalId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_aiGenerated,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_ageRange,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_language,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_target,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_tag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_icon,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_iconTag,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_colorTag,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_anchor,
      },
    ],
  },
  [ConfigKey._group_standardItemLeadInstructionHint]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_itemLead,
        maxCount: 2,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_instruction,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_hint,
      },
    ],
  },
  [ConfigKey._group_standardExample]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_example,
      },
    ],
  },
  [ConfigKey._group_standardTags]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardAllBits,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardItemLeadInstructionHint,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardExample,
      },
    ],
  },
  [ConfigKey._group_imageSource]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_imageSource,
        chain: [
          {
            type: BitTagType.property,
            configKey: ConfigKey._property_mockupId,
          },
          {
            type: BitTagType.property,
            configKey: ConfigKey._property_size,
          },
          {
            type: BitTagType.property,
            configKey: ConfigKey._property_format,
          },
          {
            type: BitTagType.property,
            configKey: ConfigKey._property_trim,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_partner]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_partner,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceImage,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_gap]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_gap,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            configKey: ConfigKey._tag_gap,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_standardExample,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_trueFalse]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_true,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            configKey: ConfigKey._tag_true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            configKey: ConfigKey._tag_false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_standardExample,
          },
        ],
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_false,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.tag,
            configKey: ConfigKey._tag_true,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.tag,
            configKey: ConfigKey._tag_false,
            maxCount: Count.infinity,
          },
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_standardItemLeadInstructionHint,
          },
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_standardExample,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_markConfig]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_markConfig,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            configKey: ConfigKey._property_color,
          },
          {
            type: BitTagType.property,
            configKey: ConfigKey._property_emphasis,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_mark]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_mark,
        maxCount: Count.infinity,
        chain: [
          {
            type: BitTagType.property,
            configKey: ConfigKey._property_mark,
          },
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_standardExample,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_learningPathCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_action,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_duration,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_date,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_location,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_list,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_textReference,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_isTracked,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_isInfoOnly,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_deeplink,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_book,
        chain: [
          {
            type: BitTagType.tag,
            configKey: ConfigKey._tag_reference,
            maxCount: 2,
          },
        ],
      },
    ],
  },
  //
  // Common resource properties
  //
  [ConfigKey._group_resourceCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_license,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_copyright,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_caption,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_showInIndex,
      },
    ],
  },
  [ConfigKey._group_resourceImageCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceCommon,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_src1x,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_src2x,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_src3x,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_src4x,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_width,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_height,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_alt,
      },
    ],
  },
  [ConfigKey._group_resourceAudioCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceCommon,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_duration,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_mute,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_autoplay,
      },
    ],
  },
  [ConfigKey._group_resourceVideoCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceCommon,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_width,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_height,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_duration,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_mute,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_autoplay,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_allowSubtitles,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_showSubtitles,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_alt,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_posterImage,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_src1x,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_src2x,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_src3x,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_src4x,
      },
    ],
  },
  //
  // Single resources
  //
  [ConfigKey._group_resourceImage]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_image,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceImagePortrait]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_imagePortrait,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceImageLandscape]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_imageLandscape,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceImageEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_imageEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceImageLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_imageLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceAudio]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_audio,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceAudioEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_audioEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceAudioLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_audioLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceVideo]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_video,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceVideoEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_videoEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceVideoLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_videoLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceStillImageFilmEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_stillImageFilmEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceStillImageFilmLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_stillImageFilmLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceArticle]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_article,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceArticleEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_articleEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceArticleLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_articleLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceDocument]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_document,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceDocumentEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_documentEmbed,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceDocumentLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_documentLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceDocumentDownload]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_documentDownload,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceAppLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_appLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey._group_resourceWebsiteLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        type: BitTagType.resource,
        configKey: ConfigKey._resource_websiteLink,
        chain: [
          {
            type: BitTagType.group,
            configKey: ConfigKey._group_resourceCommon,
          },
        ],
      },
    ],
  },
  //
  // Combo resources - these are resources made up of a combination of multiple resources.
  //
  [ConfigKey._group_resourceStillImageFilm]: {
    type: GroupConfigType.comboResource,
    comboResourceType: ResourceTag.stillImageFilm,
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImage,
        maxCount: 1,
        minCount: 1,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceAudio,
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
  [ConfigKey._group_resourceImageResponsive]: {
    type: GroupConfigType.comboResource,
    comboResourceType: ResourceTag.imageResponsive,
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImagePortrait,
        maxCount: 1,
        minCount: 1,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImageLandscape,
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
};

export { GROUPS };
