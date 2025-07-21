import { type EnumType, superenum } from '@ncoderz/superenum';

/**
 * Type of group config
 */
const GroupConfigType = superenum({
  standard: 'standard', // Any ordinary group
  resource: 'resource', // A resource group
  comboResource: 'comboResource', // A combo resource group
});

export type GroupConfigTypeType = EnumType<typeof GroupConfigType>;

export { GroupConfigType };
