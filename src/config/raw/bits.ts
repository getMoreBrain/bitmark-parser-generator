import { _BitsConfig } from '../../model/config/_Config';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey';
import { GroupConfigKey } from '../../model/config/enum/GroupConfigKey';
import { PropertyConfigKey } from '../../model/config/enum/PropertyConfigKey';
import { TagConfigKey } from '../../model/config/enum/TagConfigKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { AliasBitType, RootBitType } from '../../model/enum/BitType';
import { Count } from '../../model/enum/Count';
import { ExampleType } from '../../model/enum/ExampleType';

const BITS: _BitsConfig = {
  [RootBitType._error]: {
    since: '1.3.0',
    tags: [],
    bodyAllowed: true,
    aliases: {},
  },

  [RootBitType.appFlashcards]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.title,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.flashcardSet,
        maxCount: Count.infinity,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    rootExampleType: ExampleType.string,
    aliases: {
      [AliasBitType.appFlashcardsQuiz]: { since: '1.3.0' },
      [AliasBitType.appFlashcardsLearn]: { since: '1.3.0' },
    },
  },
  [RootBitType.appLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceAppLink,
        minCount: 1,
      },
    ],
    bodyAllowed: false,
  },
  [RootBitType.article]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.title,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    aliases: {
      [AliasBitType.page]: { since: '1.3.0' },
      [AliasBitType.statement]: { since: '1.3.0' },
      [AliasBitType.buttonCopyText]: { since: '1.4.3' },
    },
  },
  [RootBitType.articleEmbed]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceArticleEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.articleLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceArticleLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.audio]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceAudio,
        minCount: 1,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.audioEmbed]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceAudioEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.audioLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceAudioLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.bitAlias]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.tag_reference,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.anchor,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.book]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.spaceId,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.title,
        maxCount: 2,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.subtype,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.coverImage,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.publisher,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.subject,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.author,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.theme,
      },
    ],
    bodyAllowed: true,
    aliases: {
      [AliasBitType.bookAcknowledgments]: { since: '1.3.0' },
      [AliasBitType.bookAddendum]: { since: '1.3.0' },
      [AliasBitType.bookAfterword]: { since: '1.3.0' },
      [AliasBitType.bookAppendix]: { since: '1.3.0' },
      [AliasBitType.bookArticle]: { since: '1.3.0' },
      [AliasBitType.bookAutherBio]: { since: '1.3.0' },
      [AliasBitType.bookBibliography]: { since: '1.3.0' },
      [AliasBitType.bookComingSoon]: { since: '1.3.0' },
      [AliasBitType.bookConclusion]: { since: '1.3.0' },
      [AliasBitType.bookCopyright]: { since: '1.3.0' },
      [AliasBitType.bookCopyrightPermissions]: { since: '1.3.0' },
      [AliasBitType.bookDedication]: { since: '1.3.0' },
      [AliasBitType.bookEndnotes]: { since: '1.3.0' },
      [AliasBitType.bookEpigraph]: { since: '1.3.0' },
      [AliasBitType.bookEpilogue]: { since: '1.3.0' },
      [AliasBitType.bookForword]: { since: '1.3.0' },
      [AliasBitType.bookFrontispiece]: { since: '1.3.0' },
      [AliasBitType.bookImprint]: { since: '1.3.0' },
      [AliasBitType.bookIncitingIncident]: { since: '1.3.0' },
      [AliasBitType.bookIntroduction]: { since: '1.3.0' },
      [AliasBitType.bookListOfContributors]: { since: '1.3.0' },
      [AliasBitType.bookNotes]: { since: '1.3.0' },
      [AliasBitType.bookPostscript]: { since: '1.3.0' },
      [AliasBitType.bookPreface]: { since: '1.3.0' },
      [AliasBitType.bookPrologue]: { since: '1.3.0' },
      [AliasBitType.bookReadMore]: { since: '1.3.0' },
      [AliasBitType.bookReferenceList]: { since: '1.3.0' },
      [AliasBitType.bookRequestForABookReview]: { since: '1.3.0' },
      [AliasBitType.bookSummary]: { since: '1.3.0' },
      [AliasBitType.bookTeaser]: { since: '1.3.0' },
      [AliasBitType.bookTitle]: { since: '1.3.0' },
    },
  },
  [RootBitType.botActionResponse]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._botActionResponses,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.botActionSend]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.date,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.browserImage]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImage,
        minCount: 1,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.focusX,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.focusY,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.card1]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    aliases: {
      [AliasBitType.question1]: { since: '1.3.0' },
      [AliasBitType.survey1]: { since: '1.3.0' },
      [AliasBitType.surveyAnonymous1]: { since: '1.3.0' },
    },
  },
  [RootBitType.chapter]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.anchor,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.title,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.clozeAndMultipleChoiceText]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_gap,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    aliases: {
      [AliasBitType.coachCallToActionClozeAndMultipleChoiceText]: { since: '1.3.0' },
    },
  },
  [RootBitType.cloze]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_gap,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    aliases: {
      [AliasBitType.clozeInstructionGrouped]: { since: '1.3.0' },
      [AliasBitType.clozeSolutionGrouped]: { since: '1.3.0' },
      [AliasBitType.coachSelfReflectionCloze]: { since: '1.3.0' },
      [AliasBitType.coachCallToActionCloze]: { since: '1.3.0' },
    },
  },
  [RootBitType.code]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.computerLanguage,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.conversationLeft1]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_partner,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    aliases: {
      [AliasBitType.conversationLeft1Scream]: { since: '1.3.0' },
      [AliasBitType.conversationLeft1Thought]: { since: '1.3.0' },
      [AliasBitType.conversationRight1]: { since: '1.3.0' },
      [AliasBitType.conversationRight1Scream]: { since: '1.3.0' },
      [AliasBitType.conversationRight1Thought]: { since: '1.3.0' },
    },
  },
  [RootBitType.document]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceDocument,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.documentDownload]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceDocumentDownload,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.documentEmbed]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceDocumentEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.documentLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceDocumentLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.essay]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.property_sampleSolution,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    rootExampleType: ExampleType.string,
    aliases: {
      [AliasBitType.coachSelfReflectionEssay]: { since: '1.3.0' },
      [AliasBitType.coachCallToActionEssay]: { since: '1.3.0' },
    },
  },
  [RootBitType.example]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.title,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    rootExampleType: ExampleType.string,
    aliases: {
      [AliasBitType.appAiPrompt]: { since: '1.3.0' },
      [AliasBitType.aiPrompt]: { since: '1.3.0' },
      [AliasBitType.articleAi]: { since: '1.3.0' },
      [AliasBitType.articleAttachment]: { since: '1.3.0' },
      [AliasBitType.assignment]: { since: '1.3.0' },
      [AliasBitType.audioTranscript]: { since: '1.3.0' },
      [AliasBitType.bitmarkExample]: { since: '1.3.0' },
      [AliasBitType.blogArticle]: { since: '1.3.0' },
      [AliasBitType.bug]: { since: '1.3.0' },
      [AliasBitType.checklist]: { since: '1.3.0' },
      [AliasBitType.coachAudioTranscript]: { since: '1.3.0' },
      [AliasBitType.coachCallToActionChecklist]: { since: '1.3.0' },
      [AliasBitType.coachHomeRules]: { since: '1.3.0' },
      [AliasBitType.coachVideoTranscript]: { since: '1.3.0' },
      [AliasBitType.correction]: { since: '1.3.0' },
      [AliasBitType.cookPreparation]: { since: '1.3.0' },
      [AliasBitType.cookStep]: { since: '1.3.0' },
      [AliasBitType.cookIngredients]: { since: '1.3.0' },
      [AliasBitType.cookRemark]: { since: '1.3.0' },
      [AliasBitType.cookVariation]: { since: '1.3.0' },
      [AliasBitType.cookInsert]: { since: '1.3.0' },
      [AliasBitType.cookArrangement]: { since: '1.3.0' },
      [AliasBitType.cookPracticeAdvise]: { since: '1.3.0' },
      [AliasBitType.cookPlate]: { since: '1.3.0' },
      [AliasBitType.cookRecommendation]: { since: '1.3.0' },
      [AliasBitType.cookPersonalRecommendation]: { since: '1.3.0' },
      [AliasBitType.cookSideDrink]: { since: '1.3.0' },
      [AliasBitType.cookSideDish]: { since: '1.3.0' },
      [AliasBitType.cookTimer]: { since: '1.3.0' },
      [AliasBitType.danger]: { since: '1.3.0' },
      [AliasBitType.details1]: { since: '1.3.0' },
      [AliasBitType.details]: { since: '1.3.0' },
      [AliasBitType.editorial]: { since: '1.3.0' },
      [AliasBitType.editorNote]: { since: '1.3.0' },
      [AliasBitType.featured]: { since: '1.3.0' },
      [AliasBitType.help]: { since: '1.3.0' },
      [AliasBitType.hint]: { since: '1.3.0' },
      [AliasBitType.info]: { since: '1.3.0' },
      [AliasBitType.langLearningOutcomes]: { since: '1.3.0' },
      [AliasBitType.langEnablingLanguageSkills]: { since: '1.3.0' },
      [AliasBitType.langLifeSkills]: { since: '1.3.0' },
      [AliasBitType.langEnglishAroundWorld]: { since: '1.3.0' },
      [AliasBitType.langGoodToKnow]: { since: '1.3.0' },
      [AliasBitType.langLearningGoal]: { since: '1.3.0' },
      [AliasBitType.langLearningStrategy]: { since: '1.3.0' },
      [AliasBitType.langLikeALocal]: { since: '1.3.0' },
      [AliasBitType.langMaterial]: { since: '1.3.0' },
      [AliasBitType.langUsefulPhrases]: { since: '1.3.0' },
      [AliasBitType.langLevelDown]: { since: '1.3.0' },
      [AliasBitType.langLevelUp]: { since: '1.3.0' },
      [AliasBitType.langExtraActivity]: { since: '1.3.0' },
      [AliasBitType.langVideoScript]: { since: '1.3.0' },
      [AliasBitType.langAudioScript]: { since: '1.3.0' },
      [AliasBitType.langVocabulary]: { since: '1.3.0' },
      [AliasBitType.langHomework]: { since: '1.3.0' },
      [AliasBitType.langTeacherNote]: { since: '1.3.0' },
      [AliasBitType.langTeacherPronunciation]: { since: '1.3.0' },
      [AliasBitType.message]: { since: '1.3.0' },
      [AliasBitType.newspaperArticle]: { since: '1.3.0' },
      [AliasBitType.note]: { since: '1.3.0' },
      [AliasBitType.noteAi]: { since: '1.3.0' },
      [AliasBitType.notebookArticle]: { since: '1.3.0' },
      [AliasBitType.preparationNote]: { since: '1.3.0' },
      [AliasBitType.releaseNotesSummary]: { since: '1.3.0' },
      [AliasBitType.remark]: { since: '1.3.0' },
      [AliasBitType.reviewNote]: { since: '1.3.0' },
      [AliasBitType.reviewAuthorNote]: { since: '1.3.0' },
      [AliasBitType.reviewReviewerNote]: { since: '1.3.0' },
      [AliasBitType.reviewRequestForReviewNote]: { since: '1.3.0' },
      [AliasBitType.reviewApprovedNote]: { since: '1.3.0' },
      [AliasBitType.selfAssessment]: { since: '1.3.0' },
      [AliasBitType.sideNote]: { since: '1.3.0' },
      [AliasBitType.summary]: { since: '1.3.0' },
      [AliasBitType.summaryAi]: { since: '1.3.0' },
      [AliasBitType.videoTranscript]: { since: '1.3.0' },
      [AliasBitType.warning]: { since: '1.3.0' },
      [AliasBitType.workbookArticle]: { since: '1.3.0' },
    },
  },
  [RootBitType.flashcard]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._flashcards,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    aliases: {
      [AliasBitType.flashcard1]: { since: '1.3.0' },
    },
  },
  [RootBitType.focusImage]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImage,
        minCount: 1,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.focusX,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.focusY,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.highlightText]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.image]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImage,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
    aliases: {
      [AliasBitType.appCreateBitsFromImage]: { since: '1.3.0' },
      [AliasBitType.appGetScreenshot]: { since: '1.3.0' },
      [AliasBitType.detailsImage]: { since: '1.3.0' },
      [AliasBitType.figure]: { since: '1.3.0', deprecated: '1.4.0' },
      [AliasBitType.imageBanner]: { since: '1.3.0' },
      [AliasBitType.imageFigure]: { since: '1.3.0' },
      [AliasBitType.imageLandscape]: { since: '1.3.0' },
      [AliasBitType.imageMood]: { since: '1.3.0' },
      [AliasBitType.imagePortrait]: { since: '1.3.0' },
      [AliasBitType.imagePrototype]: { since: '1.3.0' },
      [AliasBitType.imageScreenshot]: { since: '1.3.0' },
      [AliasBitType.imageStyled]: { since: '1.3.0' },
      [AliasBitType.imageSuperWide]: { since: '1.3.0' },
      [AliasBitType.imageZoom]: { since: '1.3.0' },
      [AliasBitType.langLifeSkillIcon]: { since: '1.3.0' },
      [AliasBitType.lifeSkillSticker]: { since: '1.3.0' },
      [AliasBitType.screenshot]: { since: '1.3.0', deprecated: '1.4.0' },
    },
  },
  [RootBitType.imageLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImageLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.imageOnDevice]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImage,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_imageSource,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.imageResponsive]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        // Combo resource
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImageResponsive,
      },
    ],

    bodyAllowed: true, // false??
  },
  [RootBitType.internalLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.tag_reference,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.interview]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._questions,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    aliases: {
      [AliasBitType.interviewInstructionGrouped]: { since: '1.3.0' },
      [AliasBitType.botInterview]: { since: '1.3.0' },
    },
  },
  [RootBitType.learningPathBook]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_learningPathCommon,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    aliases: {
      [AliasBitType.bookLink]: { since: '1.3.0' },
      [AliasBitType.bookLinkNext]: { since: '1.3.0' },
      [AliasBitType.bookLinkPrev]: { since: '1.3.0' },
      [AliasBitType.learningPathBotTraining]: { since: '1.3.0' },
      [AliasBitType.learningPathClassroomEvent]: { since: '1.3.0' },
      [AliasBitType.learningPathClassroomTraining]: { since: '1.3.0' },
      [AliasBitType.learningPathClosing]: { since: '1.3.0' },
      [AliasBitType.learningPathFeedback]: { since: '1.3.0' },
      [AliasBitType.learningPathLearningGoal]: { since: '1.3.0' },
      [AliasBitType.learningPathLti]: { since: '1.3.0' },
      [AliasBitType.learningPathSign]: { since: '1.3.0' },
      [AliasBitType.learningPathStep]: { since: '1.3.0' },
    },
  },

  [RootBitType.learningPathExternalLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_learningPathCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.externalLink,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.externalLinkText,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.learningPathVideoCall]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_learningPathCommon,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.videoCallLink,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.mark]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_markConfig,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_mark,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.match]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._matchPairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    aliases: {
      [AliasBitType.matchAll]: { since: '1.3.0' },
      [AliasBitType.matchReverse]: { since: '1.3.0' },
      [AliasBitType.matchAllReverse]: { since: '1.3.0' },
      [AliasBitType.matchSolutionGrouped]: { since: '1.3.0' },
    },
  },
  [RootBitType.matchMatrix]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._matchMatrix,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchAudio]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._matchAudioPairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },

  [RootBitType.matchPicture]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._matchImagePairs,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.multipleChoice1]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    aliases: {
      [AliasBitType.coachSelfReflectionMultipleChoice1]: { since: '1.3.0' },
    },
  },
  [RootBitType.multipleChoice]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_trueFalse,
      }, // This is actually for multiple-choice-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardSetConfigKey._quiz,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    aliases: {
      [AliasBitType.coachSelfReflectionMultipleChoice]: { since: '1.3.0' },
    },
  },
  [RootBitType.multipleChoiceText]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    aliases: {
      [AliasBitType.coachCallToActionMultipleChoiceText]: { since: '1.3.0' },
      [AliasBitType.coachSelfReflectionMultipleChoiceText]: { since: '1.3.0' },
    },
  },
  [RootBitType.multipleResponse1]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_trueFalse,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    aliases: {
      [AliasBitType.coachSelfReflectionMultipleResponse1]: { since: '1.3.0' },
    },
  },
  [RootBitType.multipleResponse]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_trueFalse,
      }, // This is actually for multiple-response-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardSetConfigKey._quiz,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    aliases: {
      [AliasBitType.coachSelfReflectionMultipleResponse]: { since: '1.3.0' },
    },
  },
  [RootBitType.pageBuyButton]: {
    since: '1.4.3',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.content2Buy,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.photo]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImage,
        minCount: 1,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.quote]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.quotedPerson,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.rating]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    bodyAllowed: true,
    aliases: {
      [AliasBitType.coachSelfReflectionRating]: { since: '1.3.0' },
    },
  },
  [RootBitType.releaseNote]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.releaseVersion,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sampleSolution]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      // Not sure if these are actually valid here, but include them as they are in the test bit.
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.anchor,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.tag_reference,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.sequence]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._elements,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    rootExampleType: ExampleType.boolean,
  },
  [RootBitType.stillImageFilm]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        // Combo resource
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceStillImageFilm,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmEmbed]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceStillImageFilmEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.stillImageFilmLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceStillImageFilmLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [RootBitType.surveyAnonymous]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [RootBitType.survey]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },

  [RootBitType.toc]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    bodyAllowed: true,
    aliases: {
      [AliasBitType.anchor]: { since: '1.3.0' },
      [AliasBitType.bitBookEnding]: { since: '1.3.0' },
      [AliasBitType.bitBookSummary]: { since: '1.3.0' },
      [AliasBitType.botActionAnnounce]: { since: '1.3.0' },
      [AliasBitType.botActionRatingNumber]: { since: '1.3.0' },
      [AliasBitType.botActionRemind]: { since: '1.3.0' },
      [AliasBitType.botActionSave]: { since: '1.3.0' },
      [AliasBitType.botActionTrueFalse]: { since: '1.3.0' },
      [AliasBitType.chapterSubjectMatter]: { since: '1.3.0' },
      [AliasBitType.chat]: { since: '1.3.0' },
      [AliasBitType.conclusion]: { since: '1.3.0' },
      [AliasBitType.documentUpload]: { since: '1.3.0' },
      [AliasBitType.footNote]: { since: '1.3.0' },
      [AliasBitType.groupBorn]: { since: '1.3.0' },
      [AliasBitType.groupDied]: { since: '1.3.0' },
      [AliasBitType.recordAudio]: { since: '1.3.0' },
      [AliasBitType.stickyNote]: { since: '1.3.0' },
      [AliasBitType.takePicture]: { since: '1.3.0' },
    },
  },
  [RootBitType.trueFalse1]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.labelTrue,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.labelFalse,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.true,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.false,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: false,
    rootExampleType: ExampleType.boolean,
  },

  [RootBitType.trueFalse]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.labelTrue,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.labelFalse,
      },
    ],
    cardSet: CardSetConfigKey._statements,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [RootBitType.vendorPadletEmbed]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.padletId,
      },
    ],

    bodyAllowed: true,
  },
  [RootBitType.video]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceVideo,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
    aliases: {
      [AliasBitType.videoLandscape]: { since: '1.3.0' },
      [AliasBitType.videoPortrait]: { since: '1.3.0' },
    },
  },
  [RootBitType.videoEmbed]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceVideoEmbed,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
    aliases: {
      [AliasBitType.videoEmbedLandscape]: { since: '1.3.0' },
      [AliasBitType.videoEmbedPortrait]: { since: '1.3.0' },
    },
  },
  [RootBitType.videoLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceVideoLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
    aliases: {
      [AliasBitType.videoLinkLandscape]: { since: '1.3.0' },
      [AliasBitType.videoLinkPortrait]: { since: '1.3.0' },
    },
  },
  [RootBitType.websiteLink]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceWebsiteLink,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
};

export { BITS };
