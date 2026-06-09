import { type ExportJsonKey, type HtmlKey } from './_Config.ts';
import { CardVariantConfig } from './CardVariantConfig.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class CardSideConfig {
  readonly name: string;
  readonly repeat: boolean;
  readonly jsonKey: string | null | undefined;
  readonly exportJsonKey?: ExportJsonKey;
  readonly hasExportJsonKey: boolean;
  readonly htmlKey?: HtmlKey;
  readonly hasHtmlKey: boolean;
  readonly variants: CardVariantConfig[];

  public constructor(
    name: string,
    repeat: boolean,
    variants: CardVariantConfig[],
    jsonKey?: string | null,
    exportJsonKey?: ExportJsonKey,
    hasExportJsonKey: boolean = false,
    htmlKey?: HtmlKey,
    hasHtmlKey: boolean = false,
  ) {
    this.name = name;
    this.repeat = repeat;
    this.jsonKey = jsonKey;
    this.exportJsonKey = exportJsonKey;
    this.hasExportJsonKey = hasExportJsonKey;
    this.htmlKey = htmlKey;
    this.hasHtmlKey = hasHtmlKey;
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
