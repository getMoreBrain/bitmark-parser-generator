import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { PropertyValueNode } from './PropertyValueNode';

type Children = PropertyValueNode[];

class PropertyValuesNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.propertyValues;
  propertyValueNodes: PropertyValueNode[];

  static create(propertyValue: string | number | boolean | null | undefined): PropertyValuesNode {
    const node = new PropertyValuesNode([]);
    node.propertyValueNodes.push(PropertyValueNode.create(propertyValue));

    node.validate();

    return node;
  }

  protected constructor(propertyValueNodes: PropertyValueNode[]) {
    super();
    this.propertyValueNodes = propertyValueNodes;
  }

  protected buildChildren(): Children {
    const children: Children = [...this.propertyValueNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.propertyValueNodes, 'propertyValueNodes');
  }
}

export { PropertyValuesNode };
