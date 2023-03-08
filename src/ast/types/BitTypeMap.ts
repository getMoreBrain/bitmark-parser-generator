import { EnumType, superenum } from '@ncoderz/superenum';

const BitTypeMap = superenum({
  bit: '.',
  property: '@',
  item: '%',
  lead: '%',
  hint: '?',
  instruction: '!',
  gap: '_',
  statementTrue: '+',
  statementFalse: '-',
  choiceTrue: '+',
  choiceFalse: '-',
  responseTrue: '+',
  responseFalse: '-',
  optionTrue: '+',
  optionFalse: '-',
  example: '@',
});

export type BitTypeMapType = EnumType<typeof BitTypeMap>;

export { BitTypeMap };
