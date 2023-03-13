import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { BodyTextNode } from './BodyTextNode';
import { GapNode } from './GapNode';
import { SelectNode } from './SelectNode';

export type BodyNodeTypes = BodyTextNode | GapNode | SelectNode;

type Children = BodyNodeTypes[];

class BodyNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.body;
  bodyParts: BodyNodeTypes[];

  static create(bodyParts: BodyNodeTypes[]): BodyNode {
    const node = new BodyNode(bodyParts);
    node.validate();
    return node;
  }

  protected constructor(bodyParts: BodyNodeTypes[]) {
    super();
    this.bodyParts = bodyParts;
  }

  protected buildChildren(): Children {
    const children = [...this.bodyParts];

    return children;
  }

  protected validate(): void {
    NodeValidator.isArray(this.bodyParts, 'bodyParts');
  }
}

export { BodyNode };
