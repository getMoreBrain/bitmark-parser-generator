import { EnumType, superenum } from '@ncoderz/superenum';

import { TagDataMap } from '../config/TagData';

export interface CardSetVariantConfig {
  // Tags, Property Tags, and Tag chains that are valid for this bit type
  tags: TagDataMap;

  // Is a body allowed? (default: false)
  bodyAllowed?: boolean;
}

export interface CardSetTypeMetadata {
  variants: CardSetVariantConfig[];
}

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
