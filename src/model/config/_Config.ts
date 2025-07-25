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
  baseBitType?: BitTypeType; // The base bit type
  textFormatDefault?: TextFormatType; // Default text format
  quizBit?: true; // True if the bit is a quiz bit
  tags?: _TagInfoConfig[];
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
  tags: _TagInfoConfig[];
  maxCount?: CountType; // Default: 1
  minCount?: number; // Default: 0

  // Only relevant if type = GroupConfigType.comboResource
  comboResourceConfigKey?: ConfigKeyType;
}

export interface _ComboResourcesConfig {
  [resourceTag: string]: _ComboResourceConfig;
}

export interface _ComboResourceConfig {
  tags: _TagInfoConfig[];
}

export interface _TagsConfig {
  [configKey: string]: _TagConfig;
}

export interface _TagConfig {
  tag: TagType;
  deprecated?: string; // Deprecated version
}

export interface _PropertiesConfig {
  [configKey: string]: _PropertyConfig;
}

export interface _PropertyConfig {
  tag: string;
  deprecated?: string; // Deprecated version
  format?: TagFormatType; // How the property is formatted
  defaultValue?: string; // The default value of the property - this value can be omitted from the markup
  jsonKey?: string; // If the json key is different from the tag
}

export interface _ResourcesConfig {
  [configKey: string]: _ResourceConfig;
}

export interface _ResourceConfig {
  tag: string;
  deprecated?: string; // Deprecated version
  jsonKey?: string; // If the json key is different from the tag
}

export interface _TagInfoConfig {
  key: ConfigKeyType;
  deprecated?: string; // Deprecated version
  maxCount?: CountType; // Default: 1
  minCount?: number; // Default: 0
  format?: TagFormatType; // How the tag is formatted
  defaultValue?: string; // The default value of the tag if omitted from the markup
  jsonKey?: string; // If the json key is different from the tag
  chain?: _TagInfoConfig[];
}

export interface _CardSetsConfig {
  [configKey: string]: _CardSetConfig;
}

/**
 * TODO: The CardSetConfig needs improving to handle more use cases
 * - Different card configurations
 * - Infinitely repeating cards (this is the default, but maybe there could also be limited cards)
 * - Infinitely repeating sides (this is hacked in at the moment, but the config is not completely correct)
 */
export interface _CardSetConfig {
  // Configuration for each variant from the card set
  // - all cards have the same config
  // - each variant is indexed via side and variant
  variants: _CardVariantConfig[][];
}

export interface _CardVariantConfig {
  tags: _TagInfoConfig[];
  deprecated?: string; // Deprecated version
  bodyAllowed?: boolean; // Default: false
  bodyRequired?: boolean; // Default: false
  repeatCount?: CountType; // Default: 1
}
