import { EnumType, superenum } from '@ncoderz/superenum';

const BitTagType = superenum({
  tag: 'tag', // A standard tag
  property: 'property', // A property tag
  resource: 'resource', // A resource tag
  chain: 'chain', // A tag chain

  //
  group: 'group', // A reusable group of tags
});

export type BitTagTypeType = EnumType<typeof BitTagType>;

export { BitTagType };
