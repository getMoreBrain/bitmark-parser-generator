import { EnumType, superenum } from '@ncoderz/superenum';

const PropertyFormat = superenum({
  none: 'none', // The property does not have a value
  // string: 'string', // If the value of the property is treated as a (non-trimmed) string
  trimmedString: 'trimmedString', // If the value of the property is treated as a trimmed string
  bitmarkMinusMinus: 'bitmarkMinusMinus', // If the value of the property is treated as a bitmark-- with the value being the bitmark name
  bitmarkPlusPlus: 'bitmarkPlusPlus', // If the value of the property is treated as a bitmark++ with the value being the bitmark name
  number: 'number', // If the value is treated as a number
  boolean: 'boolean', // If the value is treated as a boolean
  invertedBoolean: 'invertedBoolean', // If the value is treated as a boolean with the value inverted (e.g. isLongAnswer ==> isShortAnswer = false)
});

export type PropertyFormatType = EnumType<typeof PropertyFormat>;

export { PropertyFormat };
