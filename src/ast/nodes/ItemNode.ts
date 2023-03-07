import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class ItemNode implements AstNode {
  type = AstNodeType.item;
  val: string;

  constructor(value: string) {
    this.val = value;
  }

  get value(): string {
    return this.val;
  }
}

export { ItemNode };
