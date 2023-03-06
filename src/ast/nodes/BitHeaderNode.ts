import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { AttachmentTypeNode } from './AttachmentTypeNode';
import { BitTypeNode } from './BitTypeNode';
import { TextFormatNode } from './TextFormatNode';

class BitHeaderNode implements AstNode {
  type: AstNodeTypeType = AstNodeType.bitHeader;
  bitTypeNode: BitTypeNode;
  formatNode: TextFormatNode;
  attachmentTypeNode?: AttachmentTypeNode;

  constructor(bitTypeNode: BitTypeNode, formatNode: TextFormatNode, attachmentTypeNode?: AttachmentTypeNode) {
    this.bitTypeNode = bitTypeNode;
    this.formatNode = formatNode;
    this.attachmentTypeNode = attachmentTypeNode;
  }

  get children(): AstNode[] {
    const children = [];

    children.push(this.bitTypeNode);
    children.push(this.formatNode);
    if (this.attachmentTypeNode) children.push(this.attachmentTypeNode);

    return children;
  }
}

export { BitHeaderNode };
