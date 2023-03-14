import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { TextFormat, TextFormatType } from '../../types/TextFormat';
import { BaseValueNode } from '../BaseLeafNode';

class TextFormatNode extends BaseValueNode<TextFormatType> implements AstNode {
  type = AstNodeType.textFormat;

  static create(textFormat?: TextFormatType): TextFormatNode {
    const node = new TextFormatNode(textFormat);
    node.validate();
    return node;
  }

  protected constructor(textFormat?: TextFormatType) {
    super(textFormat ?? TextFormat.bitmarkMinusMinus);
  }

  protected validate(): void {
    // Check type
    const type = TextFormat.fromValue(this.value);
    if (!type) {
      throw new Error(`Invalid text format type: ${this.value}`);
    }
  }
}

export { TextFormatNode };
