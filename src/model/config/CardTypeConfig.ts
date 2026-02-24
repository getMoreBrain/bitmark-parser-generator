import { type CardSideConfig } from './CardSideConfig.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class CardTypeConfig {
  readonly name: string;
  readonly isDefault: boolean;
  readonly jsonKey: string | null;
  readonly itemType: 'object' | 'array';
  readonly sides: CardSideConfig[];

  public constructor(
    name: string,
    isDefault: boolean,
    jsonKey: string | null,
    itemType: 'object' | 'array',
    sides: CardSideConfig[],
  ) {
    this.name = name;
    this.isDefault = isDefault;
    this.jsonKey = jsonKey;
    this.itemType = itemType;
    this.sides = sides;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = '';

    s += `[CardType: ${this.name}]`;
    if (this.isDefault) s += ' (default)';
    s += `\n  jsonKey: ${this.jsonKey}`;
    s += `\n  itemType: ${this.itemType}`;

    for (const side of this.sides) {
      s += `\n${side.toString(opts)}`;
    }

    return s;
  }
}

export { CardTypeConfig };
