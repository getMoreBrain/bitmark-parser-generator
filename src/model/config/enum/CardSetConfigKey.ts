import { type EnumType } from '@ncoderz/superenum';

const CardSetConfigKey = {
  flashcard: 'flashcard',
  flashcard1: 'flashcard1',
  definitionList: 'definitionList',
  elements: 'elements',
  statements: 'statements',
  quiz: 'quiz',
  quizResponses: 'quizResponses',
  feedback: 'feedback',
  questions: 'questions',
  matchPairs: 'matchPairs',
  matchAudioPairs: 'matchAudioPairs',
  matchImagePairs: 'matchImagePairs',
  matchMatrix: 'matchMatrix',
  table: 'table',
  tableExtended: 'tableExtended',
  pronunciationTable: 'pronunciationTable',
  botActionResponses: 'botActionResponses',
  exampleBitList: 'exampleBitList',
  pageFooterSections: 'pageFooterSections',
  clozeList: 'clozeList',
  ingredients: 'ingredients',
  // DEPRECATED - TO BE REMOVED IN THE FUTURE
  // captionDefinitionsList: 'captionDefinitionsList',
  bookReferenceList: 'bookReferenceList',
} as const;

export type CardSetConfigKeyType = EnumType<typeof CardSetConfigKey>;

export { CardSetConfigKey };
