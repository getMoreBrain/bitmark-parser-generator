import { BitTagType, BitTagTypeType } from '../enum/BitTagType';
import { CountType } from '../enum/Count';
import { TagType } from '../enum/Tag';

import { AbstractTagConfig } from './AbstractTagConfig';
import { TagsConfig } from './TagsConfig';
import { ConfigKeyType } from './enum/ConfigKey';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class MarkupTagConfig extends AbstractTagConfig {
  readonly type: BitTagTypeType = BitTagType.tag;

  public constructor(
    configKey: ConfigKeyType,
    tag: TagType,
    maxCount: CountType,
    minCount: number,
    chain: TagsConfig | undefined,
    // jsonKey?: PropertyJsonKeyType | ResourceJsonKeyType|undefined,
    // astKey?: PropertyAstKeyType|undefined,
    deprecated: string | undefined,
  ) {
    super(BitTagType.tag, configKey, tag, maxCount, minCount, chain, undefined, undefined, deprecated);

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
