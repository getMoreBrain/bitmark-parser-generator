import { WithExampleJson } from '../ast/BaseBuilder';
import { TextAst } from '../model/ast/TextNodes';
import { ExampleJson } from '../model/json/BitJson';
import { TextParser } from '../parser/text/TextParser';

import { BooleanUtils } from './BooleanUtils';

const textParser = new TextParser();

class BitUtils {
  /**
   * Helper function to fill in the example / isExample of a node based on the values of _isDefaultExample and example.
   * This function if for 'string' examples.
   *
   * @param nodes
   * @param _isDefaultExample
   * @param example
   * @param firstOnly
   * @returns
   */
  fillStringExample(
    nodes: WithExampleJson | WithExampleJson[],
    _isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    firstOnly: boolean,
  ) {
    if (!nodes) return;
    if (!Array.isArray(nodes)) nodes = [nodes];

    for (const node of nodes) {
      if (!node.isExample) {
        if (_isDefaultExample) {
          node.example = node._defaultExample as ExampleJson;
          node.isExample = true;
        } else {
          // node._isDefaultExample = false;
          node.example = (example ? textParser.toAst(example as TextAst) : undefined) as ExampleJson;
        }
        if (firstOnly) break;
      }
    }
  }

  /**
   * Helper function to fill in the example / isExample of a node based on the values of _isDefaultExample and example.
   * This function if for 'boolean' examples.
   *
   * @param nodes
   * @param _isDefaultExample
   * @param example
   * @param firstCorrectOnly
   * @returns
   */
  fillBooleanExample(
    nodes: WithExampleJson | WithExampleJson[],
    _isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    firstCorrectOnly: boolean,
  ) {
    if (!nodes) return;
    if (!Array.isArray(nodes)) nodes = [nodes];

    for (const node of nodes) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!node.isExample && (!firstCorrectOnly || (node as any).isCorrect)) {
        if (_isDefaultExample) {
          node.example = node._defaultExample as ExampleJson;
          node.isExample = true;
        } else {
          // node._isDefaultExample = false;
          node.example = BooleanUtils.toBoolean(example);
        }
        if (firstCorrectOnly) break;
      }
    }
  }
}

const instance = new BitUtils();

export { instance as BitUtils };
