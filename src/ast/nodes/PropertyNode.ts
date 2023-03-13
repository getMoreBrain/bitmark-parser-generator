import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';
import { Property } from '../types/Property';

import { BaseBranchNode } from './BaseBranchNode';
import { PropertyKeyNode } from './PropertyKeyNode';
import { PropertyValuesNode } from './PropertyValuesNode';

type Children = [PropertyKeyNode, PropertyValuesNode];

class PropertyNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.property;
  keyNode: PropertyKeyNode;
  valuesNode: PropertyValuesNode;

  static create(property: Property): PropertyNode {
    const node = new PropertyNode(PropertyKeyNode.create(property.key), PropertyValuesNode.create(property.value));

    node.validate();

    return node;
  }

  protected constructor(keyNode: PropertyKeyNode, valueNode: PropertyValuesNode) {
    super();
    this.keyNode = keyNode;
    this.valuesNode = valueNode;
  }

  protected buildChildren(): Children {
    const children: Children = [this.keyNode, this.valuesNode];

    return children;
  }

  protected validate(): void {
    NodeValidator.isRequired(this.keyNode, 'keyNode');
    NodeValidator.isNonEmptyArray(this.valuesNode, 'valuesNode');
  }
}

export { PropertyNode };
