import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class ItemNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.item;

  static create(item: string): ItemNode {
    const node = new ItemNode(item);
    node.validate();
    return node;
  }

  protected constructor(item: string) {
    super(item);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'item');
  }
}

export { ItemNode };
