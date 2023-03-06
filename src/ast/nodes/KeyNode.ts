import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';

class KeyNode implements AstNode {
  type = AstNodeType.key;
  key: string;

  constructor(key: string) {
    this.type = AstNodeType.key;
    this.key = key;
  }

  get value(): string | undefined {
    return this.key;
  }
}

export { KeyNode };
