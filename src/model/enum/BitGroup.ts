import { type EnumType } from '@ncoderz/superenum';

/**
 * PLAN-020: Bit group keys.
 *
 * Bit groups are search/filter categories over bit types (a bit type can belong to several
 * groups). The keys are adopted verbatim from the historical book-service `bit-types.js`
 * lists so that existing `g=<key>` search queries keep working; renames are handled via the
 * `aliases` field on the registry entries in `config/raw/bitGroups.ts`, never by changing a
 * key.
 *
 * Not to be confused with tag groups (`GroupConfigType` / `config/raw/groups.ts`), which
 * group tags for config reuse. See PLAN-020.
 */
const BitGroup = {
  assignment: 'assignment',
  authors: 'authors',
  botAction: 'bot-action',
  bots: 'bots',
  chat: 'chat',
  cloze: 'cloze',
  conversation: 'conversation',
  cooking: 'cooking',
  correction: 'correction',
  documentUpload: 'document-upload',
  essay: 'essay',
  extractor: 'extractor',
  flashcard: 'flashcard',
  group: 'group',
  highlightText: 'highlight-text',
  interview: 'interview',
  learningPath: 'learning-path',
  mark: 'mark',
  match: 'match',
  message: 'message',
  multipleChoice: 'multiple-choice',
  multipleResponse: 'multiple-response',
  nonProduction: 'non-production',
  other: 'other',
  pages: 'pages',
  preparationNote: 'preparation-note',
  quizzes: 'quizzes',
  rating: 'rating',
  recipes: 'recipes',
  recordAudio: 'record-audio',
  reviewErrors: 'review-errors',
  reviews: 'reviews',
  selfAssessment: 'self-assessment',
  sequence: 'sequence',
  set: 'set',
  static: 'static',
  steps: 'steps',
  survey: 'survey',
  surveyAnonymous: 'survey-anonymous',
  surveys: 'surveys',
  tables: 'tables',
  takePicture: 'take-picture',
  trueFalse: 'true-false',
  vocabulary: 'vocabulary',
  warning: 'warning',
  whiteLabel: 'white-label',
} as const;

export type BitGroupType = EnumType<typeof BitGroup>;

export { BitGroup };
