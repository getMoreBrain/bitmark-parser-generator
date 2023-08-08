import { EnumType, superenum } from '@ncoderz/superenum';

import { TagDataMap } from '../config/TagData';

import { CardSetTypeType } from './CardSetType';
import { ExampleTypeType } from './ExampleType';
import { ResourceTypeType } from './ResourceType';

export interface BitTypeMetadata {
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

const BitType = superenum({
  _error: '_error', // Used for error handling to indicate a bit type that is not supported or a bit parse error
  aiPrompt: 'ai-prompt',
  anchor: 'anchor',
  appLink: 'app-link',
  article: 'article',
  articleAi: 'article-ai',
  articleAttachment: 'article-attachment',
  articleEmbed: 'article-embed',
  articleLink: 'article-link',
  assignment: 'assignment',
  audio: 'audio',
  audioEmbed: 'audio-embed',
  audioLink: 'audio-link',
  bitAlias: 'bit-alias',
  bitBookEnding: 'bit-book-ending',
  bitBookSummary: 'bit-book-summary',
  blogArticle: 'blog-article',
  book: 'book',
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
  botActionResponse: 'bot-action-response',
  botActionSave: 'bot-action-save',
  botActionSend: 'bot-action-send',
  botActionTrueFalse: 'bot-action-true-false',
  botInterview: 'bot-interview',
  browserImage: 'browser-image',
  bug: 'bug',
  card1: 'card-1',
  chapter: 'chapter',
  chapterSubjectMatter: 'chapter-subject-matter',
  chat: 'chat',
  cloze: 'cloze',
  clozeAndMultipleChoiceText: 'cloze-and-multiple-choice-text',
  clozeInstructionGrouped: 'cloze-instruction-grouped',
  clozeSolutionGrouped: 'cloze-solution-grouped',
  code: 'code',
  conclusion: 'conclusion',
  conversationLeft1: 'conversation-left-1',
  conversationLeft1Scream: 'conversation-left-1-scream',
  conversationLeft1Thought: 'conversation-left-1-thought',
  conversationRight1: 'conversation-right-1',
  conversationRight1Scream: 'conversation-right-1-scream',
  conversationRight1Thought: 'conversation-right-1-thought',
  cookPreparation: 'cook-preparation',
  cookStep: 'cook-step',
  cookIngredients: 'cook-ingredients',
  cookRemark: 'cook-remark',
  cookVariation: 'cook-variation',
  cookInsert: 'cook-insert',
  cookArrangement: 'cook-arrangement',
  cookPracticeAdvise: 'cook-practice-advise',
  cookPlate: 'cook-plate',
  cookRecommendation: 'cook-recommendation',
  cookPersonalRecommendation: 'cook-personal-recommendation',
  cookSideDrink: 'cook-side-drink',
  cookSideDish: 'cook-side-dish',
  cookTimer: 'cook-timer',
  correction: 'correction',
  danger: 'danger',
  details: 'details',
  details1: 'details-1',
  document: 'document',
  documentDownload: 'document-download',
  documentEmbed: 'document-embed',
  documentLink: 'document-link',
  documentUpload: 'document-upload',
  editorial: 'editorial',
  essay: 'essay',
  example: 'example',
  featured: 'featured',
  flashcard: 'flashcard',
  flashcard1: 'flashcard-1',
  focusImage: 'focus-image',
  footNote: 'foot-note',
  groupBorn: 'group-born',
  groupDied: 'group-died',
  help: 'help',
  highlightText: 'highlight-text',
  hint: 'hint',
  image: 'image',
  imageLandscape: 'image-landscape',
  imageLink: 'image-link',
  imageOnDevice: 'image-on-device',
  imagePortrait: 'image-portrait',
  imagePrototype: 'image-prototype',
  imageSuperWide: 'image-super-wide',
  imageZoom: 'image-zoom',
  info: 'info',
  internalLink: 'internal-link',
  interview: 'interview',
  interviewInstructionGrouped: 'interview-instruction-grouped',
  langLearningOutcomes: 'lang-learning-outcomes',
  langEnablingLanguageSkills: 'lang-enabling-language-skills',
  langLifeSkills: 'lang-life-skills',
  langEnglishAroundWorld: 'lang-english-around-world',
  langGoodToKnow: 'lang-good-to-know',
  langLearningStrategy: 'lang-learning-strategy',
  langLikeALocal: 'lang-like-a-local',
  langUsefulPhrases: 'lang-useful-phrases',
  langLevelDown: 'lang-level-down',
  langLevelUp: 'lang-level-up',
  langExtraActivity: 'lang-extra-activity',
  langVideoScript: 'lang-video-script',
  langAudioScript: 'lang-audio-script',
  langVocabulary: 'lang-vocabulary',
  langHomework: 'lang-homework',
  langTeacherNote: 'lang-teacher-note',
  learningPathBook: 'learning-path-book',
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
  mark: 'mark',
  match: 'match',
  matchAll: 'match-all',
  matchAllReverse: 'match-all-reverse',
  matchAudio: 'match-audio',
  matchMatrix: 'match-matrix',
  matchPicture: 'match-picture',
  matchReverse: 'match-reverse',
  matchSolutionGrouped: 'match-solution-grouped',
  message: 'message',
  multipleChoice: 'multiple-choice',
  multipleChoice1: 'multiple-choice-1',
  multipleChoiceText: 'multiple-choice-text',
  multipleResponse: 'multiple-response',
  multipleResponse1: 'multiple-response-1',
  newspaperArticle: 'newspaper-article',
  note: 'note',
  noteAi: 'note-ai',
  notebookArticle: 'notebook-article',
  page: 'page',
  photo: 'photo',
  preparationNote: 'preparation-note',
  question1: 'question-1',
  quote: 'quote',
  rating: 'rating',
  // record: 'record',
  recordAudio: 'record-audio',
  releaseNote: 'release-note',
  releaseNotesSummary: 'release-notes-summary',
  remark: 'remark',
  sampleSolution: 'sample-solution',
  screenshot: 'screenshot',
  selfAssessment: 'self-assessment',
  sequence: 'sequence',
  sideNote: 'side-note',
  stickyNote: 'sticky-note',
  stillImageFilm: 'still-image-film',
  stillImageFilmEmbed: 'still-image-film-embed',
  stillImageFilmLink: 'still-image-film-link',
  statement: 'statement',
  summary: 'summary',
  summaryAi: 'summary-ai',
  survey: 'survey',
  survey1: 'survey-1',
  surveyAnonymous: 'survey-anonymous',
  surveyAnonymous1: 'survey-anonymous-1',
  takePicture: 'take-picture',
  toc: 'toc',
  trueFalse: 'true-false',
  trueFalse1: 'true-false-1',
  vendorPadletEmbed: 'vendor-padlet-embed',
  video: 'video',
  videoEmbed: 'video-embed',
  videoLandscape: 'video-landscape',
  videoLink: 'video-link',
  videoPortrait: 'video-portrait',
  warning: 'warning',
  websiteLink: 'website-link',
  workbookArticle: 'workbook-article',
});

export type BitTypeType = EnumType<typeof BitType>;

export { BitType };
