import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitElementNode } from './BitElementNode';

class BitElementArrayNode implements AstNode {
  type = AstNodeType.bitElementArray;
  bitElementNodes: BitElementNode[] = [];

  constructor(bitElementNodes: BitElementNode[]) {
    this.type = AstNodeType.bitElementArray;
    this.bitElementNodes = bitElementNodes;
  }

  get children(): AstNode[] {
    return [...this.bitElementNodes];
  }
}

export { BitElementArrayNode };
