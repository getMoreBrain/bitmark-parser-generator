import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { Format, FormatType } from '../types/Format';

class FormatNode implements AstNode {
  type = AstNodeType.format;
  format: FormatType;

  constructor(format?: FormatType) {
    this.type = AstNodeType.format;
    this.format = Format.fromValue(format) ?? Format.bitmarkMinusMinus;
  }

  get value(): FormatType {
    return this.format;
  }
}

export { FormatNode };
