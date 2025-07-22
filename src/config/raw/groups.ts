import { type _GroupsConfig } from '../../model/config/_Config.ts';
import { ConfigKey } from '../../model/config/enum/ConfigKey.ts';
import { GroupConfigType } from '../../model/config/enum/GroupConfigType.ts';
import { Count } from '../../model/enum/Count.ts';
import { TagFormat } from '../../model/enum/TagFormat.ts';

const GROUPS: _GroupsConfig = {
  [ConfigKey.group_standardAllBits]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_id,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_customerId,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_externalId,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_isTemplate,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isTemplateStripTheme,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_aiGenerated,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_machineTranslated,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_searchIndex,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_analyticsTag,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_categoryTag,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_topicTag,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_altLangTag,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_feedbackEngine,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_feedbackType,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_disableFeedback,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_diffTo,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffOp,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffRef,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffContext,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffTime,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_ageRange,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_lang,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_publisher,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_publisherName,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_theme,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_target,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_tag,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_reductionTag,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_bubbleTag,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_levelCEFRp,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_levelCEFR,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_levelILR,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_levelACTFL,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_icon,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_iconTag,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_colorTag,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.tag_anchor,
      },
      {
        key: ConfigKey.property_search,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_showInIndex,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_layer,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_layerRole,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [ConfigKey.group_standardItemLeadInstructionHint]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.tag_item,
        chain: [
          {
            key: ConfigKey.tag_item,
            maxCount: 3,
          },
        ],
      },
      {
        key: ConfigKey.tag_instruction,
      },
      {
        key: ConfigKey.tag_hint,
      },
    ],
  },
  [ConfigKey.group_standardExample]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_example,
        format: TagFormat.plainText,
      },
    ],
  },
  [ConfigKey.group_standardTags]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.group_standardAllBits,
      },
      {
        key: ConfigKey.group_standardItemLeadInstructionHint,
      },
      {
        key: ConfigKey.group_standardExample,
      },
    ],
  },
  [ConfigKey.group_imageSource]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_imageSource,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_mockupId,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_size,
            format: TagFormat.number,
          },
          {
            key: ConfigKey.property_format,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_trim,
            format: TagFormat.boolean,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_technicalTerm]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_technicalTerm,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_lang,
            format: TagFormat.plainText,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_person]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_person,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_title,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_resourceImage,
          },
        ],
      },
      {
        // Deprecated (parter renamed to person)
        key: ConfigKey.property_partner,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_title,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_resourceImage,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_gap]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.tag_gap,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.tag_gap,
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
          },
          {
            key: ConfigKey.group_standardExample,
          },
          {
            key: ConfigKey.property_isCaseSensitive,
            format: TagFormat.boolean,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_trueFalse]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.tag_true,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.tag_true,
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.tag_false,
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
          },
          {
            key: ConfigKey.group_standardExample,
          },
        ],
      },
      {
        key: ConfigKey.tag_false,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.tag_true,
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.tag_false,
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
          },
          {
            key: ConfigKey.group_standardExample,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_markConfig]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_mark,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.property_color,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_emphasis,
            format: TagFormat.plainText,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_mark]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.tag_mark,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.property_mark,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_standardExample,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_bookCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_language,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_customerExternalId,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_spaceId,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_kind,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_hasMarkAsDone,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_processHandIn,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_processHandInLocation,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_isPublic,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isTemplate,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isTemplateStripTheme,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_chatWithBook,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_chatWithBookBrainKey,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.tag_title,
        maxCount: 2,
      },
      {
        key: ConfigKey.property_subtype,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_coverImage,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_coverColor,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_subject,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_author,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_publications,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_duration,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_maxTocChapterLevel,
        format: TagFormat.number,
      },
    ],
  },
  [ConfigKey.group_learningPathCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_action,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_duration,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_date,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_dateEnd,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_location,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_list,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_textReference,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_isTracked,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_isInfoOnly,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_deeplink,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_book,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.tag_reference,
            maxCount: 2,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_quizCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_revealSolutions,
        format: TagFormat.boolean,
        // defaultValue: 'false',
      },
    ],
  },
  //
  // Resource groups
  //
  [ConfigKey.group_resourceBitTags]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.resource_imagePlaceholder,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
          },
        ],
        maxCount: 1,
      },
    ],
  },
  //
  // Common resource properties
  //
  [ConfigKey.group_resourceCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_license,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_copyright,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_caption,
        format: TagFormat.bitmarkText,
      },
      {
        key: ConfigKey.property_showInIndex,
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_search,
        format: TagFormat.plainText,
      },
    ],
  },
  [ConfigKey.group_resourceImageCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
      },
      {
        key: ConfigKey.property_src1x,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src2x,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src3x,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src4x,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_width,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_alt,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_zoomDisabled,
        format: TagFormat.boolean,
      },
    ],
  },
  [ConfigKey.group_resourceAudioCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
      },
      {
        key: ConfigKey.property_duration,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_mute,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_autoplay,
        format: TagFormat.boolean,
      },
    ],
  },
  [ConfigKey.group_resourceVideoCommon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
      },
      {
        key: ConfigKey.property_width,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_duration,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_mute,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_autoplay,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_allowSubtitles,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_showSubtitles,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_alt,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_posterImage,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
          },
        ],
      },
      {
        key: ConfigKey.property_src1x,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src2x,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src3x,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src4x,
        format: TagFormat.plainText,
      },
    ],
  },
  //
  // Single resources
  //
  [ConfigKey.group_resourceIcon]: {
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.resource_icon,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImage]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_image,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImagePortrait]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_imagePortrait,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageLandscape]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_imageLandscape,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_imageEmbed,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_imageLink,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAudio]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_audio,
        chain: [
          {
            key: ConfigKey.group_resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAudioEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_audioEmbed,
        chain: [
          {
            key: ConfigKey.group_resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAudioLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_audioLink,
        chain: [
          {
            key: ConfigKey.group_resourceAudioCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceVideo]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_video,
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceVideoEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_videoEmbed,
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceVideoLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_videoLink,
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceStillImageFilmEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_stillImageFilmEmbed,
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceStillImageFilmLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_stillImageFilmLink,
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceArticle]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_article,
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceArticleEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_articleEmbed,
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceArticleLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_articleLink,
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocument]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_document,
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocumentEmbed]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_documentEmbed,
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocumentLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_documentLink,
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocumentDownload]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_documentDownload,
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAppLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_appLink,
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceWebsiteLink]: {
    type: GroupConfigType.resource,
    tags: [
      {
        key: ConfigKey.resource_websiteLink,
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
          },
        ],
      },
    ],
  },
  //
  // Combo resources - these are resources made up of a combination of multiple resources.
  //
  [ConfigKey.group_resourceStillImageFilm]: {
    type: GroupConfigType.comboResource,
    comboResourceConfigKey: ConfigKey.resource_stillImageFilm,
    tags: [
      {
        key: ConfigKey.group_resourceImage,
        maxCount: 1,
        minCount: 1,
      },
      {
        key: ConfigKey.group_resourceAudio,
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
  [ConfigKey.group_resourceImageResponsive]: {
    type: GroupConfigType.comboResource,
    comboResourceConfigKey: ConfigKey.resource_imageResponsive,
    tags: [
      {
        key: ConfigKey.group_resourceImagePortrait,
        maxCount: 1,
        minCount: 1,
      },
      {
        key: ConfigKey.group_resourceImageLandscape,
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
};

export { GROUPS };
