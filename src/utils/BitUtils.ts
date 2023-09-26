import { WithExample } from '../ast/BaseBuilder';
import { Example } from '../model/ast/Nodes';

import { BooleanUtils } from './BooleanUtils';

class BitUtils {
  /**
   * Helper function to fill in the example / isExample of a node based on the values of isDefaultExample and example.
   * This function if for 'string' examples.
   *
   * @param nodes
   * @param isDefaultExample
   * @param example
   * @param firstOnly
   * @returns
   */
  fillStringExample(
    nodes: WithExample | WithExample[],
    isDefaultExample: boolean | undefined,
    example: Example | undefined,
    firstOnly: boolean,
  ) {
    if (!nodes) return;
    if (!Array.isArray(nodes)) nodes = [nodes];

    for (const node of nodes) {
      if (!node.isExample) {
        if (isDefaultExample) {
          node.isDefaultExample = true;
          node.isExample = true;
        } else {
          node.isDefaultExample = false;
          node.example = example;
        }
        if (firstOnly) break;
      }
    }
  }

  /**
   * Helper function to fill in the example / isExample of a node based on the values of isDefaultExample and example.
   * This function if for 'boolean' examples.
   *
   * @param nodes
   * @param isDefaultExample
   * @param example
   * @param firstCorrectOnly
   * @returns
   */
  fillBooleanExample(
    nodes: WithExample | WithExample[],
    isDefaultExample: boolean | undefined,
    example: Example | undefined,
    firstCorrectOnly: boolean,
  ) {
    if (!nodes) return;
    if (!Array.isArray(nodes)) nodes = [nodes];

    for (const node of nodes) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!node.isExample && (!firstCorrectOnly || (node as any).isCorrect)) {
        if (isDefaultExample) {
          node.isDefaultExample = true;
          node.isExample = true;
        } else {
          node.isDefaultExample = false;
          node.example = BooleanUtils.toBoolean(example);
        }
        if (firstCorrectOnly) break;
      }
    }
  }
}

const instance = new BitUtils();

export { instance as BitUtils };
