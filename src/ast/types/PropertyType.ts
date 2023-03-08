import { EnumType, superenum } from '@ncoderz/superenum';

const PropertyType = superenum({
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  object: 'object',
  BitBitTypeType: 'BitBitTypeType',
  BitTextFormat: 'BitTextFormat',
  Resource: 'Resource',
  BitResourceTypeType: 'BitResourceTypeType',
  TODO: 'TODO',
});

export type PropertyTypeType = EnumType<typeof PropertyType>;

export { PropertyType };
