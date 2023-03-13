import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { ItemNode } from './ItemNode';
import { LeadNode } from './LeadNode';

type Children = (ItemNode | LeadNode)[];

class ItemLeadNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.itemLead;
  itemNode: ItemNode;
  leadNode?: LeadNode;

  static create(item?: string, lead?: string): ItemLeadNode | undefined {
    if (!item && !lead) return undefined;

    const itemNode = ItemNode.create(item || '');
    const leadNode = LeadNode.create(lead);

    const node = new ItemLeadNode(itemNode, leadNode);

    node.validate();

    return node;
  }

  protected constructor(itemNode: ItemNode, leadNode?: LeadNode) {
    super();
    this.itemNode = itemNode;
    this.leadNode = leadNode;
  }

  protected buildChildren(): Children {
    const children: Children = [this.itemNode];

    if (this.leadNode) children.push(this.leadNode);

    return children;
  }

  protected validate(): void {
    // Check
    NodeValidator.isRequired(this.itemNode, 'itemNode');
  }
}

export { ItemLeadNode };
