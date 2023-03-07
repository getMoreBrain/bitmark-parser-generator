import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitElementNode } from './BitElementNode';
import { TextElementNode } from './TextElementNode';

class TextElementsNode extends BitElementNode implements AstNode {
  type = AstNodeType.textElements;
  textElementNodes: TextElementNode[];

  constructor(textElementNodes: TextElementNode[]) {
    super();

    this.textElementNodes = textElementNodes;
  }

  get children(): TextElementNode[] {
    return [...this.textElementNodes];
  }
}

export { TextElementsNode };
