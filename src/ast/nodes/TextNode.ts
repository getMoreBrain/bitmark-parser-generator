import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { Format, FormatType } from '../types/Format';

import { BitElementNode } from './BitElementNode';

class TextNode extends BitElementNode implements AstNode {
  type = AstNodeType.text;
  text?: string;

  constructor(text?: string) {
    super();

    this.type = AstNodeType.text;
    this.text = text;
  }

  get value(): string | undefined {
    return this.text;
  }
}

export { TextNode };
