import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { AttachmentTypeNode } from './AttachmentTypeNode';
import { BitTypeNode } from './BitTypeNode';
import { FormatNode } from './FormatNode';

class BitHeaderNode implements AstNode {
  type: AstNodeTypeType = AstNodeType.bitHeader;
  bitTypeNode: BitTypeNode;
  formatNode: FormatNode;
  attachmentTypeNode?: AttachmentTypeNode;

  constructor(bitTypeNode: BitTypeNode, formatNode: FormatNode, attachmentTypeNode?: AttachmentTypeNode) {
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
