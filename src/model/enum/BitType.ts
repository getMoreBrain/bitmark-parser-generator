import { EnumType, superenum } from '@ncoderz/superenum';

import { TagDataMap } from '../config/TagData';

import { CardSetTypeType } from './CardSetType';
import { ExampleTypeType } from './ExampleType';
import { ResourceTypeType } from './ResourceType';

// Type containing both the root and alias bit types
export interface BitType {
  alias: RootOrAliasBitTypeType;
  root: RootBitTypeType;
}

export type RootBitTypeType = EnumType<typeof RootBitType>;
export type AliasBitTypeType = EnumType<typeof AliasBitType>;
export type RootOrAliasBitTypeType = RootBitTypeType | AliasBitTypeType;

export interface RootBitTypeMetadata {
  // Tags, Property Tags, and Tag chains that are valid for this bit type
  tags: TagDataMap;

  // Is a resource attachment allowed (e.g. not for [.image], but for [.article&image])
  // (default: false)
  resourceAttachmentAllowed?: boolean;

  // Resource type that is valid for this bit type
  resourceType?: ResourceTypeType;

  // Type of card set that is valid for this bit type (if any)
  cardSet?: CardSetConfig;

  // Is a body allowed? (default: false)
  bodyAllowed?: boolean;

  // Is a footer allowed? (default: false)
  footerAllowed?: boolean;

  // Top-level example type (default: none)
  rootExampleType?: ExampleTypeType;
}

/**
 * TODO: The CardSetConfig needs improving to handle more use cases
 * - Different card configurations
 * - Infinitely repeating cards (this is the default, but maybe there could also be limited cards)
 * - Infinitely repeating sides (this is hacked in at the moment, but the config is not really correct)
 */
export interface CardSetConfig {
  type: CardSetTypeType;

  // Configuration for each variant from the card set
  // - all cards have the same config
  // - each variant is indexed via side and variant
  variants: CardSetVariantConfig[][];
}

export interface CardSetVariantConfig {
  // Tags, Property Tags, and Tag chains that are valid for this bit type
  tags: TagDataMap;

  // Is a body allowed in this card variant? (default: false)
  bodyAllowed?: boolean;

  // If true, this config repeats infinitely
  infiniteRepeat?: boolean;
}

const RootBitType = superenum({
  _error: '_error', // Used for error handling to indicate a bit type that is not supported or a bit parse error
  appLink: 'app-link',
  article: 'article',
  articleEmbed: 'article-embed',
  articleLink: 'article-link',
  audio: 'audio',
  audioEmbed: 'audio-embed',
  audioLink: 'audio-link',
  bitAlias: 'bit-alias',
  book: 'book',
  botActionResponse: 'bot-action-response',
  botActionSend: 'bot-action-send',
  browserImage: 'browser-image',
  chapter: 'chapter',
  cloze: 'cloze',
  clozeAndMultipleChoiceText: 'cloze-and-multiple-choice-text',
  code: 'code',
  conversationLeft1: 'conversation-left-1',
  document: 'document',
  documentDownload: 'document-download',
  documentEmbed: 'document-embed',
  documentLink: 'document-link',
  essay: 'essay',
  example: 'example',
  flashcard: 'flashcard',
  flashcard1: 'flashcard-1',
  focusImage: 'focus-image',
  highlightText: 'highlight-text',
  image: 'image',
  imageLink: 'image-link',
  internalLink: 'internal-link',
  interview: 'interview',
  learningPathBook: 'learning-path-book',
  learningPathExternalLink: 'learning-path-external-link',
  learningPathVideoCall: 'learning-path-video-call',
  mark: 'mark',
  match: 'match',
  matchAudio: 'match-audio',
  matchMatrix: 'match-matrix',
  matchPicture: 'match-picture',
  multipleChoice: 'multiple-choice',
  multipleChoice1: 'multiple-choice-1',
  multipleChoiceText: 'multiple-choice-text',
  multipleResponse: 'multiple-response',
  multipleResponse1: 'multiple-response-1',
  photo: 'photo',
  quote: 'quote',
  rating: 'rating',
  // record: 'record',
  releaseNote: 'release-note',
  sampleSolution: 'sample-solution',
  screenshot: 'screenshot',
  sequence: 'sequence',
  stillImageFilm: 'still-image-film',
  stillImageFilmEmbed: 'still-image-film-embed',
  stillImageFilmLink: 'still-image-film-link',
  survey: 'survey',
  surveyAnonymous: 'survey-anonymous',
  toc: 'toc',
  trueFalse: 'true-false',
  trueFalse1: 'true-false-1',
  vendorPadletEmbed: 'vendor-padlet-embed',
  video: 'video',
  videoEmbed: 'video-embed',
  videoLink: 'video-link',
  websiteLink: 'website-link',
});

const AliasBitType = superenum({
  card1: 'card-1',
  question1: 'question-1',
  survey1: 'survey-1',
  surveyAnonymous1: 'survey-anonymous-1',
  conclusion: 'conclusion',
  footNote: 'foot-note',
  stickyNote: 'sticky-note',
  aiPrompt: 'ai-prompt',
  anchor: 'anchor',
  appAiPrompt: 'app-ai-prompt',
  articleAi: 'article-ai',
  articleAttachment: 'article-attachment',
  assignment: 'assignment',
  audioTranscript: 'audio-transcript',
  bitBookEnding: 'bit-book-ending',
  bitBookSummary: 'bit-book-summary',
  bitmarkExample: 'bitmark-example',
  blogArticle: 'blog-article',
  bookAcknowledgments: 'book-acknowledgments',
  bookAddendum: 'book-addendum',
  bookAfterword: 'book-afterword',
  bookAppendix: 'book-appendix',
  bookArticle: 'book-article',
  bookAutherBio: 'book-author-bio',
  bookBibliography: 'book-bibliography',
  bookComingSoon: 'book-coming-soon',
  bookConclusion: 'book-conclusion',
  bookCopyright: 'book-copyright',
  bookCopyrightPermissions: 'book-copyright-permissions',
  bookDedication: 'book-dedication',
  bookEndnotes: 'book-endnotes',
  bookEpigraph: 'book-epigraph',
  bookEpilogue: 'book-epilogue',
  bookForword: 'book-foreword',
  bookFrontispiece: 'book-frontispiece',
  bookImprint: 'book-imprint',
  bookIncitingIncident: 'book-inciting-incident',
  bookIntroduction: 'book-introduction',
  bookListOfContributors: 'book-list-of-contributors',
  bookNotes: 'book-notes',
  bookPostscript: 'book-postscript',
  bookPreface: 'book-preface',
  bookPrologue: 'book-prologue',
  bookReadMore: 'book-read-more',
  bookReferenceList: 'book-reference-list',
  bookRequestForABookReview: 'book-request-for-a-book-review',
  bookSummary: 'book-summary',
  bookTeaser: 'book-teaser',
  bookTitle: 'book-title',
  botActionAnnounce: 'bot-action-announce',
  botActionRatingNumber: 'bot-action-rating-number',
  botActionRemind: 'bot-action-remind',
  botActionSave: 'bot-action-save',
  botActionTrueFalse: 'bot-action-true-false',
  botInterview: 'bot-interview',
  bug: 'bug',
  chapterSubjectMatter: 'chapter-subject-matter',
  chat: 'chat',
  checklist: 'checklist',
  clozeInstructionGrouped: 'cloze-instruction-grouped',
  clozeSolutionGrouped: 'cloze-solution-grouped',
  coachAudioTranscript: 'coach-audio-transcript',
  coachCallToActionChecklist: 'coach-call-to-action-checklist',
  coachCallToActionCloze: 'coach-call-to-action-cloze',
  coachCallToActionClozeAndMultipleChoiceText: 'coach-call-to-action-cloze-and-multiple-choice-text',
  coachCallToActionEssay: 'coach-call-to-action-essay',
  coachCallToActionMultipleChoiceText: 'coach-call-to-action-multiple-choice-text',
  coachHomeRules: 'coach-home-rules',
  coachSelfReflectionCloze: 'coach-self-reflection-cloze',
  coachSelfReflectionEssay: 'coach-self-reflection-essay',
  coachSelfReflectionMultipleChoice: 'coach-self-reflection-multiple-choice',
  coachSelfReflectionMultipleChoice1: 'coach-self-reflection-multiple-choice-1',
  coachSelfReflectionMultipleChoiceText: 'coach-self-reflection-multiple-choice-text',
  coachSelfReflectionMultipleResponse: 'coach-self-reflection-multiple-response',
  coachSelfReflectionMultipleResponse1: 'coach-self-reflection-multiple-response-1',
  coachSelfReflectionRating: 'coach-self-reflection-rating',
  coachVideoTranscript: 'coach-video-transcript',
  conversationLeft1Scream: 'conversation-left-1-scream',
  conversationLeft1Thought: 'conversation-left-1-thought',
  conversationRight1: 'conversation-right-1',
  conversationRight1Scream: 'conversation-right-1-scream',
  conversationRight1Thought: 'conversation-right-1-thought',
  cookArrangement: 'cook-arrangement',
  cookIngredients: 'cook-ingredients',
  cookInsert: 'cook-insert',
  cookPersonalRecommendation: 'cook-personal-recommendation',
  cookPlate: 'cook-plate',
  cookPracticeAdvise: 'cook-practice-advise',
  cookPreparation: 'cook-preparation',
  cookRecommendation: 'cook-recommendation',
  cookRemark: 'cook-remark',
  cookSideDish: 'cook-side-dish',
  cookSideDrink: 'cook-side-drink',
  cookStep: 'cook-step',
  cookTimer: 'cook-timer',
  cookVariation: 'cook-variation',
  correction: 'correction',
  danger: 'danger',
  details: 'details',
  details1: 'details-1',
  documentUpload: 'document-upload',
  editorial: 'editorial',
  editorNote: 'editor-note',
  featured: 'featured',
  groupBorn: 'group-born',
  groupDied: 'group-died',
  help: 'help',
  hint: 'hint',
  imageLandscape: 'image-landscape',
  imageOnDevice: 'image-on-device',
  imagePortrait: 'image-portrait',
  imagePrototype: 'image-prototype',
  imageSuperWide: 'image-super-wide',
  imageZoom: 'image-zoom',
  info: 'info',
  interviewInstructionGrouped: 'interview-instruction-grouped',
  langAudioScript: 'lang-audio-script',
  langEnablingLanguageSkills: 'lang-enabling-language-skills',
  langEnglishAroundWorld: 'lang-english-around-world',
  langExtraActivity: 'lang-extra-activity',
  langGoodToKnow: 'lang-good-to-know',
  langHomework: 'lang-homework',
  langLearningGoal: 'lang-learning-goal',
  langLearningOutcomes: 'lang-learning-outcomes',
  langLearningStrategy: 'lang-learning-strategy',
  langLevelDown: 'lang-level-down',
  langLevelUp: 'lang-level-up',
  langLifeSkills: 'lang-life-skills',
  langLikeALocal: 'lang-like-a-local',
  langMaterial: 'lang-material',
  langTeacherNote: 'lang-teacher-note',
  langTeacherPronunciation: 'lang-teacher-pronunciation',
  langUsefulPhrases: 'lang-useful-phrases',
  langVideoScript: 'lang-video-script',
  langVocabulary: 'lang-vocabulary',
  learningPathBotTraining: 'learning-path-bot-training',
  learningPathClassroomEvent: 'learning-path-classroom-event',
  learningPathClassroomTraining: 'learning-path-classroom-training',
  learningPathClosing: 'learning-path-closing',
  learningPathExternalLink: 'learning-path-external-link',
  learningPathFeedback: 'learning-path-feedback',
  learningPathLearningGoal: 'learning-path-learning-goal',
  learningPathLti: 'learning-path-lti',
  learningPathSign: 'learning-path-sign',
  learningPathStep: 'learning-path-step',
  learningPathVideoCall: 'learning-path-video-call',
  matchAll: 'match-all',
  matchAllReverse: 'match-all-reverse',
  matchReverse: 'match-reverse',
  matchSolutionGrouped: 'match-solution-grouped',
  message: 'message',
  newspaperArticle: 'newspaper-article',
  note: 'note',
  noteAi: 'note-ai',
  notebookArticle: 'notebook-article',
  page: 'page',
  preparationNote: 'preparation-note',
  recordAudio: 'record-audio',
  releaseNotesSummary: 'release-notes-summary',
  remark: 'remark',
  selfAssessment: 'self-assessment',
  sideNote: 'side-note',
  statement: 'statement',
  summary: 'summary',
  summaryAi: 'summary-ai',
  takePicture: 'take-picture',
  videoLandscape: 'video-landscape',
  videoPortrait: 'video-portrait',
  videoTranscript: 'video-transcript',
  warning: 'warning',
  workbookArticle: 'workbook-article',
});

const RootBitTypeToAliasMap = {
  [RootBitType.article]: [
    //
    AliasBitType.page,
    AliasBitType.statement,
  ],
  [RootBitType.book]: [
    AliasBitType.bookAcknowledgments,
    AliasBitType.bookAddendum,
    AliasBitType.bookAfterword,
    AliasBitType.bookAppendix,
    AliasBitType.bookArticle,
    AliasBitType.bookAutherBio,
    AliasBitType.bookBibliography,
    AliasBitType.bookComingSoon,
    AliasBitType.bookConclusion,
    AliasBitType.bookCopyright,
    AliasBitType.bookCopyrightPermissions,
    AliasBitType.bookDedication,
    AliasBitType.bookEndnotes,
    AliasBitType.bookEpigraph,
    AliasBitType.bookEpilogue,
    AliasBitType.bookForword,
    AliasBitType.bookFrontispiece,
    AliasBitType.bookImprint,
    AliasBitType.bookIncitingIncident,
    AliasBitType.bookIntroduction,
    AliasBitType.bookListOfContributors,
    AliasBitType.bookNotes,
    AliasBitType.bookPostscript,
    AliasBitType.bookPreface,
    AliasBitType.bookPrologue,
    AliasBitType.bookReadMore,
    AliasBitType.bookReferenceList,
    AliasBitType.bookRequestForABookReview,
    AliasBitType.bookSummary,
    AliasBitType.bookTeaser,
    AliasBitType.bookTitle,
  ],
  [RootBitType.cloze]: [
    //
    AliasBitType.clozeInstructionGrouped,
    AliasBitType.clozeSolutionGrouped,
    AliasBitType.coachSelfReflectionCloze,
    AliasBitType.coachCallToActionCloze,
  ],
  [RootBitType.clozeAndMultipleChoiceText]: [
    //
    AliasBitType.coachCallToActionClozeAndMultipleChoiceText,
  ],
  [RootBitType.conversationLeft1]: [
    //
    AliasBitType.conversationLeft1Scream,
    AliasBitType.conversationLeft1Thought,
    AliasBitType.conversationRight1,
    AliasBitType.conversationRight1Scream,
    AliasBitType.conversationRight1Thought,
  ],
  [RootBitType.essay]: [
    //
    AliasBitType.coachSelfReflectionEssay,
    AliasBitType.coachCallToActionEssay,
  ],
  [RootBitType.example]: [
    AliasBitType.appAiPrompt,
    AliasBitType.aiPrompt,
    AliasBitType.articleAi,
    AliasBitType.articleAttachment,
    AliasBitType.assignment,
    AliasBitType.audioTranscript,
    AliasBitType.bitmarkExample,
    AliasBitType.blogArticle,
    AliasBitType.bug,
    AliasBitType.checklist,
    AliasBitType.coachAudioTranscript,
    AliasBitType.coachCallToActionChecklist,
    AliasBitType.coachHomeRules,
    AliasBitType.coachVideoTranscript,
    AliasBitType.correction,
    AliasBitType.cookPreparation,
    AliasBitType.cookStep,
    AliasBitType.cookIngredients,
    AliasBitType.cookRemark,
    AliasBitType.cookVariation,
    AliasBitType.cookInsert,
    AliasBitType.cookArrangement,
    AliasBitType.cookPracticeAdvise,
    AliasBitType.cookPlate,
    AliasBitType.cookRecommendation,
    AliasBitType.cookPersonalRecommendation,
    AliasBitType.cookSideDrink,
    AliasBitType.cookSideDish,
    AliasBitType.cookTimer,
    AliasBitType.danger,
    AliasBitType.details1,
    AliasBitType.details,
    AliasBitType.editorial,
    // BitTypeAlias.example,
    AliasBitType.editorNote,
    AliasBitType.featured,
    AliasBitType.help,
    AliasBitType.hint,
    AliasBitType.info,
    AliasBitType.langLearningOutcomes,
    AliasBitType.langEnablingLanguageSkills,
    AliasBitType.langLifeSkills,
    AliasBitType.langEnglishAroundWorld,
    AliasBitType.langGoodToKnow,
    AliasBitType.langLearningGoal,
    AliasBitType.langLearningStrategy,
    AliasBitType.langLikeALocal,
    AliasBitType.langMaterial,
    AliasBitType.langUsefulPhrases,
    AliasBitType.langLevelDown,
    AliasBitType.langLevelUp,
    AliasBitType.langExtraActivity,
    AliasBitType.langVideoScript,
    AliasBitType.langAudioScript,
    AliasBitType.langVocabulary,
    AliasBitType.langHomework,
    AliasBitType.langTeacherNote,
    AliasBitType.langTeacherPronunciation,
    AliasBitType.message,
    AliasBitType.newspaperArticle,
    AliasBitType.note,
    AliasBitType.noteAi,
    AliasBitType.notebookArticle,
    // BitTypeAlias.page,
    AliasBitType.preparationNote,
    AliasBitType.releaseNotesSummary,
    AliasBitType.remark,
    AliasBitType.selfAssessment,
    AliasBitType.sideNote,
    // BitTypeAlias.statement,
    AliasBitType.summary,
    AliasBitType.summaryAi,
    AliasBitType.videoTranscript,
    AliasBitType.warning,
    AliasBitType.workbookArticle,
  ],
  [RootBitType.image]: [
    //
    AliasBitType.imageLandscape,
    AliasBitType.imageOnDevice,
    AliasBitType.imagePortrait,
    AliasBitType.imagePrototype,
    AliasBitType.imageSuperWide,
    AliasBitType.imageZoom,
  ],
  [RootBitType.interview]: [
    //
    AliasBitType.interviewInstructionGrouped,
    AliasBitType.botInterview,
  ],
  [RootBitType.learningPathBook]: [
    //
    AliasBitType.learningPathBotTraining,
    AliasBitType.learningPathClassroomEvent,
    AliasBitType.learningPathClassroomTraining,
    AliasBitType.learningPathClosing,
    AliasBitType.learningPathFeedback,
    AliasBitType.learningPathLearningGoal,
    AliasBitType.learningPathLti,
    AliasBitType.learningPathSign,
    AliasBitType.learningPathStep,
  ],
  [RootBitType.mark]: [
    //
    AliasBitType.card1,
    AliasBitType.question1,
    AliasBitType.survey1,
    AliasBitType.surveyAnonymous1,
  ],
  [RootBitType.match]: [
    //
    AliasBitType.matchAll,
    AliasBitType.matchReverse,
    AliasBitType.matchAllReverse,
    AliasBitType.matchSolutionGrouped,
  ],
  [RootBitType.multipleChoice1]: [
    //
    AliasBitType.coachSelfReflectionMultipleChoice1,
  ],
  [RootBitType.multipleChoice]: [
    //
    AliasBitType.coachSelfReflectionMultipleChoice,
  ],
  [RootBitType.multipleChoiceText]: [
    //
    AliasBitType.coachCallToActionMultipleChoiceText,
    AliasBitType.coachSelfReflectionMultipleChoiceText,
  ],
  [RootBitType.multipleResponse1]: [
    //
    AliasBitType.coachSelfReflectionMultipleResponse1,
  ],
  [RootBitType.multipleResponse]: [
    //
    AliasBitType.coachSelfReflectionMultipleResponse,
  ],
  [RootBitType.rating]: [
    //
    AliasBitType.coachSelfReflectionRating,
  ],
  [RootBitType.toc]: [
    //
    AliasBitType.anchor,
    AliasBitType.bitBookEnding,
    AliasBitType.bitBookSummary,
    AliasBitType.botActionAnnounce,
    AliasBitType.botActionRatingNumber,
    AliasBitType.botActionRemind,
    AliasBitType.botActionSave,
    AliasBitType.botActionTrueFalse,
    AliasBitType.chapterSubjectMatter,
    AliasBitType.chat,
    AliasBitType.conclusion,
    AliasBitType.documentUpload,
    AliasBitType.footNote,
    AliasBitType.groupBorn,
    AliasBitType.groupDied,
    AliasBitType.recordAudio,
    AliasBitType.stickyNote,
    AliasBitType.takePicture,
  ],
  [RootBitType.video]: [
    //
    AliasBitType.videoLandscape,
    AliasBitType.videoPortrait,
  ],
};

// Create the bit type alias map for fast lookups

const BitTypeAliasMap: Map<RootOrAliasBitTypeType, RootBitTypeType> = new Map();

class BitTypeUtils {
  /**
   * Return the bitType (root and alias types) given a root or alias bit type
   *
   * If the bit type is not found, the returned bitType will contain the  _error bit type
   *
   * @param aliasOrRootBitType bit type in (root or alias, may be invalid)
   * @returns valid bitType (root and alias types) which will contain _error bit types if the bit type is invalid
   */
  public static getBitType(aliasOrRootBitType: RootOrAliasBitTypeType | string | undefined): BitType {
    const alias = BitTypeUtils.getAliasedBitType(aliasOrRootBitType);
    const root = BitTypeUtils.getRootBitType(alias);
    return {
      alias,
      root,
    };
  }

  private static getRootBitType(bitTypeOrAlias: RootOrAliasBitTypeType | undefined): RootBitTypeType {
    if (!bitTypeOrAlias) return RootBitType._error;
    return BitTypeAliasMap.get(bitTypeOrAlias) ?? RootBitType._error;
  }

  private static getAliasedBitType(bitTypeOrAlias: string | undefined): RootOrAliasBitTypeType {
    return AliasBitType.fromValue(bitTypeOrAlias) ?? RootBitType.fromValue(bitTypeOrAlias) ?? RootBitType._error;
  }
}

function init() {
  // Ensure bit type aliases to itself
  for (const v of RootBitType.values()) {
    BitTypeAliasMap.set(v as RootOrAliasBitTypeType, v as RootBitTypeType);
  }
  // Aliases to bit type
  for (const [k, v] of Object.entries(RootBitTypeToAliasMap)) {
    for (const vv of v) {
      BitTypeAliasMap.set(vv as RootOrAliasBitTypeType, k as RootBitTypeType);
    }
  }
}

// Initialise on first import
init();

export { RootBitType, AliasBitType, BitTypeUtils };
