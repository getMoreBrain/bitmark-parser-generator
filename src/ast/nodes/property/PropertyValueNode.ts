import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

type PropertyValueType = string | number | boolean | null | undefined;

class PropertyValueNode extends BaseValueNode<PropertyValueType> implements AstNode {
  type = AstNodeType.prefix;

  static create(propertyValue: string | number | boolean | null | undefined): PropertyValueNode {
    const node = new PropertyValueNode(propertyValue);

    node.validate();

    return node;
  }

  protected constructor(propertyValue: PropertyValueType) {
    super(propertyValue);
  }

  protected validate(): void {
    NodeValidator.isStringOrNumberOrBooleanOrNullOrUndefined(this.value, 'propertyValue');
  }
}

export { PropertyValueNode };
