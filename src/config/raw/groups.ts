import { type _GroupsConfig } from '../../model/config/_Config.ts';
import { ConfigKey } from '../../model/config/enum/ConfigKey.ts';
import { GroupConfigType } from '../../model/config/enum/GroupConfigType.ts';
import { Count } from '../../model/enum/Count.ts';
import { TagFormat } from '../../model/enum/TagFormat.ts';

const GROUPS: _GroupsConfig = {
  [ConfigKey.group_standardAllBits]: {
    name: 'Standard',
    description: 'Standard tags which apply to all bits',
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_id,
        description: 'The unique identifier(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_customerId,
        description: 'The customer-specific identifier for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_externalId,
        description: 'The external identifier for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_isTemplate,
        description: 'If true, the bit is a template',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isTemplateStripTheme,
        description: 'If true, the bit is a template strip theme',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_aiGenerated,
        description: 'If true, the bit is AI-generated',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_machineTranslated,
        description: 'If true, the bit is machine-translated',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_searchIndex,
        description: 'The search index(es) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_analyticsTag,
        description: 'The analytics tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_categoryTag,
        description: 'The category tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_topicTag,
        description: 'The topic tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_reportTag,
        description: 'The report tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_altLangTag,
        description: 'The alternative language tag for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_feedbackEngine,
        description: 'The feedback engine for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_feedbackType,
        description: 'The feedback type for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_disableFeedback,
        description: 'If true, feedback is disabled for the bit',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_diffTo,
        description: 'The diff to version for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffOp,
        description: 'The diff operation for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffRef,
        description: 'The diff reference for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffContext,
        description: 'The diff context for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffTime,
        description: 'The diff time for the bit',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_ageRange,
        description: 'The age range for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_lang,
        description: 'The language for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_publisher,
        description: 'The publisher(s) of the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_publisherName,
        description: 'The name of the publisher of the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_theme,
        description: 'The theme(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_target,
        description: 'The target(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_tag,
        description: 'The tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_groupTag,
        description: 'The group tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.property_tag,
            description: 'The tag(s) for the group',
            format: TagFormat.plainText,
            maxCount: Count.infinity,
          },
        ],
      },
      {
        key: ConfigKey.property_reductionTag,
        description: 'The reduction tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_bubbleTag,
        description: 'The bubble tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_levelCEFRp,
        description: 'The CEFRp level for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_levelCEFR,
        description: 'The CEFR level for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_levelILR,
        description: 'The ILR level for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_levelACTFL,
        description: 'The ACTFL level for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_icon,
        description: 'The icon for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_iconTag,
        description: 'The icon tag for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_colorTag,
        description: 'The color tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.tag_anchor,
        name: 'Anchor',
        description: 'The anchor for the bit',
      },
      {
        key: ConfigKey.property_search,
        description: 'The search text for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_showInIndex,
        description: 'If true, the bit is shown in the index',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_layer,
        description: 'The layer(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_layerRole,
        description: 'The layer role(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [ConfigKey.group_standardItemLeadInstructionHint]: {
    type: GroupConfigType.standard,
    description:
      'Standard group for item, lead, page number, margin number, instruction and hint tags',
    tags: [
      {
        key: ConfigKey.tag_item,
        description: 'The item for the bit',
        chain: [
          {
            key: ConfigKey.tag_item,
            description: 'The lead, page number, and margin number for the bit',
            maxCount: 3,
          },
        ],
      },
      {
        key: ConfigKey.tag_instruction,
        name: 'Instruction',
        description: 'The instruction for the bit',
      },
      {
        key: ConfigKey.tag_hint,
        name: 'Hint',
        description: 'The hint for the bit',
      },
    ],
  },
  [ConfigKey.group_standardTags]: {
    type: GroupConfigType.standard,
    description: 'Standard tags which apply to MOST (but not all) bits',
    tags: [
      {
        key: ConfigKey.group_standardAllBits,
        description: 'All standard tags which apply to all bits',
      },
      {
        key: ConfigKey.group_standardItemLeadInstructionHint,
        description: 'Item, lead, page number, margin number, instruction and hint tags',
      },
      {
        key: ConfigKey.property_example,
        description: 'The example(s) for the bit',
        format: TagFormat.plainText,
      },
    ],
  },
  [ConfigKey.group_imageSource]: {
    type: GroupConfigType.standard,
    description: 'Image source chain',
    tags: [
      {
        key: ConfigKey.property_imageSource,
        description: 'The source of an image',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_mockupId,
            description: 'The mockup ID for the image',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_size,
            description: 'The size of the image',
            format: TagFormat.number,
          },
          {
            key: ConfigKey.property_format,
            description: 'The format of the image',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_trim,
            description: 'If true, the image is trimmed',
            format: TagFormat.boolean,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_technicalTerm]: {
    type: GroupConfigType.standard,
    description: 'Technical term chain',
    tags: [
      {
        key: ConfigKey.property_technicalTerm,
        description: 'The technical term',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_lang,
            description: 'The language of the technical term',
            format: TagFormat.plainText,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_person]: {
    type: GroupConfigType.standard,
    description: 'Person chain',
    tags: [
      {
        key: ConfigKey.property_person,
        description: 'A person',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_title,
            description: "The person's title",
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_resourceImage,
            description: 'The image of the person',
          },
        ],
      },
      {
        // Deprecated (parter renamed to person)
        key: ConfigKey.property_partner,
        description: 'A partner',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_title,
            description: "The partner's title",
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_resourceImage,
            description: 'The image of the partner',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_gap]: {
    type: GroupConfigType.standard,
    description: 'Gap chain',
    tags: [
      {
        key: ConfigKey.tag_gap,
        description: 'The value of a gap in the content',
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.tag_gap,
            description: 'Alternative values for the gaps in the content',
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
            description: 'Item, lead, page number, margin number, instruction and hint tags',
          },
          {
            key: ConfigKey.property_example,
            description: 'An example for the gap',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_isCaseSensitive,
            description: 'If true, the gap text is case sensitive',
            format: TagFormat.boolean,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_trueFalse]: {
    type: GroupConfigType.standard,
    description: 'True/False chain',
    tags: [
      {
        key: ConfigKey.tag_true,
        description: 'True value for a true/false statement/question',
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.tag_true,
            description: 'True values for a true/false statement/question',
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.tag_false,
            description: 'False values for a true/false statement/question',
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
            description: 'Item, lead, page number, margin number, instruction and hint tags',
          },
          {
            key: ConfigKey.property_example,
            description: 'An example for the true/false statement/question',
            format: TagFormat.plainText,
          },
        ],
      },
      {
        key: ConfigKey.tag_false,
        description: 'False value for a true/false statement/question',
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.tag_true,
            description: 'True values for a true/false statement/question',
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.tag_false,
            description: 'False values for a true/false statement/question',
            maxCount: Count.infinity,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
            description: 'Item, lead, page number, margin number, instruction and hint tags',
          },
          {
            key: ConfigKey.property_example,
            description: 'An example for the true/false statement/question',
            format: TagFormat.plainText,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_markConfig]: {
    type: GroupConfigType.standard,
    description: 'Mark configuration chain',
    tags: [
      {
        key: ConfigKey.property_mark,
        description: 'The mark configuration',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.property_color,
            description: 'The color of the mark',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_emphasis,
            description: 'The emphasis of the mark',
            format: TagFormat.plainText,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_mark]: {
    type: GroupConfigType.standard,
    description: 'Mark chain',
    tags: [
      {
        key: ConfigKey.tag_mark,
        description: 'The marked content',
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.property_mark,
            description: 'The mark configuration',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_example,
            description: 'An example for the marked content',
            format: TagFormat.plainText,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_bookCommon]: {
    type: GroupConfigType.standard,
    description: 'Common book tags',
    tags: [
      {
        key: ConfigKey.property_language,
        description: 'The language of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_customerExternalId,
        description: 'The customer-specific external identifier for the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_spaceId,
        description: 'The space ID for the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_kind,
        description: 'The kind of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_hasMarkAsDone,
        description: 'If true, the book has a "Mark as done" feature',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_processHandIn,
        description: 'If true, the book will be processed when upon hand-in',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_processHandInLocation,
        description: 'The location where the book was handed-in',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_isPublic,
        description: 'If true, the book is public',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isTemplate,
        description: 'If true, the book is a template',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isTemplateStripTheme,
        description: 'If true, the book is a template strip theme',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_chatWithBook,
        description: 'If true, the user can chat about the book with an AI assistant',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_chatWithBookBrainKey,
        description: 'The BookBrain key for the book chat',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.tag_title,
        name: 'Title',
        description: 'The title of the book',
        maxCount: 2,
      },
      {
        key: ConfigKey.property_subtype,
        description: 'The subtype of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_coverImage,
        description: 'The cover image(s) of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_coverColor,
        description: 'The cover color of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_subject,
        description: 'The subject(s) of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_author,
        description: 'The author(s) of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_publications,
        description: 'The publication(s) of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_duration,
        description: 'The duration of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_maxTocChapterLevel,
        description: 'The maximum table of contents chapter level',
        format: TagFormat.number,
      },
    ],
  },
  [ConfigKey.group_learningPathCommon]: {
    type: GroupConfigType.standard,
    description: 'Common learning path tags',
    tags: [
      {
        key: ConfigKey.property_action,
        description: 'The action for the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_duration,
        description: 'The duration of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_date,
        description: 'The date of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_dateEnd,
        description: 'The end date of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_location,
        description: 'The location of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_list,
        description: 'The list of items in the learning path',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_textReference,
        description: 'The text reference for the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_isTracked,
        description: 'If true, the learning path is tracked',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_isInfoOnly,
        description: 'If true, the learning path is info only',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_deeplink,
        description: 'The deeplink(s) for the learning path',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'The caption for the button of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_book,
        description: 'The book(s) associated with the learning path',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.tag_reference,
            description: 'The reference(s) for the book(s) in the learning path',
            maxCount: 2,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_quizCommon]: {
    type: GroupConfigType.standard,
    description: 'Common quiz tags',
    tags: [
      {
        key: ConfigKey.property_revealSolutions,
        description: 'If true, the quiz solutions are revealed',
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
    description: 'Resource bit tags',
    tags: [
      {
        key: ConfigKey.resource_imagePlaceholder,
        description: 'Placeholder image for the resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the placeholder image',
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
    description: 'Common resource properties',
    tags: [
      {
        key: ConfigKey.property_license,
        description: 'The license for the resource',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_copyright,
        description: 'The copyright information for the resource',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_caption,
        description: 'The caption for the resource',
        format: TagFormat.bitmarkText,
      },
      {
        key: ConfigKey.property_showInIndex,
        description: 'If true, the resource is shown in the index',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_search,
        description: 'The search text for the resource',
        format: TagFormat.plainText,
      },
    ],
  },
  [ConfigKey.group_resourceImageCommon]: {
    type: GroupConfigType.standard,
    description: 'Common properties for image resources',
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
        description: 'Common resource properties',
      },
      {
        key: ConfigKey.property_src1x,
        description: 'The source URL for the image at 1x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src2x,
        description: 'The source URL for the image at 2x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src3x,
        description: 'The source URL for the image at 3x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src4x,
        description: 'The source URL for the image at 4x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_width,
        description: 'The width of the image',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height,
        description: 'The height of the image',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_alt,
        description: 'The alternative text for the image',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_zoomDisabled,
        description: 'If true, zooming is disabled for the image',
        format: TagFormat.boolean,
      },
    ],
  },
  [ConfigKey.group_resourceAudioCommon]: {
    type: GroupConfigType.standard,
    description: 'Common properties for audio resources',
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
        description: 'Common resource properties',
      },
      {
        key: ConfigKey.property_duration,
        description: 'The duration of the audio resource',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_mute,
        description: 'If true, the audio is muted',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_autoplay,
        description: 'If true, the audio plays automatically',
        format: TagFormat.boolean,
      },
    ],
  },
  [ConfigKey.group_resourceVideoCommon]: {
    type: GroupConfigType.standard,
    description: 'Common properties for video resources',
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
        description: 'Common resource properties',
      },
      {
        key: ConfigKey.property_width,
        description: 'The width of the video',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height,
        description: 'The height of the video',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_duration,
        description: 'The duration of the video',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_mute,
        description: 'If true, the video is muted',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_autoplay,
        description: 'If true, the video plays automatically',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_allowSubtitles,
        description: 'If true, subtitles are allowed for the video',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_showSubtitles,
        description: 'If true, subtitles are shown in the video',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_alt,
        description: 'The alternative text for the video',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_posterImage,
        description: 'The poster image for the video',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the poster image',
          },
        ],
      },
      {
        key: ConfigKey.property_src1x,
        description: 'The source URL for the video at 1x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src2x,
        description: 'The source URL for the video at 2x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src3x,
        description: 'The source URL for the video at 3x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src4x,
        description: 'The source URL for the video at 4x resolution',
        format: TagFormat.plainText,
      },
    ],
  },
  //
  // Single resources
  //
  [ConfigKey.group_resourceIcon]: {
    type: GroupConfigType.standard,
    description: 'Common properties for icon resources',
    tags: [
      {
        key: ConfigKey.resource_icon,
        description: 'The icon resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the icon resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImage]: {
    type: GroupConfigType.resource,
    description: 'Common properties for image resources',
    tags: [
      {
        key: ConfigKey.resource_image,
        description: 'The image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImagePortrait]: {
    type: GroupConfigType.resource,
    description: 'Portrait image resource',
    tags: [
      {
        key: ConfigKey.resource_imagePortrait,
        description: 'The portrait image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the portrait image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageLandscape]: {
    type: GroupConfigType.resource,
    description: 'Landscape image resource',
    tags: [
      {
        key: ConfigKey.resource_imageLandscape,
        description: 'The landscape image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the landscape image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded image resource',
    tags: [
      {
        key: ConfigKey.resource_imageEmbed,
        description: 'The embedded image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the embedded image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageLink]: {
    type: GroupConfigType.resource,
    description: 'Link to an image resource',
    tags: [
      {
        key: ConfigKey.resource_imageLink,
        description: 'The link to the image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the linked image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAudio]: {
    type: GroupConfigType.resource,
    description: 'Audio resource',
    tags: [
      {
        key: ConfigKey.resource_audio,
        description: 'The audio resource',
        chain: [
          {
            key: ConfigKey.group_resourceAudioCommon,
            description: 'Common audio properties for the audio resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAudioEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded audio resource',
    tags: [
      {
        key: ConfigKey.resource_audioEmbed,
        description: 'The embedded audio resource',
        chain: [
          {
            key: ConfigKey.group_resourceAudioCommon,
            description: 'Common audio properties for the embedded audio resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAudioLink]: {
    type: GroupConfigType.resource,
    description: 'Link to an audio resource',
    tags: [
      {
        key: ConfigKey.resource_audioLink,
        description: 'The link to the audio resource',
        chain: [
          {
            key: ConfigKey.group_resourceAudioCommon,
            description: 'Common audio properties for the linked audio resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceVideo]: {
    type: GroupConfigType.resource,
    description: 'Video resource',
    tags: [
      {
        key: ConfigKey.resource_video,
        description: 'The video resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the video resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceVideoEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded video resource',
    tags: [
      {
        key: ConfigKey.resource_videoEmbed,
        description: 'The embedded video resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the embedded video resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceVideoLink]: {
    type: GroupConfigType.resource,
    description: 'Link to a video resource',
    tags: [
      {
        key: ConfigKey.resource_videoLink,
        description: 'The link to the video resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the linked video resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceStillImageFilmEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded still image film resource',
    tags: [
      {
        key: ConfigKey.resource_stillImageFilmEmbed,
        description: 'The embedded still image film resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the embedded still image film resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceStillImageFilmLink]: {
    type: GroupConfigType.resource,
    description: 'Link to a still image film resource',
    tags: [
      {
        key: ConfigKey.resource_stillImageFilmLink,
        description: 'The link to the still image film resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the linked still image film resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceArticle]: {
    type: GroupConfigType.resource,
    description: 'Article resource',
    tags: [
      {
        key: ConfigKey.resource_article,
        description: 'The article resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the article resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceArticleEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded article resource',
    tags: [
      {
        key: ConfigKey.resource_articleEmbed,
        description: 'The embedded article resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the embedded article resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceArticleLink]: {
    type: GroupConfigType.resource,
    description: 'Link to an article resource',
    tags: [
      {
        key: ConfigKey.resource_articleLink,
        description: 'The link to the article resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the linked article resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocument]: {
    type: GroupConfigType.resource,
    description: 'Document resource',
    tags: [
      {
        key: ConfigKey.resource_document,
        description: 'The document resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the document resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocumentEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded document resource',
    tags: [
      {
        key: ConfigKey.resource_documentEmbed,
        description: 'The embedded document resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the embedded document resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocumentLink]: {
    type: GroupConfigType.resource,
    description: 'Link to a document resource',
    tags: [
      {
        key: ConfigKey.resource_documentLink,
        description: 'The link to the document resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the linked document resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocumentDownload]: {
    type: GroupConfigType.resource,
    description: 'Downloadable document resource',
    tags: [
      {
        key: ConfigKey.resource_documentDownload,
        description: 'The downloadable document resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the downloadable document resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAppLink]: {
    type: GroupConfigType.resource,
    description: 'Link to an app resource',
    tags: [
      {
        key: ConfigKey.resource_appLink,
        description: 'The link to the app resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the linked app resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceWebsiteLink]: {
    type: GroupConfigType.resource,
    description: 'Link to a website resource',
    tags: [
      {
        key: ConfigKey.resource_websiteLink,
        description: 'The link to the website resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the linked website resource',
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
    description: 'Resource for still image film',
    comboResourceConfigKey: ConfigKey.resource_stillImageFilm,
    tags: [
      {
        key: ConfigKey.group_resourceImage,
        description: 'The image resource for the still image film',
        maxCount: 1,
        minCount: 1,
      },
      {
        key: ConfigKey.group_resourceAudio,
        description: 'The audio resource for the still image film',
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
  [ConfigKey.group_resourceImageResponsive]: {
    type: GroupConfigType.comboResource,
    description: 'Responsive image resource',
    comboResourceConfigKey: ConfigKey.resource_imageResponsive,
    tags: [
      {
        key: ConfigKey.group_resourceImagePortrait,
        description: 'The portrait image resource',
        maxCount: 1,
        minCount: 1,
      },
      {
        key: ConfigKey.group_resourceImageLandscape,
        description: 'The landscape image resource',
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
};

export { GROUPS };
