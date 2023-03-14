import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseBranchNode } from '../BaseBranchNode';

import { SelectOptionNode } from './SelectOptionNode';

type Children = SelectOptionNode[];

class SelectOptionsNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.selectOptions;
  optionNodes: SelectOptionNode[];

  static create(optionNodes: SelectOptionNode[]): SelectOptionsNode | undefined {
    const node = new SelectOptionsNode(optionNodes);

    node.validate();

    return node;
  }

  protected constructor(optionNodes: SelectOptionNode[]) {
    super();
    this.optionNodes = optionNodes;
  }

  protected buildChildren(): Children {
    const children: Children = [...this.optionNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.optionNodes, 'optionNodes');
  }
}

export { SelectOptionsNode };
