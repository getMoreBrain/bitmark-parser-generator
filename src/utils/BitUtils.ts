import { type WithExampleJson } from '../ast/BaseBuilder.ts';
import { type TextAst } from '../model/ast/TextNodes.ts';
import { type TextFormatType } from '../model/enum/TextFormat.ts';
import { TextLocation } from '../model/enum/TextLocation.ts';
import { type ExampleJson } from '../model/json/BitJson.ts';
import { TextParser } from '../parser/text/TextParser.ts';
import { BooleanUtils } from './BooleanUtils.ts';

const textParser = new TextParser();

class BitUtils {
  /**
   * Helper function to fill in the example / isExample of a node based on the values of __isDefaultExample and example.
   * This function if for 'string' examples.
   *
   * @param nodes
   * @param __isDefaultExample
   * @param example
   * @param firstOnly
   * @returns
   */
  fillStringExample(
    textFormat: TextFormatType,
    nodes: WithExampleJson | WithExampleJson[],
    __isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    firstOnly: boolean,
  ) {
    if (!nodes) return;
    if (!Array.isArray(nodes)) nodes = [nodes];

    for (const node of nodes) {
      if (!node.isExample) {
        if (__isDefaultExample) {
          node.example = node.__defaultExample as ExampleJson;
          node.isExample = true;
        } else {
          // node.__isDefaultExample = false;
          node.example = (
            example
              ? textParser.toAst(example as TextAst, {
                  format: textFormat,
                  location: TextLocation.tag,
                })
              : undefined
          ) as ExampleJson;
        }
        if (firstOnly) break;
      }
    }
  }

  /**
   * Helper function to fill in the example / isExample of a node based on the values of __isDefaultExample and example.
   * This function if for 'boolean' examples.
   *
   * @param nodes
   * @param __isDefaultExample
   * @param example
   * @param firstCorrectOnly
   * @returns
   */
  fillBooleanExample(
    nodes: WithExampleJson | WithExampleJson[],
    __isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    firstCorrectOnly: boolean,
  ) {
    if (!nodes) return;
    if (!Array.isArray(nodes)) nodes = [nodes];

    for (const node of nodes) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!node.isExample && (!firstCorrectOnly || (node as any).isCorrect)) {
        if (__isDefaultExample) {
          node.example = node.__defaultExample as ExampleJson;
          node.isExample = true;
        } else {
          // node.__isDefaultExample = false;
          node.example = BooleanUtils.toBoolean(example);
        }
        if (firstCorrectOnly) break;
      }
    }
  }
}

const instance = new BitUtils();

export { instance as BitUtils };
