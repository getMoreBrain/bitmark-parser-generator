import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class PairValueNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.pairValue;

  static create(pairValue?: string): PairValueNode | undefined {
    const node = pairValue ? new PairValueNode(pairValue) : undefined;

    if (node) node.validate();

    return node;
  }

  constructor(pairValue: string) {
    super(pairValue);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'pairValue');
  }
}

export { PairValueNode };
