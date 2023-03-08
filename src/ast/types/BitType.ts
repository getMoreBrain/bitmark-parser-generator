import { EnumType, superenum } from '@ncoderz/superenum';

const BitType = superenum({
  bit: 'bit', // .
  property: 'property', // @
  cards: 'cards', // ===
  item: 'item', // %
  lead: 'lead', // %
  hint: 'hint', // ?
  instruction: 'instruction', // !
  quiz: 'quiz', // HIDDEN
  gap: 'gap', // _
  select: 'select', // HIDDEN
  statementTrue: 'statementTrue', // +
  statementFalse: 'statementFalse', // -
  choiceTrue: 'choiceTrue', // +
  choiceFalse: 'choiceFalse', // -
  responseTrue: 'responseTrue', // +
  responseFalse: 'responseFalse', // -
  optionTrue: 'optionTrue', // +
  optionFalse: 'optionFalse', // -
  example: 'example', // @
  resource: 'resource',
  body: 'body', // HIDDEN
  text: 'text', // HIDDEN
});

export type BitTypeType = EnumType<typeof BitType>;

export { BitType };
