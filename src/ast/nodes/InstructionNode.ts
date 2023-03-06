import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitElementNode } from './BitElementNode';

class InstructionNode extends BitElementNode implements AstNode {
  type = AstNodeType.instruction;
  instruction: string;

  constructor(instruction: string) {
    super();

    this.instruction = instruction;
  }

  get value(): string {
    return this.instruction;
  }
}

export { InstructionNode };
