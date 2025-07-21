import { type BitTagTypeType } from '../enum/BitTagType.ts';
import { type CountType } from '../enum/Count.ts';
import { type PropertyAstKeyType } from '../enum/PropertyAstKey.ts';
import { type PropertyJsonKeyType } from '../enum/PropertyJsonKey.ts';
import { type PropertyTagType } from '../enum/PropertyTag.ts';
import { type ResourceJsonKeyType } from '../enum/ResourceJsonKey.ts';
import { type ResourceTagType } from '../enum/ResourceTag.ts';
import { type TagType } from '../enum/Tag.ts';
import { type ConfigKeyType } from './enum/ConfigKey.ts';
import { type TagsConfig } from './TagsConfig.ts';

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
