import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class SolutionNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.solution;

  static create(solution?: string): SolutionNode | undefined {
    const node = solution ? new SolutionNode(solution) : undefined;

    if (node) node.validate();

    return node;
  }

  constructor(solution: string) {
    super(solution);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'solution');
  }
}

export { SolutionNode };
