import { type EnumType, superenum } from '@ncoderz/superenum';

const InfoType = superenum({
  list: 'list', // List non-deprecated bits
  deprecated: 'deprecated', // List deprecated bits
  all: 'all', // List all bits
  bit: 'bit', // Get information for a bit
});

export type InfoTypeType = EnumType<typeof InfoType>;

export { InfoType };
