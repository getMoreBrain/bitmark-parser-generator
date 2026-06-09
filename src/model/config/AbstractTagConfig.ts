import { type BitTagConfigKeyTypeType } from '../enum/BitTagConfigKeyType.ts';
import { type CountType } from '../enum/Count.ts';
import { type ExportJsonKey, type HtmlKey } from './_Config.ts';
import type { ConfigKeyType } from './enum/ConfigKey.ts';
import { type TagsConfig } from './TagsConfig.ts';

abstract class AbstractTagConfig {
  readonly type: BitTagConfigKeyTypeType;
  readonly configKey: ConfigKeyType;
  readonly tag: string;
  readonly maxCount: CountType; // Default: 1
  readonly minCount: number; // Default: 0
  readonly chain?: TagsConfig;

  readonly jsonKey?: string; // Legacy string-form jsonKey
  readonly exportJsonKey?: ExportJsonKey; // New JSON-pattern jsonKey (export-only)
  readonly hasExportJsonKey: boolean; // True iff exportJsonKey was explicitly set

  readonly htmlKey?: HtmlKey; // HTML key-pattern (export-only)
  readonly hasHtmlKey: boolean; // True iff htmlKey was explicitly set

  readonly deprecated?: string; // Deprecated version

  public constructor(params: {
    type: BitTagConfigKeyTypeType;
    configKey: ConfigKeyType;
    tag: string;
    maxCount: CountType;
    minCount: number;
    chain: TagsConfig | undefined;
    jsonKey: string | undefined;
    exportJsonKey: ExportJsonKey | undefined;
    hasExportJsonKey: boolean;
    htmlKey: HtmlKey | undefined;
    hasHtmlKey: boolean;
    deprecated: string | undefined;
  }) {
    this.type = params.type;
    this.configKey = params.configKey;
    this.tag = params.tag;
    this.maxCount = params.maxCount;
    this.minCount = params.minCount;
    this.chain = params.chain;
    this.jsonKey = params.jsonKey;
    this.exportJsonKey = params.exportJsonKey;
    this.hasExportJsonKey = params.hasExportJsonKey;
    this.htmlKey = params.htmlKey;
    this.hasHtmlKey = params.hasHtmlKey;
    this.deprecated = params.deprecated;
  }
}

export { AbstractTagConfig };
