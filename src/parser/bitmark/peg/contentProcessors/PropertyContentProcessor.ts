import { Config } from '../../../../config/config';
import {
  PropertyConfigKey,
  PropertyKeyMetadata,
  PropertyConfigKeyType,
} from '../../../../model/config/PropertyConfigKey';
import { BitType } from '../../../../model/enum/BitType';
import { BooleanUtils } from '../../../../utils/BooleanUtils';
import { NumberUtils } from '../../../../utils/NumberUtils';
import { StringUtils } from '../../../../utils/StringUtils';

import { bookChainContentProcessor } from './BookChainContentProcessor';
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
  bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { key: tag, value } = content as TypeKeyValue;
  const isChain = bitLevel === BitContentLevel.Chain;

  const propertyConfig = Config.getPropertyFromTag(bitType, tag);
  const propertyConfigKey = PropertyConfigKey.fromValue(propertyConfig.);

  // Check for chains
  // Generally, the chain will only be present in the correct bit as the data was already validated. The bit type
  // should also be checked here if the property may occur in another bit with a different meaning.
  if (propertyConfigKey === PropertyConfigKey._example) {
    exampleTagContentProcessor(context, bitLevel, bitType, content, target);
    return;
  } else if (propertyConfigKey === PropertyConfigKey._partner) {
    partnerChainContentProcessor(context, bitLevel, bitType, content, target);
    return;
  } else if (propertyConfigKey === PropertyConfigKey._imageSource) {
    imageSourceChainContentProcessor(context, bitLevel, bitType, content, target);
    return;
  } else if (propertyConfigKey === PropertyConfigKey._book) {
    bookChainContentProcessor(context, bitLevel, bitType, content, target);
    return;
  } else if (propertyConfigKey === PropertyConfigKey._mark && !isChain) {
    markConfigChainContentProcessor(context, bitLevel, bitType, content, target);
    return;
  }

  // Helper for building the properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addProperty = (obj: any, key: PropertyConfigKeyType, v: unknown) => {
    const meta = PropertyConfigKey.getMetadata<PropertyKeyMetadata>(PropertyConfigKey.fromValue(key)) ?? {};

    // if (key === 'progress') debugger;

    // Convert property and key as needed
    if (meta.astKey) key = meta.astKey;
    if (meta.isTrimmedString) v = StringUtils.isString(v) ? StringUtils.trimmedString(v) : undefined;
    if (meta.isNumber) v = NumberUtils.asNumber(v);
    if (meta.isBoolean) v = BooleanUtils.toBoolean(v, true);
    if (meta.isInvertedBoolean) v = !BooleanUtils.toBoolean(v, true);

    if (meta.isSingle) {
      obj[key] = v;
    } else {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const originalValue = obj[key];
        obj[key] = [...originalValue, v];
      } else {
        obj[key] = [v];
      }
    }
  };

  // TODO: We need to look the property up via the bit and key (the property may be different across bits)

  if (PropertyConfigKey.fromValue(tag)) {
    // Known property
    addProperty(target, tag, value);
  } else {
    // Unknown (extra) property
    addProperty(target.extraProperties, tag, value);
  }
}

export { propertyContentProcessor };
