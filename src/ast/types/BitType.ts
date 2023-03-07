import { EnumType, superenum } from '@ncoderz/superenum';

const BitType = superenum({
  bit: 'bit',
  property: 'property',
  cards: 'cards',
  item: 'item',
  lead: 'lead',
  hint: 'hint',
  instruction: 'instruction',
  quiz: 'quiz',
  gap: 'gap',
  select: 'select',
  statementTrue: 'statementTrue',
  statementFalse: 'statementFalse',
  choiceTrue: 'choiceTrue',
  choiceFalse: 'choiceFalse',
  responseTrue: 'responseTrue',
  responseFalse: 'responseFalse',
  example: 'example',
  body: 'body',
  text: 'text',
});

export type BitTypeType = EnumType<typeof BitType>;

export { BitType };
