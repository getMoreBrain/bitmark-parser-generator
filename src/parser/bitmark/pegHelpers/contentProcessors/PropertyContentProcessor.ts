/* eslint-disable @typescript-eslint/no-explicit-any */
import { BitTypeType } from '../../../../model/enum/BitType';
import { PropertyKey, PropertyKeyMetadata } from '../../../../model/enum/PropertyKey';
import { BooleanUtils } from '../../../../utils/BooleanUtils';
import { NumberUtils } from '../../../../utils/NumberUtils';
import { StringUtils } from '../../../../utils/StringUtils';

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

  // Helper for building the properties
  const addProperty = (obj: any, key: string, v: unknown) => {
    const meta = PropertyKey.getMetadata<PropertyKeyMetadata>(PropertyKey.fromValue(key)) ?? {};

    // if (key === 'progress') debugger;

    // Convert property and key as needed
    if (meta.astKey) key = meta.astKey;
    if (meta.isTrimmedString) v = StringUtils.isString(v) ? StringUtils.trimmedString(v) : undefined;
    if (meta.isNumber) v = NumberUtils.asNumber(v);
    if (meta.isBoolean) v = BooleanUtils.asBoolean(v, true);
    if (meta.isInvertedBoolean) v = !BooleanUtils.asBoolean(v, true);

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
