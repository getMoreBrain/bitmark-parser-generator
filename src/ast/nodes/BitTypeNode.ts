import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { BitTypeType } from '../types/BitType';

class BitTypeNode implements AstNode {
  type = AstNodeType.bitType;
  bitType: BitTypeType;

  constructor(type: BitTypeType) {
    this.type = AstNodeType.bitType;
    this.bitType = type;
  }

  get value(): BitTypeType {
    return this.bitType;
  }
}

export { BitTypeNode };
