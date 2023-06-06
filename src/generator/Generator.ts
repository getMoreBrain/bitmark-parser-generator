import { Node } from '../model/ast/Nodes';

export interface Generator<T extends Node, R> {
  generate: (ast: T) => Promise<R>;
}
