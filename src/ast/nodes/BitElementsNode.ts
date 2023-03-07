import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitElementNode } from './BitElementNode';

class BitElementsNode implements AstNode {
  type = AstNodeType.bitElements;
  bitElementNodes: BitElementNode[] = [];
  inline: boolean;

  constructor(bitElementNodes: BitElementNode[], inline: boolean) {
    this.bitElementNodes = bitElementNodes;
    this.inline = inline;
  }

  get children(): BitElementNode[] {
    return [...this.bitElementNodes];
  }
}

export { BitElementsNode };
