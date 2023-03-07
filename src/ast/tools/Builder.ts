import { BitAttachmentTypeNode } from '../nodes/AttachmentTypeNode';
import { BitBitTypeNode } from '../nodes/BitBitTypeNode';
import { BitKeyNode } from '../nodes/BitKeyNode';
import { BitNode } from '../nodes/BitNode';
import { BitTypeNode } from '../nodes/BitTypeNode';
import { BitValueNode } from '../nodes/BitValueNode';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { BitsNode } from '../nodes/BitsNode';
import { BitAttachmentTypeType } from '../types/BitAttachmentType';
import { BitBitTypeType } from '../types/BitBitType';
import { BitTypeType } from '../types/BitType';
import { BitType } from '../types/BitType';

class Builder {
  bitmark(bits: BitsNode[]): BitmarkNode {
    const node = new BitmarkNode(bits);

    return node;
  }

  bits(bitNode: BitNode, bitsNodes?: BitsNode[]): BitsNode {
    const node = new BitsNode(bitNode, bitsNodes);

    return node;
  }

  bit(
    bitTypeNode: BitTypeNode,
    bitKeyNode: BitKeyNode,
    bitValueNode?: BitValueNode,
    attachmentTypeNode?: BitAttachmentTypeNode,
  ): BitNode {
    const node = new BitNode(bitTypeNode, bitKeyNode, bitValueNode, attachmentTypeNode);

    return node;
  }

  bitType(type: BitTypeType): BitTypeNode {
    const node = new BitTypeNode(type);

    return node;
  }

  bitBitType(type: BitBitTypeType): BitBitTypeNode {
    const node = new BitBitTypeNode(type);

    return node;
  }

  bitKey(key: string): BitKeyNode {
    const node = new BitKeyNode(key);

    return node;
  }

  bitValue(value: string | boolean): BitValueNode {
    const node = new BitValueNode(value);

    return node;
  }

  bitAttachmentType(type: BitAttachmentTypeType): BitAttachmentTypeNode {
    const node = new BitAttachmentTypeNode(type);

    return node;
  }

  cards(cards: BitsNode[]): BitsNode {
    const node = new BitsNode(new BitNode(new BitTypeNode(BitType.cards), new BitKeyNode('')), cards);

    return node;
  }

  body(parts: BitsNode[]): BitsNode {
    const node = new BitsNode(new BitNode(new BitTypeNode(BitType.body), new BitKeyNode('')), parts);

    return node;
  }

  text(text: string): BitsNode {
    const node = new BitsNode(new BitNode(new BitTypeNode(BitType.text), new BitKeyNode(text)));

    return node;
  }
}

const builder = new Builder();

export { builder as Builder };
