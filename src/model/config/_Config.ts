/**
 * Type definitions for the raw configuration data.
 *
 */
import { type BitTypeType } from '../enum/BitType.ts';
import { type CountType } from '../enum/Count.ts';
import { type ExampleTypeType } from '../enum/ExampleType.ts';
import { type TagType } from '../enum/Tag.ts';
import { type TagFormatType } from '../enum/TagFormat.ts';
import { type TextFormatType } from '../enum/TextFormat.ts';
import { type CardSetConfigKeyType } from './enum/CardSetConfigKey.ts';
import type { ConfigKeyType } from './enum/ConfigKey.ts';
import { type GroupConfigTypeType } from './enum/GroupConfigType.ts';

export interface _Config {
  bits: _BitsConfig;
  groups: _GroupsConfig;
  tags: _TagsConfig;
  properties: _PropertiesConfig;
  resources: _ResourcesConfig;
  cardSets: _CardSetsConfig;
}

export interface _BitsConfig {
  [configKey: string]: _BitConfig;
}

export interface _BitConfig {
  since: string; // Supported since version
  name?: string; // Will default to the configKey minus prefix if not provided
  description: string;
  baseBitType?: BitTypeType; // The base bit type
  textFormatDefault?: TextFormatType; // Default text format
  quizBit?: true; // True if the bit is a quiz bit
  tags?: _AbstractTagConfig[];
  cardSet?: CardSetConfigKeyType;
  deprecated?: string; // Deprecated version
  bodyAllowed?: boolean; // Default: true
  bodyRequired?: boolean; // Default: false
  footerAllowed?: boolean; // Default: true
  footerRequired?: boolean; // Default: false
  resourceAttachmentAllowed?: boolean; // Default: true
  rootExampleType?: ExampleTypeType;
}

export interface _BitAliasConfig {
  since: string; // Supported since version
  deprecated?: string; // Deprecated version
}

export interface _GroupsConfig {
  [configKey: string]: _GroupConfig;
}

export interface _GroupConfig {
  type: GroupConfigTypeType;
  name?: string; // Will default to the configKey minus prefix if not provided
  description: string;
  tags: _AbstractTagConfig[];
  maxCount?: CountType; // Default: 1
  minCount?: number; // Default: 0

  // Only relevant if type = GroupConfigType.comboResource
  comboResourceConfigKey?: ConfigKeyType;
}

export interface _ComboResourcesConfig {
  [resourceTag: string]: _ComboResourceConfig;
}

export interface _ComboResourceConfig {
  tags: _AbstractTagConfig[];
}

export interface _TagsConfig {
  [configKey: string]: _TagConfig;
}

export interface _TagConfig {
  key: TagType;
  name?: string; // Will default to the configKey minus prefix if not provided
  description: string;
  deprecated?: string; // Deprecated version
}

export interface _PropertiesConfig {
  [configKey: string]: _PropertyConfig;
}

export interface _PropertyConfig {
  key: ConfigKeyType;
  name?: string; // Will default to the configKey minus prefix if not provided
  description: string;
  deprecated?: string; // Deprecated version
  format?: TagFormatType; // How the property is formatted
  values?: string[]; // If the format is an enumeration, the possible values of the property
  defaultValue?: string; // The default value of the property - this value can be omitted from the markup
  jsonKey?: string; // If the json key is different from the tag
}

export interface _ResourcesConfig {
  [configKey: string]: _ResourceConfig;
}

export interface _ResourceConfig {
  key: ConfigKeyType;
  name?: string; // Will default to the configKey minus prefix if not provided
  description: string;
  deprecated?: string; // Deprecated version
  jsonKey?: string; // If the json key is different from the tag
}

/**
 * Combines the _TagConfig, _PropertyConfig, and _ResourceConfig interfaces
 */
export interface _AbstractTagConfig {
  key: ConfigKeyType;
  name?: string; // Will default to the configKey minus prefix if not provided
  description: string;
  deprecated?: string; // Deprecated version
  maxCount?: CountType; // Default: 1
  minCount?: number; // Default: 0
  format?: TagFormatType; // How the tag is formatted
  values?: string[]; // If the format is an enumeration, the possible values of the property
  defaultValue?: string; // The default value of the tag if omitted from the markup
  jsonKey?: string; // If the json key is different from the tag
  secondaryJsonKey?: string; // Heading card alternate path
  chain?: _AbstractTagConfig[];
}

export interface _CardSetsConfig {
  [configKey: string]: _CardSetConfig;
}

export interface _CardSetConfig {
  cards: _CardTypeConfig[];
}

export interface _CardTypeConfig {
  name: string; // e.g. 'default', 'table-header'
  isDefault?: boolean; // true for the unqualified ==== divider
  jsonKey: string | null; // e.g. 'cards', 'pairs', null
  itemType?: 'object' | 'array'; // Default: 'object'
  sides: _CardSideConfig[];
}

export interface _CardSideConfig {
  name: string; // e.g. 'question', 'key', 'cell'
  repeat?: boolean; // Side repeats for remaining -- dividers
  jsonKey?: string; // JSON key wrapping repeating side entries (e.g. 'cells')
  variants: _CardVariantConfig[];
}

export interface _CardVariantConfig {
  tags: _AbstractTagConfig[];
  deprecated?: string; // Deprecated version
  bodyAllowed?: boolean; // Default: false
  bodyRequired?: boolean; // Default: false
  repeatCount?: CountType; // Default: 1
  // JSON mapping fields
  jsonKey?: string | null; // JSON path for body text
}
