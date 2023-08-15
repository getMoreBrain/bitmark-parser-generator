import { Example, Property } from '../model/ast/Nodes';
import { PropertyKey, PropertyKeyMetadata, PropertyKeyType } from '../model/enum/PropertyKey';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BooleanUtils } from '../utils/BooleanUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { StringUtils } from '../utils/StringUtils';

export interface WithExample {
  isDefaultExample: boolean;
  isExample: boolean;
  example?: Example;
}

class BaseBuilder {
  /**
   * Convert example to an Example.
   * - If example is set, then the isExample will be true and example with be example as a string.
   * - Else if isDefaultExample is true, then isDefaultExample / isExample will both be true.
   * - Else isDefaultExample / isExample will both be false.
   *
   * @param isDefaultExample - true if the example is the default value
   * @param example - the example to convert (string, boolean) or undefined if none / default
   * @returns example/isDefaultExample resolved to an Example object
   */
  protected toExample(isDefaultExample: boolean | undefined, example: string | boolean | undefined): WithExample {
    // Example
    if (example != undefined) {
      // Convert to boolean to string
      if (example === true) example = 'true';
      if (example === false) example = 'false';

      return {
        isDefaultExample: false,
        isExample: true,
        example,
      };
    }

    // Default example
    if (isDefaultExample) {
      return {
        isDefaultExample: true,
        isExample: true,
      };
    }

    // Not an example
    return {
      isDefaultExample: false,
      isExample: false,
    };
  }

  /**
   * Convert example to an Example, only allowing boolean values.
   * - If example is set, then the isExample will be true and example with be example as a boolean.
   * - Else if isDefaultExample is true, then isDefaultExample / isExample will both be true.
   * - Else isDefaultExample / isExample will both be false.
   *
   * @param isDefaultExample - true if the example is the default value
   * @param example - the example to convert (string, boolean) or undefined if none / default
   * @returns example/isDefaultExample resolved to an Example object
   */
  protected toExampleBoolean(
    isDefaultExample: boolean | undefined,
    example: string | boolean | undefined,
  ): WithExample {
    const isExampleButNotBoolean = example != undefined && !BooleanUtils.isBooleanString(example);

    // Example
    if (example != undefined && !isExampleButNotBoolean) {
      return {
        isDefaultExample: false,
        isExample: true,
        example: BooleanUtils.toBoolean(example),
      };
    }

    // Default example
    if (isDefaultExample || isExampleButNotBoolean) {
      return {
        isDefaultExample: true,
        isExample: true,
      };
    }

    // Not an example
    return {
      isDefaultExample: false,
      isExample: false,
    };
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
