import { type EnumType } from '@ncoderz/superenum';

const CardSetConfigKey = {
  flashcard: 'flashcard',
  definitionList: 'definitionList',
  elements: 'elements',
  statements: 'statements',
  quiz: 'quiz',
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
  clozeList: 'clozeList',
  ingredients: 'ingredients',
  // DEPRECATED - TO BE REMOVED IN THE FUTURE
  // captionDefinitionsList: 'captionDefinitionsList',
  bookReferenceList: 'bookReferenceList',
} as const;

export type CardSetConfigKeyType = EnumType<typeof CardSetConfigKey>;

export { CardSetConfigKey };
