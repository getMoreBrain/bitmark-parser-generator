import { type EnumType } from '@ncoderz/superenum';

const InfoType = {
  list: 'list', // List non-deprecated bits
  deprecated: 'deprecated', // List deprecated bits
  all: 'all', // List all bits
  bit: 'bit', // Get information for a bit
} as const;

export type InfoTypeType = EnumType<typeof InfoType>;

export { InfoType };
