import { AttachmentTypeNode } from '../nodes/AttachmentTypeNode';
import { BitElementArrayNode } from '../nodes/BitElementArrayNode';
import { BitElementNode } from '../nodes/BitElementNode';
import { BitHeaderNode } from '../nodes/BitHeaderNode';
import { BitNode } from '../nodes/BitNode';
import { BitTypeNode } from '../nodes/BitTypeNode';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { InstructionNode } from '../nodes/InstructionNode';
import { ItemNode } from '../nodes/ItemNode';
import { KeyNode } from '../nodes/KeyNode';
import { PropertyNode } from '../nodes/PropertyNode';
import { TextFormatNode } from '../nodes/TextFormatNode';
import { TextNode } from '../nodes/TextNode';
import { ValueNode } from '../nodes/ValueNode';
import { BitTypeType } from '../types/BitType';
import { TextFormatType } from '../types/TextFormat';

class Builder {
  bitmark(bits: BitNode[]): BitmarkNode {
    const node = new BitmarkNode(bits);

    return node;
  }

  bit(bitHeaderNode: BitHeaderNode, bitElementArrayNode?: BitElementArrayNode): BitNode {
    const node = new BitNode(bitHeaderNode, bitElementArrayNode);

    return node;
  }

  bitHeader(
    bitTypeNode: BitTypeNode,
    textFormatNode: TextFormatNode,
    attachmentTypeNode?: AttachmentTypeNode,
  ): BitHeaderNode {
    const node = new BitHeaderNode(bitTypeNode, textFormatNode, attachmentTypeNode);

    return node;
  }

  bitType(type: BitTypeType): BitTypeNode {
    const node = new BitTypeNode(type);

    return node;
  }

  textFormat(format: TextFormatType): TextFormatNode {
    const node = new TextFormatNode(format);

    return node;
  }

  bitElementArray(bitElements: BitElementNode[]): BitElementArrayNode {
    const node = new BitElementArrayNode(bitElements);

    return node;
  }

  property(keyNode: KeyNode, valueNode: ValueNode): PropertyNode {
    const node = new PropertyNode(keyNode, valueNode);

    return node;
  }

  key(key: string): KeyNode {
    const node = new KeyNode(key);

    return node;
  }

  value(value: string): ValueNode {
    const node = new ValueNode(value);

    return node;
  }

  item(item: string): ItemNode {
    const node = new ItemNode(item);

    return node;
  }

  instruction(instruction: string): InstructionNode {
    const node = new InstructionNode(instruction);

    return node;
  }

  text(text?: string): TextNode {
    const node = new TextNode(text);

    return node;
  }
}

const builder = new Builder();

export { builder as Builder };
