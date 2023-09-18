import { CardKeyType } from '../../config/new/CardKey';
import { CountType } from '../../config/new/Count';
import { BitTagTypeType } from '../enum/BitTagType';
import { ExampleTypeType } from '../enum/ExampleType';
import { PropertyFormatType } from '../enum/PropertyFormat';

export interface NewConfig {
  bits: BitsConfig;
  groups: GroupsConfig; // DONE
  tags: TagsConfig; // DONE
  properties: PropertiesConfig; // DONE
  resources: ResourcesConfig; // DONE
  cardSets: CardsConfig;
  // resourceAttachments: ResourceAttachmentsConfig;
}

export interface BitsConfig {
  [key: string]: BitConfig;
}

export interface BitConfig {
  tags: TagInfoConfig[];
  cardSet?: CardKeyType;
  bodyAllowed?: boolean; // Default: false
  bodyRequired?: boolean; // Default: false
  footerAllowed?: boolean; // Default: false
  footerRequired?: boolean; // Default: false
  resourceAttachmentAllowed?: boolean; // Default: false
  rootExampleType?: ExampleTypeType;
}

export interface GroupsConfig {
  [key: string]: GroupConfig;
}

export interface GroupConfig {
  tags: TagInfoConfig[];
}

export interface TagsConfig {
  [key: string]: TagConfig;
}

export interface TagConfig {
  tag: string;
}

export interface PropertiesConfig {
  [key: string]: PropertyConfig;
}

export interface PropertyConfig {
  tag: string;
  single?: boolean; // If the property is treated as single rather than an array
  format?: PropertyFormatType; // How the property is formatted
  defaultValue?: string; // The default value of the property - this value can be omitted from the markup
  astKey?: string; // If the AST key is different from the markup property key
  jsonKey?: string; // If the json key is different from the markup property key
}

export interface ResourcesConfig {
  [key: string]: ResourceConfig;
}

export interface ResourceConfig {
  tag: string;
}

export interface TagInfoConfig {
  type: BitTagTypeType;
  id: string;
  maxCount?: CountType; // Default: 1
  minCount?: CountType; // Default: 1
  chain?: TagInfoConfig[];
}

export interface CardsConfig {
  [key: string]: CardConfig;
}

export interface CardConfig {
  variants: CardVariantConfig[][];
}

export interface CardVariantConfig {
  tags: TagInfoConfig[];
  bodyAllowed?: boolean; // Default: false
  bodyRequired?: boolean; // Default: false
  repeatCount?: CountType; // Default: 1
}
