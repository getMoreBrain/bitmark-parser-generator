import { BitTypeType } from '../../../../model/enum/BitType';
import { PropertyKey, PropertyKeyMetadata } from '../../../../model/enum/PropertyKey';
import { BooleanUtils } from '../../../../utils/BooleanUtils';
import { NumberUtils } from '../../../../utils/NumberUtils';
import { StringUtils } from '../../../../utils/StringUtils';

import { bookChainContentProcessor } from './BookChainContentProcessor';
import { partnerChainContentProcessor } from './PartnerChainContentProcessor';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

function propertyContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { key, value } = content as TypeKeyValue;

  // Check for chains
  // Generally, the chain will only be present in the correct bit as the data was already validated. The bit type
  // should also be checked here if the property may occur in another bit with a different meaning.
  if (key === PropertyKey.partner) {
    partnerChainContentProcessor(context, bitLevel, bitType, content, target);
    return;
  } else if (key === PropertyKey.book) {
    bookChainContentProcessor(context, bitLevel, bitType, content, target);
    return;
  }

  // Helper for building the properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addProperty = (obj: any, key: string, v: unknown) => {
    const meta = PropertyKey.getMetadata<PropertyKeyMetadata>(PropertyKey.fromValue(key)) ?? {};

    // if (key === 'progress') debugger;

    // Convert property and key as needed
    if (meta.astKey) key = meta.astKey;
    if (meta.isTrimmedString) v = StringUtils.isString(v) ? StringUtils.trimmedString(v) : undefined;
    if (meta.isNumber) v = NumberUtils.asNumber(v);
    if (meta.isBoolean) v = BooleanUtils.toBoolean(v, true);
    if (meta.isInvertedBoolean) v = !BooleanUtils.toBoolean(v, true);

    if (meta.isExample) {
      if (v === true) v = null;
    }

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

  if (PropertyKey.fromValue(key)) {
    // Known property
    addProperty(target, key, value);
  } else {
    // Unknown (extra) property
    addProperty(target.extraProperties, key, value);
  }
}

export { propertyContentProcessor };
