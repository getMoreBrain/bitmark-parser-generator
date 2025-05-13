import { EnumType, superenum } from '@ncoderz/superenum';

import { groupConfigKeys } from './GroupConfigKey';
import { propertyConfigKeys } from './PropertyConfigKey';
import { resourceConfigKeys } from './ResourceConfigKey';
import { tagConfigKeys } from './TagConfigKey';

/**
 * Combined bit config keys
 */
const ConfigKey = superenum({
  _unknown: '_unknown',

  // Tags
  ...tagConfigKeys,

  // Properties
  ...propertyConfigKeys,

  // Resources
  ...resourceConfigKeys,

  // Groups
  ...groupConfigKeys,
});

function keyClashCheck() {
  const keys = new Set<string>();
  const keySets = [tagConfigKeys, propertyConfigKeys, resourceConfigKeys, groupConfigKeys];
  for (const keySet of keySets) {
    for (const key in keySet) {
      // Clashes are not a problem, and necessary if for example a Property and Resource tag have the same name
      // if (keys.has(key)) {
      // throw new Error(`Duplicate ConfigKey: ${key}`);
      // }
      keys.add(key);
    }
  }
}

// Run key clash check on initialisation
keyClashCheck();

export type ConfigKeyType = EnumType<typeof ConfigKey>;

export { ConfigKey };
