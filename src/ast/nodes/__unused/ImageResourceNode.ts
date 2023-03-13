import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { ImageResource } from '../types/ImageResource';

import { BaseValueNode } from './BaseLeafNode';

class ImageResourceNode extends BaseValueNode<ImageResource> implements AstNode {
  type = AstNodeType.imageResource;

  constructor(image: ImageResource) {
    super(image);
  }
}

export { ImageResourceNode };
