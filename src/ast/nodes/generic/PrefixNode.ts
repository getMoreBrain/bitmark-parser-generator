import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class PrefixNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.prefix;

  static create(prefix?: string): PrefixNode | undefined {
    const node = prefix ? new PrefixNode(prefix) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(prefix: string) {
    super(prefix);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'prefix');
  }
}

export { PrefixNode };
