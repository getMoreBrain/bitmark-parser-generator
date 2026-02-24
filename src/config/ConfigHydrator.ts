import { Enum } from '@ncoderz/superenum';

import { type _AbstractTagConfig, type _CardVariantConfig } from '../model/config/_Config.ts';
import { CardSetConfig } from '../model/config/CardSetConfig.ts';
import { CardSideConfig } from '../model/config/CardSideConfig.ts';
import { CardTypeConfig } from '../model/config/CardTypeConfig.ts';
import { CardVariantConfig } from '../model/config/CardVariantConfig.ts';
import { type CardSetConfigKeyType } from '../model/config/enum/CardSetConfigKey.ts';
import { ConfigKey, typeFromConfigKey } from '../model/config/enum/ConfigKey.ts';
import { MarkupTagConfig } from '../model/config/MarkupTagConfig.ts';
import { PropertyTagConfig } from '../model/config/PropertyTagConfig.ts';
import { ResourceTagConfig } from '../model/config/ResourceTagConfig.ts';
import { type TagsConfig } from '../model/config/TagsConfig.ts';
import { type TagsConfigWithInfo } from '../model/config/TagsConfigWithInfo.ts';
import { BitTagConfigKeyType } from '../model/enum/BitTagConfigKeyType.ts';
import { Tag } from '../model/enum/Tag.ts';
import { CARDS } from './raw/cardSets.ts';
import { GROUPS } from './raw/groups.ts';

const MAX_COUNT_DEFAULT = 1;
const MIN_COUNT_DEFAULT = 0;

class ConfigHydrator {
  public hydrateTagsConfig(_tags: _AbstractTagConfig[]): TagsConfigWithInfo {
    const tagsWithInfo: TagsConfigWithInfo = {
      tags: {},
    };

    for (const t of _tags) {
      let expandedTags: TagsConfigWithInfo | undefined;
      const type = typeFromConfigKey(t.key);

      switch (type) {
        case BitTagConfigKeyType.tag:
          expandedTags = this.hydrateTagConfig(t);
          break;

        case BitTagConfigKeyType.property:
          expandedTags = this.hydratePropertyTagConfig(t);
          break;

        case BitTagConfigKeyType.resource:
          expandedTags = this.hydrateResourceTagConfig(t);
          break;

        case BitTagConfigKeyType.group:
          expandedTags = this.hydrateTagGroupConfig(t);
          break;

        default:
          throw new Error(`Unknown tag type for config key '${t.key}'`);
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

  public hydrateCardSetConfig(
    _cardSet: CardSetConfigKeyType | undefined,
  ): CardSetConfig | undefined {
    if (!_cardSet) return undefined;
    const _cardSetConfig = CARDS[_cardSet];
    if (!_cardSetConfig) throw new Error(`No config found for card set config key '${_cardSet}'`);

    const cardTypes: CardTypeConfig[] = [];

    for (const _cardType of _cardSetConfig.cards) {
      const sides: CardSideConfig[] = [];

      for (const _side of _cardType.sides) {
        const variantsOfSide: CardVariantConfig[] = [];
        for (const _variant of _side.variants) {
          const v = this.hydrateCardVariantConfig(_variant);
          variantsOfSide.push(v);
        }
        const sideConfig = new CardSideConfig(_side.name, _side.repeat ?? false, variantsOfSide);
        sides.push(sideConfig);
      }

      const cardTypeConfig = new CardTypeConfig(
        _cardType.name,
        _cardType.isDefault ?? false,
        _cardType.jsonKey,
        _cardType.itemType ?? 'object',
        sides,
      );
      cardTypes.push(cardTypeConfig);
    }

    const cardSetConfig = new CardSetConfig(_cardSet, cardTypes);

    return cardSetConfig;
  }

  private hydrateTagConfig(_tag: _AbstractTagConfig): TagsConfigWithInfo {
    const {
      key: _configKey,
      maxCount,
      minCount,
      chain: _chain,
      secondaryJsonKey,
      deprecated,
    } = _tag;
    const configKey = Enum(ConfigKey).fromValue(_configKey) || ConfigKey._unknown;
    if (!configKey) throw new Error(`No tag key found for config key '${configKey}'`);
    const tag = Enum(Tag).fromValue(configKey);
    if (!tag) throw new Error(`No tag found for tag config key '${configKey}'`);

    let chain: TagsConfig | undefined;

    if (_chain) {
      chain = this.hydrateTagsConfig(_chain).tags;
    }

    const hydratedTag = new MarkupTagConfig({
      configKey,
      tag,
      maxCount: maxCount ?? MAX_COUNT_DEFAULT,
      minCount: minCount ?? MIN_COUNT_DEFAULT,
      chain,
      secondaryJsonKey,
      deprecated,
    });

    return {
      tags: {
        [configKey]: hydratedTag,
      },
    };
  }

  private hydratePropertyTagConfig(_tag: _AbstractTagConfig): TagsConfigWithInfo {
    const {
      key: _configKey,
      maxCount,
      minCount,
      chain: _chain,
      deprecated,
      format,
      values,
      defaultValue,
      jsonKey,
      secondaryJsonKey,
    } = _tag;
    const configKey = Enum(ConfigKey).fromValue(_configKey) || ConfigKey._unknown;
    if (!configKey) throw new Error(`No property key found for config key '${configKey}'`);
    const tag = _configKey.substring(1); // Remove the '@' prefix from the config key

    let chain: TagsConfig | undefined;

    if (_chain) {
      chain = this.hydrateTagsConfig(_chain).tags;
    }

    const hydratedTag = new PropertyTagConfig({
      configKey,
      tag,
      maxCount: maxCount ?? MAX_COUNT_DEFAULT,
      minCount: minCount ?? MIN_COUNT_DEFAULT,
      chain,
      jsonKey,
      secondaryJsonKey,
      format,
      values,
      defaultValue,
      deprecated,
    });

    return {
      tags: {
        [configKey]: hydratedTag,
      },
    };
  }

  private hydrateResourceTagConfig(_tag: _AbstractTagConfig): TagsConfigWithInfo {
    const {
      key: _configKey,
      maxCount,
      minCount,
      chain: _chain,
      deprecated,
      jsonKey,
      secondaryJsonKey,
    } = _tag;
    const configKey = Enum(ConfigKey).fromValue(_configKey) || ConfigKey._unknown;
    if (!configKey) throw new Error(`No resource key found for config key '${configKey}'`);
    const tag = _configKey.substring(1); // Remove the '&' prefix from the config key

    let chain: TagsConfig | undefined;

    if (_chain) {
      chain = this.hydrateTagsConfig(_chain).tags;
    }

    const hydratedTag = new ResourceTagConfig({
      configKey,
      tag,
      maxCount: maxCount ?? MAX_COUNT_DEFAULT,
      minCount: minCount ?? MIN_COUNT_DEFAULT,
      chain,
      jsonKey,
      secondaryJsonKey,
      deprecated,
    });

    return {
      tags: {
        [configKey]: hydratedTag,
      },
    };
  }

  private hydrateTagGroupConfig(_tag: _AbstractTagConfig): TagsConfigWithInfo {
    const { key: _configKey } = _tag;
    const configKey = Enum(ConfigKey).fromValue(_configKey) || ConfigKey._unknown;
    if (!configKey) throw new Error(`No group key found for config key '${configKey}'`);
    const _groupConfig = GROUPS[configKey];
    if (!_groupConfig) throw new Error(`No config found for group config key '${_configKey}'`);
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
        comboResourceConfigKey: _groupConfig.comboResourceConfigKey,
      },
    };
  }

  private hydrateCardVariantConfig(_variant: _CardVariantConfig): CardVariantConfig {
    const { tags: _tags, bodyAllowed, bodyRequired, repeatCount, jsonKey } = _variant;

    const tags = this.hydrateTagsConfig(_tags);

    const cardSetConfig = new CardVariantConfig(
      tags.tags,
      bodyAllowed,
      bodyRequired,
      repeatCount,
      jsonKey,
    );

    return cardSetConfig;
  }
}

const instance = new ConfigHydrator();

export { instance as ConfigHydrator };
