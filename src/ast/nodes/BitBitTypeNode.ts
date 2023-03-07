import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { BitBitTypeType } from '../types/BitBitType';

class BitBitTypeNode implements AstNode {
  type = AstNodeType.bitBitType;
  bitBitType: BitBitTypeType;

  constructor(type: BitBitTypeType) {
    this.bitBitType = type;
  }

  get value(): BitBitTypeType {
    return this.bitBitType;
  }
}

export { BitBitTypeNode };
