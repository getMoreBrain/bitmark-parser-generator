import { EnumType, superenum } from '@ncoderz/superenum';

// const BitType = superenum({
//   bit: 'bit', // .
//   property: 'property', // @
//   cards: 'cards', // ===
//   item: 'item', // %
//   lead: 'lead', // %
//   hint: 'hint', // ?
//   instruction: 'instruction', // !
//   quiz: 'quiz', // HIDDEN
//   gap: 'gap', // _
//   select: 'select', // HIDDEN
//   statementTrue: 'statementTrue', // +
//   statementFalse: 'statementFalse', // -
//   choiceTrue: 'choiceTrue', // +
//   choiceFalse: 'choiceFalse', // -
//   responseTrue: 'responseTrue', // +
//   responseFalse: 'responseFalse', // -
//   optionTrue: 'optionTrue', // +
//   optionFalse: 'optionFalse', // -
//   example: 'example', // @
//   resource: 'resource',
//   body: 'body', // HIDDEN
//   text: 'text', // HIDDEN
// });

// export type BitTypeType = EnumType<typeof BitType>;

// export { BitType };

const BitTypeRaw = {
  book: 'book',
  bookFrontispiece: 'book-frontispiece',
  bookTitle: 'book-title',
  bookCopyright: 'book-copyright',
  bookDedication: 'book-dedication',
  bookForword: 'book-foreword',
  bookPreface: 'book-preface',
  bookPrologue: 'book-prologue',
  bookEpilogue: 'book-epilogue',
  bookIntroduction: 'book-introduction',
  bookIncitingIncident: 'book-inciting-incident',
  bookConclusion: 'book-conclusion',
  bookAfterword: 'book-afterword',
  bookPostscript: 'book-postscript',
  bookAppendix: 'book-appendix',
  bookAddendum: 'book-addendum',
  bookAcknowledgments: 'book-acknowledgments',
  bookListOfContributors: 'book-list-of-contributors',
  bookBibliography: 'book-bibliography',
  bookReferenceList: 'book-reference-list',
  bookEndnotes: 'book-endnotes',
  bookNotes: 'book-notes',
  bookCopyrightPermissions: 'book-copyright-permissions',
  bookTeaser: 'book-teaser',
  bookAutherBio: 'book-author-bio',
  bookRequestForABookReview: 'book-request-for-a-book-review',
  bookComingSoon: 'book-coming-soon',
  bookReadMore: 'book-read-more',
  bookSummary: 'book-summary',
  bookEpigraph: 'book-epigraph',
  chapter: 'chapter',
  summary: 'summary',
  bitAlias: 'bit-alias',
  internalLink: 'internal-link',
  anchor: 'anchor',
  groupBorn: 'group-born',
  groupDied: 'group-died',
  cloze: 'cloze',
  clozeInstructionGrouped: 'cloze-instruction-grouped',
  clozeSolutionGrouped: 'cloze-solution-grouped',
  clozeAndMultipleChoiceText: 'cloze-and-multiple-choice-text',
  multipleChoice: 'multiple-choice',
  multipleChoice1: 'multiple-choice-1',
  multipleChoiceText: 'multiple-choice-text',
  multipleResponse: 'multiple-response',
  multipleResponse1: 'multiple-response-1',
  essay: 'essay',
  interview: 'interview',
  interviewInstructionGrouped: 'interview-instruction-grouped',
  match_: 'match-',
  matchReverse: 'match-reverse',
  matchPicture: 'match-picture',
  matchAudio: 'match-audio',
  matchSolutionGrouped: 'match-solution-grouped',
  trueFalse1: 'true-false-1',
  trueFalse: 'true-false',
  sequence: 'sequence',
  correction: 'correction',
  mark_: 'mark-',
  documentUpload: 'document-upload',
  takePicture: 'take-picture',
  recordAudio: 'record-audio',
  preparationNote: 'preparation-note',
  assignment: 'assignment',
  article: 'article',
  articleAttachment: 'article-attachment',
  flashcard: 'flashcard',
  flashcard1: 'flashcard-1',
  chat: 'chat',
  conversation: 'conversation',
  selfAssessment: 'self-assessment',
  rating: 'rating',
  survey: 'survey',
  survey1: 'survey-1',
  surveyAnonymous: 'survey-anonymous',
  surveyAnonymous1: 'survey-anonymous-1',
  hint: 'hint',
  botInterview: 'bot-interview',
  botActionRatingNumber: 'bot-action-rating-number',
  botActionResponse: 'bot-action-response',
  botActionTrueFalse: 'bot-action-true-false',
  code: 'code',
  card1: 'card-1',
  question1: 'question-1',
} as const;

const BitType = superenum(BitTypeRaw);

export type BitTypeKeys = keyof typeof BitTypeRaw;
export type BitTypeType = EnumType<typeof BitType>;

export { BitType };
