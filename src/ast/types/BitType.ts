import { EnumType, superenum } from '@ncoderz/superenum';

const BitType = superenum({
  bit: 'bit',
  property: 'property',
  item: 'item',
  lead: 'lead',
  hint: 'hint',
  instruction: 'instruction',
  gap: 'gap',
  statementTrue: 'statementTrue',
  statementFalse: 'statementFalse',
  example: 'example',
  body: 'body',
  text: 'text',
});

export type BitTypeType = EnumType<typeof BitType>;

export { BitType };
