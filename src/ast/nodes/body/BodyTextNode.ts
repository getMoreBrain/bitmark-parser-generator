import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class BodyTextNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.bodyText;

  static create(bodyText: string): BodyTextNode {
    const node = new BodyTextNode(bodyText || '');

    node.validate();

    return node;
  }

  protected constructor(bodyText: string) {
    super(bodyText);
  }

  protected validate(): void {
    NodeValidator.isString(this.value, 'bodyText');
  }
}

export { BodyTextNode };
