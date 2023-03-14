import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class PairKeyNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.pairKey;

  static create(key: string): PairKeyNode {
    const node = new PairKeyNode(key);

    if (node) node.validate();

    return node;
  }

  constructor(key: string) {
    super(key);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'key');
  }
}

export { PairKeyNode };
