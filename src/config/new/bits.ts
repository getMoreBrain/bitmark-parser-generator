import { CardConfigKey } from '../../model/config/CardConfigKey';
import { GroupConfigKey } from '../../model/config/GroupConfigKey';
import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { _BitsConfig } from '../../model/config/RawConfig';
import { TagConfigKey } from '../../model/config/TagConfigKey';
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
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._title,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._flashcardSet,
        maxCount: Count.infinity,
      },

      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
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
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAppLink,
      },
    ],

    //resourceType: ResourceType.appLink,
    bodyAllowed: false,
  },
  [RootBitType.article]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._title,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.articleEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceArticleEmbed,
      },
    ],

    //resourceType: ResourceType.articleEmbed,
    bodyAllowed: true,
  },
  [RootBitType.articleLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceArticleLink,
      },
    ],

    //resourceType: ResourceType.articleLink,
    bodyAllowed: true,
  },
  [RootBitType.audio]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAudio,
      },
    ],

    //resourceType: ResourceType.audio,
    bodyAllowed: true,
  },
  [RootBitType.audioEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAudioEmbed,
      },
    ],

    //resourceType: ResourceType.audioEmbed,
    bodyAllowed: true,
  },
  [RootBitType.audioLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAudioLink,
      },
    ],

    //resourceType: ResourceType.audioLink,
    bodyAllowed: true,
  },
  [RootBitType.bitAlias]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._reference,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._anchor,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.book]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._spaceId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._title,
        maxCount: 2,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._subtype,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._coverImage,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._publisher,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._subject,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._author,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._theme,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.botActionResponse]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
    ],
    cardSet: CardConfigKey._botActionResponses,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.botActionSend]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._date,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.browserImage]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImage,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._focusX,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._focusY,
      },
    ],

    //resourceType: ResourceType.image,
    bodyAllowed: true,
  },
  [RootBitType.card1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.chapter]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._anchor,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._title,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.clozeAndMultipleChoiceText]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._gap,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._trueFalse,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.cloze]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._gap,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.code]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._computerLanguage,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.conversationLeft1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._partner,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.document]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceDocument,
      },
    ],

    //resourceType: ResourceType.document,
    bodyAllowed: true,
  },
  [RootBitType.documentDownload]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceDocumentDownload,
      },
    ],

    //resourceType: ResourceType.documentDownload,
    bodyAllowed: true,
  },
  [RootBitType.documentEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceDocumentEmbed,
      },
    ],

    //resourceType: ResourceType.documentEmbed,
    bodyAllowed: true,
  },
  [RootBitType.documentLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceDocumentLink,
      },
    ],

    //resourceType: ResourceType.documentLink,
    bodyAllowed: true,
  },
  [RootBitType.essay]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._sampleSolution,
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
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._title,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
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
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    cardSet: CardConfigKey._flashcards,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.focusImage]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImage,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._focusX,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._focusY,
      },
    ],

    //resourceType: ResourceType.image,
    bodyAllowed: true,
  },
  [RootBitType.highlightText]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.image]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImage,
      },
    ],

    //resourceType: ResourceType.image,
    bodyAllowed: true,
  },
  [RootBitType.imageLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImageLink,
      },
    ],

    //resourceType: ResourceType.imageLink,
    bodyAllowed: true,
  },
  [RootBitType.imageOnDevice]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImage,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._imageSource,
      },
    ],

    //resourceType: ResourceType.image,
    // resourceOptional: true,
    bodyAllowed: true,
  },
  [RootBitType.imageResponsive]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImageResponsive,
      },
    ],

    //resourceType: ResourceType.imageResponsive,
    bodyAllowed: true, // false??
  },
  [RootBitType.internalLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._reference,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.interview]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    cardSet: CardConfigKey._questions,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.learningPathBook]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._learningPathCommon,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.learningPathExternalLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._learningPathCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._externalLink,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._externalLinkText,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.learningPathVideoCall]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._learningPathCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._videoCallLink,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.mark]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._markConfig,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._mark,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.match]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    cardSet: CardConfigKey._matchPairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchMatrix]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    cardSet: CardConfigKey._matchMatrix,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchAudio]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    cardSet: CardConfigKey._matchAudioPairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchPicture]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    cardSet: CardConfigKey._matchImagePairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.multipleChoice1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.multipleChoice]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._trueFalse,
      }, // This is actually for multiple-choice-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardConfigKey._quiz,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.multipleChoiceText]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._trueFalse,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.multipleResponse1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.multipleResponse]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._trueFalse,
      }, // This is actually for multiple-response-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardConfigKey._quiz,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.photo]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceImage,
      },
    ],

    //resourceType: ResourceType.image,
    bodyAllowed: true,
  },
  [RootBitType.quote]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._quotedPerson,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.rating]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.releaseNote]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._releaseVersion,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sampleSolution]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      // Not sure if these are actually valid here, but include them as they are in the test bit.
      {
        type: BitTagType.tag,
        id: TagConfigKey._anchor,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._reference,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sequence]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    cardSet: CardConfigKey._elements,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    rootExampleType: ExampleType.boolean,
  },
  [RootBitType.stillImageFilm]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceStillImageFilm,
      },
    ],

    //resourceType: ResourceType.stillImageFilm,
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceStillImageFilmEmbed,
      },
    ],

    //resourceType: ResourceType.stillImageFilmEmbed,
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceStillImageFilmLink,
      },
    ],

    //resourceType: ResourceType.stillImageFilmLink,
    bodyAllowed: true,
  },
  [RootBitType.surveyAnonymous]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.survey]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.toc]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
    ],

    bodyAllowed: true,
  },

  [RootBitType.trueFalse1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._labelTrue,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._labelFalse,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._true,
      },
      {
        type: BitTagType.tag,
        id: TagConfigKey._false,
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
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceAll,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._labelTrue,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._labelFalse,
      },
    ],
    cardSet: CardConfigKey._statements,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.vendorPadletEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyConfigKey._padletId,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.video]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceVideo,
      },
    ],

    //resourceType: ResourceType.video,
    bodyAllowed: true,
  },

  [RootBitType.videoEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceVideoEmbed,
      },
    ],

    //resourceType: ResourceType.videoEmbed,
    bodyAllowed: true,
  },
  [RootBitType.videoLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceVideoLink,
      },
    ],

    //resourceType: ResourceType.videoLink,
    bodyAllowed: true,
  },
  [RootBitType.websiteLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupConfigKey._standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupConfigKey._resourceWebsiteLink,
      },
    ],

    //resourceType: ResourceType.websiteLink,
    bodyAllowed: true,
  },
};

export { BITS };
