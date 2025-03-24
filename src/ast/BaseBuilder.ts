import { Breakscape } from '../breakscaping/Breakscape';
import { Config } from '../config/Config';
import { TextGenerator } from '../generator/text/TextGenerator';
import { Property } from '../model/ast/Nodes';
import { JsonText, TextAst } from '../model/ast/TextNodes';
import { BitConfig } from '../model/config/BitConfig';
import { ConfigKeyType } from '../model/config/enum/ConfigKey';
import { BitTypeType } from '../model/enum/BitType';
import { PropertyFormat } from '../model/enum/PropertyFormat';
import { TextFormatType } from '../model/enum/TextFormat';
import { ExampleJson } from '../model/json/BitJson';
import { TextParser } from '../parser/text/TextParser';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BooleanUtils } from '../utils/BooleanUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { StringUtils } from '../utils/StringUtils';

export interface WithExampleJson {
  isExample: boolean;
  example: ExampleJson;
  __defaultExample?: ExampleJson;
}

export interface BuildContext {
  bitConfig: BitConfig;
  bitType: BitTypeType;
  textFormat: TextFormatType;
}

class BaseBuilder {
  protected textParser: TextParser;
  protected textGenerator: TextGenerator;

  constructor() {
    this.textParser = new TextParser();
    this.textGenerator = new TextGenerator();
  }

  /**
   * Convert example to an Example.
   * - If example is set, then the isExample will be true and example with be example as a BreakscapedText.
   * - Else if __isDefaultExample is true, then __isDefaultExample / isExample will both be true.
   * - Else __isDefaultExample / isExample will both be false.
   *
   * @param __isDefaultExample - true if the example is the default value
   * @param example - the example to convert (BreakscapedText, boolean) or undefined if none / default
   * @returns example/__isDefaultExample resolved to an Example object
   */
  protected toExample(
    __isDefaultExample: boolean | undefined,
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
        __defaultExample: defaultExample ?? null,
      };
    }

    // Default example
    if (__isDefaultExample) {
      return {
        isExample: true,
        example: defaultExample ?? null,
        __defaultExample: defaultExample ?? null,
      };
    }

    // Not an example
    return {
      isExample: false,
      example: null,
      __defaultExample: defaultExample ?? null,
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

  protected getEmptyTextAst(context: BuildContext): TextAst {
    return this.handleJsonText(context, true, ' ');
  }

  /**
   * Convert the JsonText from the JSON to the AST format:
   * Input:
   *  - Bitmark v2: breakscaped string
   *  - Bitmark v3: bitmark text JSON (TextAst)
   * Output:
   *  - bitmark text JSON (TextAst) with __tag property to indicate item is text
   *
   * In the case of Bitmark v2 type texts, there is nothing to do but cast the type.
   *
   * @param breakscaped string or TextAst or breakscaped string[] or TextAst[]
   * @param textFormat format of TextAst
   * @param inBody true if the text is in the body
   * @returns Breakscaped string or breakscaped string[]
   */
  protected handleJsonText<T extends JsonText | JsonText[] | undefined, R = T extends JsonText[] ? TextAst[] : TextAst>(
    context: BuildContext,
    isProperty: boolean,
    text: T,
  ): R {
    let res: R;

    const { textFormat } = context;

    if (text == null) {
      res = [] as R;
    } else {
      if (this.textParser.isAst(text)) {
        // Use the text generator to convert the TextAst to breakscaped string
        // this.ast.printTree(text, NodeType.textAst);

        res = text as R;
      } else if (Array.isArray(text)) {
        const strArray: TextAst[] = [];
        for (let i = 0, len = text.length; i < len; i++) {
          const t = text[i];

          if (this.textParser.isAst(t)) {
            // Use the text generator to convert the TextAst to breakscaped string
            // this.ast.printTree(text, NodeType.textAst);
            strArray[i] = t as TextAst;
          } else if (StringUtils.isString(t)) {
            strArray[i] = this.textParser.toAst(
              Breakscape.breakscape(t as string, {
                textFormat,
              }),
              {
                textFormat,
                isProperty,
              },
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (strArray[i] as any).__tag = 'text';
          } else {
            // Invalid data
            strArray[i] = [];
          }
        }
        // Return the array of TextAst texts
        return strArray as R;
      } else if (StringUtils.isString(text)) {
        // v2 text(?)
        res = this.textParser.toAst(
          Breakscape.breakscape(text as string, {
            textFormat,
            v2: true,
          }),
          {
            textFormat,
            isProperty,
          },
        ) as R;
      } else {
        // Invalid data
        res = [] as R;
      }
    }

    // Add the __tag property to indicate this is a text item
    // This is somewhat ugly, but otherwise we would need an AST structure that is not so similar to the JSON
    // resulting in a lot more conversion code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res as any).__tag = 'text';

    return res;
  }

  // /**
  //  * Remove any property with a key starting with an underscore.
  //  *
  //  * @param json
  //  */
  // protected removeTemporaryProperties(json: Record<string, unknown> | unknown[]): void {
  //   const obj = json as Record<string, unknown>;
  //   for (const key in obj) {
  //     if (key.startsWith('_')) {
  //       delete obj[key];
  //     } else if (typeof obj[key] === 'object') {
  //       this.removeTemporaryProperties(obj[key] as Record<string, unknown>);
  //     }
  //   }
  // }
}

export { BaseBuilder };
