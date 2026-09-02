import { Enum } from '@ncoderz/superenum';

import { type _BitConfig, type _PropertiesConfig } from '../model/config/_Config.ts';
import { BitConfig } from '../model/config/BitConfig.ts';
import type { CardVariantConfig } from '../model/config/CardVariantConfig.ts';
import { ConfigKey, type ConfigKeyType } from '../model/config/enum/ConfigKey.ts';
import { GroupConfigType } from '../model/config/enum/GroupConfigType.ts';
import { ResourcesConfig } from '../model/config/ResourcesConfig.ts';
import { ResourceTagConfig } from '../model/config/ResourceTagConfig.ts';
import { type TagConfig } from '../model/config/TagConfig.ts';
import { type TagsConfig } from '../model/config/TagsConfig.ts';
import { type BitGroupType } from '../model/enum/BitGroup.ts';
import { BitTagConfigKeyType } from '../model/enum/BitTagConfigKeyType.ts';
import { BitType, type BitTypeType } from '../model/enum/BitType.ts';
import { Count } from '../model/enum/Count.ts';
import { type ResourceGroupType } from '../model/enum/ResourceGroup.ts';
import type { ResourceKeyType } from '../model/enum/ResourceKey.ts';
import { resourceTypeToConfigKey, type ResourceTypeType } from '../model/enum/ResourceType.ts';
import { TagFormat } from '../model/enum/TagFormat.ts';
import { TextFormat } from '../model/enum/TextFormat.ts';
import { type TranslationsData } from '../model/TranslationsData.ts';
import { ObjectUtils } from '../utils/ObjectUtils.ts';
import { ConfigHydrator } from './ConfigHydrator.ts';
import { BIT_GROUPS } from './raw/bitGroups.ts';
import { BITS } from './raw/bits.ts';
import { GROUPS } from './raw/groups.ts';
import { RESOURCE_GROUPS } from './raw/resourceGroups.ts';

/**
 * PLAN-017: suffix identifying the deprecated collapsible bit types.
 */
const COLLAPSIBLE_BIT_TYPE_SUFFIX = '-collapsible';

export interface ComboResources {
  [configKey: string]: TagsConfig;
}

class Config {
  public bitLevelMin = 1;
  public bitLevelMax = 7;
  private bitCache: Map<BitTypeType, BitConfig> = new Map();
  private migratedBitCache: Map<BitTypeType, BitTypeType | undefined> = new Map();
  private allResourcesCache: TagsConfig | undefined;
  private comboResourcesCache: Map<ConfigKeyType, TagsConfig | undefined> = new Map();

  // PLAN-020: bit-group / resource-group lookup caches (built lazily, immutable afterwards)
  private bitGroupKeyCache: Map<string, BitGroupType> | undefined; // key + aliases -> key
  private bitGroupToBitTypesCache: Map<BitGroupType, BitTypeType[]> | undefined;
  private resourceGroupKeyCache: Map<string, ResourceGroupType> | undefined; // key + aliases -> key
  private translations: TranslationsData | undefined; // normalized: lowercase language tags

  constructor() {
    //
  }

  //
  // PLAN-020: Bit groups, resource groups & translated names
  //

  /**
   * Register translated display names (from the `./translations` subpath export).
   *
   * Without registration, name lookups fall back to the inline English `title` / the
   * technical key. Idempotent; last registration wins.
   */
  public registerTranslations(data: TranslationsData): void {
    // Normalize language tags to lowercase for case-insensitive BCP-47 lookup
    const normalized: TranslationsData = {};
    for (const [key, langs] of Object.entries(data)) {
      const entry: { [lang: string]: string } = {};
      for (const [lang, text] of Object.entries(langs)) {
        entry[lang.toLowerCase()] = text;
      }
      normalized[key] = entry;
    }
    this.translations = normalized;
  }

  /**
   * Resolve a bit-group key or alias to the canonical bit-group key.
   *
   * @returns the canonical key, or undefined if unknown (never throws)
   */
  public getBitGroupKey(keyOrAlias: BitGroupType | string | undefined): BitGroupType | undefined {
    if (keyOrAlias == null) return undefined;
    return this.getBitGroupKeyMap().get(keyOrAlias);
  }

  /**
   * Resolve a resource-group key or alias to the canonical resource-group key.
   *
   * @returns the canonical key, or undefined if unknown (never throws)
   */
  public getResourceGroupKey(
    keyOrAlias: ResourceGroupType | string | undefined,
  ): ResourceGroupType | undefined {
    if (keyOrAlias == null) return undefined;
    return this.getResourceGroupKeyMap().get(keyOrAlias);
  }

  /**
   * Get the resolved bit-group memberships for a bit type.
   *
   * Memberships are explicit per bit — no inheritance via baseBitType. The one exception:
   * a deprecated bit with a migration target derives its target's memberships unless it
   * declares its own (D6).
   *
   * @param bitType the bit type (unknown / invalid types return [])
   */
  public getBitGroupsForBitType(bitType: BitTypeType | string | undefined): BitGroupType[] {
    if (bitType == null) return [];
    const _bitConfig = BITS[bitType as BitTypeType];
    if (!_bitConfig) return [];
    // Copy: the raw config is immutable at runtime and must not leak by reference
    if (_bitConfig.bitGroups) return [..._bitConfig.bitGroups];
    const target = this.getMigratedBitType(bitType as BitTypeType);
    if (target) return this.getBitGroupsForBitType(target);
    return [];
  }

  /**
   * Get all bit types belonging to one or more bit groups (union, deduped, sorted).
   *
   * Serves search queries such as `g=cloze&g=table`. Inputs may be canonical keys or
   * aliases; unknown inputs are ignored (never throws).
   *
   * @param bitGroups bit-group keys or aliases
   * @param options includeDeprecated: include deprecated bit types (default: true —
   *        stored legacy content must still be found by search)
   */
  public getBitTypesForBitGroups(
    bitGroups: (BitGroupType | string)[],
    options?: { includeDeprecated?: boolean },
  ): BitTypeType[] {
    const includeDeprecated = options?.includeDeprecated ?? true;
    const map = this.getBitGroupToBitTypesMap();
    const res = new Set<BitTypeType>();
    for (const g of bitGroups) {
      const key = this.getBitGroupKey(g);
      if (!key) continue;
      for (const bt of map.get(key) ?? []) {
        if (!includeDeprecated && BITS[bt]?.deprecated) continue;
        res.add(bt);
      }
    }
    return [...res].sort();
  }

  /**
   * Get the bit groups that one or more bit types belong to (union, deduped, sorted).
   *
   * Unknown bit types are ignored (never throws).
   */
  public getBitGroupsForBitTypes(bitTypes: (BitTypeType | string)[]): BitGroupType[] {
    const res = new Set<BitGroupType>();
    for (const bt of bitTypes) {
      for (const g of this.getBitGroupsForBitType(bt)) res.add(g);
    }
    return [...res].sort();
  }

  /**
   * Get the resource types belonging to one or more resource groups (union, deduped,
   * sorted). Members are canonical kebab-case values only — normalize legacy camelCase
   * input values before matching against them.
   */
  public getResourceTypesForResourceGroups(
    resourceGroups: (ResourceGroupType | string)[],
  ): ResourceTypeType[] {
    const res = new Set<ResourceTypeType>();
    for (const g of resourceGroups) {
      const key = this.getResourceGroupKey(g);
      if (!key) continue;
      for (const rt of RESOURCE_GROUPS[key].resourceTypes) res.add(rt);
    }
    return [...res].sort();
  }

  /**
   * Get the resource groups that one or more resource types belong to (union, deduped,
   * sorted). Unknown resource types are ignored.
   */
  public getResourceGroupsForResourceTypes(
    resourceTypes: (ResourceTypeType | string)[],
  ): ResourceGroupType[] {
    const wanted = new Set(resourceTypes);
    const res = new Set<ResourceGroupType>();
    for (const [key, g] of Object.entries(RESOURCE_GROUPS)) {
      if (g.resourceTypes.some((rt) => wanted.has(rt))) res.add(key as ResourceGroupType);
    }
    return [...res].sort();
  }

  /**
   * Get the translated display name of a bit type.
   *
   * Fallback chain (D8): requested BCP-47 tag → progressively stripped subtags → inline
   * English `title` → technical key.
   */
  public getBitTitle(bitType: BitTypeType | string, language?: string): string {
    const inline = BITS[bitType as BitTypeType]?.title;
    return this.translate(bitType as string, inline, language);
  }

  /**
   * Get the translated display name of a bit group (key or alias accepted).
   * Fallback chain as {@link getBitTitle}.
   */
  public getBitGroupTitle(keyOrAlias: BitGroupType | string, language?: string): string {
    const key = this.getBitGroupKey(keyOrAlias);
    if (!key) return keyOrAlias as string;
    return this.translate(key, BIT_GROUPS[key].title, language);
  }

  /**
   * Get the translated display name of a resource group (key or alias accepted).
   * Fallback chain as {@link getBitTitle}.
   */
  public getResourceGroupTitle(keyOrAlias: ResourceGroupType | string, language?: string): string {
    const key = this.getResourceGroupKey(keyOrAlias);
    if (!key) return keyOrAlias as string;
    return this.translate(key, RESOURCE_GROUPS[key].title, language);
  }

  private translate(key: string, inlineTitle: string | undefined, language?: string): string {
    if (language && this.translations) {
      const entry = this.translations[key];
      if (entry) {
        // BCP-47 fallback walk: de-CH-1996 → de-CH → de
        let lang = language.toLowerCase();
        for (;;) {
          const text = entry[lang];
          if (text) return text;
          const idx = lang.lastIndexOf('-');
          if (idx < 0) break;
          lang = lang.substring(0, idx);
        }
      }
    }
    // en → inline title; final fallback: technical key
    return inlineTitle ?? key;
  }

  private getBitGroupKeyMap(): Map<string, BitGroupType> {
    if (!this.bitGroupKeyCache) {
      const map = new Map<string, BitGroupType>();
      for (const [key, g] of Object.entries(BIT_GROUPS)) {
        if (map.has(key)) throw new Error(`Duplicate bit-group key/alias: ${key}`);
        map.set(key, key as BitGroupType);
        for (const alias of g.aliases ?? []) {
          if (map.has(alias)) throw new Error(`Duplicate bit-group key/alias: ${alias}`);
          map.set(alias, key as BitGroupType);
        }
      }
      this.bitGroupKeyCache = map;
    }
    return this.bitGroupKeyCache;
  }

  private getResourceGroupKeyMap(): Map<string, ResourceGroupType> {
    if (!this.resourceGroupKeyCache) {
      const map = new Map<string, ResourceGroupType>();
      for (const [key, g] of Object.entries(RESOURCE_GROUPS)) {
        if (map.has(key)) throw new Error(`Duplicate resource-group key/alias: ${key}`);
        map.set(key, key as ResourceGroupType);
        for (const alias of g.aliases ?? []) {
          if (map.has(alias)) throw new Error(`Duplicate resource-group key/alias: ${alias}`);
          map.set(alias, key as ResourceGroupType);
        }
      }
      this.resourceGroupKeyCache = map;
    }
    return this.resourceGroupKeyCache;
  }

  private getBitGroupToBitTypesMap(): Map<BitGroupType, BitTypeType[]> {
    if (!this.bitGroupToBitTypesCache) {
      const map = new Map<BitGroupType, BitTypeType[]>();
      for (const key of Object.keys(BIT_GROUPS)) map.set(key as BitGroupType, []);
      for (const bt of Object.keys(BITS).sort()) {
        for (const g of this.getBitGroupsForBitType(bt as BitTypeType)) {
          const list = map.get(g);
          if (!list) throw new Error(`Bit '${bt}' references unknown bit group '${g}'`);
          list.push(bt as BitTypeType);
        }
      }
      this.bitGroupToBitTypesCache = map;
    }
    return this.bitGroupToBitTypesCache;
  }

  /**
   * Return the bitType given a bit type that may be invalid
   *
   * If the bit type is not found, the _error bit type will be returned.
   *
   * @param bitType bit type in (may be invalid)
   * @returns valid bitType, or _error if the bit type is invalid
   */
  public getBitType(bitType: BitTypeType | string | undefined): BitTypeType {
    if (bitType?.startsWith('|')) bitType = bitType.substring(1);
    return Enum(BitType).fromValue(bitType) ?? BitType._error;
  }

  /**
   * PLAN-017: Return the migration target for a deprecated `*-collapsible` bit type.
   *
   * Every `*-collapsible` bit type declares its non-collapsible cousin as its `baseBitType`, so the
   * target is read from the config rather than a hand-maintained table — a new `*-collapsible` bit
   * type is covered automatically.
   *
   * `BitType.collapsible` is the one exclusion: it has no non-collapsible cousin (its `baseBitType`
   * is `article`, which is not a migration target).
   *
   * @param bitType the bit type
   * @returns the bit type to migrate to, or undefined if the bit type does not migrate
   */
  public getMigratedBitType(bitType: BitTypeType): BitTypeType | undefined {
    const cached = this.migratedBitCache.get(bitType);
    if (cached !== undefined || this.migratedBitCache.has(bitType)) return cached;

    let target: BitTypeType | undefined;
    if (bitType !== BitType.collapsible && bitType.endsWith(COLLAPSIBLE_BIT_TYPE_SUFFIX)) {
      target = BITS[bitType]?.baseBitType;
    }

    this.migratedBitCache.set(bitType, target);
    return target;
  }

  /**
   * Check if a bit type is and instance of the given root bit type.
   *
   * @param bitType the bit type
   * @param baseBitType the root bit type or types to check
   */
  public isOfBitType(
    bitType: BitTypeType | undefined,
    baseBitType: BitTypeType | BitTypeType[],
  ): boolean {
    if (!bitType) return false;
    if (bitType === baseBitType) return true;
    const bitConfig = this.getBitConfig(bitType);
    if (!bitConfig) return false;

    if (Array.isArray(baseBitType)) {
      for (const bt of baseBitType) {
        if (bitConfig.inheritedBitTypesSet.has(bt)) return true;
      }
      return false;
    }

    return bitConfig.inheritedBitTypesSet.has(baseBitType);
  }

  /**
   * Return true if the bit type is commented.
   *
   * @param bitType bit type in (may be invalid)
   * @returns true if the bit type is commented
   */
  public isBitTypeCommented(bitType: string | undefined): boolean {
    return !!bitType?.startsWith('|');
  }

  /**
   * Get the configuration for a bit.
   *
   * @param bitType
   * @returns the bit configuration
   */
  public getBitConfig(bitType: BitTypeType): BitConfig {
    let bitConfig = this.bitCache.get(bitType);
    if (!bitConfig) {
      const throwNotFoundError = () => {
        throw new Error(`No config found for bit: ${bitType}`);
      };

      // Get the bit configs, following the inheritance tree
      const inheritedBitTypes: BitTypeType[] = [];
      const _bitConfigTree: _BitConfig[] = [];
      let bitTypeCurrent: BitTypeType | undefined = bitType;
      while (bitTypeCurrent) {
        const _bitConfig: _BitConfig = BITS[bitTypeCurrent];
        if (!_bitConfig) throwNotFoundError();

        inheritedBitTypes.push(bitTypeCurrent);
        _bitConfigTree.push(_bitConfig);
        bitTypeCurrent = _bitConfig.baseBitType;
      }

      // Reverse the tree so that the root is first
      _bitConfigTree.reverse();

      // Loop the tree, merging the configs
      const _mergedBitConfig: _BitConfig = _bitConfigTree.reduce((acc, cur) => {
        acc = ObjectUtils.deepMerge(acc, cur);
        return acc;
      }, {} as _BitConfig);

      // Extract the root config
      const {
        since,
        textFormatDefault,
        quizBit,
        tags: _tags,
        cardSet: _cardSet,
        deprecated,
        bodyAllowed,
        bodyRequired,
        footerAllowed,
        footerRequired,
        resourceAttachmentAllowed,
        rootExampleType,
      } = _mergedBitConfig;

      // All bits have the internal comment property, so add it to the tags
      _tags?.push({
        key: ConfigKey.property_internalComment,
        description: 'Internal comment for the bit.',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
        minCount: 0,
      });

      // Hydrate the configuration
      const zeroCountAllResourcesTags = this.getAllResourcesTagsWithZeroCounts();
      const bitTags = ConfigHydrator.hydrateTagsConfig(_tags ?? []);
      const cardSet = ConfigHydrator.hydrateCardSetConfig(_cardSet);

      // Merge the allResourcesTags with the bitTags *in the correct order*
      const comboResourceConfigKey = bitTags.info?.comboResourceConfigKey;
      const tags = {
        ...bitTags.tags,
      };
      for (const [k, v] of Object.entries(zeroCountAllResourcesTags)) {
        if (!tags[k]) tags[k] = v;
      }

      // Create the bit config
      // PLAN-020: title and bitGroups come from the bit's OWN raw config (with D6
      // derivation for deprecated bits), NOT from the merged inheritance chain —
      // memberships are explicit and must not leak from baseBitType.
      bitConfig = new BitConfig({
        since,
        bitType,
        title: BITS[bitType]?.title,
        bitGroups: this.getBitGroupsForBitType(bitType),
        inheritedBitTypes,
        textFormatDefault: textFormatDefault ?? TextFormat.bitmarkText,
        tags,
        cardSet,
        quizBit,
        deprecated,
        bodyAllowed,
        bodyRequired,
        footerAllowed,
        footerRequired,
        resourceAttachmentAllowed,
        rootExampleType,
        comboResourceConfigKey,
      });

      // Add to cache
      this.bitCache.set(bitType, bitConfig);
    }

    return bitConfig;
  }

  /**
   * Look up the tag configuration by tag (rather than by config key).
   *
   * @param bitType
   * @param key the configKey to look up - if undefined, will return undefined
   * @returns
   */
  public getTagConfigForTag(
    tagsConfig: TagsConfig | undefined,
    key: ConfigKeyType | undefined,
  ): TagConfig | undefined {
    if (!tagsConfig) return undefined;

    // // Search the properties in the bit config for the matching tag.
    // for (const [, t] of Object.entries(tagsConfig)) {
    //   if (t.tag === tag) {
    //     return t;
    //   }
    // }

    // return undefined;

    // Now a map lookup since the tag now has the & / @ prefix
    return tagsConfig[key as string];
  }

  /**
   * Look up the tag configuration for a cardSet variant.
   *
   * @param bitType
   * @param sideNo
   * @param variantNo
   * @param tag
   * @param parentTagConfig
   * @returns
   */
  public getTagsConfigForCardSet(
    bitType: BitTypeType,
    sideNo: number,
    variantNo: number,
  ): TagsConfig | undefined {
    const variantConfig = this.getCardSetVariantConfig(bitType, sideNo, variantNo);
    if (!variantConfig) return undefined;

    return variantConfig.tags;
  }

  /**
   * Get the configuration for a particular card side and variant
   * (checking for infinitely repeating variants)
   *
   * @param config all variant configurations
   * @param sideNo side index
   * @param variantNo variant index
   *
   * @returns the config if found, otherwise undefined
   */
  public getCardSetVariantConfig(
    bitType: BitTypeType,
    sideNo: number,
    variantNo: number,
  ): CardVariantConfig | undefined {
    let ret: CardVariantConfig | undefined;

    const bitConfig = this.getBitConfig(bitType);
    if (!bitConfig) return undefined;
    const variants = bitConfig.cardSet?.variants;
    if (!variants) return undefined;

    const sideIdx = Math.min(sideNo, variants.length - 1);
    const variant = variants[sideIdx];

    // Check for variant
    const maxVariantIndex = variant.length - 1;
    if (variantNo > maxVariantIndex) {
      ret = variant[maxVariantIndex];
      // Fix: Always assume infinite repeat count
      // if (ret.repeatCount !== Count.infinity) return undefined;
    } else {
      ret = variant[variantNo];
    }

    return ret;
  }

  /**
   * Get the resource configuration for a bit.
   *
   * The configuration returned potentially depends on the resourceTypeAttachment which can change the allowed
   * count of the resource (or comboResource) it matches.
   *
   * The function is a bit complicated, but it is actually just manipulating the configuration into a format that
   * the rest of the app can use easily.
   *
   * @param bitType
   * @param resourceTypeAttachment the resource type specified in the bit header
   * @returns the definitive resource configuration for the bit
   */
  // TODO - this will need fixing.
  public getBitResourcesConfig(
    bitType: BitTypeType,
    resourceTypeAttachment: ResourceTypeType | undefined,
  ): ResourcesConfig {
    let finalResourceTags: TagsConfig = {};
    const comboResourceConfigKeysMap: Map<ConfigKeyType, ConfigKeyType[]> = new Map();
    const configKeyResourceAttachment = resourceTypeAttachment
      ? resourceTypeToConfigKey(resourceTypeAttachment)
      : undefined;

    const bitConfig = this.getBitConfig(bitType);

    // Filter out the resource tags
    const resourceTags: TagsConfig = {};
    for (const [k, v] of Object.entries(bitConfig.tags)) {
      if (v.type === BitTagConfigKeyType.resource) {
        resourceTags[k] = v;
      }
    }

    // Work out the potential combo resource type, which is either fixed by the bit type, or comes from the bit header
    const comboResourceConfigKey =
      bitConfig.comboResourceConfigKey ??
      (bitConfig.resourceAttachmentAllowed ? configKeyResourceAttachment : undefined);

    if (comboResourceConfigKey) {
      // The comboResourceConfigKey might be a combo resource. Build the comborResourceTagTypesMap
      const comboResourcesMap: Map<ConfigKeyType, TagConfig> = new Map();

      // The resource type attachment might be a combo resource - handle it
      const comboResource = this.getComboResource(comboResourceConfigKey);
      if (comboResource) {
        // Extract the resource types from the combo resource
        const comboResourceTagConfigs = Object.values(comboResource).filter((t) => {
          return t.type === BitTagConfigKeyType.resource;
        });
        const comboResourceTypes = comboResourceTagConfigs.map((t) => t.configKey);

        // Combine into a map for easy lookup
        comboResourceTypes.forEach((type) => {
          const tags = comboResourceTagConfigs.find((t) => t.configKey === type);
          if (tags) comboResourcesMap.set(type, tags);
        });

        // If the resource tag is a combo resource tag, then add it to the comboResourceConfigKeysMap
        const comboResourceConfigKeys = this.getComboResourceConfigKeys(comboResourceConfigKey);
        if (comboResourceConfigKeys && comboResourceConfigKeys.length > 0) {
          comboResourceConfigKeysMap.set(comboResourceConfigKey, comboResourceConfigKeys);
        }
      }

      // If the resource is an attachment...
      // Modify the count for the resource that matched the resource type attachment
      // (create a copy so as not to modify the original configuration)
      if (resourceTypeAttachment) {
        for (const [k, tag] of Object.entries(resourceTags)) {
          // Check if the tag matches the resource type attachment or the comboResource
          const singleTagMatch = comboResourceConfigKey === tag.configKey;
          const comboTagMatch = comboResourcesMap
            ? comboResourcesMap.has(tag.configKey as ResourceKeyType)
            : false;

          if (singleTagMatch) {
            // Single tag match for a resource specified in the bit header
            const newTag = new ResourceTagConfig({
              configKey: tag.configKey,
              tag: tag.tag,
              minCount: 1,
              maxCount: 1,
              chain: tag.chain,
              jsonKey: tag.jsonKey,
              exportJsonKey: tag.exportJsonKey,
              hasExportJsonKey: tag.hasExportJsonKey,
              htmlKey: tag.htmlKey,
              hasHtmlKey: tag.hasHtmlKey,
              deprecated: tag.deprecated,
            });
            finalResourceTags[k] = newTag;
          } else if (comboTagMatch) {
            // Combo resource tag match for a resource specified in the bit header
            if (comboResourcesMap) {
              const newTag = comboResourcesMap.get(tag.configKey as ResourceKeyType);
              if (newTag) finalResourceTags[k] = newTag;
            }
          } else {
            finalResourceTags[k] = tag;
          }
        }
      } else {
        // Combo resource, but not a resource type attachement
        finalResourceTags = resourceTags;
      }
    } else {
      // No combo resource and no resource type attachment
      finalResourceTags = resourceTags;
    }

    const resourcesConfig = new ResourcesConfig(
      finalResourceTags,
      bitConfig.resourceAttachmentAllowed,
      configKeyResourceAttachment,
      comboResourceConfigKeysMap,
    );

    return resourcesConfig;
  }

  /**
   * Get the resourceType tags for a combo resource.
   *
   * @param configKeyResourceAttachment
   * @returns resourceTypes for the combo resource (or undefined if not a combo resource)
   */
  private getComboResourceConfigKeys(
    configKeyResourceAttachment: ConfigKeyType | undefined,
  ): ConfigKeyType[] | undefined {
    const comboResource = this.getComboResource(configKeyResourceAttachment);
    if (comboResource) {
      const comboResourceTypes = Object.values(comboResource)
        .filter((t) => {
          return t.type === BitTagConfigKeyType.resource;
        })
        .map((t) => t.configKey);

      return comboResourceTypes;
    }
    return undefined;
  }

  /**
   * Get the tags for a combo resource.
   *
   * Combo resources are resources that contain more than one resource, such as still-image-film.
   * These resources require special handling in the code and therefore also special configuration.
   *
   * @returns TagsConfig for the combo resource or undefined if not found
   */
  private getComboResource(resourceConfigKey: ConfigKeyType | undefined): TagsConfig | undefined {
    if (!resourceConfigKey) return undefined;

    let comboResourcesTags = this.comboResourcesCache.get(resourceConfigKey);
    if (!comboResourcesTags) {
      // Filter for all the resource groups and hydrate the tags
      comboResourcesTags = {};
      Object.values(GROUPS)
        .filter(
          (g) =>
            g.type === GroupConfigType.comboResource &&
            g.comboResourceConfigKey === resourceConfigKey,
        )
        .forEach((g) => {
          comboResourcesTags = {
            ...comboResourcesTags,
            ...ConfigHydrator.hydrateTagsConfig(g.tags).tags,
          };
        });

      // Add to cache
      if (Object.keys(comboResourcesTags).length === 0) comboResourcesTags = undefined;
      this.comboResourcesCache.set(resourceConfigKey, comboResourcesTags);
    }

    return comboResourcesTags;
  }

  /**
   * Get the tags for all resources with 0 max/min counts.
   *
   * This is required so that any bit can parse all resources correctly. It is necessary to parse all resources
   * for any bit because of the requirement to add excess resources to the 'parser' output.
   *
   * NOTE: These are not used for validation, only for parsing. They will be overridden for individual bits for
   * validation.
   *
   * @returns TagsConfig for all resources
   */
  private getAllResourcesTagsWithZeroCounts(): TagsConfig {
    let allResourcesTags = this.allResourcesCache;
    if (!allResourcesTags) {
      // Filter for all the resource groups and hydrate the tags
      allResourcesTags = {};
      Object.values(GROUPS)
        .filter((g) => g.type === GroupConfigType.resource)
        .forEach((g) => {
          allResourcesTags = {
            ...allResourcesTags,
            ...ConfigHydrator.hydrateTagsConfig(g.tags).tags,
          };
        });

      // Ensure the minimum and maximum counts are all set to 0
      // We only use this config to understand how to parse, not to validate
      for (const tag of Object.values(allResourcesTags)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tagAny = tag as any;
        tagAny.maxCount = 0;
        tagAny.minCount = 0;
      }

      // Add to cache
      this.allResourcesCache = allResourcesTags;
    }

    return allResourcesTags;
  }
}

const instance = new Config();

export { instance as Config };
