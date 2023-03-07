import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class ValueNode implements AstNode {
  type = AstNodeType.value;
  val: string | boolean;

  constructor(value: string | boolean) {
    this.val = value;
  }

  get value(): string | boolean {
    return this.val;
  }
}

export { ValueNode };
