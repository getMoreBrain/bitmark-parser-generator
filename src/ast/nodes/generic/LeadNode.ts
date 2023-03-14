import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseValueNode } from '../BaseLeafNode';

class LeadNode extends BaseValueNode<string> implements AstNode {
  type = AstNodeType.lead;

  static create(lead?: string): LeadNode | undefined {
    const node = lead ? new LeadNode(lead) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(lead: string) {
    super(lead);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyString(this.value, 'lead');
  }
}

export { LeadNode };
