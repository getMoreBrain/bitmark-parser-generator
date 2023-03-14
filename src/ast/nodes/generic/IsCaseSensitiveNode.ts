import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class IsCaseSensitiveNode extends BaseValueNode<boolean> implements AstNode {
  type = AstNodeType.isCaseSensitive;

  static create(isCaseSensitive?: boolean): IsCaseSensitiveNode | undefined {
    const node = isCaseSensitive != null ? new IsCaseSensitiveNode(isCaseSensitive) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(isCaseSensitive: boolean) {
    super(isCaseSensitive);
  }

  protected validate(): void {
    NodeValidator.isBoolean(this.value, 'isCaseSensitive');
  }
}

export { IsCaseSensitiveNode };
