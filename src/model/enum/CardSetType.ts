import { EnumType, superenum } from '@ncoderz/superenum';

const CardSetType = superenum({
  elements: 'elements',
  statements: 'statements',
  quiz: 'quiz',
  questions: 'questions',
  matchPairs: 'matchPairs',
  matchMatrix: 'matchMatrix',
  botActionResponses: 'botActionResponses',
});

export type CardSetTypeType = EnumType<typeof CardSetType>;

export { CardSetType };