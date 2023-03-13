import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';
import { Resource } from '../types/resources/Resource';

import { BaseValueNode } from './BaseLeafNode';

class ResourceNode extends BaseValueNode<Resource> implements AstNode {
  type = AstNodeType.resource;

  static create(resource?: Resource): ResourceNode | undefined {
    const node = resource ? new ResourceNode(resource) : undefined;
    if (node) node.validate();

    return node;
  }

  protected constructor(resource: Resource) {
    super(resource);
  }

  protected validate(): void {
    NodeValidator.isValidResource(this.value, 'resource');
  }
}

export { ResourceNode };
