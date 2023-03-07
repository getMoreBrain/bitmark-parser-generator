import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitAttachmentTypeNode } from './AttachmentTypeNode';
import { BitKeyNode } from './BitKeyNode';
import { BitTypeNode } from './BitTypeNode';
import { BitValueNode } from './BitValueNode';

class BitNode implements AstNode {
  type = AstNodeType.bit;
  bitTypeNode: BitTypeNode;
  bitKeyNode: BitKeyNode;
  bitValueNode?: BitValueNode;
  attachmentTypeNode?: BitAttachmentTypeNode;

  constructor(
    bitTypeNode: BitTypeNode,
    bitKeyNode: BitKeyNode,
    bitValueNode?: BitValueNode,
    attachmentTypeNode?: BitAttachmentTypeNode,
  ) {
    this.bitTypeNode = bitTypeNode;
    this.bitKeyNode = bitKeyNode;
    this.bitValueNode = bitValueNode;
    this.attachmentTypeNode = attachmentTypeNode;
  }

  get children(): AstNode[] {
    const children = [];

    children.push(this.bitTypeNode);
    children.push(this.bitKeyNode);
    if (this.bitValueNode) children.push(this.bitValueNode);
    if (this.attachmentTypeNode) children.push(this.attachmentTypeNode);

    return children;
  }
}

export { BitNode };
