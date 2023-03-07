import { AstNodeType } from '../AstNodeType';
import { Ast, AstWalkCallbacks, AstNode, AstNodeInfo } from '../Ast';
import { BitBitTypeNode } from '../nodes/BitBitTypeNode';
import { BitNode } from '../nodes/BitNode';
import { BitTypeNode } from '../nodes/BitTypeNode';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { BitsNode } from '../nodes/BitsNode';
import { BitBitType } from '../types/BitBitType';
import { BitTypeMap } from '../types/BitTypeMap';
import { BitType } from '../types/BitType';
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

  protected on_bits_enter(node: BitsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    // const isCardBits = this.isCardNode(node.bitNode);
    // if (isCardBits) {
    //   this.writeCardDivider();
    // }
  }

  protected on_bits_between(
    node: BitsNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    const isTopLevelBits = this.isTopLevelBits(node);
    const isCards = this.isCardsNode(node.bitNode);
    const isQuiz = this.isQuizNode(node.bitNode);

    if (isTopLevelBits || isQuiz) {
      this.writeNL();
    } else if (isCards) {
      this.writeCardDivider();
    }
  }

  protected on_bits_exit(node: BitsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const isCards = this.isCardsNode(node.bitNode);
    if (isCards) {
      this.writeCardDivider();
    }

    const isQuiz = this.isQuizNode(node.bitNode);
    if (isQuiz) {
      this.writeNL();
    }
  }

  // bit

  protected on_bit_enter(node: BitNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const isHiddenBit = this.isHiddenBitNode(node);

    if (!isHiddenBit) {
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
    const isHiddenBit = this.isHiddenBitNode(node);

    if (!isHiddenBit) {
      this.writeCL();
    }
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
        if (node.value !== true) {
          this.writeColon();
          this.writeString(`${node.value}`);
        }
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

  // END NODE HANDLERS

  //
  // WRITE FUNCTIONS
  //

  protected writeString(s?: string): void {
    if (s != null) this.write(s);
  }

  // protected writeOPBUL(): void {
  //   this.write('[•');
  // }

  // protected writeOPESC(): void {
  //   this.write('[^');
  // }

  // protected writeOPRANGLE(): void {
  //   this.write('[►');
  // }

  // protected writeOPDANGLE(): void {
  //   this.write('[▼');
  // }

  // protected writeOPD(): void {
  //   this.write('[.');
  // }

  // protected writeOPU(): void {
  //   this.write('[_');
  // }

  // protected writeOPB(): void {
  //   this.write('[!');
  // }

  // protected writeOPQ(): void {
  //   this.write('[?');
  // }

  // protected writeOPA(): void {
  //   this.write('[@');
  // }

  // protected writeOPP(): void {
  //   this.write('[+');
  // }

  // protected writeOPM(): void {
  //   this.write('[-');
  // }

  // protected writeOPS(): void {
  //   this.write('[\\');
  // }

  // protected writeOPR(): void {
  //   this.write('[*');
  // }

  // protected writeOPC(): void {
  //   this.write('[%');
  // }

  protected writeOP(): void {
    this.write('[');
  }

  protected writeCL(): void {
    this.write(']');
  }

  protected writeAmpersand(): void {
    this.write('&');
  }

  protected writeColon(): void {
    this.write(':');
  }

  // protected writeDoubleColon(): void {
  //   this.write('::');
  // }

  protected writeCardDivider(): void {
    this.write('===');
  }

  protected writeNL(): void {
    this.write('\n');
  }

  protected isTopLevelBits(node: BitsNode): boolean {
    if (node.type !== AstNodeType.bits) return false;

    if (node.bitNode && node.bitNode.bitTypeNode) {
      switch (node.bitNode.bitTypeNode.bitType) {
        case BitType.bit:
          // case BitType.statementFalse:
          return true;
      }
    }

    return false;
  }

  // protected isTopLevelBit(node: BitNode): boolean {
  //   if (node.type !== AstNodeType.bit) return false;

  //   if (node.bitTypeNode) {
  //     switch (node.bitTypeNode.bitType) {
  //       case BitType.bit:
  //       case BitType.property:
  //         return true;
  //     }
  //   }

  //   return false;
  // }

  protected isHiddenBitNode(node: BitNode): boolean {
    return this.isBodyNode(node) || this.isTextNode(node) || this.isQuizNode(node) || this.isCardsNode(node);
  }

  protected isBodyNode(node: BitNode): boolean {
    if (!node || node.type !== AstNodeType.bit) return false;
    return node.bitTypeNode?.bitType === BitType.body;
  }

  protected isTextNode(node: BitNode): boolean {
    if (!node || node.type !== AstNodeType.bit) return false;
    return node.bitTypeNode?.bitType === BitType.text;
  }

  protected isCardsNode(node: BitNode): boolean {
    if (!node || node.type !== AstNodeType.bit) return false;
    if (node.bitTypeNode) {
      switch (node.bitTypeNode.bitType) {
        case BitType.cards:
          return true;
      }
    }
    return false;
  }

  protected isQuizNode(node: BitNode): boolean {
    if (!node || node.type !== AstNodeType.bit) return false;
    if (node.bitTypeNode) {
      switch (node.bitTypeNode.bitType) {
        case BitType.quiz:
          return true;
      }
    }
    return false;
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
