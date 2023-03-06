import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class ValueNode implements AstNode {
  type = AstNodeType.value;
  val: string;

  constructor(value: string) {
    this.type = AstNodeType.value;
    this.val = value;
  }

  get value(): string {
    return this.val;
  }
}

export { ValueNode };
