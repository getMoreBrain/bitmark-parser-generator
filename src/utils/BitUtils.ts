import { WithExample } from '../ast/BaseBuilder';
import { Example, Resource } from '../model/ast/Nodes';
import { BitType, RootBitType, RootBitTypeMetadata } from '../model/enum/BitType';
import { ResourceType, ResourceTypeType } from '../model/enum/ResourceType';

import { BooleanUtils } from './BooleanUtils';

class BitUtils {
  /**
   * Calculate the valid bit resource type based on the bit type, resource type, and resource.
   *
   * @param bitType if set, and no resourceType or resource is set, it will be used to calculate the valid resource
   * @param resourceType if set, it will be used as the valid resource type
   * @param resource if set, and resource type is not set, the resource type will be extracted from the resource
   * @returns the resource type or undefined if none set
   */
  calculateValidResourceType(
    bitType: BitType,
    resourceType: string | undefined,
    resource: Resource | undefined,
  ): ResourceTypeType | undefined {
    let ret: ResourceTypeType | undefined;

    if (resourceType) {
      ret = ResourceType.fromValue(resourceType);
    }
    if (!ret && resource) {
      ret = resource.type;
    }

    if (!ret) {
      const meta = RootBitType.getMetadata<RootBitTypeMetadata>(bitType.root);

      if (meta) {
        ret = meta.resourceType;
      }
    }

    return ret;
  }

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
