import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitElementArrayNode } from './BitElementArrayNode';
import { BitHeaderNode } from './BitHeaderNode';

class BitNode implements AstNode {
  type = AstNodeType.bit;
  bitHeaderNode: BitHeaderNode;
  bitElementArrayNode?: BitElementArrayNode;

  constructor(bitHeaderNode: BitHeaderNode, bitElementArrayNode?: BitElementArrayNode) {
    this.bitHeaderNode = bitHeaderNode;
    this.bitElementArrayNode = bitElementArrayNode;
  }

  get children(): AstNode[] {
    const children = [];

    children.push(this.bitHeaderNode);
    if (this.bitElementArrayNode) children.push(this.bitElementArrayNode);

    return children;
  }
}

export { BitNode };
