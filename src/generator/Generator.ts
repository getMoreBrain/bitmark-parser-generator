import { BitmarkAst } from '../model/ast/Nodes';

export interface Generator<T> {
  generate: (ast: BitmarkAst) => Promise<T>;
}
