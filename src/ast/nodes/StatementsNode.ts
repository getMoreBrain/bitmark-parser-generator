import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { StatementNode } from './StatementNode';

type Children = StatementNode[];

class StatementsNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.statements;
  statementNodes: StatementNode[];

  static create(statementNodes?: StatementNode[]): StatementsNode | undefined {
    if (!statementNodes || statementNodes.length === 0) return undefined;
    const node = new StatementsNode(statementNodes);

    node.validate();

    return node;
  }

  protected constructor(statementNodes: StatementNode[]) {
    super();
    this.statementNodes = statementNodes;
  }

  protected buildChildren(): Children {
    const children: Children = [...this.statementNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.statementNodes, 'statementNodes');
  }
}

export { StatementsNode };
