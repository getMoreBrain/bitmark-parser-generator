import { type EnumType, superenum } from '@ncoderz/superenum';

const ExampleType = superenum({
  none: 'none', // Example is not allowed
  string: 'string', // Example is a string value
  boolean: 'boolean', // Example is a boolean value
});

export type ExampleTypeType = EnumType<typeof ExampleType>;

export { ExampleType };
