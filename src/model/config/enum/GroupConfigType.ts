import { type EnumType } from '@ncoderz/superenum';

/**
 * Type of group config
 */
const GroupConfigType = {
  standard: 'standard', // Any ordinary group
  resource: 'resource', // A resource group
  comboResource: 'comboResource', // A combo resource group
} as const;

export type GroupConfigTypeType = EnumType<typeof GroupConfigType>;

export { GroupConfigType };
