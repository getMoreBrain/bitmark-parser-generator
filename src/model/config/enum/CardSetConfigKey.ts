import { EnumType, superenum } from '@ncoderz/superenum';

const CardSetConfigKey = superenum({
  _flashcard: '_flashcard',
  _definitionList: '_definitionList',
  _elements: '_elements',
  _statements: '_statements',
  _quiz: '_quiz',
  _feedback: '_feedback',
  _questions: '_questions',
  _matchPairs: '_matchPairs',
  _matchAudioPairs: '_matchAudioPairs',
  _matchImagePairs: '_matchImagePairs',
  _matchMatrix: '_matchMatrix',
  _table: '_table',
  _pronunciationTable: '_pronunciationTable',
  _botActionResponses: '_botActionResponses',
  _exampleBitList: '_exampleBitList',
  _clozeList: '_clozeList',
  _ingredients: '_ingredients',
  // DEPRECATED - TO BE REMOVED IN THE FUTURE
  // _captionDefinitionsList: '_captionDefinitionsList',
  _bookReferenceList: '_bookReferenceList',
});

export type CardSetConfigKeyType = EnumType<typeof CardSetConfigKey>;

export { CardSetConfigKey };
