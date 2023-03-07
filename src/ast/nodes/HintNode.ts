import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class HintNode implements AstNode {
  type = AstNodeType.hint;
  val: string;

  constructor(value: string) {
    this.val = value;
  }

  get value(): string {
    return this.val;
  }
}

export { HintNode };
