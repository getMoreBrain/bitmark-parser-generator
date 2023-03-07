import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { AstNode } from '../Ast';

abstract class TextElementNode implements AstNode {
  type: AstNodeTypeType = AstNodeType.unknown;

  constructor() {
    //
  }
}

export { TextElementNode };
