import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { TextFormat, TextFormatType } from '../types/TextFormat';

class TextFormatNode implements AstNode {
  type = AstNodeType.textFormat;
  format: TextFormatType;

  constructor(format?: TextFormatType) {
    this.format = TextFormat.fromValue(format) ?? TextFormat.bitmarkMinusMinus;
  }

  get value(): TextFormatType {
    return this.format;
  }
}

export { TextFormatNode };
