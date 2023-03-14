import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseBranchNode } from '../BaseBranchNode';

import { PairNode } from './PairNode';

type Children = PairNode[];

class PairsNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.pairs;
  pairNodes: PairNode[];

  static create(pairNodes?: PairNode[]): PairsNode | undefined {
    if (!pairNodes || pairNodes.length === 0) return undefined;

    const node = new PairsNode(pairNodes);

    node.validate();

    return node;
  }

  protected constructor(pairNodes: PairNode[]) {
    super();
    this.pairNodes = pairNodes;
  }

  protected buildChildren(): Children {
    const children: Children = [...this.pairNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.pairNodes, 'pairNodes');
  }
}

export { PairsNode };
