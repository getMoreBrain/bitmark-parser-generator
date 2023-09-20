import { _BitsConfig } from '../../model/config/_Config';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey';
import { GroupConfigKey } from '../../model/config/enum/GroupConfigKey';
import { PropertyConfigKey } from '../../model/config/enum/PropertyConfigKey';
import { ResourceConfigKey } from '../../model/config/enum/ResourceConfigKey';
import { TagConfigKey } from '../../model/config/enum/TagConfigKey';
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._title,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._flashcardSet,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceAppLink,
        minCount: 1,
      },
    ],
    bodyAllowed: false,
  },
  [RootBitType.article]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._title,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.articleEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceArticleEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.articleLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceArticleLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.audio]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceAudio,
        minCount: 1,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.audioEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceAudioEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.audioLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceAudioLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.bitAlias]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._reference,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._anchor,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.book]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._spaceId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._title,
        maxCount: 2,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._subtype,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._coverImage,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._publisher,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._subject,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._author,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._theme,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.botActionResponse]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._date,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.browserImage]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImage,
        minCount: 1,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._focusX,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._focusY,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.card1]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.chapter]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._anchor,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._title,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.clozeAndMultipleChoiceText]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._gap,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.cloze]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._gap,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.code]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._computerLanguage,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.conversationLeft1]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._partner,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.document]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceDocument,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.documentDownload]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceDocumentDownload,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.documentEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceDocumentEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.documentLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceDocumentLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.essay]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._sampleSolution,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._title,
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
        configKey: GroupConfigKey._standardTags,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImage,
        minCount: 1,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._focusX,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._focusY,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.highlightText]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.image]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImage,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.imageLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImageLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.imageOnDevice]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImage,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._imageSource,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.imageResponsive]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        // Combo resource
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImageResponsive,
      },
    ],

    bodyAllowed: true, // false??
  },
  [RootBitType.internalLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._reference,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.interview]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._learningPathCommon,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.learningPathExternalLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._learningPathCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._externalLink,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._externalLinkText,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.learningPathVideoCall]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._learningPathCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._videoCallLink,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.mark]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._markConfig,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._mark,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.match]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
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
        configKey: GroupConfigKey._standardTags,
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
        configKey: GroupConfigKey._standardTags,
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
        configKey: GroupConfigKey._standardTags,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.multipleChoice]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._trueFalse,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.multipleResponse1]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.multipleResponse]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._trueFalse,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceImage,
        minCount: 1,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.quote]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._quotedPerson,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.rating]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.releaseNote]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._releaseVersion,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sampleSolution]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      // Not sure if these are actually valid here, but include them as they are in the test bit.
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._anchor,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._reference,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sequence]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        // Combo resource
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceStillImageFilm,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceStillImageFilmEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceStillImageFilmLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.surveyAnonymous]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.survey]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.toc]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
    ],

    bodyAllowed: true,
  },

  [RootBitType.trueFalse1]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._labelTrue,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._labelFalse,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._true,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey._false,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._labelTrue,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._labelFalse,
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
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey._padletId,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.video]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceVideo,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },

  [RootBitType.videoEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceVideoEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.videoLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceVideoLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.websiteLink]: {
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey._resourceWebsiteLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
};

export { BITS };
