import { Example, Property } from '../model/ast/Nodes';
import { PropertyKey, PropertyKeyMetadata, PropertyKeyType } from '../model/enum/PropertyKey';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BooleanUtils } from '../utils/BooleanUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { StringUtils } from '../utils/StringUtils';

class BaseBuilder {
  /**
   * Convert example to an Example.
   * - If example is undefined, then undefined will be returned.
   * - If example is null, then the defaultValue will be used.
   * - Recognises boolean strings and converts them to boolean values.
   *
   * @param example - the example to convert (string, boolean, or null (use defaultValue))
   * @param defaultValue - the default value to use for this example
   * @returns example/defaultValue resolved to an Example object
   */
  protected toExample(
    example: string | boolean | null | undefined,
    defaultValue: string | boolean | null,
  ): {
    isExample: boolean;
    example?: Example;
  } {
    if (example === undefined) {
      return {
        isExample: false,
      };
    }
    let exampleRes: Example = '';

    const exampleOrDefault: Example | null = example === null ? defaultValue : example;

    if (BooleanUtils.isBooleanString(exampleOrDefault)) {
      exampleRes = BooleanUtils.toBoolean(exampleOrDefault);
    } else if (StringUtils.isString(exampleOrDefault)) {
      exampleRes = exampleOrDefault;
    } else {
      exampleRes = exampleOrDefault; // Must be boolean or null
    }

    return {
      isExample: exampleRes !== undefined,
      example: exampleRes,
    };
  }

  /**
   * Convert example to an Example, only allowing boolean values.
   * - If example is undefined, then undefined will be returned.
   * - If example is null, then the defaultValue will be used.
   * - Recognises boolean strings and converts them to boolean values.
   *
   * @param example - the example to convert (string, boolean, or null (use defaultValue))
   * @param defaultValue - the default value to use for this example
   * @returns example/defaultValue resolved to an Example object
   */
  protected toExampleBoolean(
    example: string | boolean | null | undefined,
    defaultValue: boolean | null,
  ): {
    isExample: boolean;
    example?: Example;
  } {
    if (example === undefined) {
      return {
        isExample: false,
      };
    }
    let exampleRes: Example = '';

    const exampleOrDefault: Example | null = example === null ? defaultValue : example;

    if (BooleanUtils.isBoolean(example) || BooleanUtils.isBooleanString(exampleOrDefault)) {
      exampleRes = BooleanUtils.toBoolean(exampleOrDefault);
    } else {
      exampleRes = defaultValue; // Must be boolean or null
    }

    return {
      isExample: exampleRes !== undefined,
      example: exampleRes,
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
