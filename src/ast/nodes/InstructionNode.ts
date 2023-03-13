import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class InstructionNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.instruction;

  static create(instruction?: string): InstructionNode | undefined {
    const node = instruction ? new InstructionNode(instruction) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(instruction: string) {
    super(instruction);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'instruction');
  }
}

export { InstructionNode };
