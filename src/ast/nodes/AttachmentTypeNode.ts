import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { SubBitTypeType } from '../types/SubBitType';

class AttachmentTypeNode implements AstNode {
  type = AstNodeType.attachmentType;
  attachmentType: SubBitTypeType;

  constructor(attachmentType: SubBitTypeType) {
    this.type = AstNodeType.attachmentType;
    this.attachmentType = attachmentType;
  }

  get value(): SubBitTypeType {
    return this.attachmentType;
  }
}

export { AttachmentTypeNode };
