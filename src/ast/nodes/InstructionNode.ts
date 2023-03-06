import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class InstructionNode implements AstNode {
  type = AstNodeType.instruction;
  val: string;

  constructor(value: string) {
    this.type = AstNodeType.instruction;
    this.val = value;
  }

  get value(): string {
    return this.val;
  }
}

export { InstructionNode };
