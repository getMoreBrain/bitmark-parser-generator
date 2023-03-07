import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class BitKeyNode implements AstNode {
  type = AstNodeType.bitKey;
  val: string | boolean;

  constructor(key: string) {
    this.val = key;
  }

  get value(): string | boolean {
    return this.val;
  }
}

export { BitKeyNode };
