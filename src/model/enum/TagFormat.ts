import { type EnumType, superenum } from '@ncoderz/superenum';

const TagFormat = superenum({
  none: 'none', // The property does not have a value
  plainText: 'plainText', // If the value of the property is treated as a trimmed plain text string
  bitmarkText: 'bitmarkText', // If the value of the property is treated as a bitmark+
  number: 'number', // If the value is treated as a number
  boolean: 'boolean', // If the value is treated as a boolean
  invertedBoolean: 'invertedBoolean', // If the value is treated as a boolean with the value inverted (e.g. isLongAnswer ==> isShortAnswer = false)
});

export type TagFormatType = EnumType<typeof TagFormat>;

export { TagFormat as TagFormat };
