import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class ChoiceTextNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.choiceText;

  static create(text: string): ChoiceTextNode {
    const node = new ChoiceTextNode(text);

    node.validate();

    return node;
  }

  protected constructor(text: string) {
    super(text);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'choiceText');
  }
}

export { ChoiceTextNode };
