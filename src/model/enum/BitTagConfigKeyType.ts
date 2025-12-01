import { type EnumType } from '@ncoderz/superenum';

const BitTagConfigKeyType = {
  unknown: 'unknown', // Unknown tag type, used for error handling

  tag: 'tag', // A standard tag
  property: 'property', // A property tag
  resource: 'resource', // A resource tag

  //
  group: 'group', // A reusable group of tags
} as const;

export type BitTagConfigKeyTypeType = EnumType<typeof BitTagConfigKeyType>;

export { BitTagConfigKeyType };
