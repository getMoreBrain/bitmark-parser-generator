import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitNode } from './BitNode';

class BitArrayNode implements AstNode {
  type = AstNodeType.bitArray;
  bitArrayNodes: BitNode[] = [];
  inline: boolean;

  constructor(bitArrayNodes: BitNode[], inline?: boolean) {
    this.bitArrayNodes = bitArrayNodes;
    this.inline = !!inline;
  }

  get children(): BitNode[] {
    return [...this.bitArrayNodes];
  }
}

export { BitArrayNode };
