import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class ResponseTextNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.responseText;

  static create(text: string): ResponseTextNode {
    const node = new ResponseTextNode(text);

    node.validate();

    return node;
  }

  protected constructor(text: string) {
    super(text);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'responseText');
  }
}

export { ResponseTextNode };
