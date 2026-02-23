import { CardVariantConfig } from './CardVariantConfig.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class CardSideConfig {
  readonly name: string;
  readonly repeat: boolean;
  readonly variants: CardVariantConfig[];

  public constructor(name: string, repeat: boolean, variants: CardVariantConfig[]) {
    this.name = name;
    this.repeat = repeat;
    this.variants = variants;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = '';

    s += `[Side: ${this.name}]`;
    if (this.repeat) s += ' (repeat)';

    let variantNo = 0;
    for (const variant of this.variants) {
      s += `\n  [Variant ${variantNo}]`;
      s += `\n  ${variant.toString(opts)}`;
      variantNo++;
    }

    return s;
  }
}

export { CardSideConfig };
