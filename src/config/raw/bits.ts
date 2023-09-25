import { _BitsConfig } from '../../model/config/_Config';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey';
import { ConfigKey } from '../../model/config/enum/ConfigKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { RootBitType } from '../../model/enum/BitType';
import { Count } from '../../model/enum/Count';
import { ExampleType } from '../../model/enum/ExampleType';

const BITS: _BitsConfig = {
  [RootBitType._error]: {
    tags: [],
    bodyAllowed: true,
  },

  [RootBitType.appFlashcards]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_title,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_flashcardSet,
        maxCount: Count.infinity,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    rootExampleType: ExampleType.string,
  },

  [RootBitType.appLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceAppLink,
        minCount: 1,
      },
    ],
    bodyAllowed: false,
  },
  [RootBitType.article]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_title,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.articleEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceArticleEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.articleLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceArticleLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.audio]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceAudio,
        minCount: 1,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.audioEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceAudioEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.audioLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceAudioLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.bitAlias]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_reference,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_anchor,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.book]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_spaceId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_title,
        maxCount: 2,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_subtype,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_coverImage,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_publisher,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_subject,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_author,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_theme,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.botActionResponse]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._botActionResponses,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.botActionSend]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_date,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.browserImage]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImage,
        minCount: 1,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_focusX,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_focusY,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.card1]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.chapter]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_anchor,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_title,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.clozeAndMultipleChoiceText]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_gap,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.cloze]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_gap,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.code]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_computerLanguage,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.conversationLeft1]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_partner,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.document]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceDocument,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.documentDownload]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceDocumentDownload,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.documentEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceDocumentEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.documentLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceDocumentLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.essay]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_sampleSolution,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    rootExampleType: ExampleType.string,
  },
  [RootBitType.example]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_title,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    rootExampleType: ExampleType.string,
  },
  [RootBitType.flashcard]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._flashcards,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.focusImage]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImage,
        minCount: 1,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_focusX,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_focusY,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.highlightText]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.image]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImage,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.imageLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImageLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.imageOnDevice]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImage,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_imageSource,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.imageResponsive]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        // Combo resource
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImageResponsive,
      },
    ],

    bodyAllowed: true, // false??
  },
  [RootBitType.internalLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_reference,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.interview]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._questions,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.learningPathBook]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_learningPathCommon,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.learningPathExternalLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_learningPathCommon,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_externalLink,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_externalLinkText,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.learningPathVideoCall]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_learningPathCommon,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_videoCallLink,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.mark]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_markConfig,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_mark,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.match]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._matchPairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchMatrix]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._matchMatrix,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchAudio]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._matchAudioPairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchPicture]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._matchImagePairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.multipleChoice1]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.multipleChoice]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_trueFalse,
      }, // This is actually for multiple-choice-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardSetConfigKey._quiz,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.multipleChoiceText]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.multipleResponse1]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.multipleResponse]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_trueFalse,
      }, // This is actually for multiple-response-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardSetConfigKey._quiz,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.photo]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceImage,
        minCount: 1,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.quote]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_quotedPerson,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.rating]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.releaseNote]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_releaseVersion,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sampleSolution]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      // Not sure if these are actually valid here, but include them as they are in the test bit.
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_anchor,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_reference,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sequence]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._elements,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    rootExampleType: ExampleType.boolean,
  },
  [RootBitType.stillImageFilm]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        // Combo resource
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceStillImageFilm,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceStillImageFilmEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceStillImageFilmLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.surveyAnonymous]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.survey]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.toc]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
    ],

    bodyAllowed: true,
  },

  [RootBitType.trueFalse1]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_labelTrue,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_labelFalse,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_true,
      },
      {
        type: BitTagType.tag,
        configKey: ConfigKey._tag_false,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: false,
    rootExampleType: ExampleType.boolean,
  },

  [RootBitType.trueFalse]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_labelTrue,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_labelFalse,
      },
    ],
    cardSet: CardSetConfigKey._statements,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.vendorPadletEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: ConfigKey._property_padletId,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.video]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceVideo,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },

  [RootBitType.videoEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceVideoEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.videoLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceVideoLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.websiteLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: ConfigKey._group_resourceWebsiteLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
};

export { BITS };
