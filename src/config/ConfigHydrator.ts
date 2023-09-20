import { CardSetConfig } from '../model/config/CardSetConfig';
import { CardVariantConfig } from '../model/config/CardVariantConfig';
import { MarkupTagConfig } from '../model/config/MarkupTagConfig';
import { PropertyTagConfig } from '../model/config/PropertyTagConfig';
import { ResourceTagConfig } from '../model/config/ResourceTagConfig';
import { TagsConfigWithInfo } from '../model/config/TagsConfigWithInfo';
import { TagsConfig } from '../model/config/TagsConfig';
import { _TagInfoConfig, _CardVariantConfig } from '../model/config/_Config';
import { CardSetConfigKeyType } from '../model/config/enum/CardSetConfigKey';
import { GroupConfigKey } from '../model/config/enum/GroupConfigKey';
import { PropertyConfigKey } from '../model/config/enum/PropertyConfigKey';
import { ResourceConfigKey } from '../model/config/enum/ResourceConfigKey';
import { TagConfigKey } from '../model/config/enum/TagConfigKey';
import { BitTagType } from '../model/enum/BitTagType';

import { CARDS } from './raw/cardSets';
import { GROUPS } from './raw/groups';
import { PROPERTIES } from './raw/properties';
import { RESOURCES } from './raw/resources';
import { TAGS } from './raw/tags';

const MAX_COUNT_DEFAULT = 1;
const MIN_COUNT_DEFAULT = 0;

class ConfigHydrator {
  public hydrateTagsConfig(_tags: _TagInfoConfig[]): TagsConfigWithInfo {
    const tagsWithInfo: TagsConfigWithInfo = {
      tags: {},
    };

    for (const t of _tags) {
      let expandedTags: TagsConfigWithInfo | undefined;
      switch (t.type) {
        case BitTagType.tag:
          expandedTags = this.hydrateTagConfig(t);
          break;

        case BitTagType.property:
          expandedTags = this.hydratePropertyTagConfig(t);
          break;

        case BitTagType.resource:
          expandedTags = this.hydrateResourceTagConfig(t);
          break;

        case BitTagType.group:
          expandedTags = this.hydrateTagGroupConfig(t);
          break;

        default:
        // Ignore
      }

      if (expandedTags) {
        tagsWithInfo.tags = {
          ...tagsWithInfo.tags,
          ...expandedTags.tags,
        };

        tagsWithInfo.info = Object.assign(tagsWithInfo.info ?? {}, expandedTags.info);
      }
    }

    return tagsWithInfo;
  }

  public hydrateCardSetConfig(_cardSet: CardSetConfigKeyType | undefined): CardSetConfig | undefined {
    if (!_cardSet) return undefined;
    const _cardSetConfig = CARDS[_cardSet];
    if (!_cardSetConfig) throw new Error(`No config found for card set config key '${_cardSet}'`);

    const variants: CardVariantConfig[][] = [];

    for (const _variants of _cardSetConfig.variants) {
      const variantsOfSide = [];
      for (const _variant of _variants) {
        const v = this.hydrateCardVariantConfig(_variant);
        variantsOfSide.push(v);
      }
      variants.push(variantsOfSide);
    }

    const cardSetConfig = new CardSetConfig(_cardSet, variants);

    return cardSetConfig;
  }

  private hydrateTagConfig(_tag: _TagInfoConfig): TagsConfigWithInfo {
    const { configKey: _configKey, maxCount, minCount, chain: _chain } = _tag;
    const configKey = TagConfigKey.fromKey(_configKey) || TagConfigKey._unknown;
    const _tagConfig = TAGS[configKey];
    if (!_tagConfig) throw new Error(`No config found for tag config key '${_configKey}'`);
    const { tag, deprecated } = _tagConfig;

    let chain: TagsConfig | undefined;

    if (_chain) {
      chain = this.hydrateTagsConfig(_chain).tags;
    }

    const hydratedTag = new MarkupTagConfig(
      configKey,
      tag,
      maxCount ?? MAX_COUNT_DEFAULT,
      minCount ?? MIN_COUNT_DEFAULT,
      chain,
      deprecated,
    );

    return {
      tags: {
        [configKey]: hydratedTag,
      },
    };
  }

  private hydratePropertyTagConfig(_tag: _TagInfoConfig): TagsConfigWithInfo {
    const { configKey: _configKey, maxCount, minCount, chain: _chain } = _tag;
    const configKey = PropertyConfigKey.fromKey(_configKey) || PropertyConfigKey._unknown;
    const _propertyConfig = PROPERTIES[configKey];
    if (!_propertyConfig) throw new Error(`No config found for property config key '${_configKey}'`);
    const { tag, deprecated, single, format, defaultValue, jsonKey, astKey } = _propertyConfig;

    let chain: TagsConfig | undefined;

    if (_chain) {
      chain = this.hydrateTagsConfig(_chain).tags;
    }

    const hydratedTag = new PropertyTagConfig(
      configKey,
      tag,
      maxCount ?? MAX_COUNT_DEFAULT,
      minCount ?? MIN_COUNT_DEFAULT,
      chain,
      jsonKey,
      astKey,
      single,
      format,
      defaultValue,
      deprecated,
    );

    return {
      tags: {
        [configKey]: hydratedTag,
      },
    };
  }

  private hydrateResourceTagConfig(_tag: _TagInfoConfig): TagsConfigWithInfo {
    const { configKey: _configKey, maxCount, minCount, chain: _chain } = _tag;
    const configKey = ResourceConfigKey.fromKey(_configKey) || ResourceConfigKey._unknown;
    const _resourceConfig = RESOURCES[configKey];
    if (!_resourceConfig) throw new Error(`No config found for resource config key '${_configKey}'`);
    const { tag, deprecated, jsonKey } = _resourceConfig;

    let chain: TagsConfig | undefined;

    if (_chain) {
      chain = this.hydrateTagsConfig(_chain).tags;
    }

    const hydratedTag = new ResourceTagConfig(
      configKey,
      tag,
      maxCount ?? MAX_COUNT_DEFAULT,
      minCount ?? MIN_COUNT_DEFAULT,
      chain,
      jsonKey,
      deprecated,
    );

    return {
      tags: {
        [configKey]: hydratedTag,
      },
    };
  }

  private hydrateTagGroupConfig(_tag: _TagInfoConfig): TagsConfigWithInfo {
    const { configKey: _configKey } = _tag;
    const configKey = GroupConfigKey.fromKey(_configKey) || GroupConfigKey._unknown;
    const _groupConfig = GROUPS[configKey];
    if (!_groupConfig) throw new Error(`No config found for tag config key '${_configKey}'`);
    const { tags: _tags } = _groupConfig;

    const tags = this.hydrateTagsConfig(_tags).tags;

    // Apply the groups min/max to the first tag in the group (overriding the default value)
    const tagValues = Object.values(tags);
    if (tagValues.length > 0) {
      const firstTag = tagValues[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firstTagAny = firstTag as any;
      firstTagAny.maxCount = _tag.maxCount ?? firstTag.maxCount;
      firstTagAny.minCount = _tag.minCount ?? firstTag.minCount;
    }

    return {
      tags,
      info: {
        comboResourceType: _groupConfig.comboResourceType,
      },
    };
  }

  private hydrateCardVariantConfig(_variant: _CardVariantConfig): CardVariantConfig {
    const { tags: _tags, bodyAllowed, bodyRequired, repeatCount } = _variant;

    const tags = this.hydrateTagsConfig(_tags);

    const cardSetConfig = new CardVariantConfig(tags.tags, bodyAllowed, bodyRequired, repeatCount);

    return cardSetConfig;
  }
}

const instance = new ConfigHydrator();

export { instance as ConfigHydrator };
