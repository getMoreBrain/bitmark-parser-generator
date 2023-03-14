import { AstNodeType } from '../../../AstNodeType';
import { AstNode } from '../../../Ast';
import { NodeValidator } from '../../../tools/NodeValidator';
import { ResourceTypeType } from '../../../types/resources/ResouceType';
import { BaseValueNode } from '../../BaseLeafNode';

class ResourceTypeNode extends BaseValueNode<ResourceTypeType> implements AstNode {
  type = AstNodeType.resourceType;

  static create(resourceType: ResourceTypeType): ResourceTypeNode | undefined {
    const node = new ResourceTypeNode(resourceType);
    node.validate();

    return node;
  }

  protected constructor(resourceType: ResourceTypeType) {
    super(resourceType);
  }

  protected validate(): void {
    NodeValidator.isRequired(this.value, 'resourceType');
  }
}

export { ResourceTypeNode };
