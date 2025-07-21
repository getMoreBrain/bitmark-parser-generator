import { type Node } from '../model/ast/Nodes.ts';

export interface Generator<T extends Node, R = void> {
  generate: (ast: T, param1?: unknown, param2?: unknown) => Promise<R>;

  generateSync: (ast: T, param1?: unknown, param2?: unknown) => R;
}
