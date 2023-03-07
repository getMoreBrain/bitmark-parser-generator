import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { PlaceholderTypeType } from '../types/PlaceholderType';

import { BitElementNode } from './BitElementNode';
import { TextNode } from './TextNode';

class PlaceholderHeaderNode extends BitElementNode implements AstNode {
  type = AstNodeType.placeholderHeader;
  placeholderType: PlaceholderTypeType;
  // formatNode: TextFormatNode;
  textNode: TextNode;

  constructor(placeholderType: PlaceholderTypeType /*, formatNode: TextFormatNode*/, textNode: TextNode) {
    super();

    this.placeholderType = placeholderType;
    // this.formatNode = formatNode;
    this.textNode = textNode;
  }

  get value(): PlaceholderTypeType {
    return this.placeholderType;
  }

  get children(): AstNode[] {
    const children = [];

    children.push(this.textNode);
    // children.push(this.formatNode);

    return children;
  }
}

export { PlaceholderHeaderNode };
