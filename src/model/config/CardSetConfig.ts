import { type CardSideConfig } from './CardSideConfig.ts';
import { type CardTypeConfig } from './CardTypeConfig.ts';
import { type CardVariantConfig } from './CardVariantConfig.ts';
import { type CardSetConfigKeyType } from './enum/CardSetConfigKey.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class CardSetConfig {
  readonly configKey: CardSetConfigKeyType;
  readonly cards: CardTypeConfig[];

  // Legacy accessor — returns the default card type (first with isDefault, or first entry)
  private get defaultCard(): CardTypeConfig {
    return this.cards.find((c) => c.isDefault) ?? this.cards[0];
  }

  // Legacy accessor — returns jsonKey of the default card type
  get jsonKey(): string | null {
    return this.defaultCard.jsonKey;
  }

  // Legacy accessor — returns itemType of the default card type
  get itemType(): 'object' | 'array' {
    return this.defaultCard.itemType;
  }

  // Legacy accessor — returns sides of the default card type
  get sides(): CardSideConfig[] {
    return this.defaultCard.sides;
  }

  // Legacy accessor — reconstructs sections map from cards array (for downstream consumers)
  get sections(): Record<string, { jsonKey: string }> | undefined {
    if (this.cards.length <= 1) return undefined;
    const sections: Record<string, { jsonKey: string }> = {};
    for (const card of this.cards) {
      sections[card.name] = { jsonKey: card.jsonKey ?? '' };
    }
    return sections;
  }

  // Legacy accessor — provides the same shape as the old `variants: CardVariantConfig[][]`
  // so downstream consumers (Config.getCardSetVariantConfig, etc.) continue to work.
  get variants(): CardVariantConfig[][] {
    return this.sides.map((side) => side.variants);
  }

  public constructor(configKey: CardSetConfigKeyType, cards: CardTypeConfig[]) {
    this.configKey = configKey;
    this.cards = cards;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = '';

    s += `[CardSet: ${this.configKey}]`;

    for (const card of this.cards) {
      s += `\n${card.toString(opts)}`;
    }

    return s;
  }
}

export { CardSetConfig };
