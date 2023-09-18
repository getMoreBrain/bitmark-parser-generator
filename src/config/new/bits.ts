import { CardKey } from '../../model/config/CardKey';
import { GroupKey } from '../../model/config/GroupKey';
import { BitsConfig } from '../../model/config/NewConfig';
import { TagKey } from '../../model/config/TagKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { RootBitType } from '../../model/enum/BitType';
import { Count } from '../../model/enum/Count';
import { ExampleType } from '../../model/enum/ExampleType';
import { PropertyKey } from '../../model/enum/PropertyKey';

const BITS: BitsConfig = {
  [RootBitType._error]: {
    tags: [],
    bodyAllowed: true,
  },

  [RootBitType.appFlashcards]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagKey.title,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.flashcardSet,
        maxCount: Count.infinity,
      },

      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
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
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAppLink,
      },
    ],

    //resourceType: ResourceType.appLink,
    bodyAllowed: false,
  },
  [RootBitType.article]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagKey.title,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.articleEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceArticleEmbed,
      },
    ],

    //resourceType: ResourceType.articleEmbed,
    bodyAllowed: true,
  },
  [RootBitType.articleLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceArticleLink,
      },
    ],

    //resourceType: ResourceType.articleLink,
    bodyAllowed: true,
  },
  [RootBitType.audio]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAudio,
      },
    ],

    //resourceType: ResourceType.audio,
    bodyAllowed: true,
  },
  [RootBitType.audioEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAudioEmbed,
      },
    ],

    //resourceType: ResourceType.audioEmbed,
    bodyAllowed: true,
  },
  [RootBitType.audioLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAudioLink,
      },
    ],

    //resourceType: ResourceType.audioLink,
    bodyAllowed: true,
  },
  [RootBitType.bitAlias]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagKey.reference,
      },
      {
        type: BitTagType.tag,
        id: TagKey.anchor,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.book]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.spaceId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        id: TagKey.title,
        maxCount: 2,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.subtype,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.coverImage,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.publisher,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.subject,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.author,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.theme,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.botActionResponse]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
    ],
    cardSet: CardKey.botActionResponses,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.botActionSend]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.date,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.browserImage]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImage,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.focusX,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.focusY,
      },
    ],

    //resourceType: ResourceType.image,
    bodyAllowed: true,
  },
  [RootBitType.card1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.chapter]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagKey.anchor,
      },
      {
        type: BitTagType.tag,
        id: TagKey.title,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.clozeAndMultipleChoiceText]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.gap,
      },
      {
        type: BitTagType.group,
        id: GroupKey.trueFalse,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.cloze]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.gap,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.code]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.computerLanguage,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.conversationLeft1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.partner,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.document]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceDocument,
      },
    ],

    //resourceType: ResourceType.document,
    bodyAllowed: true,
  },
  [RootBitType.documentDownload]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceDocumentDownload,
      },
    ],

    //resourceType: ResourceType.documentDownload,
    bodyAllowed: true,
  },
  [RootBitType.documentEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceDocumentEmbed,
      },
    ],

    //resourceType: ResourceType.documentEmbed,
    bodyAllowed: true,
  },
  [RootBitType.documentLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceDocumentLink,
      },
    ],

    //resourceType: ResourceType.documentLink,
    bodyAllowed: true,
  },
  [RootBitType.essay]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.sampleSolution,
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
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagKey.title,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
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
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    cardSet: CardKey.flashcards,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.focusImage]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImage,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.focusX,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.focusY,
      },
    ],

    //resourceType: ResourceType.image,
    bodyAllowed: true,
  },
  [RootBitType.highlightText]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupKey.trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.image]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImage,
      },
    ],

    //resourceType: ResourceType.image,
    bodyAllowed: true,
  },
  [RootBitType.imageLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImageLink,
      },
    ],

    //resourceType: ResourceType.imageLink,
    bodyAllowed: true,
  },
  [RootBitType.imageOnDevice]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImage,
      },
      {
        type: BitTagType.group,
        id: GroupKey.imageSource,
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
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImageResponsive,
      },
    ],

    //resourceType: ResourceType.imageResponsive,
    bodyAllowed: true, // false??
  },
  [RootBitType.internalLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.tag,
        id: TagKey.reference,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.interview]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    cardSet: CardKey.questions,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.learningPathBook]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupKey.learningPathCommon,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.learningPathExternalLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupKey.learningPathCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.externalLink,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.externalLinkText,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.learningPathVideoCall]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupKey.learningPathCommon,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.videoCallLink,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.mark]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupKey.markConfig,
      },
      {
        type: BitTagType.group,
        id: GroupKey.mark,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.match]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    cardSet: CardKey.matchPairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchMatrix]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    cardSet: CardKey.matchMatrix,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchAudio]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    cardSet: CardKey.matchAudioPairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchPicture]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    cardSet: CardKey.matchImagePairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.multipleChoice1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupKey.trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.multipleChoice]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupKey.trueFalse,
      }, // This is actually for multiple-choice-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardKey.quiz,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.multipleChoiceText]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.trueFalse,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.multipleResponse1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupKey.trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.multipleResponse]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.group,
        id: GroupKey.trueFalse,
      }, // This is actually for multiple-response-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardKey.quiz,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.photo]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceImage,
      },
    ],

    //resourceType: ResourceType.image,
    bodyAllowed: true,
  },
  [RootBitType.quote]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.quotedPerson,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.rating]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.releaseNote]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.releaseVersion,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sampleSolution]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      // Not sure if these are actually valid here, but include them as they are in the test bit.
      {
        type: BitTagType.tag,
        id: TagKey.anchor,
      },
      {
        type: BitTagType.tag,
        id: TagKey.reference,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sequence]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    cardSet: CardKey.elements,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    rootExampleType: ExampleType.boolean,
  },
  [RootBitType.stillImageFilm]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceStillImageFilm,
      },
    ],

    //resourceType: ResourceType.stillImageFilm,
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceStillImageFilmEmbed,
      },
    ],

    //resourceType: ResourceType.stillImageFilmEmbed,
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceStillImageFilmLink,
      },
    ],

    //resourceType: ResourceType.stillImageFilmLink,
    bodyAllowed: true,
  },
  [RootBitType.surveyAnonymous]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.survey]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.toc]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
    ],

    bodyAllowed: true,
  },

  [RootBitType.trueFalse1]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.labelTrue,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.labelFalse,
      },
      {
        type: BitTagType.tag,
        id: TagKey.true,
      },
      {
        type: BitTagType.tag,
        id: TagKey.false,
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
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceAll,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.labelTrue,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.labelFalse,
      },
    ],
    cardSet: CardKey.statements,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.vendorPadletEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.property,
        id: PropertyKey.padletId,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.video]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceVideo,
      },
    ],

    //resourceType: ResourceType.video,
    bodyAllowed: true,
  },

  [RootBitType.videoEmbed]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceVideoEmbed,
      },
    ],

    //resourceType: ResourceType.videoEmbed,
    bodyAllowed: true,
  },
  [RootBitType.videoLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceVideoLink,
      },
    ],

    //resourceType: ResourceType.videoLink,
    bodyAllowed: true,
  },
  [RootBitType.websiteLink]: {
    tags: [
      {
        type: BitTagType.group,
        id: GroupKey.standardTags,
      },
      {
        type: BitTagType.group,
        id: GroupKey.resourceWebsiteLink,
      },
    ],

    //resourceType: ResourceType.websiteLink,
    bodyAllowed: true,
  },
};

export { BITS };
