import { Config } from '../../../../config/Config';
import { PropertyTagConfig } from '../../../../model/config/PropertyTagConfig';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { PropertyConfigKey } from '../../../../model/config/enum/PropertyConfigKey';
import { BitType } from '../../../../model/enum/BitType';
import { PropertyFormat } from '../../../../model/enum/PropertyFormat';
import { PropertyTag } from '../../../../model/enum/PropertyTag';
import { BooleanUtils } from '../../../../utils/BooleanUtils';
import { NumberUtils } from '../../../../utils/NumberUtils';
import { StringUtils } from '../../../../utils/StringUtils';

import { bookChainContentProcessor } from './BookChainContentProcessor';
import { commentTagContentProcessor } from './CommentTagContentProcessor';
import { exampleTagContentProcessor } from './ExampleTagContentProcessor';
import { imageSourceChainContentProcessor } from './ImageSourceChainContentProcessor';
import { markConfigChainContentProcessor } from './MarkConfigChainContentProcessor';
import { partnerChainContentProcessor } from './PartnerChainContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

function propertyContentProcessor(
  context: BitmarkPegParserContext,
  bitType: BitType,
  bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { key: tag, value } = content as TypeKeyValue;
  const isChain = bitLevel === BitContentLevel.Chain;

  // Get the property config for the tag (if it exists)
  const propertyConfig = Config.getTagConfigForTag(tagsConfig, tag);
  const configKey = propertyConfig ? propertyConfig.configKey : undefined;

  // Handle internal comments
  if (tag === PropertyTag.internalComment) {
    commentTagContentProcessor(context, bitType, bitLevel, content, target);
    return;
  }

  // Check for chains
  // Generally, the chain will only be present in the correct bit as the data was already validated. The bit type
  // should also be checked here if the property may occur in another bit with a different meaning.
  if (propertyConfig) {
    if (configKey === PropertyConfigKey.example) {
      exampleTagContentProcessor(context, bitType, bitLevel, content, target);
      return;
    } else if (configKey === PropertyConfigKey.partner) {
      partnerChainContentProcessor(context, bitType, bitLevel, propertyConfig.chain, content, target);
      return;
    } else if (configKey === PropertyConfigKey.imageSource) {
      imageSourceChainContentProcessor(context, bitType, bitLevel, tagsConfig, content, target);
      return;
    } else if (configKey === PropertyConfigKey.book) {
      bookChainContentProcessor(context, bitType, bitLevel, propertyConfig.chain, content, target);
      return;
    } else if (configKey === PropertyConfigKey.markConfig && !isChain) {
      markConfigChainContentProcessor(context, bitType, bitLevel, tagsConfig, content, target);
      return;
    }
  }

  // Helper for building the properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addProperty = (obj: any, tag: string, v: unknown, c: PropertyTagConfig | undefined) => {
    // if (key === 'progress') debugger;

    // Convert property as needed
    const processValue = (v: unknown) => {
      if (v == null) return undefined;
      if (c) {
        switch (c.format) {
          case PropertyFormat.string:
            return StringUtils.isString(v) ? StringUtils.string(v) : undefined;

          case PropertyFormat.trimmedString:
            return StringUtils.isString(v) ? StringUtils.trimmedString(v) : undefined;

          case PropertyFormat.number:
            return NumberUtils.asNumber(v);

          case PropertyFormat.boolean:
            return BooleanUtils.toBoolean(v, true);

          case PropertyFormat.invertedBoolean:
            return !BooleanUtils.toBoolean(v, true);
        }
      }
      return v;
    };

    // Convert property and key as needed
    v = processValue(v);
    if (c?.astKey) tag = c.astKey;

    if (c?.single) {
      obj[tag] = v;
    } else {
      if (Object.prototype.hasOwnProperty.call(obj, tag)) {
        const originalValue = obj[tag];
        obj[tag] = [...originalValue, v];
      } else {
        obj[tag] = [v];
      }
    }
  };

  if (propertyConfig) {
    // Known property in correct position
    addProperty(target, tag, value, propertyConfig);
  } else {
    // Unknown (extra) property
    addProperty(target.extraProperties, tag, value, propertyConfig);
  }
}

export { propertyContentProcessor };
