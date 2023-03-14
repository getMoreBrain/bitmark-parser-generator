import { AstNodeType } from '../../../AstNodeType';
import { AstNode } from '../../../Ast';
import { NodeValidator } from '../../../tools/NodeValidator';
import { BaseValueNode } from '../../BaseLeafNode';

class AgeRangesNode extends BaseValueNode<number[]> implements AstNode {
  type = AstNodeType.ageRanges;

  static create(ageRanges?: number | number[]): AgeRangesNode | undefined {
    if (ageRanges == null || (Array.isArray(ageRanges) && ageRanges.length === 0)) return undefined;
    if (!Array.isArray(ageRanges)) ageRanges = [ageRanges];

    // Ensure ageRanges are numbers, converting if necessary
    ageRanges = ageRanges.map((ageRange) => +ageRange);

    const node = new AgeRangesNode(ageRanges);

    node.validate();

    return node;
  }

  protected constructor(ageRanges: number | number[]) {
    if (!Array.isArray(ageRanges)) ageRanges = [ageRanges];

    super(ageRanges);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.value, 'ageRanges');
    for (const ageRange of this.value) {
      NodeValidator.isNumber(ageRange, 'ageRange');
    }
  }
}

export { AgeRangesNode };
