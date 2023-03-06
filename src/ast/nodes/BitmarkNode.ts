import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitNode } from './BitNode';

class BitmarkNode implements AstNode {
  type = AstNodeType.bitmark;
  bit: BitNode;

  constructor(bit: BitNode) {
    this.type = AstNodeType.bitmark;
    this.bit = bit;
  }

  get children(): AstNode[] {
    return [this.bit];
  }
}

export { BitmarkNode };
