import { type BitTagConfigKeyTypeType } from '../enum/BitTagConfigKeyType.ts';
import { type CountType } from '../enum/Count.ts';
import type { ConfigKeyType } from './enum/ConfigKey.ts';
import { type TagsConfig } from './TagsConfig.ts';

abstract class AbstractTagConfig {
  readonly type: BitTagConfigKeyTypeType;
  readonly configKey: ConfigKeyType;
  readonly tag: string;
  readonly maxCount: CountType; // Default: 1
  readonly minCount: number; // Default: 0
  readonly chain?: TagsConfig;

  readonly jsonKey?: string; // If the json key is different from the tag

  readonly deprecated?: string; // Deprecated version

  public constructor(
    type: BitTagConfigKeyTypeType,
    configKey: ConfigKeyType,
    tag: string,
    maxCount: CountType,
    minCount: number,
    chain: TagsConfig | undefined,
    jsonKey: string | undefined,
    deprecated: string | undefined,
  ) {
    this.type = type;
    this.configKey = configKey;
    this.tag = tag;
    this.maxCount = maxCount;
    this.minCount = minCount;
    this.chain = chain;
    this.jsonKey = jsonKey;
    this.deprecated = deprecated;
  }
}

export { AbstractTagConfig };
