import { EnumType, superenum } from '@ncoderz/superenum';

const CardKey = superenum({
  flashcards: 'flashcards',
  elements: 'elements',
  statements: 'statements',
  quiz: 'quiz',
  questions: 'questions',
  matchPairs: 'matchPairs',
  matchAudioPairs: 'matchAudioPairs',
  matchImagePairs: 'matchImagePairs',
  matchMatrix: 'matchMatrix',
  botActionResponses: 'botActionResponses',
});

export type CardKeyType = EnumType<typeof CardKey>;

export { CardKey };
