import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class StatementNode implements AstNode {
  type = AstNodeType.statement;
  val: string;
  isCorrect: boolean;

  constructor(value: string, isCorrect: boolean) {
    this.val = value;
    this.isCorrect = isCorrect;
  }

  get value(): string {
    return this.val;
  }
}

export { StatementNode };
