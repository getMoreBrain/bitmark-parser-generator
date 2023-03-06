import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { AstNode } from '../Ast';

import { BitElementNode } from './BitElementNode';
import { KeyNode } from './KeyNode';
import { ValueNode } from './ValueNode';

class PropertyNode extends BitElementNode implements AstNode {
  type: AstNodeTypeType = AstNodeType.property;
  keyNode: KeyNode;
  valueNode: ValueNode;

  constructor(keyNode: KeyNode, valueNode: ValueNode) {
    super();

    this.keyNode = keyNode;
    this.valueNode = valueNode;
  }

  get children(): AstNode[] {
    const children = [];

    children.push(this.keyNode);
    children.push(this.valueNode);

    return children;
  }
}

export { PropertyNode };
