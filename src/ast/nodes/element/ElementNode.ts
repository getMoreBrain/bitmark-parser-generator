import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class ElementNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.element;

  static create(element?: string): ElementNode | undefined {
    const node = element ? new ElementNode(element) : undefined;

    if (node) node.validate();

    return node;
  }

  constructor(element: string) {
    super(element);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'element');
  }
}

export { ElementNode };
