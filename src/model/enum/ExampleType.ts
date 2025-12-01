import { type EnumType } from '@ncoderz/superenum';

const ExampleType = {
  none: 'none', // Example is not allowed
  string: 'string', // Example is a string value
  boolean: 'boolean', // Example is a boolean value
} as const;

export type ExampleTypeType = EnumType<typeof ExampleType>;

export { ExampleType };
