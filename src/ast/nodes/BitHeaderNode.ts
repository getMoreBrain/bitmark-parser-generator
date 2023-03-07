import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitAttachmentTypeNode } from './AttachmentTypeNode';
import { BitBitTypeNode } from './BitBitTypeNode';
import { TextFormatNode } from './TextFormatNode';

class BitHeaderNode implements AstNode {
  type: AstNodeTypeType = AstNodeType.bitHeader;
  bitBitTypeNode: BitBitTypeNode;
  formatNode: TextFormatNode;
  attachmentTypeNode?: BitAttachmentTypeNode;

  constructor(bitTypeNode: BitBitTypeNode, formatNode: TextFormatNode, attachmentTypeNode?: BitAttachmentTypeNode) {
    this.bitBitTypeNode = bitTypeNode;
    this.formatNode = formatNode;
    this.attachmentTypeNode = attachmentTypeNode;
  }

  get children(): AstNode[] {
    const children = [];

    children.push(this.bitBitTypeNode);
    children.push(this.formatNode);
    if (this.attachmentTypeNode) children.push(this.attachmentTypeNode);

    return children;
  }
}

export { BitHeaderNode };
