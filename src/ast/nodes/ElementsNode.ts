import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { ElementNode } from './ElementNode';

type Children = ElementNode[];

class ElementsNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.elements;
  elementNodes: ElementNode[];

  static create(elements?: string[]): ElementsNode | undefined {
    if (!elements || elements.length === 0) return undefined;
    const elementNodes: ElementNode[] = [];

    for (const el of elements) {
      if (el) {
        const elementNode = ElementNode.create(el);
        if (elementNode) {
          elementNodes.push(elementNode);
        }
      }
    }

    const node = new ElementsNode(elementNodes);

    node.validate();

    return node;
  }

  protected constructor(elementNodes: ElementNode[]) {
    super();
    this.elementNodes = elementNodes;
  }

  protected buildChildren(): Children {
    const children = [...this.elementNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.elementNodes, 'elementNodes');
  }
}

export { ElementsNode };
