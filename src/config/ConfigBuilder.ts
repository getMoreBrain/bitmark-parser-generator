import { TagData } from '../model/config/TagData';
import { BitTagType, BitTagTypeType } from '../model/enum/BitTagType';
import { RootBitType, RootBitTypeMetadata } from '../model/enum/BitType';
import { PropertyFormat } from '../model/enum/PropertyFormat';
import { PropertyKey, PropertyKeyMetadata } from '../model/enum/PropertyKey';
import { ResourceType } from '../model/enum/ResourceType';

import {
  ChainConfig,
  ChainsConfig,
  NewConfig,
  PropertiesConfig,
  PropertyConfig,
  ResourceConfig,
  GroupsConfig,
  TagInfoConfig,
  GroupConfig,
  TagsConfig,
} from '../model/config/NewConfig';

import {
  TAGS_AUDIO_CHAIN,
  TAGS_DEFAULT_RESOURCE_CHAIN,
  TAGS_IMAGE_CHAIN,
  TAGS_VIDEO_CHAIN,
} from './bits/generic/resourceChainBitConfigs';

class ConfigBuilder {
  build(): NewConfig {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: Partial<NewConfig> = {};

    // const bits: { [key: string]: any } = {};
    // for (const bit of RootBitType.values()) {
    //   const meta = RootBitType.getMetadata<RootBitTypeMetadata>(bit);
    //   bits[bit] = meta;
    // }
    // config.bits = bits;

    // const properties: PropertiesConfig = {};
    // for (const p of PropertyKey.values()) {
    //   const meta = PropertyKey.getMetadata<PropertyKeyMetadata>(p);
    //   if (!meta) continue;

    //   const propertyConfig: PropertyConfig = {
    //     tag: p,
    //   };

    //   if (meta.isSingle) propertyConfig.single = true;
    //   if (meta.isTrimmedString) propertyConfig.format = PropertyFormat.trimmedString;
    //   else if (meta.isNumber) propertyConfig.format = PropertyFormat.number;
    //   else if (meta.isBoolean) propertyConfig.format = PropertyFormat.boolean;
    //   else if (meta.isInvertedBoolean) propertyConfig.format = PropertyFormat.invertedBoolean;
    //   else propertyConfig.format = PropertyFormat.string;

    //   if (meta.ignoreTrue) {
    //     propertyConfig.defaultValue = 'true';
    //   } else if (meta.ignoreFalse) {
    //     propertyConfig.defaultValue = 'false';
    //   }
    //   if (meta.astKey) propertyConfig.astKey = meta.astKey;
    //   if (meta.jsonKey) propertyConfig.jsonKey = meta.jsonKey;

    //   properties[p] = propertyConfig;
    // }
    // config.properties = properties;

    const processTags = (k: string, v: TagData) => {
      let type: BitTagTypeType = BitTagType.tag;
      if (v.isProperty) type = BitTagType.property;
      if (v.isResource) type = BitTagType.resource;

      const tagInfo: TagInfoConfig = {
        type,
        id: k,
        maxCount: v.maxCount,
        minCount: v.minCount,
      };

      return tagInfo;
    };

    const tagGroups: GroupsConfig = {};

    // TAGS_DEFAULT_RESOURCE_CHAIN
    const defaultResource: GroupConfig = {
      tags: [],
    };
    for (const [k, v] of Object.entries(TAGS_DEFAULT_RESOURCE_CHAIN)) {
      const tagInfo = processTags(k, v);
      defaultResource.tags.push(tagInfo);
    }
    tagGroups.resource_default = defaultResource;

    // TAGS_IMAGE_CHAIN
    const imageResource: GroupConfig = {
      tags: [],
    };
    let i = -1;
    for (const [k, v] of Object.entries(TAGS_IMAGE_CHAIN)) {
      i++;
      if (i < 4 - 1) continue;
      if (i < 4) {
        imageResource.tags.push({
          type: BitTagType.group,
          id: 'resource_default',
        });
        continue;
      }
      const tagInfo = processTags(k, v);
      imageResource.tags.push(tagInfo);
      i++;
    }
    tagGroups.resource_image = imageResource;

    // TAGS_AUDIO_CHAIN
    const audioResource: GroupConfig = {
      tags: [],
    };
    i = -1;
    for (const [k, v] of Object.entries(TAGS_AUDIO_CHAIN)) {
      i++;
      if (i < 4 - 1) continue;
      if (i < 4) {
        audioResource.tags.push({
          type: BitTagType.group,
          id: 'resource_default',
        });
        continue;
      }
      const tagInfo = processTags(k, v);
      audioResource.tags.push(tagInfo);
      i++;
    }
    tagGroups.resource_audio = audioResource;

    // TAGS_VIDEO_CHAIN
    const videoResource: GroupConfig = {
      tags: [],
    };
    i = -1;
    for (const [k, v] of Object.entries(TAGS_VIDEO_CHAIN)) {
      i++;
      if (i < 4 - 1) continue;
      if (i < 4) {
        videoResource.tags.push({
          type: BitTagType.group,
          id: 'resource_default',
        });
        continue;
      }
      const tagInfo = processTags(k, v);
      videoResource.tags.push(tagInfo);
      i++;
    }
    tagGroups.resource_video = videoResource;

    config.groups = tagGroups;

    // const chains: ChainsConfig = {};
    // for (const c of ResourceType.values()) {
    //   const chainConfig: ChainConfig = {
    //     tags: [],
    //   };

    //   const imageSource = TAGS_CHAIN_IMAGE_SOURCE
    //   const chainImageSource:  =

    //   chainConfig.tags.push({});

    //   chains[c] = chainConfig;
    // }
    // config.chains = chains;

    return config as NewConfig;
  }
}

export { ConfigBuilder };
