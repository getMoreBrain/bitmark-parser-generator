import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { BitAttachmentTypeType } from '../types/BitAttachmentType';

class BitAttachmentTypeNode implements AstNode {
  type: AstNodeTypeType = AstNodeType.bitAttachmentType;
  bitAttachmentType: BitAttachmentTypeType;

  constructor(bitAttachmentType: BitAttachmentTypeType) {
    this.bitAttachmentType = bitAttachmentType;
  }

  get value(): BitAttachmentTypeType {
    return this.bitAttachmentType;
  }
}

export { BitAttachmentTypeNode };
