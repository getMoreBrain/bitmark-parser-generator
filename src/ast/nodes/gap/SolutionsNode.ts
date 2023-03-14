import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseBranchNode } from '../BaseBranchNode';

import { SolutionNode } from './SolutionNode';

type Children = SolutionNode[];

class SolutionsNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.solutions;
  solutionNodes: SolutionNode[];

  static create(solutions: string[]): SolutionsNode {
    const solutionNodes: SolutionNode[] = [];

    for (const s of solutions) {
      if (s) {
        const solutionNode = SolutionNode.create(s);
        if (solutionNode) {
          solutionNodes.push(solutionNode);
        }
      }
    }

    const node = new SolutionsNode(solutionNodes);

    node.validate();

    return node;
  }

  protected constructor(solutionNodes: SolutionNode[]) {
    super();
    this.solutionNodes = solutionNodes;
  }

  protected buildChildren(): Children {
    const children = [...this.solutionNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.solutionNodes, 'solutionNodes');
  }
}

export { SolutionsNode };
