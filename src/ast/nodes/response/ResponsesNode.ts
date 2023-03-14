import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseBranchNode } from '../BaseBranchNode';

import { ResponseNode } from './ResponseNode';

type Children = ResponseNode[];

class ResponsesNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.responses;
  responseNodes: ResponseNode[];

  static create(responseNodes?: ResponseNode[]): ResponsesNode | undefined {
    if (!responseNodes || responseNodes.length === 0) return undefined;
    const node = new ResponsesNode(responseNodes);

    node.validate();

    return node;
  }

  protected constructor(responseNodes: ResponseNode[]) {
    super();
    this.responseNodes = responseNodes;
  }

  protected buildChildren(): Children {
    const children: Children = [...this.responseNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.responseNodes, 'responseNodes');
  }
}

export { ResponsesNode };
