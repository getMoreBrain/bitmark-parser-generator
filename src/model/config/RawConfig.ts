import { BitTagTypeType } from '../enum/BitTagType';
import { CountType } from '../enum/Count';
import { ExampleTypeType } from '../enum/ExampleType';
import { PropertyFormatType } from '../enum/PropertyFormat';

import { CardConfigKeyType } from './CardConfigKey';

export interface _Config {
  bits: _BitsConfig;
  groups: _GroupsConfig;
  tags: _TagsConfig;
  properties: _PropertiesConfig;
  resources: _ResourcesConfig;
  cardSets: _CardsConfig;
}

export interface _BitsConfig {
  [configKey: string]: _BitConfig;
}

export interface _BitConfig {
  tags: _TagInfoConfig[];
  cardSet?: CardConfigKeyType;
  bodyAllowed?: boolean; // Default: false
  bodyRequired?: boolean; // Default: false
  footerAllowed?: boolean; // Default: false
  footerRequired?: boolean; // Default: false
  resourceAttachmentAllowed?: boolean; // Default: false
  rootExampleType?: ExampleTypeType;
}

export interface _GroupsConfig {
  [configKey: string]: _GroupConfig;
}

export interface _GroupConfig {
  tags: _TagInfoConfig[];
}

export interface _TagsConfig {
  [configKey: string]: _TagConfig;
}

export interface _TagConfig {
  tag: string;
}

export interface _PropertiesConfig {
  [configKey: string]: _PropertyConfig;
}

export interface _PropertyConfig {
  tag: string;
  single?: boolean; // If the property is treated as single rather than an array
  format?: PropertyFormatType; // How the property is formatted
  defaultValue?: string; // The default value of the property - this value can be omitted from the markup
  astKey?: string; // If the AST key is different from the markup property key
  jsonKey?: string; // If the json key is different from the markup property key
}

export interface _ResourcesConfig {
  [configKey: string]: _ResourceConfig;
}

export interface _ResourceConfig {
  tag: string;
}

export interface _TagInfoConfig {
  type: BitTagTypeType;
  id: string;
  maxCount?: CountType; // Default: 1
  minCount?: CountType; // Default: 1
  chain?: _TagInfoConfig[];
}

export interface _CardsConfig {
  [configKey: string]: _CardConfig;
}

export interface _CardConfig {
  variants: _CardVariantConfig[][];
}

export interface _CardVariantConfig {
  tags: _TagInfoConfig[];
  bodyAllowed?: boolean; // Default: false
  bodyRequired?: boolean; // Default: false
  repeatCount?: CountType; // Default: 1
}
