import { Example, ExampleObjectSingleOrArray, Property } from '../model/ast/Nodes';
import { PropertyKey, PropertyKeyMetadata, PropertyKeyType } from '../model/enum/PropertyKey';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BooleanUtils } from '../utils/BooleanUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { StringUtils } from '../utils/StringUtils';

class BaseBuilder {
  /**
   * Return true if any of the answers has an example.
   *
   * @param answers - array of answers
   * @returns true if any of the answers has an example, otherwise undefined
   */
  protected hasAnswerExample(...answers: (ExampleObjectSingleOrArray | undefined)[]): true | undefined {
    let isAnswerExample: true | undefined;
    if (Array.isArray(answers)) {
      for (const as of answers) {
        if (Array.isArray(as)) {
          for (const a of as) {
            if (a.example) {
              isAnswerExample = true;
              break;
            }
          }
        } else if (as) {
          if (as.example) {
            isAnswerExample = true;
            break;
          }
        }
        if (isAnswerExample) break;
      }
    }
    return isAnswerExample;
  }

  /**
   * Convert example to an Example.
   * This function recognises boolean strings and converts them to boolean values.
   *
   * @param exampleIn - the example to convert (string or boolean)
   * @param fallbackExampleIn - if exampleIn resolves to false, this example will be used instead
   * @returns exampleIn resolved to an Example object
   */
  protected toExample(
    exampleIn: string | boolean | undefined,
    fallbackExampleIn?: string | boolean | undefined,
  ): Example | undefined {
    const exampleInIsFalse = () => {
      return fallbackExampleIn != null ? this.toExample(fallbackExampleIn) : undefined;
    };

    if (exampleIn == null) return exampleInIsFalse();
    let text = '';

    const isBooleanString = BooleanUtils.isBooleanString(exampleIn);
    if (isBooleanString) {
      if (!BooleanUtils.toBoolean(exampleIn)) return exampleInIsFalse();
      return true;
    } else {
      text = exampleIn as string;
    }

    return text;
  }

  /**
   * Convert example to an Example (with only boolean values).
   * This function recognises boolean strings and converts them to boolean values.
   *
   * @param exampleIn - the example to convert (string or boolean)
   * @param fallbackExampleIn - if exampleIn resolves to false, this example will be used instead
   * @returns exampleIn resolved to an Example object with only boolean values
   */
  protected toExampleBoolean(
    exampleIn: string | boolean | undefined,
    fallbackExampleIn?: string | boolean | undefined,
  ): Example | undefined {
    const exampleInIsFalse = () => {
      return fallbackExampleIn != null ? this.toExample(fallbackExampleIn) : false;
    };

    if (exampleIn == null) return exampleInIsFalse();

    const isBooleanString = BooleanUtils.isBooleanString(exampleIn);
    if (isBooleanString) {
      if (!BooleanUtils.toBoolean(exampleIn)) return exampleInIsFalse();
      return true;
    }

    return true;
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
