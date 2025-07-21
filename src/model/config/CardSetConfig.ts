import { CardVariantConfig } from './CardVariantConfig.ts';
import { type CardSetConfigKeyType } from './enum/CardSetConfigKey.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class CardSetConfig {
  readonly configKey: CardSetConfigKeyType;
  readonly variants: CardVariantConfig[][];

  public constructor(configKey: CardSetConfigKeyType, variants: CardVariantConfig[][]) {
    this.configKey = configKey;
    this.variants = variants;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = '';

    let sideNo = 0;
    let variantNo = 0;
    for (const sides of this.variants) {
      for (const variant of sides) {
        s += `[Card - Side ${sideNo}, Variant ${variantNo}]`;
        s += `\n${variant.toString(opts)}`;
        variantNo++;
      }
      sideNo++;
    }

    return s;
  }
}

export { CardSetConfig };
