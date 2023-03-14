import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class IsLongAnswerNode extends BaseValueNode<boolean> implements AstNode {
  type = AstNodeType.isLongAnswer;

  static create(isLongAnswer?: boolean): IsLongAnswerNode | undefined {
    const node = isLongAnswer != null ? new IsLongAnswerNode(isLongAnswer) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(isLongAnswer: boolean) {
    super(isLongAnswer);
  }

  protected validate(): void {
    NodeValidator.isBoolean(this.value, 'isLongAnswer');
  }
}

export { IsLongAnswerNode };
