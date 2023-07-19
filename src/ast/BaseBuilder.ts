import { Example, Property } from '../model/ast/Nodes';
import { PropertyKey, PropertyKeyMetadata, PropertyKeyType } from '../model/enum/PropertyKey';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BooleanUtils } from '../utils/BooleanUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { StringUtils } from '../utils/StringUtils';

class BaseBuilder {
  /**
   * Convert example to an Example.
   * This function recognises boolean strings and converts them to boolean values.
   *
   * @param bitmarkText - bitmark text
   * @returns bitmark text AST as plain JS object
   */
  protected toExample(exampleIn: string | boolean | undefined): Example | undefined {
    if (exampleIn == null) return undefined;
    let text = '';

    const isBooleanString = BooleanUtils.isBooleanString(exampleIn);
    if (isBooleanString) {
      if (!BooleanUtils.toBoolean(exampleIn)) return undefined;
      return true;
    } else {
      text = exampleIn as string;
    }

    return text;
  }

  /**
   * Convert a raw bitmark property to an AST property.
   *
   * @param key
   * @param value
   * @returns
   */
  protected toAstProperty(key: PropertyKeyType, value: unknown | unknown[] | undefined): Property | undefined {
    const meta = PropertyKey.getMetadata<PropertyKeyMetadata>(key) ?? {};

    if (value == null) return undefined;

    // if (key === 'progress') debugger;

    // Convert property as needed
    const processValue = (v: unknown) => {
      if (v == null) return undefined;
      if (meta.isTrimmedString) v = StringUtils.isString(v) ? StringUtils.trimmedString(v) : undefined;
      if (meta.isNumber) v = NumberUtils.asNumber(v);
      if (meta.isBoolean) v = BooleanUtils.toBoolean(v, true);
      if (meta.isInvertedBoolean) v = !BooleanUtils.toBoolean(v, true);
      return v;
    };
    if (Array.isArray(value)) {
      const valueArray = value as unknown[];
      for (let i = 0, len = valueArray.length; i < len; i++) {
        valueArray[i] = processValue(valueArray[i]);
      }
    } else {
      value = processValue(value);
    }

    return ArrayUtils.asArray(value);
  }
}

export { BaseBuilder };
