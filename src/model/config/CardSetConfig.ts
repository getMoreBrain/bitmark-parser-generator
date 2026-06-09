import { type ExportJsonKey, type HtmlKey } from './_Config.ts';
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
  htmlKey?: HtmlKey;
  hasHtmlKey?: boolean;
  isDefault?: boolean;
  sideJsonKey?: string;
  sideExportJsonKey?: ExportJsonKey;
  hasSideExportJsonKey?: boolean;
  sideHtmlKey?: HtmlKey;
  hasSideHtmlKey?: boolean;
  // PLAN-085: cardinality on the section (per-card-type). `0` (default)
  // means unbounded. Exported as `min` / `max` in the per-card config
  // JSON; mirrored on the Rust `CardConfig.min/max` field.
  minCount?: number;
  maxCount?: number;
}

class CardSetConfig {
  readonly configKey: CardSetConfigKeyType;
  readonly jsonKey: string | null;
  readonly exportJsonKey?: ExportJsonKey;
  readonly hasExportJsonKey: boolean;
  readonly htmlKey?: HtmlKey;
  readonly hasHtmlKey: boolean;
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
    htmlKey: HtmlKey | undefined = undefined,
    hasHtmlKey: boolean = false,
  ) {
    this.configKey = configKey;
    this.jsonKey = jsonKey;
    this.exportJsonKey = exportJsonKey;
    this.hasExportJsonKey = hasExportJsonKey;
    this.htmlKey = htmlKey;
    this.hasHtmlKey = hasHtmlKey;
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
