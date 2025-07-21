import { BitTagType, type BitTagTypeType } from '../enum/BitTagType.ts';
import { type CountType } from '../enum/Count.ts';
import { type ResourceJsonKeyType } from '../enum/ResourceJsonKey.ts';
import { type ResourceTagType } from '../enum/ResourceTag.ts';
import { AbstractTagConfig } from './AbstractTagConfig.ts';
import { type ConfigKeyType } from './enum/ConfigKey.ts';
import { type TagsConfig } from './TagsConfig.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class ResourceTagConfig extends AbstractTagConfig {
  readonly type: BitTagTypeType = BitTagType.resource;

  public constructor(
    configKey: ConfigKeyType,
    tag: ResourceTagType,
    maxCount: CountType,
    minCount: number,
    chain: TagsConfig | undefined,
    jsonKey: ResourceJsonKeyType | undefined,
    // astKey: PropertyAstKeyType|undefined,
    deprecated: string | undefined,
  ) {
    super(
      BitTagType.resource,
      configKey,
      tag,
      maxCount,
      minCount,
      chain,
      jsonKey,
      undefined,
      deprecated,
    );

    // TODO
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = `RES[${this.tag}`;
    if (opts.includeConfigs) {
      if (this.deprecated != null) s += `, deprecated=${this.deprecated}`;
      if (this.maxCount != null) s += `, max=${this.maxCount}`;
      if (this.minCount != null) s += `, min=${this.minCount}`;
      if (this.jsonKey != null) s += `, json=${this.jsonKey}`;
    }
    s += ']';

    if (this.chain && opts.includeChains) {
      s += `\n|__`;
      let first = true;
      for (const tag of Object.values(this.chain)) {
        if (!first) s += ` `;
        s += `${tag.toString(opts)}`;
        first = false;
      }
    }

    return s;
  }
}

export { ResourceTagConfig };
