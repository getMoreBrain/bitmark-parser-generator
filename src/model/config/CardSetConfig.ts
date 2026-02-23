import { type CardSideConfig } from './CardSideConfig.ts';
import { type CardVariantConfig } from './CardVariantConfig.ts';
import { type CardSetConfigKeyType } from './enum/CardSetConfigKey.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class CardSetConfig {
  readonly configKey: CardSetConfigKeyType;
  readonly jsonKey: string | null;
  readonly itemType: 'object' | 'array';
  readonly sections: Record<string, { jsonKey: string }> | undefined;
  readonly sides: CardSideConfig[];

  // Legacy accessor — provides the same shape as the old `variants: CardVariantConfig[][]`
  // so downstream consumers (Config.getCardSetVariantConfig, etc.) continue to work.
  get variants(): CardVariantConfig[][] {
    return this.sides.map((side) => side.variants);
  }

  public constructor(
    configKey: CardSetConfigKeyType,
    jsonKey: string | null,
    itemType: 'object' | 'array',
    sections: Record<string, { jsonKey: string }> | undefined,
    sides: CardSideConfig[],
  ) {
    this.configKey = configKey;
    this.jsonKey = jsonKey;
    this.itemType = itemType;
    this.sections = sections;
    this.sides = sides;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = '';

    s += `[CardSet: ${this.configKey}]`;
    s += `\n  jsonKey: ${this.jsonKey}`;
    s += `\n  itemType: ${this.itemType}`;

    for (const side of this.sides) {
      s += `\n${side.toString(opts)}`;
    }

    return s;
  }
}

export { CardSetConfig };
