import { BitTagType, BitTagTypeType } from '../enum/BitTagType';
import { CountType } from '../enum/Count';
import { PropertyAstKeyType } from '../enum/PropertyAstKey';
import { PropertyFormatType } from '../enum/PropertyFormat';
import { PropertyJsonKeyType } from '../enum/PropertyJsonKey';
import { PropertyTagType } from '../enum/PropertyTag';

import { AbstractTagConfig } from './AbstractTagConfig';
import { TagsConfig } from './TagsConfig';
import { PropertyConfigKeyType } from './enum/PropertyConfigKey';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class PropertyTagConfig extends AbstractTagConfig {
  readonly type: BitTagTypeType = BitTagType.property;

  readonly single?: boolean; // If the property is treated as single rather than an array
  readonly format?: PropertyFormatType; // How the property is formatted
  readonly defaultValue?: string; // The default value of the property - this value can be omitted from the markup

  public constructor(
    configKey: PropertyConfigKeyType,
    tag: PropertyTagType,
    maxCount: CountType,
    minCount: number,
    chain: TagsConfig | undefined,
    jsonKey: PropertyJsonKeyType | undefined,
    astKey: PropertyAstKeyType | undefined,
    single: boolean | undefined,
    format: PropertyFormatType | undefined,
    defaultValue: string | undefined,
    deprecated: string | undefined,
  ) {
    super(BitTagType.property, configKey, tag, maxCount, minCount, chain, jsonKey, astKey, deprecated);

    this.single = single;
    this.format = format;
    this.defaultValue = defaultValue;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = `PTY[${this.tag}`;
    if (opts.includeConfigs) {
      if (this.deprecated != null) s += `, deprecated=${this.deprecated}`;
      if (this.maxCount != null) s += `, max=${this.maxCount}`;
      if (this.minCount != null) s += `, min=${this.minCount}`;
      if (this.single != null) s += `, sgl=${this.single}`;
      if (this.format != null) s += `, fmt=${this.format}`;
      if (this.defaultValue != null) s += `, def=${this.defaultValue}`;
      if (this.jsonKey != null) s += `, json=${this.jsonKey}`;
      if (this.astKey != null) s += `, ast=${this.astKey}`;
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
