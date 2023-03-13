import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class IdsNode extends BaseValueNode<string[]> implements AstNode {
  type = AstNodeType.ids;

  static create(ids?: string | string[]): IdsNode | undefined {
    if (!ids || ids.length === 0) return undefined;
    if (!Array.isArray(ids)) ids = [ids];

    // Ensure Ids are strings, converting if necessary
    ids = ids.map((id) => `${id}`);

    const node = new IdsNode(ids);

    node.validate();

    return node;
  }

  protected constructor(ids: string | string[]) {
    if (!Array.isArray(ids)) ids = [ids];

    super(ids);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.value, 'ids');
    for (const id of this.value) {
      NodeValidator.isNonEmptyString(id, 'id');
    }
  }
}

export { IdsNode };
