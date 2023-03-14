import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class PostfixNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.postfix;

  static create(postfix?: string): PostfixNode | undefined {
    const node = postfix ? new PostfixNode(postfix) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(postfix: string) {
    super(postfix);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'postfix');
  }
}

export { PostfixNode };
