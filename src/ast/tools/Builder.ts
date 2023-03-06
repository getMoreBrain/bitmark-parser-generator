import { BitTypeType } from '../json/bitType';
import { AttachmentTypeNode } from '../nodes/AttachmentTypeNode';
import { BitElementArrayNode } from '../nodes/BitElementArrayNode';
import { BitElementNode } from '../nodes/BitElementNode';
import { BitHeaderNode } from '../nodes/BitHeaderNode';
import { BitNode } from '../nodes/BitNode';
import { BitTypeNode } from '../nodes/BitTypeNode';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { FormatNode } from '../nodes/FormatNode';
import { TextNode } from '../nodes/TextNode';
import { FormatType } from '../types/Format';

class Builder {
  bitmark(bit: BitNode): BitmarkNode {
    const node = new BitmarkNode(bit);

    return node;
  }

  bit(bitHeaderNode: BitHeaderNode, bitElementArrayNode?: BitElementArrayNode): BitNode {
    const node = new BitNode(bitHeaderNode, bitElementArrayNode);

    return node;
  }

  bitHeader(bitTypeNode: BitTypeNode, formatNode: FormatNode, attachmentTypeNode?: AttachmentTypeNode): BitHeaderNode {
    const node = new BitHeaderNode(bitTypeNode, formatNode, attachmentTypeNode);

    return node;
  }

  bitType(type: BitTypeType): BitTypeNode {
    const node = new BitTypeNode(type);

    return node;
  }

  format(format: FormatType): FormatNode {
    const node = new FormatNode(format);

    return node;
  }

  bitElementArray(bitElements: BitElementNode[]): BitElementArrayNode {
    const node = new BitElementArrayNode(bitElements);

    return node;
  }

  text(text?: string): TextNode {
    const node = new TextNode(text);

    return node;
  }
}

const builder = new Builder();

export { builder as Builder };
