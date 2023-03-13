import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class HintNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.hint;

  static create(hint?: string): HintNode | undefined {
    const node = hint ? new HintNode(hint) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(hint: string) {
    super(hint);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'hint');
  }
}

export { HintNode };
