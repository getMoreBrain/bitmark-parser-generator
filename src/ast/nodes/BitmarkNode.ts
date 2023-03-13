import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { BitNode } from './BitNode';

type Children = BitNode[];

class BitmarkNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.bitmark;
  bits: BitNode[];

  static create(bits: BitNode[]): BitmarkNode {
    const node = new BitmarkNode(bits);

    node.validate();

    return node;
  }

  protected constructor(bits: BitNode[]) {
    super();
    this.bits = bits;
  }

  protected buildChildren(): Children {
    return [...this.bits];
  }

  protected validate(): void {
    // Check
    NodeValidator.isRequired(this.bits, 'bits');
  }
}

export { BitmarkNode };
