import { type EnumType, superenum } from '@ncoderz/superenum';

import {
  BitTagConfigKeyType,
  type BitTagConfigKeyTypeType,
} from '../../enum/BitTagConfigKeyType.ts';
import { groupKeys } from '../../enum/GroupKey.ts';
import { propertyKeys } from '../../enum/PropertyKey.ts';
import { resourceKeys } from '../../enum/ResourceKey.ts';
import { ResourceType, type ResourceTypeType } from '../../enum/ResourceType.ts';
import { tags } from '../../enum/Tag.ts';

/**
 * Config keys for tags, resources, properties, and groups.
 *
 * Each type has a different prefix so there are no conflicts:
 * - Resources: `&`
 * - Properties: `@`
 * - Groups: `group_`
 * - Tags: <none>
 *
 */
const ConfigKey = superenum({
  // Internal
  _unknown: '_unknown',

  // Tags
  ...tags,

  // Resources
  ...resourceKeys,

  // Properties
  ...propertyKeys,

  // Groups
  ...groupKeys,
});

export type ConfigKeyType = EnumType<typeof ConfigKey>;

function typeFromConfigKey(tagKey: ConfigKeyType): BitTagConfigKeyTypeType {
  if (!tagKey) return BitTagConfigKeyType.unknown;

  if (tagKey.startsWith('@')) return BitTagConfigKeyType.property;
  if (tagKey.startsWith('&')) return BitTagConfigKeyType.resource;
  if (tagKey.startsWith('group_')) return BitTagConfigKeyType.group;

  return BitTagConfigKeyType.tag;
}

function configKeyToPropertyType(configKey: string): string {
  return configKey.replace(/^@/, '');
}

function configKeyToResourceType(configKey: string): ResourceTypeType {
  return ResourceType.fromKey(configKey.replace(/^&/, '')) as ResourceTypeType;
}

export { ConfigKey, configKeyToPropertyType, configKeyToResourceType, typeFromConfigKey };
