import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { PlaceholderTypeType } from '../types/PlaceholderType';

class PlaceholderTypeNode implements AstNode {
  type = AstNodeType.placeholderType;
  placeholderType: PlaceholderTypeType;

  constructor(type: PlaceholderTypeType) {
    this.placeholderType = type;
  }

  get value(): PlaceholderTypeType {
    return this.placeholderType;
  }
}

export { PlaceholderTypeNode };
