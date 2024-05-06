import { Config } from '../../../../config/Config';
import { PropertyTagConfig } from '../../../../model/config/PropertyTagConfig';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { PropertyConfigKey } from '../../../../model/config/enum/PropertyConfigKey';
import { BitTypeType } from '../../../../model/enum/BitType';
import { PropertyFormat } from '../../../../model/enum/PropertyFormat';
import { PropertyTag } from '../../../../model/enum/PropertyTag';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { BooleanUtils } from '../../../../utils/BooleanUtils';
import { NumberUtils } from '../../../../utils/NumberUtils';
import { StringUtils } from '../../../../utils/StringUtils';

import { bookChainContentProcessor } from './BookChainContentProcessor';
import { exampleTagContentProcessor } from './ExampleTagContentProcessor';
import { imageSourceChainContentProcessor } from './ImageSourceChainContentProcessor';
import { commentTagContentProcessor as internalCommentTagContentProcessor } from './InternalCommentTagContentProcessor';
import { markConfigChainContentProcessor } from './MarkConfigChainContentProcessor';
import { personChainContentProcessor } from './PersonChainContentProcessor';
import { ratingLevelChainContentProcessor } from './RatingLevelChainContentProcessor';
import { servingsChainContentProcessor } from './ServingsChainContentProcessor';
import { technicalTermChainContentProcessor } from './TechnicalTermChainContentProcessor';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

function propertyContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeKeyValue;
  let { key: tag } = content as TypeKeyValue;
  const isChain = contentDepth === BitContentLevel.Chain;

  // Get the property config for the tag (if it exists)
  const propertyConfig = Config.getTagConfigForTag(tagsConfig, PropertyTag.fromValue(tag));
  const configKey = propertyConfig ? propertyConfig.configKey : undefined;

  // Handle internal comments
  if (tag === PropertyTag.internalComment) {
    internalCommentTagContentProcessor(context, contentDepth, bitType, content, target);
    return;
  }

  // Check for chains
  // Generally, the chain will only be present in the correct bit as the data was already validated. The bit type
  // should also be checked here if the property may occur in another bit with a different meaning.
  if (propertyConfig) {
    if (configKey === PropertyConfigKey.example) {
      exampleTagContentProcessor(context, contentDepth, bitType, textFormat, content, target);
      return;
    } else if (configKey === PropertyConfigKey.ratingLevelStart || configKey === PropertyConfigKey.ratingLevelEnd) {
      ratingLevelChainContentProcessor(
        context,
        contentDepth,
        bitType,
        textFormat,
        propertyConfig.chain,
        content,
        target,
      );
      return;
    } else if (configKey === PropertyConfigKey.technicalTerm) {
      technicalTermChainContentProcessor(
        context,
        contentDepth,
        bitType,
        textFormat,
        propertyConfig.chain,
        content,
        target,
      );
      return;
    } else if (configKey === PropertyConfigKey.servings) {
      servingsChainContentProcessor(context, contentDepth, bitType, textFormat, propertyConfig.chain, content, target);
      return;
    } else if (configKey === PropertyConfigKey.person || configKey === PropertyConfigKey.partner) {
      personChainContentProcessor(context, contentDepth, bitType, textFormat, propertyConfig.chain, content, target);
      return;
    } else if (configKey === PropertyConfigKey.imageSource) {
      imageSourceChainContentProcessor(context, contentDepth, bitType, textFormat, tagsConfig, content, target);
      return;
    } else if (configKey === PropertyConfigKey.book) {
      bookChainContentProcessor(context, contentDepth, bitType, textFormat, propertyConfig.chain, content, target);
      return;
    } else if (configKey === PropertyConfigKey.markConfig && !isChain) {
      markConfigChainContentProcessor(context, contentDepth, bitType, textFormat, tagsConfig, content, target);
      return;
    } else if (configKey === PropertyConfigKey.property_title && isChain) {
      // Hack the intermediate tag so as not to clash with [#title] tags which are not chained (yet)
      tag = 'propertyTitle';
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
