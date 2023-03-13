import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';
import { AttachmentTypeType } from '../types/AttachmentType';
import { BitTypeType } from '../types/BitType';
import { TextFormatType } from '../types/TextFormat';

import { AttachmentTypeNode } from './AttachmentTypeNode';
import { BaseBranchNode } from './BaseBranchNode';
import { BitTypeNode } from './BitTypeNode';
import { TextFormatNode } from './TextFormatNode';

type Children = (BitTypeNode | TextFormatNode | AttachmentTypeNode)[];

class BitHeaderNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.bitHeader;
  bitTypeNode: BitTypeNode;
  textFormatNode: TextFormatNode;
  attachmentTypeNode?: AttachmentTypeNode;

  static create(bitType: BitTypeType, textFormat?: TextFormatType, attachmentType?: AttachmentTypeType): BitHeaderNode {
    const bitTypeNode = BitTypeNode.create(bitType);
    const textFormatNode = TextFormatNode.create(textFormat);
    const attachmentTypeNode = AttachmentTypeNode.create(attachmentType);

    const node = new BitHeaderNode(bitTypeNode, textFormatNode, attachmentTypeNode);

    node.validate();

    return node;
  }

  protected constructor(
    bitTypeNode: BitTypeNode,
    textFormatNode: TextFormatNode,
    attachmentTypeNode?: AttachmentTypeNode,
  ) {
    super();
    this.bitTypeNode = bitTypeNode;
    this.textFormatNode = textFormatNode;
    this.attachmentTypeNode = attachmentTypeNode;
  }

  protected buildChildren(): Children {
    const children: Children = [this.bitTypeNode, this.textFormatNode];

    if (this.attachmentTypeNode) children.push(this.attachmentTypeNode);

    return children;
  }

  protected validate(): void {
    // Check
    NodeValidator.isRequired(this.bitTypeNode, 'bitTypeNode');
    NodeValidator.isRequired(this.textFormatNode, 'textFormatNode');
  }
}

export { BitHeaderNode };
