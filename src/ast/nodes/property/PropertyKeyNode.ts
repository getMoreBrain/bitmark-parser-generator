import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class PropertyKeyNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.propertyKey;

  static create(propertyKey: string): PropertyKeyNode {
    const node = new PropertyKeyNode(propertyKey);

    node.validate();

    return node;
  }

  protected constructor(propertyKey: string) {
    super(propertyKey);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'propertyKey');
  }
}

export { PropertyKeyNode };
