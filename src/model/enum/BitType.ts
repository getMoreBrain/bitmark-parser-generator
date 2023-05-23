import { EnumType, superenum } from '@ncoderz/superenum';

import { CardSetType, CardSetTypeType } from './CardSetType';
import { ResourceType, ResourceTypeType } from './ResourceType';

export interface BitTypeMetadata {
  resourceType?: ResourceTypeType;
  cardSetType?: CardSetTypeType;
}

const BitType = superenum({
  _error: '_error', // Used for error handling to indicate a bit type that is not supported or a bit parse error
  anchor: 'anchor',
  article: 'article',
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
  groupBorn: 'group-born',
  groupDied: 'group-died',
  help: 'help',
  highlightText: 'highlight-text',
  hint: 'hint',
  image: 'image',
  imageEmbed: 'image-embed',
  imageLink: 'image-link',
  imagePrototype: 'image-prototype',
  imageSuperWide: 'image-super-wide',
  imageZoom: 'image-zoom',
  info: 'info',
  internalLink: 'internal-link',
  interview: 'interview',
  interviewInstructionGrouped: 'interview-instruction-grouped',
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
  remark: 'remark',
  sampleSolution: 'sample-solution',
  screenshot: 'screenshot',
  selfAssessment: 'self-assessment',
  sequence: 'sequence',
  sideNote: 'side-note',
  stillImageFilm: 'still-image-film',
  stillImageFilmEmbed: 'still-image-film-embed',
  stillImageFilmLink: 'still-image-film-link',
  statement: 'statement',
  summary: 'summary',
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

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.audio, {
  resourceType: ResourceType.audio,
});

BitType.setMetadata<BitTypeMetadata>(BitType.audioEmbed, {
  resourceType: ResourceType.audioEmbed,
});
BitType.setMetadata<BitTypeMetadata>(BitType.audioLink, {
  resourceType: ResourceType.audioLink,
});
BitType.setMetadata<BitTypeMetadata>(BitType.botActionResponse, {
  cardSetType: CardSetType.botActionResponses,
});
BitType.setMetadata<BitTypeMetadata>(BitType.browserImage, {
  resourceType: ResourceType.image,
});
BitType.setMetadata<BitTypeMetadata>(BitType.document, {
  resourceType: ResourceType.document,
});
BitType.setMetadata<BitTypeMetadata>(BitType.documentDownload, {
  resourceType: ResourceType.documentDownload,
});
BitType.setMetadata<BitTypeMetadata>(BitType.documentLink, {
  resourceType: ResourceType.documentLink,
});
BitType.setMetadata<BitTypeMetadata>(BitType.focusImage, {
  resourceType: ResourceType.image,
});
BitType.setMetadata<BitTypeMetadata>(BitType.imageLink, {
  resourceType: ResourceType.imageLink,
});
BitType.setMetadata<BitTypeMetadata>(BitType.imagePrototype, {
  resourceType: ResourceType.image,
});
BitType.setMetadata<BitTypeMetadata>(BitType.imageSuperWide, {
  resourceType: ResourceType.image,
});
BitType.setMetadata<BitTypeMetadata>(BitType.imageZoom, {
  resourceType: ResourceType.image,
});
BitType.setMetadata<BitTypeMetadata>(BitType.interview, {
  cardSetType: CardSetType.questions,
});
BitType.setMetadata<BitTypeMetadata>(BitType.interviewInstructionGrouped, {
  cardSetType: CardSetType.questions,
});
BitType.setMetadata<BitTypeMetadata>(BitType.match, {
  cardSetType: CardSetType.questions,
});
BitType.setMetadata<BitTypeMetadata>(BitType.matchAll, {
  cardSetType: CardSetType.matchPairs,
});
BitType.setMetadata<BitTypeMetadata>(BitType.matchAllReverse, {
  cardSetType: CardSetType.matchPairs,
});
BitType.setMetadata<BitTypeMetadata>(BitType.matchAudio, {
  cardSetType: CardSetType.matchPairs,
});
BitType.setMetadata<BitTypeMetadata>(BitType.matchMatrix, {
  cardSetType: CardSetType.matchMatrix,
});
BitType.setMetadata<BitTypeMetadata>(BitType.matchPicture, {
  cardSetType: CardSetType.matchPairs,
});
BitType.setMetadata<BitTypeMetadata>(BitType.matchReverse, {
  cardSetType: CardSetType.matchPairs,
});
BitType.setMetadata<BitTypeMetadata>(BitType.matchSolutionGrouped, {
  cardSetType: CardSetType.matchPairs,
});
BitType.setMetadata<BitTypeMetadata>(BitType.multipleChoice, {
  cardSetType: CardSetType.quiz,
});
BitType.setMetadata<BitTypeMetadata>(BitType.multipleResponse, {
  cardSetType: CardSetType.quiz,
});
BitType.setMetadata<BitTypeMetadata>(BitType.photo, {
  resourceType: ResourceType.image,
});
BitType.setMetadata<BitTypeMetadata>(BitType.screenshot, {
  resourceType: ResourceType.image,
});
BitType.setMetadata<BitTypeMetadata>(BitType.sequence, {
  cardSetType: CardSetType.elements,
});
BitType.setMetadata<BitTypeMetadata>(BitType.stillImageFilm, {
  resourceType: ResourceType.stillImageFilm,
});
BitType.setMetadata<BitTypeMetadata>(BitType.stillImageFilmEmbed, {
  resourceType: ResourceType.stillImageFilmEmbed,
});
BitType.setMetadata<BitTypeMetadata>(BitType.stillImageFilmLink, {
  resourceType: ResourceType.stillImageFilmLink,
});
BitType.setMetadata<BitTypeMetadata>(BitType.trueFalse, {
  cardSetType: CardSetType.statements,
});
BitType.setMetadata<BitTypeMetadata>(BitType.video, {
  resourceType: ResourceType.video,
});
BitType.setMetadata<BitTypeMetadata>(BitType.videoEmbed, {
  resourceType: ResourceType.videoEmbed,
});
BitType.setMetadata<BitTypeMetadata>(BitType.videoLandscape, {
  resourceType: ResourceType.video,
});
BitType.setMetadata<BitTypeMetadata>(BitType.videoLink, {
  resourceType: ResourceType.videoLink,
});
BitType.setMetadata<BitTypeMetadata>(BitType.videoPortrait, {
  resourceType: ResourceType.video,
});
BitType.setMetadata<BitTypeMetadata>(BitType.websiteLink, {
  resourceType: ResourceType.websiteLink,
});

BitType.setMetadata<BitTypeMetadata>(BitType.image, {
  resourceType: ResourceType.image,
});

export type BitTypeType = EnumType<typeof BitType>;

export { BitType };
