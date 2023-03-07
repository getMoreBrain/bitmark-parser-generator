import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitElementsNode } from './BitElementsNode';
import { TextElementNode } from './TextElementNode';

class PlaceholderNode extends TextElementNode implements AstNode {
  type: AstNodeTypeType = AstNodeType.placeholder;
  bitElementArrayNode?: BitElementsNode;

  constructor(bitElementArrayNode?: BitElementsNode) {
    super();

    this.bitElementArrayNode = bitElementArrayNode;
  }

  get children(): AstNode[] {
    const children = [];

    if (this.bitElementArrayNode) children.push(this.bitElementArrayNode);

    return children;
  }
}

export { PlaceholderNode };
