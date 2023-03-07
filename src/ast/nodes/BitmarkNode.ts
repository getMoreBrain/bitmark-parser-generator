import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitsNode } from './BitsNode';

class BitmarkNode implements AstNode {
  type = AstNodeType.bitmark;
  bits: BitsNode[];

  constructor(bits: BitsNode[]) {
    this.bits = bits;
  }

  get children(): BitsNode[] {
    return [...this.bits];
  }
}

export { BitmarkNode };
