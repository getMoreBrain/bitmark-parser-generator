import { BitConfig } from '../model/config/BitConfig';
import { ResourceTagConfig } from '../model/config/ResourceTagConfig';
import { ResourcesConfig } from '../model/config/ResourcesConfig';
import { TagConfig } from '../model/config/TagConfig';
import { TagsConfig } from '../model/config/TagsConfig';
import { _BitConfig, _PropertiesConfig } from '../model/config/_Config';
import { GroupConfigType } from '../model/config/enum/GroupConfigType';
import { BitTagType } from '../model/enum/BitTagType';
import { BitType, BitTypeType } from '../model/enum/BitType';
import { ResourceJsonKeyType } from '../model/enum/ResourceJsonKey';
import { ResourceTagType } from '../model/enum/ResourceTag';
import { TextFormat } from '../model/enum/TextFormat';
import { ObjectUtils } from '../utils/ObjectUtils';

import { ConfigHydrator } from './ConfigHydrator';
import { BITS } from './raw/bits';
import { GROUPS } from './raw/groups';
import { PROPERTIES } from './raw/properties';

export interface ComboResources {
  [configKey: string]: TagsConfig;
}

class Config {
  private bitCache: Map<BitTypeType, BitConfig> = new Map();
  private allResourcesCache: TagsConfig | undefined;
  private comboResourcesCache: Map<ResourceTagType, TagsConfig | undefined> = new Map();

  constructor() {
    //
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
    let validBitType = BitType.fromValue(bitType) ?? BitType._error;

    if (validBitType === BitType._error && bitType?.startsWith('|')) {
      validBitType = BitType._comment;
    }

    return validBitType;
  }

  /**
   * Check if a bit type is and instance of the given root bit type.
   *
   * @param bitType the bit type
   * @param baseBitType the root bit type or types to check
   */
  public isOfBitType(bitType: BitTypeType | undefined, baseBitType: BitTypeType | BitTypeType[]): boolean {
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

      // Hydratre the configuration
      const zeroCountAllResourcesTags = this.getAllResourcesTagsWithZeroCounts();
      const bitTags = ConfigHydrator.hydrateTagsConfig(_tags ?? []);
      const cardSet = ConfigHydrator.hydrateCardSetConfig(_cardSet);

      // Merge the allResourcesTags with the bitTags *in the correct order*
      const comboResourceTagType = bitTags.info?.comboResourceType;
      const tags = {
        ...bitTags.tags,
      };
      for (const [k, v] of Object.entries(zeroCountAllResourcesTags)) {
        if (!tags[k]) tags[k] = v;
      }

      // Create the bit config
      bitConfig = new BitConfig(
        since,
        bitType,
        inheritedBitTypes,
        textFormatDefault ?? TextFormat.bitmarkMinusMinus,
        tags,
        cardSet,
        deprecated,
        bodyAllowed,
        bodyRequired,
        footerAllowed,
        footerRequired,
        resourceAttachmentAllowed,
        rootExampleType,
        comboResourceTagType,
      );

      // Add to cache
      this.bitCache.set(bitType, bitConfig);
    }

    return bitConfig;
  }

  public getRawPropertiesConfig(): _PropertiesConfig {
    return PROPERTIES;
  }

  /**
   * Look up the tag configuration by tag (rather than by config key).
   *
   * @param bitType
   * @param tag
   * @param parentTagConfig
   * @returns
   */
  public getTagConfigForTag(tagsConfig: TagsConfig | undefined, tag: string): TagConfig | undefined {
    if (!tagsConfig) return undefined;

    // Search the properties in the bit config for the matching tag.
    for (const [, t] of Object.entries(tagsConfig)) {
      if (t.tag === tag) {
        return t;
      }
    }

    return undefined;
  }

  /**
   * Look up the tag configuration for a cardSet.
   *
   * @param bitType
   * @param sideNo
   * @param variantNo
   * @param tag
   * @param parentTagConfig
   * @returns
   */
  public getTagsConfigForCardSet(bitType: BitTypeType, sideNo: number, variantNo: number): TagsConfig | undefined {
    const bitConfig = this.getBitConfig(bitType);
    if (!bitConfig) return undefined;

    const cardSet = bitConfig.cardSet;
    if (!cardSet) return undefined;

    sideNo = Math.min(sideNo, cardSet.variants.length - 1);
    const variants = cardSet.variants[sideNo];
    variantNo = Math.min(variantNo, variants.length - 1);
    const variant = variants[variantNo];

    return variant.tags;
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
  public getBitResourcesConfig(
    bitType: BitTypeType,
    resourceTypeAttachment: ResourceTagType | undefined,
  ): ResourcesConfig {
    let finalResourceTags: TagsConfig = {};
    const comboResourceTagTypesMap: Map<ResourceTagType, ResourceTagType[]> = new Map();

    const bitConfig = this.getBitConfig(bitType);

    // Filter out the resource tags
    const resourceTags: TagsConfig = {};
    for (const [k, v] of Object.entries(bitConfig.tags)) {
      if (v.type === BitTagType.resource) {
        resourceTags[k] = v;
      }
    }

    // Work out the potential combo resource type, which is either fixed by the bit type, or comes from the bit header
    const comboResourceType =
      bitConfig.comboResourceType ?? (bitConfig.resourceAttachmentAllowed && resourceTypeAttachment);

    if (comboResourceType) {
      // The comboResourceType might be a combo resource. Build the comborResourceTagTypesMap
      const comboResourcesMap: Map<ResourceTagType, TagConfig> = new Map();

      // The resource type attachment might be a combo resource - handle it
      const comboResource = this.getComboResource(comboResourceType);
      if (comboResource) {
        // Extract the resource types from the combo resource
        const comboResourceTagConfigs = Object.values(comboResource).filter((t) => {
          return t.type === BitTagType.resource;
        });
        const comboResourceTypes = comboResourceTagConfigs.map((t) => t.tag as ResourceTagType);

        // Combine into a map for easy lookup
        comboResourceTypes.forEach((type) => {
          const tags = comboResourceTagConfigs.find((t) => t.tag === type);
          if (tags) comboResourcesMap.set(type, tags);
        });

        // If the resource tag is a combo resource tag, then add it to the comboResourceTagTypesMap
        const resourceTagTypes = this.getComboResourceTagTypes(comboResourceType);
        if (resourceTagTypes && resourceTagTypes.length > 0) {
          comboResourceTagTypesMap.set(comboResourceType, resourceTagTypes);
        }
      }

      // If the resource is an attachment...
      // Modify the count for the resource that matched the resource type attachment
      // (create a copy so as not to modify the original configuration)
      if (resourceTypeAttachment) {
        for (const [k, tag] of Object.entries(resourceTags)) {
          // Check if the tag matches the resource type attachment or the comboResource
          const singleTagMatch = comboResourceType === tag.tag;
          const comboTagMatch = comboResourcesMap ? comboResourcesMap.has(tag.tag as ResourceTagType) : false;

          if (singleTagMatch) {
            // Single tag match for a resource specified in the bit header
            const newTag = new ResourceTagConfig(
              tag.configKey,
              tag.tag as ResourceTagType,
              1,
              1,
              tag.chain,
              tag.jsonKey as ResourceJsonKeyType,
              tag.deprecated,
            );
            finalResourceTags[k] = newTag;
          } else if (comboTagMatch) {
            // Combo resource tag match for a resource specified in the bit header
            if (comboResourcesMap) {
              const newTag = comboResourcesMap.get(tag.tag as ResourceTagType);
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
      resourceTypeAttachment,
      comboResourceTagTypesMap,
    );

    return resourcesConfig;
  }

  /**
   * Get the resourceType tags for a combo resource.
   *
   * @param resourceTypeAttachment
   * @returns resourceTypes for the combo resource (or undefined if not a combo resource)
   */
  private getComboResourceTagTypes(resourceTypeAttachment: ResourceTagType | undefined): ResourceTagType[] | undefined {
    const comboResource = this.getComboResource(resourceTypeAttachment);
    if (comboResource) {
      const comboResourceTypes = Object.values(comboResource)
        .filter((t) => {
          return t.type === BitTagType.resource;
        })
        .map((t) => t.tag as ResourceTagType);

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
  private getComboResource(resourceType: ResourceTagType | undefined): TagsConfig | undefined {
    if (!resourceType) return undefined;

    let comboResourcesTags = this.comboResourcesCache.get(resourceType);
    if (!comboResourcesTags) {
      // Filter for all the resource groups and hydrate the tags
      comboResourcesTags = {};
      Object.values(GROUPS)
        .filter((g) => g.type === GroupConfigType.comboResource && g.comboResourceType === resourceType)
        .forEach((g) => {
          comboResourcesTags = {
            ...comboResourcesTags,
            ...ConfigHydrator.hydrateTagsConfig(g.tags).tags,
          };
        });

      // Add to cache
      if (Object.keys(comboResourcesTags).length === 0) comboResourcesTags = undefined;
      this.comboResourcesCache.set(resourceType, comboResourcesTags);
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
