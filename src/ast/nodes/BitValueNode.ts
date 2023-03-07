import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class BitValueNode implements AstNode {
  type = AstNodeType.bitValue;
  val: string | boolean;

  constructor(value: string | boolean) {
    this.val = value;
  }

  get value(): string | boolean {
    return this.val;
  }
}

export { BitValueNode };
