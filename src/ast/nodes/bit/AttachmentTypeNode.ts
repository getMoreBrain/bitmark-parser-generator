import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { AttachmentType, AttachmentTypeType } from '../../types/AttachmentType';
import { BaseValueNode } from '../BaseLeafNode';

class AttachmentTypeNode extends BaseValueNode<AttachmentTypeType> implements AstNode {
  type = AstNodeType.attachmentType;

  static create(attachmentType?: AttachmentTypeType): AttachmentTypeNode | undefined {
    const node = attachmentType ? new AttachmentTypeNode(attachmentType) : undefined;
    if (node) node.validate();

    return node;
  }

  protected constructor(attachmentType: AttachmentTypeType) {
    super(attachmentType);
  }

  protected validate(): void {
    // Check type
    const type = AttachmentType.fromValue(this.value);
    if (!type) {
      throw new Error(`Invalid attachment type: ${this.value}`);
    }
  }
}

export { AttachmentTypeNode };
