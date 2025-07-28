import { BitTagConfigKeyType, type BitTagConfigKeyTypeType } from '../enum/BitTagConfigKeyType.ts';
import { Count, type CountType } from '../enum/Count.ts';
import { type TagFormatType } from '../enum/TagFormat.ts';
import { AbstractTagConfig } from './AbstractTagConfig.ts';
import type { ConfigKeyType } from './enum/ConfigKey.ts';
import { type TagsConfig } from './TagsConfig.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class PropertyTagConfig extends AbstractTagConfig {
  readonly type: BitTagConfigKeyTypeType = BitTagConfigKeyType.property;

  readonly array?: boolean; // If the property is treated as an array rather than a single value
  readonly format?: TagFormatType; // How the property is formatted
  readonly defaultValue?: string; // The default value of the property - this value can be omitted from the markup

  public constructor(params: {
    configKey: ConfigKeyType;
    tag: string;
    maxCount: CountType;
    minCount: number;
    chain: TagsConfig | undefined;
    jsonKey: string | undefined;
    format: TagFormatType | undefined;
    defaultValue: string | undefined;
    deprecated: string | undefined;
  }) {
    super({
      type: BitTagConfigKeyType.property,
      ...params,
    });

    this.array = params.maxCount === Count.infinity || params.maxCount > 1;
    this.format = params.format;
    this.defaultValue = params.defaultValue;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = `PTY[${this.tag}`;
    if (opts.includeConfigs) {
      if (this.deprecated != null) s += `, deprecated=${this.deprecated}`;
      if (this.maxCount != null) s += `, max=${this.maxCount}`;
      if (this.minCount != null) s += `, min=${this.minCount}`;
      if (this.array != null) s += `, arr=${this.array}`;
      if (this.format != null) s += `, fmt=${this.format}`;
      if (this.defaultValue != null) s += `, def=${this.defaultValue}`;
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

export { PropertyTagConfig };
