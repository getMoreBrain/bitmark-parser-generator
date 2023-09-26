import { Config } from '../config/Config';
import { BitConfig } from '../model/config/BitConfig';
import { AliasBitType, RootBitType, RootBitTypeType, RootOrAliasBitTypeType } from '../model/enum/BitType';

export interface SupportedBitsOptions {
  includeNonDeprecated?: boolean; // Default: true
  includeDeprecated?: boolean; // Default: false
}

export interface SupportedBit {
  name: RootOrAliasBitTypeType;
  since: string;
  deprecated?: string;
  aliases?: SupportedBit[];
}

class InfoBuilder {
  public getSupportedBits(options?: SupportedBitsOptions): SupportedBit[] {
    const includeNonDeprecated = options?.includeNonDeprecated ?? true;
    const includeDeprecated = options?.includeDeprecated ?? false;
    const supportedBits: SupportedBit[] = [];

    for (const root of RootBitType.values()) {
      if (root === RootBitType._error) continue;

      const bitType = Config.getBitType(root);
      const bitConfig = Config.getBitConfig(bitType);

      const aliases = this.getSupportedBitAliases(root, options);

      const include =
        aliases.length > 0 ||
        (includeNonDeprecated && !bitConfig.deprecated) ||
        (includeDeprecated && bitConfig.deprecated);
      if (include) {
        supportedBits.push({
          name: root,
          since: bitConfig.since,
          deprecated: bitConfig.deprecated,
          aliases,
        });
      }
    }

    return supportedBits;
  }

  public getSupportedBitConfigs(): BitConfig[] {
    const res: BitConfig[] = [];

    for (const root of RootBitType.values()) {
      if (root === RootBitType._error) continue;

      const bitType = Config.getBitType(root);
      const config: BitConfig = Config.getBitConfig(bitType);
      res.push(config);
    }

    return res;
  }

  private getSupportedBitAliases(root: RootBitTypeType, options?: SupportedBitsOptions): SupportedBit[] {
    const includeNonDeprecated = options?.includeNonDeprecated ?? true;
    const includeDeprecated = options?.includeDeprecated ?? false;
    const aliases: SupportedBit[] = [];

    for (const alias of AliasBitType.values()) {
      const thisBitType = Config.getBitType(alias);
      if (thisBitType.root === root) {
        const bitConfig = Config.getBitConfig(thisBitType);

        const include = (includeNonDeprecated && !bitConfig.deprecated) || (includeDeprecated && bitConfig.deprecated);
        if (include) {
          aliases.push({
            name: thisBitType.alias,
            since: bitConfig.since,
            deprecated: bitConfig.deprecated,
          });
        }
      }
    }

    return aliases;
  }
}

export { InfoBuilder };
