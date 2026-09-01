import { type EnumType } from '@ncoderz/superenum';

const InfoType = {
  list: 'list', // List non-deprecated bits
  deprecated: 'deprecated', // List deprecated bits
  all: 'all', // List all bits
  bit: 'bit', // Get information for a bit
  bitGroups: 'bitGroups', // PLAN-020: List all bit groups with their member bit types
  resourceGroups: 'resourceGroups', // PLAN-020: List all resource groups with their member resource types
} as const;

export type InfoTypeType = EnumType<typeof InfoType>;

export { InfoType };
