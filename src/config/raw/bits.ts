import { _BitsConfig } from '../../model/config/_Config';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey';
import { GroupConfigKey } from '../../model/config/enum/GroupConfigKey';
import { PropertyConfigKey } from '../../model/config/enum/PropertyConfigKey';
import { TagConfigKey } from '../../model/config/enum/TagConfigKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { BitType } from '../../model/enum/BitType';
import { Count } from '../../model/enum/Count';
import { ExampleType } from '../../model/enum/ExampleType';
import { TextFormat } from '../../model/enum/TextFormat';

const BITS: _BitsConfig = {
  [BitType._error]: {
    since: '1.3.0',
    tags: [],
  },

  [BitType._comment]: {
    since: '1.4.12',
    tags: [],
  },

  [BitType.appFlashcards]: {
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
  },
  [BitType.appFlashcardsQuiz]: { since: '1.3.0', baseBitType: BitType.appFlashcards },
  [BitType.appFlashcardsLearn]: { since: '1.3.0', baseBitType: BitType.appFlashcards },
  [BitType.appLink]: {
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
  [BitType.article]: {
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
  },
  [BitType.statement]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.buttonCopyText]: {
    since: '1.4.3',
    baseBitType: BitType.article,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.buttonCaption,
      },
    ],
  },
  [BitType.appBitmarkFromJavascript]: {
    since: '1.4.5',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.maxCreatedBits,
      },
    ],
    textFormatDefault: TextFormat.text,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.appBitmarkFromEditor]: { since: '1.4.5', baseBitType: BitType.appBitmarkFromJavascript },
  [BitType.articleEmbed]: {
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
  [BitType.articleLink]: {
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
  [BitType.audio]: {
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
  [BitType.audioEmbed]: {
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
  [BitType.audioLink]: {
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
  [BitType.bitAlias]: {
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
  [BitType.book]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_bookCommon,
      },
    ],
    bodyAllowed: true,
  },
  [BitType.bookAcknowledgments]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookAddendum]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookAfterword]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookAppendix]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookArticle]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookAutherBio]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookBibliography]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookComingSoon]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookConclusion]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookCopyright]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookCopyrightPermissions]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookDedication]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookEndnotes]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookEpigraph]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookEpilogue]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookForword]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookFrontispiece]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookImprint]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookIncitingIncident]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookIntroduction]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookListOfContributors]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookNotes]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookPostscript]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookPreface]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookPrologue]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookReadMore]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookReferenceList]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookRequestForABookReview]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookSummary]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookTeaser]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookTitle]: { since: '1.3.0', baseBitType: BitType.book },
  [BitType.bookAlias]: {
    since: '1.4.3',
    baseBitType: BitType.book,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.bookAlias,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.botActionResponse]: {
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
  [BitType.botActionSend]: {
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
  [BitType.browserImage]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.focusX,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.focusY,
      },
    ],
  },
  [BitType.card1]: {
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
  [BitType.question1]: { since: '1.3.0', baseBitType: BitType.card1 },
  [BitType.survey1]: { since: '1.3.0', baseBitType: BitType.card1 },
  [BitType.surveyAnonymous1]: { since: '1.3.0', baseBitType: BitType.card1 },
  [BitType.chapter]: {
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
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.toc,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.progress,
      },
    ],

    bodyAllowed: true,
  },
  [BitType.clozeAndMultipleChoiceText]: {
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
  },
  [BitType.coachCallToActionClozeAndMultipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType.clozeAndMultipleChoiceText,
  },
  [BitType.cloze]: {
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
  },
  [BitType.clozeInstructionGrouped]: { since: '1.3.0', baseBitType: BitType.cloze },
  [BitType.clozeSolutionGrouped]: { since: '1.3.0', baseBitType: BitType.cloze },
  [BitType.gapText]: { since: '1.5.15', baseBitType: BitType.cloze },
  [BitType.gapTextInstructionGrouped]: { since: '1.5.15', baseBitType: BitType.cloze },
  [BitType.coachSelfReflectionCloze]: { since: '1.3.0', baseBitType: BitType.cloze },
  [BitType.coachCallToActionCloze]: { since: '1.3.0', baseBitType: BitType.cloze },
  [BitType.clozeList]: {
    since: '1.4.13',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    cardSet: CardSetConfigKey._clozeList,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [BitType.code]: {
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
    textFormatDefault: TextFormat.text,
    bodyAllowed: true,
  },
  [BitType.appCodeCell]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.appCodeEditor]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.appCodeIde]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.codeRuntime]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.consoleLog]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.output]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.stdout]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.step]: { since: '1.5.1', baseBitType: BitType.example },
  [BitType.stepImageScreenshot]: { since: '1.5.1', baseBitType: BitType.image },
  [BitType.stepImageScreenshotWithPointer]: {
    since: '1.5.1',
    baseBitType: BitType.image,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.pointerTop,
        minCount: 1,
        maxCount: 1,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.pointerLeft,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },
  [BitType.conversationLeft1]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_person,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.conversationLeft1Scream]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.conversationLeft1Thought]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.conversationRight1]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.conversationRight1Scream]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.conversationRight1Thought]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.cookPreparation]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookStep]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookIngredients]: {
    since: '1.5.16',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_technicalTerm,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.portions,
      },
    ],
    cardSet: CardSetConfigKey._ingredients,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [BitType.cookRemark]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookVariation]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookInsert]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookArrangement]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookPracticeAdvise]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookPlate]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookRecommendation]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookPersonalRecommendation]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookSideDrink]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookSideDish]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.cookTimer]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.document]: {
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
  [BitType.documentDownload]: {
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
  [BitType.documentEmbed]: {
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
  [BitType.documentLink]: {
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
  [BitType.essay]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.reasonableNumOfChars,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.property_sampleSolution,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.partialAnswer,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.property_reference,
        maxCount: Count.infinity,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    rootExampleType: ExampleType.string,
  },
  [BitType.coachSelfReflectionEssay]: { since: '1.3.0', baseBitType: BitType.essay },
  [BitType.coachCallToActionEssay]: { since: '1.3.0', baseBitType: BitType.essay },
  [BitType.example]: {
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
  },
  [BitType.appAiPrompt]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.aiPrompt]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.articleAi]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.articleAttachment]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.assignment]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.audioTranscript]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.bitmarkExample]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.blogArticle]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.bug]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.checklist]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.coachAudioTranscript]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.coachCallToActionChecklist]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.coachHomeRules]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.coachVideoTranscript]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.correction]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.danger]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.details1]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.details]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.editorial]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.editorNote]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.featured]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.help]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.hint]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.info]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langLearningOutcomes]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langEnablingLanguageSkills]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langLifeSkills]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langEnglishAroundWorld]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langGoodToKnow]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langLearningGoal]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langLearningStrategy]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langLikeALocal]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langMaterial]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langUsefulPhrases]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langLevelDown]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langLevelUp]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langExtraActivity]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langVideoScript]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langAudioScript]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langVocabulary]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langHomework]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langTeacherNote]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.langTeacherPronunciation]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.message]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.newspaperArticle]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.note]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.noteAi]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.notebookArticle]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.preparationNote]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.releaseNotesSummary]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.remark]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.selfAssessment]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.separator]: { since: '1.4.15', baseBitType: BitType.example },
  [BitType.sideNote]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.summary]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.summaryAi]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.videoTranscript]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.warning]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.workbookArticle]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.exampleList]: {
    since: '1.4.13',
    baseBitType: BitType.example,
    cardSet: CardSetConfigKey._exampleBitList,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
    rootExampleType: ExampleType.string,
  },
  [BitType.extractorPage]: { since: '1.5.17', baseBitType: BitType.page },
  [BitType.extractorBlock]: {
    since: '1.5.16',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.blockId,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.pageNo,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.x,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.y,
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
        configKey: PropertyConfigKey.index,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.classification,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.availableClassifications,
        maxCount: Count.infinity,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImage,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [BitType.pageOpenBook]: {
    since: '1.5.10',
    baseBitType: BitType.example,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.book,
      },
      {
        type: BitTagType.tag,
        configKey: TagConfigKey.tag_reference,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.buttonCaption,
      },
    ],
  },
  [BitType.pageSubscribe]: {
    since: '1.5.10',
    baseBitType: BitType.example,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.buttonCaption,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.mailingList,
      },
    ],
  },
  [BitType.assignmentList]: { since: '1.4.13', baseBitType: BitType.exampleList },
  [BitType.pageFooter]: { since: '1.4.13', baseBitType: BitType.exampleList },
  [BitType.flashcard]: {
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
  },
  [BitType.flashcard1]: { since: '1.3.0', baseBitType: BitType.flashcard },
  [BitType.focusImage]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.focusX,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.focusY,
      },
    ],
  },
  [BitType.highlightText]: {
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
  [BitType.image]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.backgroundWallpaper,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImage,
        minCount: 1,
      },
    ],
    bodyAllowed: true,
  },
  [BitType.appCreateBitsFromImage]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.appGetScreenshot]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.detailsImage]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.figure]: { since: '1.3.0', deprecated: '1.4.0', baseBitType: BitType.image },
  [BitType.imageBanner]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageFigure]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageLandscape]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageMood]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imagePortrait]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imagePrototype]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageSeparator]: { since: '1.4.15', baseBitType: BitType.image },
  [BitType.imageScreenshot]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageStyled]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageSuperWide]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageZoom]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.langLifeSkillIcon]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.lifeSkillSticker]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.pageBanner]: { since: '1.4.3', baseBitType: BitType.image },
  [BitType.screenshot]: { since: '1.3.0', deprecated: '1.4.0', baseBitType: BitType.image },
  [BitType.tableImage]: { since: '1.5.15', baseBitType: BitType.image },
  [BitType.imageLink]: {
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
  [BitType.imageOnDevice]: {
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
  [BitType.imageResponsive]: {
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
  [BitType.imagesLogoGrave]: {
    since: '1.5.11',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        // Image resource
        type: BitTagType.group,
        configKey: GroupConfigKey.group_resourceImage,
        minCount: 1,
        maxCount: Count.infinity,
      },
    ],

    bodyAllowed: true, // false??
  },
  [BitType.internalLink]: {
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
  [BitType.interview]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.reasonableNumOfChars,
      },
    ],
    cardSet: CardSetConfigKey._questions,
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    footerAllowed: true,
  },
  [BitType.interviewInstructionGrouped]: { since: '1.3.0', baseBitType: BitType.interview },
  [BitType.botInterview]: { since: '1.3.0', baseBitType: BitType.interview },
  [BitType.learningPathBook]: {
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
  },
  [BitType.bookLink]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.bookLinkNext]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.bookLinkPrev]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathClassroomEvent]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathClassroomTraining]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathClosing]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathFeedback]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathLearningGoal]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathLti]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathSign]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathStep]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathBotTraining]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.bot,
      },
    ],
  },
  [BitType.learningPathExternalLink]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.externalLink,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.externalLinkText,
      },
    ],
  },

  [BitType.learningPathVideoCall]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.videoCallLink,
      },
    ],
  },

  [BitType.mark]: {
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
  [BitType.match]: {
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
  },
  [BitType.matchAll]: { since: '1.3.0', baseBitType: BitType.match },
  [BitType.matchReverse]: { since: '1.3.0', baseBitType: BitType.match },
  [BitType.matchAllReverse]: { since: '1.3.0', baseBitType: BitType.match },
  [BitType.matchSolutionGrouped]: { since: '1.3.0', baseBitType: BitType.match },
  [BitType.matchMatrix]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    cardSet: CardSetConfigKey._matchMatrix,
  },

  [BitType.matchAudio]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    cardSet: CardSetConfigKey._matchAudioPairs,
  },

  [BitType.matchPicture]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    cardSet: CardSetConfigKey._matchImagePairs,
  },
  [BitType.multipleChoice1]: {
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
  [BitType.coachSelfReflectionMultipleChoice1]: { since: '1.3.0', baseBitType: BitType.multipleChoice1 },
  [BitType.multipleChoice]: {
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
  },
  [BitType.coachSelfReflectionMultipleChoice]: { since: '1.3.0', baseBitType: BitType.multipleChoice },
  [BitType.multipleChoiceText]: {
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
  [BitType.coachCallToActionMultipleChoiceText]: { since: '1.3.0', baseBitType: BitType.multipleChoiceText },
  [BitType.coachSelfReflectionMultipleChoiceText]: { since: '1.3.0', baseBitType: BitType.multipleChoiceText },
  [BitType.multipleResponse1]: {
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
  [BitType.coachSelfReflectionMultipleResponse1]: { since: '1.3.0', baseBitType: BitType.multipleResponse1 },
  [BitType.multipleResponse]: {
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
  },
  [BitType.coachSelfReflectionMultipleResponse]: { since: '1.3.0', baseBitType: BitType.multipleResponse },
  [BitType.page]: {
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
        configKey: PropertyConfigKey.thumbImage,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.pageBuyButton]: {
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
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.buttonCaption,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.pageBuyButtonPromotion]: { since: '1.5.11', baseBitType: BitType.pageBuyButton },
  [BitType.pagePerson]: {
    since: '1.5.16',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_person,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.buttonCaption,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.pageProduct]: {
    since: '1.4.17',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.product,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.pageProductList]: {
    since: '1.4.17',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.productList,
        maxCount: Count.infinity,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.pageProductVideo]: {
    since: '1.4.17',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.productVideo,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.pageProductVideoList]: {
    since: '1.4.17',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.productVideoList,
        maxCount: Count.infinity,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.pageSectionFolder]: {
    since: '1.4.17',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.productFolder,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.photo]: {
    since: '1.3.0',
    baseBitType: BitType.image,
  },
  [BitType.quote]: {
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
  [BitType.rating]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    bodyAllowed: true,
  },
  [BitType.coachSelfReflectionRating]: { since: '1.3.0', baseBitType: BitType.rating },
  [BitType.releaseNote]: {
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
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.releaseKind,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.releaseDate,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.reviewNote]: {
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
        configKey: PropertyConfigKey.resolved,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.resolvedDate,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.resolvedBy,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
    rootExampleType: ExampleType.string,
  },
  [BitType.reviewAuthorNote]: { since: '1.3.0', baseBitType: BitType.reviewNote },
  [BitType.reviewReviewerNote]: { since: '1.3.0', baseBitType: BitType.reviewNote },
  [BitType.reviewRequestForReviewNote]: { since: '1.3.0', baseBitType: BitType.reviewNote },
  [BitType.reviewApprovedNote]: { since: '1.3.0', baseBitType: BitType.reviewNote },
  [BitType.sampleSolution]: {
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

  [BitType.sequence]: {
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
  [BitType.stillImageFilm]: {
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
  [BitType.stillImageFilmEmbed]: {
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
  [BitType.stillImageFilmLink]: {
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
  [BitType.surveyAnonymous]: {
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
  [BitType.survey]: {
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
  [BitType.scorm]: {
    since: '1.5.11',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.scormSource,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.posterImage,
      },
    ],
    resourceAttachmentAllowed: true,
    bodyAllowed: true,
  },
  [BitType.table]: {
    since: '1.5.15',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    textFormatDefault: TextFormat.json,
    bodyAllowed: true,
  },
  [BitType.toc]: {
    since: '1.3.0',
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    bodyAllowed: true,
  },
  [BitType.tocChapter]: {
    since: '1.5.5',
    baseBitType: BitType.toc,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.maxDisplayLevel,
      },
    ],
  },
  [BitType.anchor]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.bitBookEnding]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.bitBookSummary]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.botActionAnnounce]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.botActionRatingNumber]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.botActionRemind]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.botActionSave]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.botActionTrueFalse]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.chapterSubjectMatter]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.chat]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.conclusion]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.documentUpload]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.footNote]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.groupBorn]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.groupDied]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.recordAudio]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.stickyNote]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.takePicture]: { since: '1.3.0', baseBitType: BitType.toc },
  [BitType.handInAudio]: { since: '1.5.15', baseBitType: BitType.takePicture },
  [BitType.handInContact]: { since: '1.5.15', baseBitType: BitType.takePicture },
  [BitType.handInDocument]: { since: '1.5.15', baseBitType: BitType.takePicture },
  [BitType.handInLocation]: { since: '1.5.15', baseBitType: BitType.takePicture },
  [BitType.handInPhoto]: { since: '1.5.15', baseBitType: BitType.takePicture },
  [BitType.handInScan]: { since: '1.5.15', baseBitType: BitType.takePicture },
  [BitType.handInVideo]: { since: '1.5.15', baseBitType: BitType.takePicture },
  [BitType.handInVoice]: { since: '1.5.15', baseBitType: BitType.takePicture },
  [BitType.trueFalse1]: {
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

  [BitType.trueFalse]: {
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
  [BitType.vendorAmcharts5Chart]: {
    since: '1.5.8',
    baseBitType: BitType.code,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
    ],
    textFormatDefault: TextFormat.json,
    bodyAllowed: true,
  },
  [BitType.vendorIframelyEmbed]: {
    since: '1.5.10',
    baseBitType: BitType.code,
    tags: [
      {
        type: BitTagType.group,
        configKey: GroupConfigKey.group_standardTags,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.width, // Same as image
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.height, // Same as image
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.vendorUrl,
      },
    ],
    textFormatDefault: TextFormat.text,
    bodyAllowed: true,
  },
  [BitType.vendorIframelyCard]: { since: '1.5.10', baseBitType: BitType.vendorIframelyEmbed },
  [BitType.vendorIframelyPreview]: { since: '1.5.10', baseBitType: BitType.vendorIframelyEmbed },
  [BitType.vendorIframelyPreviewMini]: { since: '1.5.10', baseBitType: BitType.vendorIframelyEmbed },
  [BitType.vendorJupyterOutput]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    tags: [
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.jupyterId,
      },
      {
        type: BitTagType.property,
        configKey: PropertyConfigKey.jupyterExecutionCount,
      },
    ],
    textFormatDefault: TextFormat.text,
    bodyAllowed: true,
  },
  [BitType.vendorJupyterCellCode]: { since: '1.4.3', baseBitType: BitType.vendorJupyterOutput },
  [BitType.vendorJupyterCellMarkdown]: { since: '1.4.3', baseBitType: BitType.vendorJupyterOutput },
  [BitType.vendorJupyterCellRaw]: { since: '1.4.3', baseBitType: BitType.vendorJupyterOutput },
  [BitType.vendorJupyterIpynb]: { since: '1.4.3', baseBitType: BitType.vendorJupyterOutput },
  [BitType.vendorPadletEmbed]: {
    since: '1.3.0',
    baseBitType: BitType.code,
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
    textFormatDefault: TextFormat.text,
    bodyAllowed: true,
  },
  [BitType.video]: {
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
  },
  [BitType.videoLandscape]: { since: '1.3.0', baseBitType: BitType.video },
  [BitType.videoPortrait]: { since: '1.3.0', baseBitType: BitType.video },
  [BitType.videoEmbed]: {
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
  },
  [BitType.videoEmbedLandscape]: { since: '1.3.0', baseBitType: BitType.videoEmbed },
  [BitType.videoEmbedPortrait]: { since: '1.3.0', baseBitType: BitType.videoEmbed },
  [BitType.videoLink]: {
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
  },
  [BitType.videoLinkLandscape]: { since: '1.3.0', baseBitType: BitType.videoLink },
  [BitType.videoLinkPortrait]: { since: '1.3.0', baseBitType: BitType.videoLink },
  [BitType.websiteLink]: {
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
