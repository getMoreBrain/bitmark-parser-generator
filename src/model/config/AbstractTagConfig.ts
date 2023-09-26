import { BitTagTypeType } from '../enum/BitTagType';
import { CountType } from '../enum/Count';
import { PropertyAstKeyType } from '../enum/PropertyAstKey';
import { PropertyJsonKeyType } from '../enum/PropertyJsonKey';
import { PropertyTagType } from '../enum/PropertyTag';
import { ResourceJsonKeyType } from '../enum/ResourceJsonKey';
import { ResourceTagType } from '../enum/ResourceTag';
import { TagType } from '../enum/Tag';

import { TagsConfig } from './TagsConfig';
import { ConfigKeyType } from './enum/ConfigKey';

abstract class AbstractTagConfig {
  readonly type: BitTagTypeType;
  readonly configKey: ConfigKeyType;
  readonly tag: TagType | ResourceTagType | PropertyTagType;
  readonly maxCount: CountType; // Default: 1
  readonly minCount: number; // Default: 0
  readonly chain?: TagsConfig;

  readonly jsonKey?: PropertyJsonKeyType | ResourceJsonKeyType; // If the json key is different from the tag
  readonly astKey?: PropertyAstKeyType; // If the AST key is different from the tag

  readonly deprecated?: string; // Deprecated version

  public constructor(
    type: BitTagTypeType,
    configKey: ConfigKeyType,
    tag: TagType | ResourceTagType | PropertyTagType,
    maxCount: CountType,
    minCount: number,
    chain: TagsConfig | undefined,
    jsonKey: PropertyJsonKeyType | ResourceJsonKeyType | undefined,
    astKey: PropertyAstKeyType | undefined,
    deprecated: string | undefined,
  ) {
    this.type = type;
    this.configKey = configKey;
    this.tag = tag;
    this.maxCount = maxCount;
    this.minCount = minCount;
    this.chain = chain;
    this.jsonKey = jsonKey;
    this.astKey = astKey;
    this.deprecated = deprecated;
  }
}

export { AbstractTagConfig };
