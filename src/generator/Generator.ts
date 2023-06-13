import { Node } from '../model/ast/Nodes';

export interface Generator<T extends Node, R = void> {
  generate: (ast: T) => Promise<R>;

  generateSync: (ast: T) => R;
}
