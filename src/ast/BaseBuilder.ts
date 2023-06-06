import { Property } from '../model/ast/Nodes';
import { Text, TextAst, TextNode } from '../model/ast/TextNodes';
import { PropertyKey, PropertyKeyMetadata, PropertyKeyType } from '../model/enum/PropertyKey';
import { TextFormat, TextFormatType } from '../model/enum/TextFormat';
import { TextParser } from '../parser/text/TextParser';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BooleanUtils } from '../utils/BooleanUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { StringUtils } from '../utils/StringUtils';

class BaseBuilder {
  private textParser: TextParser;

  constructor() {
    this.textParser = new TextParser();
  }

  /**
   * Convert string or AST to a TextNode, filling in both the string and AST in the textNode.
   *
   * @param bitmarkText - bitmark text
   * @returns bitmark text AST as plain JS object
   */
  protected toTextNode(stringOrTextAst: Text | undefined, format?: TextFormatType): TextNode | undefined {
    if (stringOrTextAst == null) return undefined;
    let textAst: TextAst;
    let text: string;

    // Default format to 'bitmark--'
    format = format ?? TextFormat.bitmarkMinusMinus;

    if (StringUtils.isString(stringOrTextAst)) {
      text = stringOrTextAst as string;
      textAst = this.textParser.toAst(text, { textFormat: format });
    } else {
      textAst = stringOrTextAst as TextAst;
      text = 'TODO - GENERATOR';
    }

    return {
      format,
      text,
      textAst,
    };
  }

  /**
   * Convert string or AST to a TextNode, or leave a boolean as it is.
   *
   * @param bitmarkText - bitmark text
   * @returns bitmark text AST as plain JS object
   */
  protected toExampeNode(
    exampleIn: Text | boolean | undefined,
    format?: TextFormatType,
  ): TextNode | boolean | undefined {
    if (exampleIn == null) return undefined;
    let res: TextNode | boolean | undefined;

    // Default format to 'bitmark--'
    format = format ?? TextFormat.bitmarkMinusMinus;

    const isBooleanString = BooleanUtils.isBooleanString(exampleIn);
    if (isBooleanString) {
      res = BooleanUtils.asBoolean(exampleIn, true);
    } else {
      res = this.toTextNode(exampleIn, format);
    }

    return res;
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
      if (meta.isBoolean) v = BooleanUtils.asBoolean(v, true);
      if (meta.isInvertedBoolean) v = !BooleanUtils.asBoolean(v, true);
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
