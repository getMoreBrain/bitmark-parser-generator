import { AstNodeType } from '../AstNodeType';
import { Ast, AstWalkCallbacks, AstNode, AstNodeInfo } from '../Ast';
import { TextFormatNode } from '../nodes/TextFormatNode';
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

  // bit

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
    if (left.type === AstNodeType.bitType && right.type === AstNodeType.textFormat) {
      const writeFormat = this.isWriteFormat(right as TextFormatNode);
      if (writeFormat) {
        this.writeColon();
      }
    }
  }

  protected on_bitHeader_exit(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeCL();
    this.writeNL();
  }

  // bitElementArray

  protected on_bitElementArray_enter(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_bitElementArray_between(
    _node: AstNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_bitElementArray_exit(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // property

  protected on_property_enter(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeOPA();
  }

  protected on_property_between(
    _node: AstNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeColon();
  }

  protected on_property_exit(_node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeCL();
    this.writeNL();
  }

  //
  // Terminal nodes (leaves)
  //

  // bitType

  protected on_bitType_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeString(node.value);
  }

  // textFormat

  protected on_textFormat_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const writeFormat = this.isWriteFormat(node as TextFormatNode);
    if (writeFormat) {
      this.writeString(node.value);
    }
  }

  // attachmentType

  protected on_attachmentType_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeString(node.value);
  }

  // key

  protected on_key_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeString(node.value);
  }

  // value

  protected on_value_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeString(node.value);
  }

  // item

  protected on_item_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPC();
      this.writeString(node.value);
      this.writeCL();
      this.writeNL();
    }
  }

  // instruction

  protected on_instruction_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPB();
      this.writeString(node.value);
      this.writeCL();
      this.writeNL();
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

  protected writeColon(): void {
    this.write(':');
  }

  protected writeDoubleColon(): void {
    this.write('::');
  }

  protected writeNL(): void {
    this.write('\n');
  }

  protected isWriteFormat(node: TextFormatNode): boolean {
    const isMinusMinus = TextFormat.fromValue(node.value) === TextFormat.bitmarkMinusMinus;
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
