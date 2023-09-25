/**
 * Type definitions for the raw configuration data.
 *
 */
import { BitTagTypeType } from '../enum/BitTagType';
import { CountType } from '../enum/Count';
import { ExampleTypeType } from '../enum/ExampleType';
import { PropertyAstKeyType } from '../enum/PropertyAstKey';
import { PropertyFormatType } from '../enum/PropertyFormat';
import { PropertyJsonKeyType } from '../enum/PropertyJsonKey';
import { PropertyTagType } from '../enum/PropertyTag';
import { ResourceJsonKeyType } from '../enum/ResourceJsonKey';
import { ResourceTagType } from '../enum/ResourceTag';
import { TagType } from '../enum/Tag';

import { CardSetConfigKeyType } from './enum/CardSetConfigKey';
import { ConfigKeyType } from './enum/ConfigKey';
import { GroupConfigTypeType } from './enum/GroupConfigType';

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
  tags: _TagInfoConfig[];
  cardSet?: CardSetConfigKeyType;
  deprecated?: string; // Deprecated version
  bodyAllowed?: boolean; // Default: false
  bodyRequired?: boolean; // Default: false
  footerAllowed?: boolean; // Default: false
  footerRequired?: boolean; // Default: false
  resourceAttachmentAllowed?: boolean; // Default: false
  rootExampleType?: ExampleTypeType;
  aliases?: _BitAliasesConfig;
}

export interface _BitAliasesConfig {
  [configKey: string]: _BitAliasConfig;
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
  comboResourceType?: ResourceTagType;
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
  tag: PropertyTagType;
  deprecated?: string; // Deprecated version
  single?: boolean; // If the property is treated as single rather than an array
  format?: PropertyFormatType; // How the property is formatted
  defaultValue?: string; // The default value of the property - this value can be omitted from the markup
  jsonKey?: PropertyJsonKeyType; // If the json key is different from the tag
  astKey?: PropertyAstKeyType; // If the AST key is different from the tag
}

export interface _ResourcesConfig {
  [configKey: string]: _ResourceConfig;
}

export interface _ResourceConfig {
  tag: ResourceTagType;
  deprecated?: string; // Deprecated version
  jsonKey?: ResourceJsonKeyType; // If the json key is different from the tag
}

export interface _TagInfoConfig {
  type: BitTagTypeType;
  configKey: ConfigKeyType;
  maxCount?: CountType; // Default: 1
  minCount?: number; // Default: 0
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
