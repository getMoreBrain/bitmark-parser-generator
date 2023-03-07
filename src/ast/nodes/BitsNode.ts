import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitNode } from './BitNode';

class BitsNode implements AstNode {
  type = AstNodeType.bits;
  bitNode: BitNode;
  bitsNodes?: BitsNode[];

  constructor(bitNode: BitNode, bitsNodes?: BitsNode[]) {
    this.bitNode = bitNode;
    this.bitsNodes = bitsNodes;
  }

  get children(): AstNode[] {
    const children = [];

    children.push(this.bitNode);
    if (this.bitsNodes) {
      Array.prototype.push.apply(children, this.bitsNodes);
    }

    return children;
  }
}

export { BitsNode };
