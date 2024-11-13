import { Breakscape } from '../breakscaping/Breakscape';
import { Config } from '../config/Config';
import { Property } from '../model/ast/Nodes';
import { JsonText, TextAst } from '../model/ast/TextNodes';
import { ConfigKeyType } from '../model/config/enum/ConfigKey';
import { PropertyFormat } from '../model/enum/PropertyFormat';
import { TextFormat, TextFormatType } from '../model/enum/TextFormat';
import { ExampleJson } from '../model/json/BitJson';
import { TextParser } from '../parser/text/TextParser';
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
  _defaultExample?: ExampleJson;
}

class BaseBuilder {
  protected textParser: TextParser;

  constructor() {
    this.textParser = new TextParser();
  }

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

  /**
   * Convert the JsonText from the JSON to the AST format:
   * Input:
   *  - Bitmark v2: breakscaped string
   *  - Bitmark v3: bitmark text JSON (TextAst)
   * Output:
   *  - breakscaped string
   *
   * In the case of Bitmark v2 type texts, there is nothing to do but cast the type.
   *
   * @param breakscaped string or TextAst or breakscaped string[] or TextAst[]
   * @param textFormat format of TextAst
   * @returns Breakscaped string or breakscaped string[]
   */
  protected convertJsonTextToAstText<
    T extends JsonText | JsonText[] | undefined,
    R = T extends JsonText[] ? TextAst[] : TextAst,
  >(text: T, textFormat?: TextFormatType): R {
    // NOTE: it is ok to default to bitmarkMinusMinus here as if the text is text then it will not be an array or
    // return true from isAst() and so will be treated as a string
    textFormat = textFormat ?? TextFormat.bitmarkMinusMinus;

    const bitTagOnly = (textFormat !== TextFormat.bitmarkPlusPlus &&
      textFormat !== TextFormat.bitmarkMinusMinus) as boolean;

    if (text == null) return [] as R;
    if (this.textParser.isAst(text)) {
      // Use the text generator to convert the TextAst to breakscaped string
      // this.ast.printTree(text, NodeType.textAst);

      return text as R;
    } else if (Array.isArray(text)) {
      const strArray: TextAst[] = [];
      for (let i = 0, len = text.length; i < len; i++) {
        const t = text[i];

        if (this.textParser.isAst(t)) {
          // Use the text generator to convert the TextAst to breakscaped string
          // this.ast.printTree(text, NodeType.textAst);
          strArray[i] = t as TextAst;
        } else {
          strArray[i] = this.textParser.toAst(
            Breakscape.breakscape(t as string, {
              bitTagOnly,
            }),
          );
          // strArray[i] = t as BreakscapedString;
        }
      }
      return strArray as R;
    }

    return this.textParser.toAst(
      Breakscape.breakscape(text as string, {
        bitTagOnly,
      }),
    ) as R;
  }
}

export { BaseBuilder };
