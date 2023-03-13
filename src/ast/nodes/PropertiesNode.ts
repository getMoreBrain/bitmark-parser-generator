import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';
import { Property } from '../types/Property';

import { BaseBranchNode } from './BaseBranchNode';
import { PropertyNode } from './PropertyNode';
import { PropertyValueNode } from './PropertyValueNode';

type Children = PropertyNode[];

class PropertiesNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.property;
  propertyNodes: PropertyNode[];

  static create(properties?: Property[]): PropertiesNode | undefined {
    if (!properties || properties.length === 0) return undefined;

    const node = new PropertiesNode([]);
    for (const p of properties) {
      node.addProperty(p);
    }

    node.validate();

    return node;
  }

  protected constructor(propertyNodes: PropertyNode[]) {
    super();
    this.propertyNodes = propertyNodes;
  }

  protected buildChildren(): Children {
    const children: Children = [...this.propertyNodes];

    return children;
  }

  addProperty(property: Property): void {
    // Find existing property node
    let propertyNode: PropertyNode | undefined;
    for (const pn of this.propertyNodes) {
      if (pn.keyNode.value === property.key) {
        propertyNode = pn;
        break;
      }
    }

    if (!propertyNode) {
      // No property node existed, create and add one
      propertyNode = PropertyNode.create(property);
      this.propertyNodes.push(propertyNode);
    } else {
      let propertyValueNode: PropertyValueNode | undefined;
      const vsn = propertyNode.valuesNode;

      // See if the value node already exists (in which case ignore it)
      for (const vn of vsn.propertyValueNodes) {
        if (vn.value === property.value) {
          propertyValueNode = vn;
          break;
        }
      }
      if (!propertyValueNode) {
        propertyValueNode = PropertyValueNode.create(property.value);
        vsn.propertyValueNodes.push(propertyValueNode);
      }
    }
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.propertyNodes, 'propertyNodes');
  }
}

export { PropertiesNode };
