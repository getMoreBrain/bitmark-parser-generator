import type { ConfigKeyType } from './enum/ConfigKey.ts';
import { type TagsConfig } from './TagsConfig.ts';

export interface TagsConfigWithInfo {
  tags: TagsConfig;
  info?: {
    comboResourceConfigKey?: ConfigKeyType;
  };
}
