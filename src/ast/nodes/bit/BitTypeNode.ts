import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { BitType, BitTypeType } from '../../types/BitType';
import { BaseValueNode } from '../BaseLeafNode';

class BitTypeNode extends BaseValueNode<BitTypeType> implements AstNode {
  type = AstNodeType.bitType;

  static create(bitType: BitTypeType): BitTypeNode {
    const node = new BitTypeNode(bitType);

    node.validate();

    return node;
  }

  protected constructor(bitType: BitTypeType) {
    super(bitType);
  }

  protected validate(): void {
    // Check type
    const type = BitType.fromValue(this.value);
    if (!type) {
      throw new Error(`Invalid bit type: ${this.value}`);
    }
  }
}

export { BitTypeNode };
