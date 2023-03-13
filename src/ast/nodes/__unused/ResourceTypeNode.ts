import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { ResourceType } from '../types/ResourceType';

import { BaseValueNode } from './BaseLeafNode';

class ResourceTypeNode extends BaseValueNode<ResourceType> implements AstNode {
  type = AstNodeType.resourceType;

  constructor(resourceType: ResourceType) {
    super(resourceType);
  }
}

export { ResourceTypeNode };
