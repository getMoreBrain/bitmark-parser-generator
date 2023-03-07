import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { TextElementNode } from './TextElementNode';

class TextNode extends TextElementNode implements AstNode {
  type = AstNodeType.text;
  text?: string;

  constructor(text?: string) {
    super();

    this.text = text;
  }

  get value(): string | undefined {
    return this.text;
  }
}

export { TextNode };
