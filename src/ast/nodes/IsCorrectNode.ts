import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class IsCorrectNode extends BaseValueNode<boolean> implements AstNode {
  type = AstNodeType.isCorrect;

  static create(isCorrect?: boolean): IsCorrectNode | undefined {
    const node = isCorrect != null ? new IsCorrectNode(isCorrect) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(isCorrect: boolean) {
    super(isCorrect);
  }

  protected validate(): void {
    NodeValidator.isBoolean(this.value, 'isCorrect');
  }
}

export { IsCorrectNode };
