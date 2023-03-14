import { AstNode } from '../Ast';

export interface CodeGenerator {
  generate: (root: AstNode) => Promise<void | string>;
}
