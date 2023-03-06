import { BitTypeType } from '../json/bitType';
import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class BitTypeNode implements AstNode {
  type = AstNodeType.type;
  bitType: BitTypeType;

  constructor(type: BitTypeType) {
    this.type = AstNodeType.type;
    this.bitType = type;
  }

  get value(): BitTypeType {
    return this.bitType;
  }
}

export { BitTypeNode };
