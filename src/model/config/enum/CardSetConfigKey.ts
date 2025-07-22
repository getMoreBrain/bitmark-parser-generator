import { type EnumType, superenum } from '@ncoderz/superenum';

const CardSetConfigKey = superenum({
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
  pronunciationTable: 'pronunciationTable',
  botActionResponses: 'botActionResponses',
  exampleBitList: 'exampleBitList',
  clozeList: 'clozeList',
  ingredients: 'ingredients',
  // DEPRECATED - TO BE REMOVED IN THE FUTURE
  // captionDefinitionsList: 'captionDefinitionsList',
  bookReferenceList: 'bookReferenceList',
});

export type CardSetConfigKeyType = EnumType<typeof CardSetConfigKey>;

export { CardSetConfigKey };
