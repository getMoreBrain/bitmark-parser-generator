import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseBranchNode } from '../BaseBranchNode';

import { PairValueNode } from './PairValueNode';

type Children = PairValueNode[];

class PairValuesNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.pairValues;
  pairValueNodes: PairValueNode[];

  static create(pairValues: string[]): PairValuesNode {
    const pairValueNodes: PairValueNode[] = [];

    for (const pv of pairValues) {
      if (pv) {
        const pvNode = PairValueNode.create(pv);
        if (pvNode) {
          pairValueNodes.push(pvNode);
        }
      }
    }

    const node = new PairValuesNode(pairValueNodes);

    node.validate();

    return node;
  }

  protected constructor(pairValueNodes: PairValueNode[]) {
    super();
    this.pairValueNodes = pairValueNodes;
  }

  protected buildChildren(): Children {
    const children: Children = [...this.pairValueNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.pairValueNodes, 'pairValueNodes');
  }
}

export { PairValuesNode };
