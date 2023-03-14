import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class TextNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.text;

  static create(text: string): TextNode {
    const node = new TextNode(text);

    node.validate();

    return node;
  }

  protected constructor(text: string) {
    super(text);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'text');
  }
}

export { TextNode };
