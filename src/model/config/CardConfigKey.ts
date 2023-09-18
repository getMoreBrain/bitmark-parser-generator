import { EnumType, superenum } from '@ncoderz/superenum';

const CardConfigKey = superenum({
  _flashcards: '_flashcards',
  _elements: '_elements',
  _statements: '_statements',
  _quiz: '_quiz',
  _questions: '_questions',
  _matchPairs: '_matchPairs',
  _matchAudioPairs: '_matchAudioPairs',
  _matchImagePairs: '_matchImagePairs',
  _matchMatrix: '_matchMatrix',
  _botActionResponses: '_botActionResponses',
});

export type CardConfigKeyType = EnumType<typeof CardConfigKey>;

export { CardConfigKey };
