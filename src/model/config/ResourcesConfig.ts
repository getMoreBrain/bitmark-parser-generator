import { type CountType } from '../enum/Count.ts';
import type { ConfigKeyType } from './enum/ConfigKey.ts';
import { type TagsConfig } from './TagsConfig.ts';

class ResourcesConfig {
  readonly tags: TagsConfig;
  readonly resourceAttachmentAllowed: boolean;
  readonly resourceAttachmentConfigKey: string | undefined;
  readonly comboResourceConfigKeysMap: Map<ConfigKeyType, ConfigKeyType[]>;

  public constructor(
    tags: TagsConfig,
    resourceAttachmentAllowed: boolean | undefined,
    resourceAttachmentConfigKey: ConfigKeyType | undefined,
    comboResourceConfigKeysMap: Map<ConfigKeyType, ConfigKeyType[]>,
  ) {
    this.tags = tags;
    this.resourceAttachmentAllowed = resourceAttachmentAllowed ?? false;
    this.resourceAttachmentConfigKey = resourceAttachmentConfigKey;
    this.comboResourceConfigKeysMap = comboResourceConfigKeysMap;
  }

  public getCountsMin(): Map<ConfigKeyType, number> {
    const counts: Map<ConfigKeyType, number> = new Map();
    for (const r of Object.values(this.tags)) {
      if (r.minCount != null) {
        counts.set(r.configKey, r.minCount);
      }
    }
    return counts;
  }

  public getCountsMax(): Map<ConfigKeyType, CountType> {
    const counts: Map<ConfigKeyType, CountType> = new Map();
    for (const r of Object.values(this.tags)) {
      if (r.maxCount != null) {
        counts.set(r.configKey, r.maxCount);
      }
    }
    return counts;
  }
}

export { ResourcesConfig };
