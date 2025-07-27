import { type _BitsConfig } from '../../model/config/_Config.ts';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey.ts';
import { ConfigKey } from '../../model/config/enum/ConfigKey.ts';
import { BitType } from '../../model/enum/BitType.ts';
import { Count } from '../../model/enum/Count.ts';
import { ExampleType } from '../../model/enum/ExampleType.ts';
import { TagFormat } from '../../model/enum/TagFormat.ts';
import { TextFormat } from '../../model/enum/TextFormat.ts';

const BITS: _BitsConfig = {
  [BitType._error]: {
    since: '1.3.0',
    description: 'An error bit, rendered when the bit cannot be interpreted',
    tags: [],
  },

  [BitType._comment]: {
    since: '1.4.12',
    description:
      'A comment bit, used when a bit is commented out by adding | between the . and the bit name, e.g [.|article]',
    tags: [],
  },

  [BitType._standard]: {
    since: '3.2.0',
    description:
      'The standard bit type, used as a base for other bits, should not be used directly',
    tags: [
      {
        key: ConfigKey.group_standardTags,
        description: 'Standard tags for (almost) all bits',
      },
    ],
  },

  [BitType.appFlashcards]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'App flashcards bit, used for flashcard quizzes in the app',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common tags for quiz bits',
      },
      {
        key: ConfigKey.tag_title,
        description: 'The title of the flashcard quiz',
      },
      {
        key: ConfigKey.property_flashcardSet,
        description: 'The flashcard set to use for the app flashcards',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.appFlashcardsQuiz]: {
    since: '1.3.0',
    baseBitType: BitType.appFlashcards,
    description: 'App flashcards quiz bit',
  },
  [BitType.appFlashcardsLearn]: {
    since: '1.3.0',
    baseBitType: BitType.appFlashcards,
    description: 'App flashcards learn bit',
  },
  [BitType.appLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'App link bit, used to link to other bits in the app',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for the resource bit',
      },
      {
        key: ConfigKey.group_resourceAppLink,
        description: 'Tags for the app link resource',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.article]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Article bit, used for articles / paragraphs',
    tags: [
      {
        key: ConfigKey.tag_title,
        description: 'The title of the article',
      },
    ],
  },
  [BitType.articleAlt]: {
    since: '1.15.0',
    baseBitType: BitType.article,
    description: 'Alternative article bit',
  },
  [BitType.articleResponsive]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description: 'Responsive article bit, used for articles that adapt to the screen size',
    tags: [
      {
        key: ConfigKey.property_imageFirst,
        description: 'If the image should be displayed first in the responsive article',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
    ],
  },
  [BitType.articleResponsiveAlt]: {
    since: '2.0.0',
    baseBitType: BitType.articleResponsive,
    description: 'Alternative responsive article bit',
  },
  [BitType.standardArticleNormative]: {
    since: '1.16.0',
    baseBitType: BitType.article,
    description: 'Standard normative article bit',
  },
  [BitType.standardArticleNonNormative]: {
    since: '1.16.0',
    baseBitType: BitType.article,
    description: 'Standard non-normative article bit',
  },
  [BitType.smartStandardArticleNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardArticleNormative,
    description: 'Smart standard normative article bit',
  },
  [BitType.smartStandardArticleNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardArticleNonNormative,
    description: 'Smart standard non-normative article bit',
  },
  [BitType.smartStandardArticleNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardArticleNormative,
    description: 'Smart standard normative article bit that is collapsible',
  },
  [BitType.smartStandardArticleNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardArticleNonNormative,
    description: 'Smart standard non-normative article bit that is collapsible',
  },
  [BitType.statement]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Statement bit, used for statements in documents',
  },
  [BitType.pageArticle]: {
    since: '1.15.0',
    baseBitType: BitType.article,
    description: 'Page article bit',
  },
  [BitType.pageArticleAlt]: {
    since: '1.15.0',
    baseBitType: BitType.article,
    description: 'Alternative page article bit',
  },
  [BitType.pageArticleResponsive]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description: 'Responsive page article bit, used for articles that adapt to the screen size',
    tags: [
      {
        key: ConfigKey.property_imageFirst,
        description: 'If the image should be displayed first in the responsive article',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
    ],
  },
  [BitType.buttonCopyText]: {
    since: '1.4.3',
    baseBitType: BitType.article,
    description: 'Button copy text bit, used to create a button that copies text to the clipboard',
    tags: [
      {
        key: ConfigKey.property_buttonCaption,
        description: 'The caption of the button',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.callToAction]: {
    since: '1.15.0',
    baseBitType: BitType._standard,
    description: 'Call to action bit, used to create a call to action button',
    tags: [
      {
        key: ConfigKey.property_buttonCaption,
        description: 'The caption of the call to action button',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_callToActionUrl,
        description: 'The URL to navigate to when the call to action button is clicked',
        format: TagFormat.plainText,
        minCount: 1,
      },
    ],
  },
  [BitType.callToActionSubscribe]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action subscribe bit',
  },
  [BitType.callToActionContact]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action contact bit',
  },
  [BitType.callToActionJoin]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action join bit',
  },
  [BitType.callToActionMail]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action mail bit',
  },
  [BitType.callToActionLearnMore]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action learn more bit',
  },
  [BitType.callToActionSeeMore]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action see more bit',
  },
  [BitType.callToActionWatch]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action watch bit',
  },
  [BitType.callToActionStartNow]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action start now bit',
  },
  [BitType.callToActionGetOffer]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action get offer bit',
  },
  [BitType.callToActionBookNow]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action book now bit',
  },
  [BitType.callToActionShopNow]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action shop now bit',
  },
  [BitType.callToActionGetNow]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action get now bit',
  },
  [BitType.callToActionDownload]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action download bit',
  },
  [BitType.callToActionCreateAccount]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action create account bit',
  },
  [BitType.appBitmarkFromJavascript]: {
    since: '1.4.5',
    baseBitType: BitType._standard,
    description: 'App bitmark from JavaScript, used to create bits from JavaScript in the app',
    tags: [
      {
        key: ConfigKey.property_maxCreatedBits,
        description: 'The maximum number of bits that can be created from this bit',
        format: TagFormat.number,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.appBitmarkFromEditor]: {
    since: '1.4.5',
    baseBitType: BitType.appBitmarkFromJavascript,
    description: 'App bitmark from editor, used to create bits from the editor in the app',
  },
  [BitType.articleEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Article embed bit, used to embed articles from other sources',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for the resource bit',
      },
      {
        key: ConfigKey.group_resourceArticleEmbed,
        description: 'Tags for the article embed resource',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.articleLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Article link bit, used to link to articles from other sources',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceArticleLink,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.audio]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceAudio,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.audioEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceAudioEmbed,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.audioLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceAudioLink,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.bitAlias]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.tag_reference,
      },
      {
        key: ConfigKey.tag_anchor,
      },
    ],
  },
  [BitType.diff]: {
    since: '3.13.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_diffTo,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.book]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_bookCommon,
      },
    ],
  },
  [BitType.bookEnd]: { since: '3.27.0', baseBitType: BitType.article },
  [BitType.bookAcknowledgements]: { since: '1.17.0', baseBitType: BitType.article },
  [BitType.bookAddendum]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookAfterword]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookAppendix]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookArticle]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookAutherBio]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookBibliography]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookComingSoon]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookConclusion]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookCopyright]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookCopyrightPermissions]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookDedication]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookEndnotes]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookEpigraph]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookEpilogue]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookForword]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookFrontispiece]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookImprint]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookIncitingIncident]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookIntroduction]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookListOfContributors]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookNotes]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookPostscript]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookPreface]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookPrologue]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookReadMore]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookReferenceList]: {
    //
    since: '3.2.0',
    baseBitType: BitType._standard,
    cardSet: CardSetConfigKey.bookReferenceList,
  },
  [BitType.bookRequestForABookReview]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookSummary]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookTeaser]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookTitle]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bookCover]: {
    since: '3.27.0',
    baseBitType: BitType.image,
    tags: [
      {
        key: ConfigKey.tag_title,
        maxCount: 2, // title & subtitle
      },
      {
        key: ConfigKey.property_coverColor,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.bookAlias]: {
    since: '1.4.3',
    baseBitType: BitType.book,
    tags: [
      {
        key: ConfigKey.property_bookAlias,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.bookDiff]: {
    since: '3.10.0',
    baseBitType: BitType.book,
    tags: [
      {
        key: ConfigKey.property_bookDiff,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.bookClose]: {
    since: '1.18.0',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.bookReference]: {
    since: '2.2.0',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_refAuthor,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_refBookTitle,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_refPublisher,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_refPublicationYear,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_citationStyle,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.botActionResponse]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [],
    cardSet: CardSetConfigKey.botActionResponses,
  },
  [BitType.botActionSend]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_date,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.browserImage]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    tags: [
      {
        key: ConfigKey.property_focusX,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_focusY,
        format: TagFormat.number,
      },
    ],
  },
  [BitType.card1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
    ],
  },
  [BitType.question1]: { since: '1.3.0', baseBitType: BitType.card1 },
  [BitType.survey1]: { since: '1.3.0', baseBitType: BitType.card1 },
  [BitType.surveyAnonymous1]: { since: '1.3.0', baseBitType: BitType.card1 },
  [BitType.chapter]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.tag_anchor,
      },
      {
        key: ConfigKey.tag_title,
      },
      {
        key: ConfigKey.property_toc,
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
      {
        key: ConfigKey.property_progress,
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
    ],
  },
  [BitType.clozeAndMultipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.group_gap,
      },
      {
        key: ConfigKey.group_trueFalse,
      },
    ],
  },
  [BitType.coachCallToActionClozeAndMultipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType.clozeAndMultipleChoiceText,
  },
  [BitType.cloze]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.property_isCaseSensitive,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_quizCountItems,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_quizStrikethroughSolutions,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_additionalSolutions,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.group_gap,
      },
    ],
  },
  [BitType.clozeInstructionGrouped]: { since: '1.3.0', baseBitType: BitType.cloze },
  [BitType.clozeSolutionGrouped]: { since: '1.3.0', baseBitType: BitType.cloze },
  [BitType.clozeSeveral]: { since: '3.5.0', baseBitType: BitType.cloze },
  [BitType.gapText]: { since: '1.5.15', baseBitType: BitType.cloze },
  [BitType.gapTextInstructionGrouped]: {
    since: '1.5.15',
    baseBitType: BitType.clozeInstructionGrouped,
  },
  [BitType.coachSelfReflectionCloze]: { since: '1.3.0', baseBitType: BitType.cloze },
  [BitType.coachCallToActionCloze]: { since: '1.3.0', baseBitType: BitType.cloze },
  [BitType.clozeList]: {
    since: '1.4.13',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
    ],
    cardSet: CardSetConfigKey.clozeList,
  },
  [BitType.code]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_computerLanguage,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_codeLineNumbers,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_codeMinimap,
        format: TagFormat.boolean,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.formula]: {
    since: '1.35.0',
    baseBitType: BitType._standard,
    tags: [],
    textFormatDefault: TextFormat.latex,
  },
  [BitType.smartStandardFormula]: { since: '3.11.0', baseBitType: BitType.formula },
  [BitType.smartStandardFormulaNonNormative]: { since: '3.11.0', baseBitType: BitType.formula },
  [BitType.smartStandardFormulaNormative]: { since: '3.11.0', baseBitType: BitType.formula },
  [BitType.smartStandardRemarkFormula]: { since: '3.11.0', baseBitType: BitType.formula },
  [BitType.smartStandardRemarkFormulaNonNormative]: {
    since: '3.11.0',
    baseBitType: BitType.formula,
  },
  [BitType.smartStandardRemarkFormulaNormative]: { since: '3.11.0', baseBitType: BitType.formula },
  [BitType.appCodeCell]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.appCodeEditor]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.appCodeIde]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.codeRuntime]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.consoleLog]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.output]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.stdout]: { since: '1.4.3', baseBitType: BitType.code },
  [BitType.step]: { since: '1.5.1', baseBitType: BitType.article },
  [BitType.stepImageScreenshot]: { since: '1.5.1', baseBitType: BitType.image },
  [BitType.stepImageScreenshotWithPointer]: {
    since: '1.5.1',
    baseBitType: BitType.image,
    tags: [
      {
        key: ConfigKey.property_pointerTop,
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
      {
        key: ConfigKey.property_pointerLeft,
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },
  [BitType.milestone]: { since: '1.20.0', baseBitType: BitType.step },
  [BitType.conversationLeft1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_person,
      },
    ],
  },
  [BitType.conversationLeft1Scream]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.conversationLeft1Thought]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.conversationRight1]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.conversationRight1Scream]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.conversationRight1Thought]: { since: '1.3.0', baseBitType: BitType.conversationLeft1 },
  [BitType.clozeAndMultipleChoiceTextConversationLeft1]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
  },
  [BitType.clozeAndMultipleChoiceTextConversationLeft1Scream]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
  },
  [BitType.clozeAndMultipleChoiceTextConversationLeft1Thought]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
  },
  [BitType.clozeAndMultipleChoiceTextConversationRight1]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
  },
  [BitType.clozeAndMultipleChoiceTextConversationRight1Scream]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
  },
  [BitType.clozeAndMultipleChoiceTextConversationRight1Thought]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
  },
  [BitType.cookPreparation]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookStep]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookIngredients]: {
    since: '1.5.16',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_technicalTerm,
      },
      {
        key: ConfigKey.property_servings,
        format: TagFormat.number,
        chain: [
          {
            key: ConfigKey.property_unit,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_unitAbbr,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_decimalPlaces,
            format: TagFormat.number,
            defaultValue: '1',
          },
          {
            key: ConfigKey.property_disableCalculation,
            format: TagFormat.boolean,
          },
          {
            key: ConfigKey.tag_hint,
          },
        ],
      },
    ],
    cardSet: CardSetConfigKey.ingredients,
  },
  [BitType.recipe]: { since: '1.5.24', baseBitType: BitType.cookIngredients },
  [BitType.cookRemark]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookVariation]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookInsert]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookNoteOnQuantity]: { since: '3.27.0', baseBitType: BitType.article },
  [BitType.cookArrangement]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookPracticeAdvise]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookPlate]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookRecommendation]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookPersonalRecommendation]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookSideDrink]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookSideDish]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.cookTimer]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.document]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceDocument,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.documentDownload]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceDocumentDownload,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.leDocumentDownload]: { since: '3.18.0', baseBitType: BitType.documentDownload },
  [BitType.documentEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceDocumentEmbed,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.documentLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceDocumentLink,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.essay]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.property_reasonableNumOfChars,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_sampleSolution,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_additionalSolutions,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_partialAnswer,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_reference,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.coachSelfReflectionEssay]: { since: '1.3.0', baseBitType: BitType.essay },
  [BitType.coachCallToActionEssay]: { since: '1.3.0', baseBitType: BitType.essay },
  [BitType.example]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.tag_title,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.exampleAlt]: { since: '1.16.0', baseBitType: BitType.example },
  [BitType.standardExampleNormative]: { since: '1.16.0', baseBitType: BitType.example },
  [BitType.standardExampleNonNormative]: { since: '1.16.0', baseBitType: BitType.example },
  [BitType.smartStandardExampleNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardExampleNormative,
  },
  [BitType.smartStandardExampleNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardExampleNonNormative,
  },
  [BitType.smartStandardExampleNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardExampleNormative,
  },
  [BitType.smartStandardExampleNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardExampleNonNormative,
  },
  [BitType.appAiPrompt]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.aiPrompt]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.articleAi]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.articleAttachment]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.assignment]: { since: '1.3.0', baseBitType: BitType.essay },
  [BitType.audioTranscript]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bitmarkExample]: { since: '1.3.0', baseBitType: BitType.example },
  [BitType.blogArticle]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bug]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.bugAlt]: { since: '1.16.0', baseBitType: BitType.bug },
  [BitType.checklist]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.coachAudioTranscript]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.coachCallToActionChecklist]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.coachHomeRules]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.coachVideoTranscript]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.correction]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.danger]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.dangerAlt]: { since: '1.16.0', baseBitType: BitType.article },
  [BitType.definitionTerm]: { since: '1.34.0', baseBitType: BitType.article },
  [BitType.deleted]: { since: '3.9.0', baseBitType: BitType.article },
  [BitType.details1]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.details]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.qAndA]: { since: '3.5.0', baseBitType: BitType.article },
  [BitType.editorial]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.editorNote]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.featured]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.glossaryTerm]: { since: '1.33.0', baseBitType: BitType.article },
  [BitType.help]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.helpAlt]: { since: '1.16.0', baseBitType: BitType.help },
  [BitType.hint]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.hintAlt]: { since: '1.16.0', baseBitType: BitType.hint },
  [BitType.indexTerm]: { since: '1.33.0', baseBitType: BitType.article },
  [BitType.info]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.infoAlt]: { since: '1.16.0', baseBitType: BitType.info },
  [BitType.langLearningOutcomes]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langEnablingLanguageSkills]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langLifeSkills]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langEnglishAroundWorld]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langGoodToKnow]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langLearningGoal]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langLearningStrategy]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langLikeALocal]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langMaterial]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langUsefulPhrases]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langLevelDown]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langLevelUp]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langExtraActivity]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langVideoScript]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langAudioScript]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langVocabulary]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langHomework]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langTeacherNote]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.langTeacherPronunciation]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.list]: { since: '1.22.0', baseBitType: BitType.article },
  [BitType.standardList]: { since: '1.22.0', baseBitType: BitType.article },
  [BitType.smartStandardList]: { since: '1.28.0', baseBitType: BitType.standardList },
  [BitType.smartStandardListCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardList,
  },
  [BitType.message]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.newspaperArticle]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.note]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.noteAlt]: { since: '1.16.0', baseBitType: BitType.note },
  [BitType.standardNoteNormative]: { since: '1.16.0', baseBitType: BitType.note },
  [BitType.standardNoteNonNormative]: { since: '1.16.0', baseBitType: BitType.note },
  [BitType.smartStandardNoteNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardNoteNormative,
  },
  [BitType.smartStandardNoteNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardNoteNonNormative,
  },
  [BitType.smartStandardNoteNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardNoteNormative,
  },
  [BitType.smartStandardNoteNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardNoteNonNormative,
  },
  [BitType.noteAi]: { since: '1.3.0', baseBitType: BitType.note },
  [BitType.notebookArticle]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.preparationNote]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.releaseNotesSummary]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.remark]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.remarkAlt]: { since: '1.16.0', baseBitType: BitType.remark },
  [BitType.standardRemarkNormative]: { since: '1.16.0', baseBitType: BitType.article },
  [BitType.standardRemarkNonNormative]: { since: '1.16.0', baseBitType: BitType.article },
  [BitType.smartStandardRemarkNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkNormative,
  },
  [BitType.smartStandardRemarkNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkNonNormative,
  },
  [BitType.smartStandardRemarkNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkNormative,
  },
  [BitType.smartStandardRemarkNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkNonNormative,
  },
  [BitType.selfAssessment]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.separator]: { since: '1.4.15', baseBitType: BitType.article },
  [BitType.separatorAlt]: { since: '1.16.0', baseBitType: BitType.separator },
  [BitType.sticker]: { since: '1.5.28', baseBitType: BitType.article },
  [BitType.sideNote]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.summary]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.summaryAi]: { since: '1.3.0', baseBitType: BitType.summary },
  [BitType.videoTranscript]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.warning]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.warningAlt]: { since: '1.16.0', baseBitType: BitType.warning },
  [BitType.workbookArticle]: { since: '1.3.0', baseBitType: BitType.article },
  [BitType.collapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.sideNoteCollapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.infoCollapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.remarkCollapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.warningCollapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.dangerCollapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.noteCollapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.exampleCollapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.hintCollapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.bugCollapsible]: { since: '1.21.0', baseBitType: BitType.article },
  [BitType.platformPath]: {
    since: '3.14.1',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_path,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.container]: {
    since: '1.9.0',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_allowedBit,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.containerWrap]: { since: '1.9.0', baseBitType: BitType.container },
  [BitType.containerNowrap]: { since: '1.9.0', baseBitType: BitType.container },
  [BitType.containerNowrapStretch]: { since: '1.9.0', baseBitType: BitType.container },
  [BitType.containerGroup]: { since: '1.9.0', baseBitType: BitType.container },
  [BitType.containerFolder]: { since: '1.9.0', baseBitType: BitType.container },
  [BitType.containerCarousel]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerCards]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerGrid]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerStack]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerSlides]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerGallery]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerScroller]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerTabs]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerAccordionTabs]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerFolderAll]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerBits2]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerCookRecipe]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerNewsArticle]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.containerPreview]: { since: '1.11.0', baseBitType: BitType.container },
  [BitType.pageContainer]: { since: '1.9.0', baseBitType: BitType.container },
  [BitType.pageContainerWrap]: { since: '1.9.0', baseBitType: BitType.pageContainer },
  [BitType.pageContainerNowrap]: { since: '1.9.0', baseBitType: BitType.pageContainer },
  [BitType.pageContainerNowrapStretch]: { since: '1.9.0', baseBitType: BitType.pageContainer },
  [BitType.pageContainerFolder]: { since: '1.9.0', baseBitType: BitType.pageContainer },
  [BitType.pageContainerGroup]: { since: '1.9.0', baseBitType: BitType.pageContainer },
  [BitType.metalevelExplanation]: { since: '1.10.0', baseBitType: BitType.article },
  [BitType.module]: {
    since: '1.5.26',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_hasBookNavigation,
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
      {
        key: ConfigKey.property_productId,
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_duration,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.moduleProduct]: {
    since: '1.9.0',
    baseBitType: BitType.module,
    tags: [
      {
        key: ConfigKey.property_productId,
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.exampleList]: {
    since: '1.4.13',
    baseBitType: BitType.example,
    cardSet: CardSetConfigKey.exampleBitList,
    rootExampleType: ExampleType.string,
  },
  [BitType.extractorPage]: { since: '1.5.17', baseBitType: BitType.image },
  [BitType.extractorPageCollapsible]: { since: '1.30.0', baseBitType: BitType.extractorPage },
  [BitType.extractorPageWithBlocks]: { since: '1.5.21', baseBitType: BitType.image },
  [BitType.extractorPageWithBlocksCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.extractorPageWithBlocks,
  },
  [BitType.extractorConfiguration]: {
    since: '1.7.1',
    baseBitType: BitType._standard,
    tags: [],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.extractorInformation]: {
    since: '3.8.0',
    baseBitType: BitType._standard,
    tags: [],
    textFormatDefault: TextFormat.json,
  },
  [BitType.extractorAiChat]: { since: '3.19.0', baseBitType: BitType._standard },
  [BitType.extractorBlock]: {
    since: '1.5.16',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_blockId,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_pageNo,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_x,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_y,
        format: TagFormat.number,
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
        key: ConfigKey.property_index,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_classification,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_availableClassifications,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.group_resourceImage,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.extractorRepeatedText]: { since: '1.5.21', baseBitType: BitType.article },
  [BitType.extractorPageNumber]: { since: '1.5.21', baseBitType: BitType.article },
  [BitType.extractorPageNumberCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.extractorPageNumber,
  },
  [BitType.extractorPageHeader]: { since: '1.5.21', baseBitType: BitType.article },
  [BitType.extractorPageHeaderCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.extractorPageHeader,
  },
  [BitType.extractorPageFooter]: { since: '1.5.21', baseBitType: BitType.article },
  [BitType.extractorPageFooterCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.extractorPageFooter,
  },
  [BitType.pageOpenBook]: {
    since: '1.5.10',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_slug,
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
      {
        /* Allow incorrectly chained reference tag */
        key: ConfigKey.tag_reference,
      },
      {
        key: ConfigKey.property_buttonCaption,
      },
    ],
  },
  [BitType.pageOpenBookList]: {
    since: '2.1.0',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_book,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.tag_reference,
            maxCount: 2,
          },
        ],
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageSubscribe]: {
    since: '1.5.10',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_mailingList,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.assignmentList]: { since: '1.4.13', baseBitType: BitType.exampleList },
  [BitType.pageFooter]: {
    since: '1.4.13',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
    ],
    cardSet: CardSetConfigKey.exampleBitList,
  },
  [BitType.legend]: {
    since: '3.12.0',
    baseBitType: BitType._standard,
    tags: [],
    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.smartStandardLegend]: { since: '3.12.0', baseBitType: BitType.legend },
  [BitType.smartStandardLegendNonNormative]: { since: '3.12.0', baseBitType: BitType.legend },
  [BitType.smartStandardLegendNormative]: { since: '3.12.0', baseBitType: BitType.legend },
  [BitType.smartStandardRemarkLegend]: { since: '3.12.0', baseBitType: BitType.legend },
  [BitType.smartStandardRemarkLegendNonNormative]: { since: '3.12.0', baseBitType: BitType.legend },
  [BitType.smartStandardRemarkLegendNormative]: { since: '3.12.0', baseBitType: BitType.legend },
  [BitType.definitionList]: {
    since: '1.34.0',
    baseBitType: BitType._standard,
    tags: [],
    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.metaSearchDefaultTerms]: {
    since: '3.12.0',
    baseBitType: BitType._standard,
    tags: [],
    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.metaSearchDefaultTopics]: {
    since: '3.12.0',
    baseBitType: BitType.metaSearchDefaultTerms,
  },
  [BitType.flashcard]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
    ],
    cardSet: CardSetConfigKey.flashcard,
  },
  [BitType.flashcard1]: { since: '1.3.0', baseBitType: BitType.flashcard },
  [BitType.qAndACard]: { since: '3.25.0', baseBitType: BitType.flashcard1 },
  [BitType.focusImage]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    tags: [
      {
        key: ConfigKey.property_focusX,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_focusY,
        format: TagFormat.number,
      },
    ],
  },
  [BitType.highlightText]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.group_trueFalse,
      },
    ],
  },
  [BitType.image]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.resource_backgroundWallpaper,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
          },
        ],
      },
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceImage,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.appCreateBitsFromImage]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.appGetScreenshot]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.detailsImage]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.figure]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.imageBanner]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageFigure]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.imageFigureAlt]: { since: '1.16.0', baseBitType: BitType.imageFigure },
  [BitType.standardImageFigureNormative]: { since: '1.16.0', baseBitType: BitType.imageFigure },
  [BitType.standardImageFigureNonNormative]: { since: '1.16.0', baseBitType: BitType.imageFigure },
  [BitType.smartStandardImageFigureNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardImageFigureNormative,
  },
  [BitType.smartStandardImageFigureNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardImageFigureNonNormative,
  },
  [BitType.smartStandardImageFigureNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardImageFigureNormative,
  },
  [BitType.smartStandardImageFigureNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardImageFigureNonNormative,
  },
  [BitType.imageLandscape]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageMood]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imagePortrait]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imagePrototype]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageSeparator]: { since: '1.4.15', baseBitType: BitType.image },
  [BitType.imageSeparatorAlt]: { since: '1.16.0', baseBitType: BitType.imageSeparator },
  [BitType.imageScreenshot]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageStyled]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageSuperWide]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.imageZoom]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.langLifeSkillIcon]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.lifeSkillSticker]: { since: '1.3.0', baseBitType: BitType.image },
  [BitType.pageBanner]: {
    since: '1.4.3',
    baseBitType: BitType.image,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageHero]: { since: '1.11.0', baseBitType: BitType.pageBanner },
  [BitType.screenshot]: { since: '1.3.0', deprecated: '1.4.0', baseBitType: BitType.image },
  [BitType.tableImage]: {
    since: '1.5.15',
    baseBitType: BitType.image,
    tags: [
      {
        key: ConfigKey.property_caption,
        format: TagFormat.bitmarkText,
      },
    ],
  },
  [BitType.tableImageAlt]: { since: '1.16.0', baseBitType: BitType.tableImage },
  [BitType.standardTableImageNormative]: { since: '1.16.0', baseBitType: BitType.tableImage },
  [BitType.standardTableImageNonNormative]: { since: '1.16.0', baseBitType: BitType.tableImage },
  [BitType.standardRemarkTableImageNormative]: { since: '1.17.0', baseBitType: BitType.tableImage },
  [BitType.standardRemarkTableImageNonNormative]: {
    since: '1.17.0',
    baseBitType: BitType.tableImage,
  },
  [BitType.smartStandardTableImageNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardTableImageNormative,
  },
  [BitType.smartStandardTableImageNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardTableImageNonNormative,
  },
  [BitType.smartStandardRemarkTableImageNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkTableImageNormative,
  },
  [BitType.smartStandardRemarkTableImageNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkTableImageNonNormative,
  },
  [BitType.smartStandardTableImageNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardTableImageNormative,
  },
  [BitType.smartStandardTableImageNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardTableImageNonNormative,
  },
  [BitType.smartStandardRemarkTableImageNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkTableImageNormative,
  },
  [BitType.smartStandardRemarkTableImageNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkTableImageNonNormative,
  },
  [BitType.imageLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceImageLink,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.imageOnDevice]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceImage,
      },
      {
        key: ConfigKey.group_imageSource,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.imageResponsive]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        // Combo resource

        key: ConfigKey.group_resourceImageResponsive,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.imagesLogoGrave]: {
    since: '1.5.11',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        // Image resource

        key: ConfigKey.group_resourceImage,
        minCount: 1,
        maxCount: Count.infinity,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.prototypeImages]: {
    since: '1.6.1',
    baseBitType: BitType.imagesLogoGrave,
  },
  [BitType.internalLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.tag_reference,
      },
    ],
  },
  [BitType.interview]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.property_reasonableNumOfChars,
        format: TagFormat.number,
      },
    ],
    cardSet: CardSetConfigKey.questions,
  },
  [BitType.interviewInstructionGrouped]: { since: '1.3.0', baseBitType: BitType.interview },
  [BitType.botInterview]: { since: '1.3.0', baseBitType: BitType.interview },
  [BitType.learningPathBook]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_learningPathCommon,
      },
    ],
  },
  [BitType.bookLink]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.bookLinkNext]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.bookLinkPrev]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathClassroomEvent]: { since: '1.3.0', baseBitType: BitType.learningPathBook },
  [BitType.learningPathClassroomTraining]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
  },
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
        key: ConfigKey.property_bot,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.learningPathExternalLink]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    tags: [
      {
        key: ConfigKey.property_externalLink,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_externalLinkText,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.learningPathVideoCall]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    tags: [
      {
        key: ConfigKey.property_videoCallLink,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leLearningObjectives]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathLearningGoal,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leVideoCall]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathVideoCall,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leClassroomEvent]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathClassroomEvent,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leMultiDayEvent]: { since: '3.32.0', baseBitType: BitType.leClassroomEvent },
  [BitType.leCompletion]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathClosing,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leExternalLink]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathExternalLink,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leReadBook]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathBook,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leLearningStep]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathStep,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.lePreparationTask]: {
    since: '1.26.0',
    baseBitType: BitType.learningPathBook,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leRead]: { since: '1.27.0', baseBitType: BitType.lePreparationTask },
  [BitType.leTask]: { since: '1.27.0', baseBitType: BitType.lePreparationTask },
  [BitType.leTodo]: { since: '1.27.0', baseBitType: BitType.lePreparationTask },
  [BitType.leFollowUpTask]: { since: '1.27.0', baseBitType: BitType.lePreparationTask },
  [BitType.leFinishingTask]: { since: '1.27.0', baseBitType: BitType.lePreparationTask },
  [BitType.leAssignment]: { since: '1.27.0', baseBitType: BitType.lePreparationTask },
  [BitType.leWatchVideoEmbed]: {
    since: '1.27.0',
    baseBitType: BitType.learningPathBook,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceVideoEmbed,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.leListenAudioEmbed]: {
    since: '1.27.0',
    baseBitType: BitType.learningPathBook,
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceAudioEmbed,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },

  [BitType.listItem]: {
    since: '1.22.0',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_listItemIndent,
        format: TagFormat.number,
        defaultValue: '0',
      },
    ],
  },
  [BitType.standardListItem]: { since: '1.22.0', baseBitType: BitType.listItem },
  [BitType.smartStandardListItem]: { since: '1.28.0', baseBitType: BitType.standardListItem },
  [BitType.smartStandardListItemCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardListItem,
  },
  [BitType.mark]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.group_markConfig,
      },
      {
        key: ConfigKey.group_mark,
      },
    ],
  },
  [BitType.match]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.property_isCaseSensitive,
        format: TagFormat.boolean,
      },
    ],
    cardSet: CardSetConfigKey.matchPairs,
  },
  [BitType.matchAll]: { since: '1.3.0', baseBitType: BitType.match },
  [BitType.matchReverse]: { since: '1.3.0', baseBitType: BitType.match },
  [BitType.matchAllReverse]: { since: '1.3.0', baseBitType: BitType.match },
  [BitType.matchSolutionGrouped]: { since: '1.3.0', baseBitType: BitType.match },
  [BitType.matchMatrix]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    cardSet: CardSetConfigKey.matchMatrix,
  },
  [BitType.matchAudio]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    cardSet: CardSetConfigKey.matchAudioPairs,
  },
  [BitType.matchPicture]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    cardSet: CardSetConfigKey.matchImagePairs,
  },
  [BitType.feedback]: {
    since: '3.13.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_reasonableNumOfChars,
        format: TagFormat.number,
      },
    ],
    cardSet: CardSetConfigKey.feedback,
  },
  [BitType.learningDocumentationFeedback]: { since: '3.13.0', baseBitType: BitType.feedback },
  [BitType.handInFeedbackExpert]: { since: '3.30.0', baseBitType: BitType.feedback },
  [BitType.handInFeedbackSelf]: { since: '3.30.0', baseBitType: BitType.feedback },
  [BitType.multipleChoice1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.group_trueFalse,
      },
    ],
  },
  [BitType.coachSelfReflectionMultipleChoice1]: {
    since: '1.3.0',
    baseBitType: BitType.multipleChoice1,
  },
  [BitType.multipleChoice]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.group_trueFalse,
      }, // This is actually for multiple-choice-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardSetConfigKey.quiz,
  },
  [BitType.coachSelfReflectionMultipleChoice]: {
    since: '1.3.0',
    baseBitType: BitType.multipleChoice,
  },
  [BitType.multipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.group_trueFalse,
      },
    ],
  },
  [BitType.coachCallToActionMultipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType.multipleChoiceText,
  },
  [BitType.coachSelfReflectionMultipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType.multipleChoiceText,
  },
  [BitType.multipleResponse1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.group_trueFalse,
      },
    ],
  },
  [BitType.coachSelfReflectionMultipleResponse1]: {
    since: '1.3.0',
    baseBitType: BitType.multipleResponse1,
  },
  [BitType.multipleResponse]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.group_trueFalse,
      }, // This is actually for multiple-response-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardSetConfigKey.quiz,
  },
  [BitType.coachSelfReflectionMultipleResponse]: {
    since: '1.3.0',
    baseBitType: BitType.multipleResponse,
  },
  [BitType.page]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.tag_title,
      },
      {
        key: ConfigKey.property_thumbImage,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageCollapsible]: { since: '1.30.0', baseBitType: BitType.page },
  [BitType.pageCoverImage]: { since: '1.22.0', baseBitType: BitType.page },
  [BitType.pageBuyButton]: {
    since: '1.4.3',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_content2Buy,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageBuyButtonAlt]: { since: '1.31.0', baseBitType: BitType.pageBuyButton },
  [BitType.pageBuyButtonPromotion]: { since: '1.5.11', baseBitType: BitType.pageBuyButton },
  [BitType.pageSubpage]: {
    since: '1.6.6',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_page,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageShopInShop]: { since: '1.6.6', baseBitType: BitType.pageSubpage },
  [BitType.pageCategory]: { since: '1.6.6', baseBitType: BitType.pageSubpage },
  [BitType.pageAcademy]: { since: '1.6.6', baseBitType: BitType.pageSubpage },
  [BitType.pagePromotion]: { since: '1.6.6', baseBitType: BitType.pageSubpage },
  [BitType.pageSpecial]: { since: '1.6.6', baseBitType: BitType.pageSubpage },
  [BitType.pagePerson]: {
    since: '1.5.16',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.group_person,
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageProduct]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_product,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageProductList]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_slug,
      },
      // NOTE: Only one of productVideo or productVideoList should be used, not both - TODO: fix when know which one!
      {
        key: ConfigKey.property_product,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      // {
      //   key: ConfigKey.property_productList,
      //   format: TagFormat.plainText,
      //   maxCount: Count.infinity,
      // },
    ],
  },
  [BitType.pageProductVideo]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_productVideo,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageProductVideoList]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
      // NOTE: Only one of productVideo or productVideoList should be used, not both - TODO: fix when know which one!
      {
        key: ConfigKey.property_productVideo,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      // {
      //   key: ConfigKey.property_productVideoList,
      //   format: TagFormat.plainText,
      //   maxCount: Count.infinity,
      // },
    ],
  },
  [BitType.pageSectionFolder]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_slug,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_productFolder,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.photo]: {
    since: '1.3.0',
    baseBitType: BitType.image,
  },
  [BitType.quote]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_quotedPerson,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.rating]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [],
  },
  [BitType.coachSelfReflectionRating]: { since: '1.3.0', baseBitType: BitType.rating },
  [BitType.releaseNote]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_releaseVersion,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_releaseKind,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_releaseDate,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.reviewNote]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.tag_title,
      },
      {
        key: ConfigKey.property_resolved,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_resolvedDate,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_resolvedBy,
        format: TagFormat.plainText,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.reviewAuthorNote]: { since: '1.3.0', baseBitType: BitType.reviewNote },
  [BitType.reviewCustomerNote]: {
    //
    since: '3.5.0',
    baseBitType: BitType.reviewNote,
  },
  [BitType.reviewReviewerNote]: { since: '1.3.0', baseBitType: BitType.reviewNote },
  [BitType.reviewRequestForReviewNote]: { since: '1.3.0', baseBitType: BitType.reviewNote },
  [BitType.reviewApprovedNote]: { since: '1.3.0', baseBitType: BitType.reviewNote },
  [BitType.sampleSolution]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      // Not sure if these are actually valid here, but include them as they are in the test bit.
      {
        key: ConfigKey.tag_anchor,
      },
      {
        key: ConfigKey.tag_reference,
      },
    ],
  },

  [BitType.sequence]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
    ],
    cardSet: CardSetConfigKey.elements,
    rootExampleType: ExampleType.boolean,
  },
  [BitType.stillImageFilm]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        // Combo resource

        key: ConfigKey.group_resourceStillImageFilm,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.stillImageFilmEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceStillImageFilmEmbed,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.stillImageFilmLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceStillImageFilmLink,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.surveyAnonymous]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [],
  },
  [BitType.survey]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [],
  },
  [BitType.surveyMatrix]: {
    since: '1.6.2',
    baseBitType: BitType.image,
    tags: [
      {
        key: ConfigKey.property_pointerTop,
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
      {
        key: ConfigKey.property_pointerLeft,
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },
  [BitType.surveyMatrixMe]: { since: '1.6.2', baseBitType: BitType.surveyMatrix },
  [BitType.surveyRating]: {
    since: '1.6.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_ratingLevelStart,
        format: TagFormat.number,
        chain: [
          {
            key: ConfigKey.property_label,
            format: TagFormat.bitmarkText,
          },
        ],
      },
      {
        key: ConfigKey.property_ratingLevelEnd,
        format: TagFormat.number,
        chain: [
          {
            key: ConfigKey.property_label,
            format: TagFormat.bitmarkText,
          },
        ],
      },
      {
        key: ConfigKey.property_ratingLevelSelected,
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.surveyRatingOnce]: {
    since: '1.6.0',
    baseBitType: BitType.surveyRating,
  },
  [BitType.surveyRatingDisplay]: {
    since: '1.6.0',
    baseBitType: BitType.surveyRating,
  },
  [BitType.scorm]: {
    since: '1.5.11',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_scormSource,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_posterImage,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pronunciationTable]: {
    since: '3.1.0',
    baseBitType: BitType._standard,
    tags: [],
    cardSet: CardSetConfigKey.pronunciationTable,
  },
  [BitType.table]: {
    since: '1.5.19',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_caption,
        format: TagFormat.bitmarkText,
      },
      {
        key: ConfigKey.property_tableFixedHeader,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tableHeaderWhitespaceNoWrap,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tableSearch,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tableSort,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tablePagination,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tablePaginationLimit,
        format: TagFormat.number,
        defaultValue: '0',
      },
      {
        key: ConfigKey.property_tableHeight,
        format: TagFormat.number,
        defaultValue: '0',
      },
      {
        key: ConfigKey.property_tableWhitespaceNoWrap,
        format: TagFormat.boolean,
        // defaultValue: 'true',
      },
      {
        key: ConfigKey.property_tableAutoWidth,
        format: TagFormat.boolean,
        // defaultValue: 'true',
      },
      {
        key: ConfigKey.property_tableResizableColumns,
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tableColumnMinWidth,
        format: TagFormat.number,
      },
    ],
    cardSet: CardSetConfigKey.table,
  },
  [BitType.tableAlt]: { since: '1.16.0', baseBitType: BitType.table },
  [BitType.standardTableNormative]: { since: '1.16.0', baseBitType: BitType.table },
  [BitType.standardTableNonNormative]: { since: '1.16.0', baseBitType: BitType.table },
  [BitType.standardRemarkTableNormative]: { since: '1.17.0', baseBitType: BitType.table },
  [BitType.standardRemarkTableNonNormative]: { since: '1.17.0', baseBitType: BitType.table },
  [BitType.smartStandardTableNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardTableNormative,
  },
  [BitType.smartStandardTableNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardTableNonNormative,
  },
  [BitType.smartStandardRemarkTableNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkTableNormative,
  },
  [BitType.smartStandardRemarkTableNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkTableNonNormative,
  },
  [BitType.smartStandardTableNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardTableNormative,
  },
  [BitType.smartStandardTableNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardTableNonNormative,
  },
  [BitType.smartStandardRemarkTableNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkTableNormative,
  },
  [BitType.smartStandardRemarkTableNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkTableNonNormative,
  },
  [BitType.parameters]: { since: '1.18.0', baseBitType: BitType.table },
  [BitType.toc]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [],
  },
  [BitType.tocChapter]: {
    since: '1.5.5',
    baseBitType: BitType.toc,
    tags: [
      {
        key: ConfigKey.property_maxDisplayLevel,
        format: TagFormat.number,
      },
    ],
  },
  [BitType.tocInline]: {
    since: '3.24.0',
    baseBitType: BitType.toc,
    tags: [
      {
        key: ConfigKey.property_maxTocChapterLevel,
        format: TagFormat.number,
      },
    ],
  },
  [BitType.tocResource]: {
    since: '3.31.0',
    baseBitType: BitType.toc,
    tags: [
      {
        key: ConfigKey.property_tocResource,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.tocContent]: {
    since: '3.31.0',
    baseBitType: BitType.toc,
    tags: [
      {
        key: ConfigKey.property_tocContent,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.anchor]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.bitBookEnding]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.bitBookSummary]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.botActionAnnounce]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.botActionRatingNumber]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.botActionRemind]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.botActionSave]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.botActionTrueFalse]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.chapterSubjectMatter]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.chat]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.conclusion]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.conclusionAlt]: { since: '1.16.0', baseBitType: BitType.conclusion },
  [BitType.documentUpload]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.footNote]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.groupBorn]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.groupDied]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.recordAudio]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.recordVideo]: { since: '1.5.24', baseBitType: BitType._standard },
  [BitType.stickyNote]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.takePicture]: { since: '1.3.0', baseBitType: BitType._standard },
  [BitType.handInAudio]: { since: '1.5.15', baseBitType: BitType._standard },
  [BitType.handInContact]: { since: '1.5.15', baseBitType: BitType._standard },
  [BitType.handInDocument]: { since: '1.5.15', baseBitType: BitType._standard },
  [BitType.handInFile]: {
    //
    since: '3.2.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_handInAcceptFileType,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.handInLocation]: { since: '1.5.15', baseBitType: BitType._standard },
  [BitType.handInPhoto]: { since: '1.5.15', baseBitType: BitType._standard },
  [BitType.handInScan]: { since: '1.5.15', baseBitType: BitType._standard },
  [BitType.handInSubmit]: {
    //
    since: '3.2.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.property_handInRequirement,
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_handInInstruction,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_buttonCaption,
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.handInVideo]: { since: '1.5.15', baseBitType: BitType._standard },
  [BitType.handInVoice]: { since: '1.5.15', baseBitType: BitType._standard },
  [BitType.trueFalse1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.property_labelTrue,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_labelFalse,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.tag_true,
      },
      {
        key: ConfigKey.tag_false,
      },
    ],
    rootExampleType: ExampleType.boolean,
  },

  [BitType.trueFalse]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
      },
      {
        key: ConfigKey.property_labelTrue,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_labelFalse,
        format: TagFormat.plainText,
      },
    ],
    cardSet: CardSetConfigKey.statements,
  },
  [BitType.vendorAmcharts5Chart]: {
    since: '1.5.8',
    baseBitType: BitType.code,
    tags: [],
    textFormatDefault: TextFormat.json,
  },
  [BitType.vendorDatadogDashboardEmbed]: {
    since: '3.12.0',
    baseBitType: BitType.code,
    tags: [
      {
        key: ConfigKey.property_vendorDashboardId,
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorFormbricksEmbed]: {
    since: '3.8.0',
    baseBitType: BitType.code,
    tags: [
      {
        key: ConfigKey.property_vendorSurveyId,
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorFormbricksEmbedAnonymous]: {
    since: '3.9.0',
    baseBitType: BitType.vendorFormbricksEmbed,
  },
  [BitType.vendorFormbricksLink]: {
    since: '3.8.0',
    baseBitType: BitType.code,
    tags: [
      {
        key: ConfigKey.property_vendorSurveyId,
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorFormbricksLinkAnonymous]: {
    since: '3.9.0',
    baseBitType: BitType.vendorFormbricksLink,
  },
  [BitType.vendorHighchartsChart]: {
    since: '1.5.28',
    baseBitType: BitType.vendorAmcharts5Chart,
  },
  [BitType.vendorIframelyEmbed]: {
    since: '1.5.10',
    baseBitType: BitType.code,
    tags: [
      {
        key: ConfigKey.property_width, // Same as image
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height, // Same as image
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_vendorUrl,
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorIframelyCard]: { since: '1.5.10', baseBitType: BitType.vendorIframelyEmbed },
  [BitType.vendorIframelyPreview]: { since: '1.5.10', baseBitType: BitType.vendorIframelyEmbed },
  [BitType.vendorIframelyPreviewMini]: {
    since: '1.5.10',
    baseBitType: BitType.vendorIframelyEmbed,
  },
  [BitType.vendorJupyterOutput]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    tags: [
      {
        key: ConfigKey.property_jupyterId,
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_jupyterExecutionCount,
        format: TagFormat.number,
      },
    ],
    textFormatDefault: TextFormat.plainText,
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
        key: ConfigKey.property_padletId,
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorStripePricingTable]: {
    since: '1.20.0',
    baseBitType: BitType.article,
    tags: [
      {
        key: ConfigKey.property_stripePricingTableId,
        format: TagFormat.plainText,
        minCount: 1,
      },
      {
        key: ConfigKey.property_stripePublishableKey,
        format: TagFormat.plainText,
        minCount: 1,
      },
    ],
  },
  [BitType.vendorStripePricingTableExternal]: {
    since: '3.13.0',
    baseBitType: BitType.vendorStripePricingTable,
  },

  [BitType.video]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceVideo,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.videoLandscape]: { since: '1.3.0', baseBitType: BitType.video },
  [BitType.videoPortrait]: { since: '1.3.0', baseBitType: BitType.video },
  [BitType.videoEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceVideoEmbed,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.videoEmbedLandscape]: { since: '1.3.0', baseBitType: BitType.videoEmbed },
  [BitType.videoEmbedPortrait]: { since: '1.3.0', baseBitType: BitType.videoEmbed },
  [BitType.videoLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceVideoLink,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.videoLinkLandscape]: { since: '1.3.0', baseBitType: BitType.videoLink },
  [BitType.videoLinkPortrait]: { since: '1.3.0', baseBitType: BitType.videoLink },
  [BitType.websiteLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
      },
      {
        key: ConfigKey.group_resourceWebsiteLink,
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
};

export { BITS };
