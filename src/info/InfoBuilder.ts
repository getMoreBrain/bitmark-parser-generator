import { Config } from '../config/Config.ts';
import { BitConfig } from '../model/config/BitConfig.ts';
import { BitType, type BitTypeType } from '../model/enum/BitType.ts';

export interface SupportedBitsOptions {
  includeNonDeprecated?: boolean; // Default: true
  includeDeprecated?: boolean; // Default: false
}

export interface SupportedBit {
  name: BitTypeType;
  since: string;
  deprecated?: string;
  inheritedBitTypes?: BitTypeType[];
}

class InfoBuilder {
  public getSupportedBits(options?: SupportedBitsOptions): SupportedBit[] {
    const includeNonDeprecated = options?.includeNonDeprecated ?? true;
    const includeDeprecated = options?.includeDeprecated ?? false;
    const supportedBits: SupportedBit[] = [];

    for (const bt of BitType.values()) {
      if (bt === BitType._error || bt === BitType._comment) continue;

      const bitType = Config.getBitType(bt);
      const bitConfig = Config.getBitConfig(bitType);

      const inheritedBitTypes =
        bitConfig.inheritedBitTypes.length > 0 ? bitConfig.inheritedBitTypes : undefined;

      const include =
        (includeNonDeprecated && !bitConfig.deprecated) ||
        (includeDeprecated && bitConfig.deprecated);
      if (include) {
        supportedBits.push({
          name: bt,
          since: bitConfig.since,
          deprecated: bitConfig.deprecated,
          inheritedBitTypes,
        });
      }
    }

    return supportedBits;
  }

  public getSupportedBitConfigs(): BitConfig[] {
    const res: BitConfig[] = [];

    for (const bt of BitType.values()) {
      if (bt === BitType._error || bt === BitType._comment) continue;

      const bitType = Config.getBitType(bt);
      const config: BitConfig = Config.getBitConfig(bitType);
      res.push(config);
    }

    return res;
  }
}

export { InfoBuilder };
