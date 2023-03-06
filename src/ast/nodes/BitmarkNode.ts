import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitNode } from './BitNode';

class BitmarkNode implements AstNode {
  type = AstNodeType.bitmark;
  bits: BitNode[];

  constructor(bits: BitNode[]) {
    this.type = AstNodeType.bitmark;
    this.bits = bits;
  }

  get children(): AstNode[] {
    return [...this.bits];
  }
}

export { BitmarkNode };
