import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class MarkupNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.markup;

  static create(markup?: string): MarkupNode | undefined {
    const node = markup ? new MarkupNode(markup) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(markup: string) {
    super(markup);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'markup');
  }
}

export { MarkupNode };
