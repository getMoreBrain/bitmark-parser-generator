import { BitTagConfigKeyType, type BitTagConfigKeyTypeType } from '../enum/BitTagConfigKeyType.ts';
import { type CountType } from '../enum/Count.ts';
import { type TagType } from '../enum/Tag.ts';
import { AbstractTagConfig } from './AbstractTagConfig.ts';
import type { ConfigKeyType } from './enum/ConfigKey.ts';
import { type TagsConfig } from './TagsConfig.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class MarkupTagConfig extends AbstractTagConfig {
  readonly type: BitTagConfigKeyTypeType = BitTagConfigKeyType.tag;

  public constructor(params: {
    configKey: ConfigKeyType;
    tag: TagType;
    maxCount: CountType;
    minCount: number;
    chain: TagsConfig | undefined;
    deprecated: string | undefined;
  }) {
    super({
      type: BitTagConfigKeyType.tag,
      jsonKey: undefined,
      ...params,
    });

    // TODO
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = `TAG[${this.tag}`;
    if (opts.includeConfigs) {
      if (this.deprecated != null) s += `, deprecated=${this.deprecated}`;
      if (this.maxCount != null) s += `, max=${this.maxCount}`;
      if (this.minCount != null) s += `, min=${this.minCount}`;
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

export { MarkupTagConfig };
