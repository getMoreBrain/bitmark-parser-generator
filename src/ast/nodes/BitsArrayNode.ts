import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitsNode } from './BitsNode';

class BitsArrayNode implements AstNode {
  type = AstNodeType.bitArray;
  bitsNodes: BitsNode[] = [];

  constructor(bitCollectionNodes: BitsNode[]) {
    this.bitsNodes = bitCollectionNodes;
  }

  get children(): BitsNode[] {
    return [...this.bitsNodes];
  }
}

export { BitsArrayNode };
