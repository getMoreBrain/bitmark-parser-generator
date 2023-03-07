import { AstNodeType } from '../AstNodeType';
import { Ast, AstWalkCallbacks, AstNode, AstNodeInfo } from '../Ast';
import { BitElementsNode } from '../nodes/BitElementsNode';
import { BitNode } from '../nodes/BitNode';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { BitsNode } from '../nodes/BitsNode';
import { PlaceholderHeaderNode } from '../nodes/PlaceholderHeaderNode';
import { StatementNode } from '../nodes/StatementNode';
import { TextFormatNode } from '../nodes/TextFormatNode';
import { BitTypeMap } from '../types/BitTypeMap';
import { BitType } from '../types/BitType';
import { PlaceholderType } from '../types/PlaceholderType';
import { TextFormat } from '../types/TextFormat';

import { CodeGenerator } from './CodeGenerator';
import { CodeWriter } from './writer/CodeWriter';
import { TextWriter } from './writer/TextWriter';

const DEFAULT_OPTIONS: BitmarkGeneratorOptions = {
  //
};

export interface BitmarkGeneratorOptions {
  explicitTextFormat?: boolean;
}

class BitmarkGenerator extends CodeWriter implements CodeGenerator {
  // TODO - make Ast class a singleton
  private ast = new Ast();
  private options: BitmarkGeneratorOptions;
  private astWalker: AstWalker;

  constructor(writer: TextWriter, options?: BitmarkGeneratorOptions) {
    super(writer);

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.astWalker = new AstWalker(this);
  }

  public generate(root: AstNode): void {
    this.ast.walk(root, this.astWalker);

    this.writeEndOfLine();
  }

  //
  // NODE HANDLERS
  //

  //
  // Non-Terminal nodes (branches)
  //

  // bitmark

  protected on_bitmark_enter(_node: BitmarkNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_bitmark_between(
    _node: BitmarkNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
    this.writeNL();
    this.writeNL();
  }

  protected on_bitmark_exit(_node: BitmarkNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // bits

  protected on_bits_enter(_node: BitsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_bits_between(
    _node: BitsNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_bits_exit(_node: BitsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // bit

  protected on_bit_enter(node: BitNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const isBody = this.isBodyNode(node);
    const isText = this.isTextNode(node);

    if (isBody) {
      // this.writeNL();
      // this.writeNL();
      // this.writeNL();
    } else if (!isText) {
      this.writeOP();
    }
  }

  protected on_bit_between(
    _node: BitNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_bit_exit(node: BitNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const isBody = this.isBodyNode(node);
    const isText = this.isTextNode(node);

    if (isBody) {
      // this.writeNL();
      // this.writeNL();
      // this.writeNL();
    } else if (!isText) {
      this.writeCL();
    }
  }

  // bitHeader

  protected on_bitHeader_enter(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeOPD();
  }

  protected on_bitHeader_between(
    _node: AstNode,
    left: AstNode,
    right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    if (left.type === AstNodeType.bitBitType && right.type === AstNodeType.textFormat) {
      const writeFormat = this.isWriteFormat(right as TextFormatNode);
      if (writeFormat) {
        this.writeColon();
      }
    }
  }

  protected on_bitHeader_exit(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeCL();
  }

  // bitElements

  protected on_bitElements_enter(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_bitElements_between(
    node: BitElementsNode,
    left: AstNode,
    right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    const itemLead = left.type === AstNodeType.item && right.type === AstNodeType.lead;
    const inline = node.inline || itemLead;

    if (!inline) {
      this.writeNL();
    }
  }

  protected on_bitElements_exit(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // property

  protected on_property_enter(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeOPA();
  }

  protected on_property_between(
    _node: AstNode,
    _left: AstNode,
    right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    if (right.value !== true) {
      this.writeColon();
    }
  }

  protected on_property_exit(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeCL();
  }

  // placeholderHeader

  protected on_placeholderHeader_enter(
    node: PlaceholderHeaderNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    switch (node.placeholderType) {
      case PlaceholderType.gap:
        this.writeOPU();
        break;
      default:
        this.writeOP();
    }
  }

  protected on_placeholderHeader_between(
    _node: AstNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    // if (left.type === AstNodeType.bitType && right.type === AstNodeType.textFormat) {
    //   const writeFormat = this.isWriteFormat(right as TextFormatNode);
    //   if (writeFormat) {
    //     this.writeColon();
    //   }
    // }
  }

  protected on_placeholderHeader_exit(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeCL();
  }

  //
  // Terminal nodes (leaves)
  //

  // bitType

  protected on_bitType_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const bitTypeText = BitTypeMap.fromKey(node.value) ?? '';
    this.writeString(bitTypeText);
  }

  // bitKey

  protected on_bitKey_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeString(node.value);
  }

  // bitValue

  protected on_bitValue_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      const write = this.isWriteFormat(node.value);

      if (write) {
        this.writeColon();
        this.writeString(node.value);
      }
    }
  }

  // bitAttachmentType

  protected on_bitAttachmentType_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeAmpersand();
      this.writeString(node.value);
    }
  }

  // textFormat

  protected on_textFormat_enter(node: TextFormatNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const writeFormat = this.isWriteFormat(node);
    if (writeFormat) {
      this.writeString(node.value);
    }
  }

  // key

  protected on_key_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeString(node.value);
  }

  // value

  protected on_value_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value !== true) {
      this.writeString(`${node.value}`);
    }
  }

  // item

  protected on_item_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPC();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // lead

  protected on_lead_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPC();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // statement

  protected on_statement_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const statementNode = node as StatementNode;
    if (statementNode.value) {
      statementNode.isCorrect ? this.writeOPP() : this.writeOPM();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // hint

  protected on_hint_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPQ();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // instruction

  protected on_instruction_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPB();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // text

  protected on_text_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeString(node.value);
  }

  // END NODE HANDLERS

  //
  // WRITE FUNCTIONS
  //

  protected writeString(s?: string): void {
    if (s != null) this.write(s);
  }

  // protected writeAtString(s?: string): void {
  //   if (s != null) this.write(`@${s}`);
  // }

  // protected writeColonString(s?: string): void {
  //   if (s != null) this.write(`:${s}`);
  // }

  // protected writeColonColonString(s?: string): void {
  //   if (s != null) this.write(`::${s}`);
  // }

  protected writeOPBUL(): void {
    this.write('[•');
  }

  protected writeOPESC(): void {
    this.write('[^');
  }

  protected writeOPRANGLE(): void {
    this.write('[►');
  }

  protected writeOPDANGLE(): void {
    this.write('[▼');
  }

  protected writeOPD(): void {
    this.write('[.');
  }

  protected writeOPU(): void {
    this.write('[_');
  }

  protected writeOPB(): void {
    this.write('[!');
  }

  protected writeOPQ(): void {
    this.write('[?');
  }

  protected writeOPA(): void {
    this.write('[@');
  }

  protected writeOPP(): void {
    this.write('[+');
  }

  protected writeOPM(): void {
    this.write('[-');
  }

  protected writeOPS(): void {
    this.write('[\\');
  }

  protected writeOPR(): void {
    this.write('[*');
  }

  protected writeOPC(): void {
    this.write('[%');
  }

  protected writeOP(): void {
    this.write('[');
  }

  protected writeCL(): void {
    this.write(']');
  }

  protected writeAt(): void {
    this.write('@');
  }

  protected writeAmpersand(): void {
    this.write('&');
  }

  protected writeColon(): void {
    this.write(':');
  }

  protected writeDoubleColon(): void {
    this.write('::');
  }

  protected writeNL(): void {
    this.write('\n');
  }

  protected isBodyNode(node: BitNode): boolean {
    if (node.type !== AstNodeType.bit) return false;
    return node.bitTypeNode?.bitType === BitType.body;
  }

  protected isTextNode(node: BitNode): boolean {
    if (node.type !== AstNodeType.bit) return false;
    return node.bitTypeNode?.bitType === BitType.text;
  }

  protected isWriteFormat(bitValue: string): boolean {
    const isMinusMinus = TextFormat.fromValue(bitValue) === TextFormat.bitmarkMinusMinus;
    const writeFormat = !isMinusMinus || this.options.explicitTextFormat;
    return !!writeFormat;
  }
}

class AstWalker implements AstWalkCallbacks {
  private generator: BitmarkGenerator;

  constructor(generator: BitmarkGenerator) {
    this.generator = generator;

    this.enter = this.enter.bind(this);
    this.between = this.between.bind(this);
    this.exit = this.exit.bind(this);
  }

  enter(node: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this.generator as any;
    const funcName = `on_${node.type}_enter`;

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }
  }

  between(node: AstNode, leftNode: AstNode, rightNode: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this.generator as any;
    const funcName = `on_${node.type}_between`;

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, leftNode, rightNode, parent, route);
    }
  }

  exit(node: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this.generator as any;
    const funcName = `on_${node.type}_exit`;

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }
  }
}

export { BitmarkGenerator };
