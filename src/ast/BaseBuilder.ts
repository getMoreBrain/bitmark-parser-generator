import { Config } from '../config/Config';
import { Property } from '../model/ast/Nodes';
import { BitmarkTextNode, JsonText, TextAst } from '../model/ast/TextNodes';
import { ConfigKeyType } from '../model/config/enum/ConfigKey';
import { PropertyFormat } from '../model/enum/PropertyFormat';
import { ExampleJson } from '../model/json/BitJson';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BooleanUtils } from '../utils/BooleanUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { StringUtils } from '../utils/StringUtils';

// export interface WithExample {
//   isDefaultExample: boolean;
//   isExample: boolean;
//   example?: Example;
// }

export interface WithExampleJson {
  // isDefaultExample?: boolean;
  isExample: boolean;
  example: ExampleJson;
  _defaultExample: ExampleJson;
}

class BaseBuilder {
  /**
   * Convert example to an Example.
   * - If example is set, then the isExample will be true and example with be example as a BreakscapedText.
   * - Else if isDefaultExample is true, then isDefaultExample / isExample will both be true.
   * - Else isDefaultExample / isExample will both be false.
   *
   * @param isDefaultExample - true if the example is the default value
   * @param example - the example to convert (BreakscapedText, boolean) or undefined if none / default
   * @returns example/isDefaultExample resolved to an Example object
   */
  protected toExample(
    isDefaultExample: boolean | undefined,
    example: TextAst | string | boolean | undefined | null,
    defaultExample?: TextAst | string | boolean | undefined | null,
  ): WithExampleJson {
    // Example
    if (example != undefined) {
      let exampleValue: JsonText | boolean | null;

      // If the default example is a boolean, then the example should be a boolean
      if (BooleanUtils.isBoolean(defaultExample)) {
        exampleValue = BooleanUtils.toBoolean(example);
      } else {
        exampleValue = example;
      }

      return {
        isExample: true,
        example: exampleValue,
        _defaultExample: defaultExample ?? null,
      };
    }

    // Default example
    if (isDefaultExample) {
      return {
        isExample: true,
        example: defaultExample ?? null,
        _defaultExample: defaultExample ?? null,
      };
    }

    // Not an example
    return {
      isExample: false,
      example: null,
      _defaultExample: defaultExample ?? null,
    };
  }

  // /**
  //  * Convert example to an Example, only allowing boolean values.
  //  * - If example is set, then the isExample will be true and example with be example as a boolean.
  //  * - Else if isDefaultExample is true, then isDefaultExample / isExample will both be true.
  //  * - Else isDefaultExample / isExample will both be false.
  //  *
  //  * @param isDefaultExample - true if the example is the default value
  //  * @param example - the example to convert (string, boolean) or undefined if none / default
  //  * @returns example/isDefaultExample resolved to an Example object
  //  */
  // protected toExampleBoolean(
  //   isDefaultExample: boolean | undefined,
  //   example: TextAst | string | boolean | undefined,
  // ): WithExampleJson {
  //   const isExampleButNotBoolean = example != undefined && !BooleanUtils.isBooleanString(example);

  //   // Example
  //   if (example != undefined && !isExampleButNotBoolean) {
  //     return {
  //       isDefaultExample: false,
  //       isExample: true,
  //       example: BooleanUtils.toBoolean(example),
  //     };
  //   }

  //   // Default example
  //   if (isDefaultExample || isExampleButNotBoolean) {
  //     return {
  //       isDefaultExample: true,
  //       isExample: true,
  //     };
  //   }

  //   // Not an example
  //   return {
  //     isDefaultExample: false,
  //     isExample: false,
  //   };
  // }

  /**
   * Convert a TextAst to a BitmarkTextNode.
   */
  protected toBitmarkTextNode(textAst: TextAst | undefined): BitmarkTextNode | undefined {
    if (textAst == null) return undefined;
    return {
      __text__: textAst ?? [],
    };
  }

  /**
   * Convert a BitmarkTextNode to TextAst.
   */
  protected getBitmarkTextAst(textNode: BitmarkTextNode | string | undefined): TextAst {
    if (textNode != null) {
      const nodeAsBitmarkTextNode = textNode as BitmarkTextNode;
      if (Array.isArray(nodeAsBitmarkTextNode.__text__)) {
        return nodeAsBitmarkTextNode.__text__;
      }
    }

    return [];
  }

  /**
   * Convert a raw bitmark property to an AST property.
   *
   * @param key
   * @param value
   * @returns
   */
  protected toAstProperty(key: ConfigKeyType, value: unknown | unknown[] | undefined): Property | undefined {
    if (value == null) return undefined;

    const propertiesConfig = Config.getRawPropertiesConfig();
    const propertyConfig = propertiesConfig[key];

    // if (key === 'progress') debugger;

    // Convert property as needed
    const processValue = (v: unknown) => {
      if (v == null) return undefined;
      switch (propertyConfig.format) {
        // case PropertyFormat.string: {
        //   // Convert number to string
        //   if (NumberUtils.asNumber(v) != null) v = `${v}`;

        //   return StringUtils.isString(v) ? StringUtils.string(v) : undefined;
        // }
        case PropertyFormat.trimmedString:
          // Convert number to string
          if (NumberUtils.asNumber(v) != null) v = `${v}`;

          return StringUtils.isString(v) ? StringUtils.trimmedString(v) : undefined;

        case PropertyFormat.number:
          return NumberUtils.asNumber(v);

        case PropertyFormat.boolean:
          return BooleanUtils.toBoolean(v, true);

        case PropertyFormat.invertedBoolean:
          return !BooleanUtils.toBoolean(v, true);
      }
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
