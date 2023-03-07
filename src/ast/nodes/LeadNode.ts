import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class LeadNode implements AstNode {
  type = AstNodeType.lead;
  val: string;

  constructor(value: string) {
    this.val = value;
  }

  get value(): string {
    return this.val;
  }
}

export { LeadNode };
