import { type ExportJsonKey } from './_Config.ts';
import { type CardSideConfig } from './CardSideConfig.ts';
import { type CardVariantConfig } from './CardVariantConfig.ts';
import { type CardSetConfigKeyType } from './enum/CardSetConfigKey.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

interface CardSetSection {
  jsonKey: string;
  exportJsonKey?: ExportJsonKey;
  hasExportJsonKey?: boolean;
  isDefault?: boolean;
  sideJsonKey?: string;
  sideExportJsonKey?: ExportJsonKey;
  hasSideExportJsonKey?: boolean;
}

class CardSetConfig {
  readonly configKey: CardSetConfigKeyType;
  readonly jsonKey: string | null;
  readonly exportJsonKey?: ExportJsonKey;
  readonly hasExportJsonKey: boolean;
  readonly sections: Record<string, CardSetSection> | undefined;
  readonly sides: CardSideConfig[];

  // Legacy accessor — provides the same shape as the old `variants: CardVariantConfig[][]`
  // so downstream consumers (Config.getCardSetVariantConfig, etc.) continue to work.
  get variants(): CardVariantConfig[][] {
    return this.sides.map((side) => side.variants);
  }

  public constructor(
    configKey: CardSetConfigKeyType,
    jsonKey: string | null,
    exportJsonKey: ExportJsonKey | undefined,
    hasExportJsonKey: boolean,
    sections: Record<string, CardSetSection> | undefined,
    sides: CardSideConfig[],
  ) {
    this.configKey = configKey;
    this.jsonKey = jsonKey;
    this.exportJsonKey = exportJsonKey;
    this.hasExportJsonKey = hasExportJsonKey;
    this.sections = sections;
    this.sides = sides;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = '';

    s += `[CardSet: ${this.configKey}]`;
    s += `\n  jsonKey: ${this.jsonKey}`;

    for (const side of this.sides) {
      s += `\n${side.toString(opts)}`;
    }

    return s;
  }
}

export { CardSetConfig, type CardSetSection };
