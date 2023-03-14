import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseBranchNode } from '../BaseBranchNode';

import { ChoiceNode } from './ChoiceNode';

type Children = ChoiceNode[];

class ChoicesNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.choices;
  choiceNodes: ChoiceNode[];

  static create(choiceNodes?: ChoiceNode[]): ChoicesNode | undefined {
    if (!choiceNodes || choiceNodes.length === 0) return undefined;
    const node = new ChoicesNode(choiceNodes);

    node.validate();

    return node;
  }

  protected constructor(choiceNodes: ChoiceNode[]) {
    super();
    this.choiceNodes = choiceNodes;
  }

  protected buildChildren(): Children {
    const children: Children = [...this.choiceNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.choiceNodes, 'choiceNodes');
  }
}

export { ChoicesNode };
