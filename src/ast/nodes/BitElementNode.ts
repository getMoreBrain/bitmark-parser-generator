import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { AstNode } from '../Ast';

abstract class BitElementNode implements AstNode {
  type: AstNodeTypeType = AstNodeType.unknown;

  constructor() {
    //
  }
}

export { BitElementNode };
