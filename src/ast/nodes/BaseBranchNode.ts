import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { AstNode } from '../Ast';

abstract class BaseBranchNode<T extends AstNode[]> {
  type: AstNodeTypeType = AstNodeType.unknown;

  constructor() {
    //
  }

  protected abstract buildChildren(): T;

  get children(): T {
    return this.buildChildren();
  }

  protected abstract validate(): void;
}

export { BaseBranchNode };
