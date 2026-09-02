import { Enum } from '@ncoderz/superenum';

import { Config } from '../config/Config.ts';
import { BIT_GROUPS } from '../config/raw/bitGroups.ts';
import { RESOURCE_GROUPS } from '../config/raw/resourceGroups.ts';
import { BitConfig } from '../model/config/BitConfig.ts';
import { type BitGroupType } from '../model/enum/BitGroup.ts';
import { BitType, type BitTypeType } from '../model/enum/BitType.ts';
import { type ResourceGroupType } from '../model/enum/ResourceGroup.ts';
import { type ResourceTypeType } from '../model/enum/ResourceType.ts';

export interface SupportedBitsOptions {
  includeNonDeprecated?: boolean; // Default: true
  includeDeprecated?: boolean; // Default: false
}

export interface SupportedBit {
  name: BitTypeType;
  title?: string; // PLAN-020: English display name
  since: string;
  deprecated?: string;
  inheritedBitTypes?: BitTypeType[];
  bitGroups?: BitGroupType[]; // PLAN-020: resolved bit-group memberships
}

/**
 * PLAN-020: Options for bit-group / resource-group queries.
 */
export interface BitGroupsOptions {
  language?: string; // Resolve titles for this BCP-47 language (fallback: en → key)
  subgroupOf?: BitGroupType | string; // Only groups with this subgroupOf metadata
  includeDeprecated?: boolean; // Include deprecated bit types in members (default: true)
}

export interface ResourceGroupsOptions {
  language?: string; // Resolve titles for this BCP-47 language (fallback: en → key)
}

/**
 * PLAN-020: A bit group with its resolved member bit types.
 */
export interface BitGroupInfo {
  key: BitGroupType;
  aliases?: string[];
  description: string;
  title: string; // Resolved for the requested language (fallback: en → key)
  subgroupOf?: BitGroupType;
  since: string;
  bitTypes: BitTypeType[];
}

/**
 * PLAN-020: A resource group with its member resource types (canonical values only).
 */
export interface ResourceGroupInfo {
  key: ResourceGroupType;
  aliases?: string[];
  description: string;
  title: string; // Resolved for the requested language (fallback: en → key)
  since: string;
  resourceTypes: ResourceTypeType[];
}

class InfoBuilder {
  public getSupportedBits(options?: SupportedBitsOptions): SupportedBit[] {
    const includeNonDeprecated = options?.includeNonDeprecated ?? true;
    const includeDeprecated = options?.includeDeprecated ?? false;
    const supportedBits: SupportedBit[] = [];

    for (const bt of Enum(BitType).values()) {
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
          title: bitConfig.title,
          since: bitConfig.since,
          deprecated: bitConfig.deprecated,
          inheritedBitTypes,
          bitGroups: bitConfig.bitGroups.length > 0 ? bitConfig.bitGroups : undefined,
        });
      }
    }

    return supportedBits;
  }

  /**
   * PLAN-020: Get all known bit groups with their resolved member bit types.
   *
   * @param options language (title resolution), subgroupOf (filter), includeDeprecated
   */
  public getBitGroups(options?: BitGroupsOptions): BitGroupInfo[] {
    const subgroupFilter =
      options?.subgroupOf != null ? Config.getBitGroupKey(options.subgroupOf) : undefined;
    // An unknown subgroupOf filter matches nothing (consistent never-throw semantics) —
    // it must NOT fall through to undefined and match the top-level groups instead.
    if (options?.subgroupOf != null && subgroupFilter == null) return [];
    const res: BitGroupInfo[] = [];
    for (const [key, g] of Object.entries(BIT_GROUPS)) {
      if (subgroupFilter != null && g.subgroupOf !== subgroupFilter) continue;
      res.push({
        key: key as BitGroupType,
        aliases: g.aliases ? [...g.aliases] : undefined,
        description: g.description,
        title: Config.getBitGroupTitle(key, options?.language),
        subgroupOf: g.subgroupOf,
        since: g.since,
        bitTypes: Config.getBitTypesForBitGroups([key], {
          includeDeprecated: options?.includeDeprecated,
        }),
      });
    }
    return res;
  }

  /**
   * PLAN-020: Get all known resource groups with their member resource types.
   */
  public getResourceGroups(options?: ResourceGroupsOptions): ResourceGroupInfo[] {
    const res: ResourceGroupInfo[] = [];
    for (const [key, g] of Object.entries(RESOURCE_GROUPS)) {
      res.push({
        key: key as ResourceGroupType,
        aliases: g.aliases ? [...g.aliases] : undefined,
        description: g.description,
        title: Config.getResourceGroupTitle(key, options?.language),
        since: g.since,
        resourceTypes: Config.getResourceTypesForResourceGroups([key]),
      });
    }
    return res;
  }

  /**
   * PLAN-020: Get the bit groups that one or more bit types belong to, with resolved
   * titles and members.
   */
  public getBitGroupsForBitTypes(
    bitTypes: (BitTypeType | string)[],
    options?: BitGroupsOptions,
  ): BitGroupInfo[] {
    const groups = new Set(Config.getBitGroupsForBitTypes(bitTypes));
    return this.getBitGroups(options).filter((g) => groups.has(g.key));
  }

  public getSupportedBitConfigs(): BitConfig[] {
    const res: BitConfig[] = [];

    for (const bt of Enum(BitType).values()) {
      if (bt === BitType._error || bt === BitType._comment) continue;

      const bitType = Config.getBitType(bt);
      const config: BitConfig = Config.getBitConfig(bitType);
      res.push(config);
    }

    return res;
  }
}

export { InfoBuilder };
