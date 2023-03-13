import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class SelectOptionTextNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.selectOptionText;

  static create(text: string): SelectOptionTextNode {
    const node = new SelectOptionTextNode(text);

    node.validate();

    return node;
  }

  protected constructor(text: string) {
    super(text);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'selectOptionText');
  }
}

export { SelectOptionTextNode };
