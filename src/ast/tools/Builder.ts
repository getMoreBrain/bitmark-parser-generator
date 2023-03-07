import { BitAttachmentTypeNode } from '../nodes/AttachmentTypeNode';
import { BitBitTypeNode } from '../nodes/BitBitTypeNode';
import { BitElementNode } from '../nodes/BitElementNode';
import { BitElementsNode } from '../nodes/BitElementsNode';
import { BitHeaderNode } from '../nodes/BitHeaderNode';
import { BitKeyNode } from '../nodes/BitKeyNode';
import { BitNode } from '../nodes/BitNode';
import { BitTypeNode } from '../nodes/BitTypeNode';
import { BitValueNode } from '../nodes/BitValueNode';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { BitsNode } from '../nodes/BitsNode';
import { HintNode } from '../nodes/HintNode';
import { InstructionNode } from '../nodes/InstructionNode';
import { ItemNode } from '../nodes/ItemNode';
import { KeyNode } from '../nodes/KeyNode';
import { LeadNode } from '../nodes/LeadNode';
import { PlaceholderHeaderNode } from '../nodes/PlaceholderHeaderNode';
import { PlaceholderNode } from '../nodes/PlaceholderNode';
import { PlaceholderTypeNode } from '../nodes/PlaceholderTypeNode';
import { PropertyNode } from '../nodes/PropertyNode';
import { StatementNode } from '../nodes/StatementNode';
import { TextElementNode } from '../nodes/TextElementNode';
import { TextElementsNode } from '../nodes/TextElementsNode';
import { TextFormatNode } from '../nodes/TextFormatNode';
import { TextNode } from '../nodes/TextNode';
import { ValueNode } from '../nodes/ValueNode';
import { BitAttachmentTypeType } from '../types/BitAttachmentType';
import { BitBitTypeType } from '../types/BitBitType';
import { BitTypeType } from '../types/BitType';
import { BitType } from '../types/BitType';
import { PlaceholderTypeType } from '../types/PlaceholderType';
import { TextFormatType } from '../types/TextFormat';

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

  bitHeader(
    bitTypeNode: BitBitTypeNode,
    textFormatNode: TextFormatNode,
    attachmentTypeNode?: BitAttachmentTypeNode,
  ): BitHeaderNode {
    const node = new BitHeaderNode(bitTypeNode, textFormatNode, attachmentTypeNode);

    return node;
  }

  bitBitType(type: BitBitTypeType): BitBitTypeNode {
    const node = new BitBitTypeNode(type);

    return node;
  }

  textFormat(format: TextFormatType): TextFormatNode {
    const node = new TextFormatNode(format);

    return node;
  }

  bitElements(bitElements: BitElementNode[], inline: boolean): BitElementsNode {
    const node = new BitElementsNode(bitElements, inline);

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

  value(value: string | boolean): ValueNode {
    const node = new ValueNode(value);

    return node;
  }

  item(item: string): ItemNode {
    const node = new ItemNode(item);

    return node;
  }

  lead(lead: string): LeadNode {
    const node = new LeadNode(lead);

    return node;
  }

  statement(statement: string, isCorrect: boolean): StatementNode {
    const node = new StatementNode(statement, isCorrect);

    return node;
  }

  hint(hint: string): HintNode {
    const node = new HintNode(hint);

    return node;
  }

  instruction(instruction: string): InstructionNode {
    const node = new InstructionNode(instruction);

    return node;
  }

  textElements(textElements: TextElementNode[]): TextElementsNode {
    const node = new TextElementsNode(textElements);

    return node;
  }

  text(text?: string): TextNode {
    const node = new TextNode(text);

    return node;
  }

  placeholder(bitElementArrayNode?: BitElementsNode): PlaceholderNode {
    const node = new PlaceholderNode(bitElementArrayNode);

    return node;
  }

  placeholderHeader(
    placeholderType: PlaceholderTypeType,
    // textFormatNode: TextFormatNode,
    textNode: TextNode,
  ): PlaceholderHeaderNode {
    const node = new PlaceholderHeaderNode(placeholderType /*, textFormatNode,*/, textNode);

    return node;
  }

  placeholderType(type: PlaceholderTypeType): PlaceholderTypeNode {
    const node = new PlaceholderTypeNode(type);

    return node;
  }

  body(parts: BitsNode[]): BitsNode {
    const node = new BitsNode(new BitNode(new BitTypeNode(BitType.body), new BitKeyNode('')), parts);

    return node;
  }

  text2(text: string): BitsNode {
    const node = new BitsNode(new BitNode(new BitTypeNode(BitType.text), new BitKeyNode(text)));

    return node;
  }
}

const builder = new Builder();

export { builder as Builder };
