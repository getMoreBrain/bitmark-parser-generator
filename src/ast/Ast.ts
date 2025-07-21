import { init } from '../init/init.ts';
import { type BitmarkAst, type Node } from '../model/ast/Nodes.ts';
import { NodeType, type NodeTypeType } from '../model/ast/NodeType.ts';
import { StringUtils } from '../utils/StringUtils.ts';

/**
 * AST tree node information
 */
export interface NodeInfo {
  /**
   * Child index of the node
   */
  index: number;
  /**
   * Node key
   */
  key: NodeTypeType;
  /**
   * Node value (if any)
   */
  value?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Callbacks for walking the AST
 */
export interface AstWalkCallbacks<C = undefined> {
  /**
   * Called when a branch node is entered
   *
   * @param node - this node info
   * @param route - route to this node from the root
   * @returns
   */
  enter?: (node: NodeInfo, route: NodeInfo[], context: C) => void | boolean;

  /**
   * Called when between child nodes
   *
   * @param node - this node info (the parent of the children in leftNode / rightNode)
   * @param leftNode - the left (previous) child node info
   * @param rightNode - the right (next) child node info
   * @param route
   * @returns
   */
  between?: (
    node: NodeInfo,
    leftNode: NodeInfo,
    rightNode: NodeInfo,
    route: NodeInfo[],
    context: C,
  ) => void | boolean;

  /**
   * Called when a branch node is exited
   * @param node - this node info
   * @param route - route to this node from the root
   * @returns
   */
  exit?: (node: NodeInfo, route: NodeInfo[], context: C) => void;

  /**
   * Called when a leaf node is entered
   * @param node - this node info
   * @param route - route to this node from the root
   * @returns
   */
  leaf?: (node: NodeInfo, route: NodeInfo[], context: C) => void;
}

/**
 * An AST (Abstract Syntax Tree) implementation for the bitmark language
 */
class Ast {
  constructor() {
    // Ensure init has been called - this is not the best place, but there is no standard entry point
    init();
  }

  /**
   * Walk bitmark AST, decending each branch and calling callbacks when entering, leaving, and when in between child
   * nodes.
   *
   * Walking the tree can be used to convert it to another format (e.g. bitmark markup or JSON or text) or for analysis.
   *
   * The tree is navigated from root to leaf, decending each branch greedily.
   *
   * e.g. for the tree:
   * ```
   * A
   * |__B1
   * |  |__C1
   * |  |__C2
   * |__B2
   *    |__C3
   *
   * Enter A1
   * Enter B1
   * Leaf  C1
   * Betwe B1 (C1, C2)
   * Leaf  C2
   * Exit  B1
   * Betwe A1 (B1, B2)
   * Enter B2
   * Leaf  C3
   * Exit  B2
   * Exit  A1
   * ```
   *
   * @param context - context object to pass to callbacks
   * @param ast - bitmark / text AST
   * @param type - type of AST to walk (i.e. NodeType.bitmarkAst, NodeType.textAst)
   * @param callbacks - set of callbacks to call while walking the tree
   */
  walk<C>(ast: Node, type: NodeTypeType, callbacks: AstWalkCallbacks<C>, context: C): void {
    this.walkRecursive(ast, [{ index: 0, key: type, value: ast }], callbacks, context);
  }

  /**
   * Convert a route to a unique key that describes that route.
   *
   * For the route A1 -> B4 -> C2 the route key would be A1_B4_C2
   *
   * @param route - the tree path from the root to the curent node
   * @returns
   */
  getRouteKey(route: NodeInfo[]): string {
    return route.reduce((acc, val, idx) => {
      if (+val.key !== val.index) {
        acc += `${val.key}`;
        if (idx < route.length - 1) {
          acc += '_';
        }
      }
      return acc;
    }, '');
  }

  /**
   * Print an AST to the console.
   * Useful for debug / development purposes
   *
   * @param ast - AST
   * @param rootKey - root node key
   */
  printTree(ast: Node, rootKey: NodeTypeType = NodeType.bitmarkAst): void {
    this.walkRecursive(
      ast,
      [{ index: 0, key: rootKey, value: ast }],
      {
        enter: (_node: NodeInfo, route: NodeInfo[]): boolean => {
          console.log('Enter:   ' + this.getRouteKey(route));

          // Stop traversing the tree if the last node is bodyJson
          if (route[route.length - 1].key === NodeType.bodyJson) return false;

          return true;
        },
        between: (_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]) => {
          console.log('Between: ' + this.getRouteKey(route));
        },
        exit: (_node: NodeInfo, route: NodeInfo[]) => {
          console.log('Exit:    ' + this.getRouteKey(route));
        },
        leaf: (_node: NodeInfo, route: NodeInfo[]) => {
          console.log('Leaf:    ' + this.getRouteKey(route));
        },
      },
      undefined,
    );
  }

  /**
   * Preprocess bitmark AST into a standard format (BitmarkAst object) from bitmark AST either as a string
   * or a plain JS object
   *
   * @param ast - bitmark AST as a string or a plain JS object
   * @returns bitmark AST in a standard format (BitmarkAst object)
   */
  preprocessAst(ast: string | unknown): BitmarkAst | undefined {
    if (StringUtils.isString(ast)) {
      const str = ast as string;
      try {
        ast = JSON.parse(str);
      } catch (_e) {
        // Failed to parse JSON, return empty array
        return undefined;
      }
    }

    if (this.isAst(ast)) {
      return ast as BitmarkAst;
    }
    return undefined;
  }

  /**
   * Check if a plain JS object is valid AST
   *
   * @param ast - a plain JS object that might be AST
   * @returns true if AST, otherwise false
   */
  isAst(ast: unknown): boolean {
    if (Object.prototype.hasOwnProperty.call(ast, 'bits')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (Array.isArray((ast as any).bits)) return true;
    }
    return false;
  }

  private walkRecursive<C>(
    node: Node,
    route: NodeInfo[],
    callbacks: AstWalkCallbacks<C>,
    context: C,
  ): void {
    const { enter, between, exit, leaf } = callbacks;

    const parentKey = route[route.length - 1].key;
    const isValue = this.isValue(node);
    const isBranch = !isValue;
    const nodeInfo = route[route.length - 1];

    // Call the enter callback for the node before walking children
    if (isBranch) {
      if (enter) {
        const res = enter(nodeInfo, route, context);
        // If return is false, stop walking this node
        if (res === false) return;
      }
    } else {
      if (leaf) leaf(nodeInfo, route, context);
    }

    // Walk child nodes
    if (isBranch) {
      const isArray = this.isArray(node);
      const keys = Object.keys(node);
      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];
        const lastChild = i === len - 1;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nodeAsAny = node as any;
        const child = nodeAsAny[key];

        if (child != null) {
          const childNodeInfo: NodeInfo = {
            key: this.getAstKey(key, parentKey, isArray),
            index: i,
            value: child,
          };

          const r = route.slice();
          r.push(childNodeInfo);
          this.walkRecursive(child, r, callbacks, context);

          if (!lastChild) {
            const nextKey = keys[i + 1];
            const nextChild = nodeAsAny[nextKey];
            const nextChildNodeInfo: NodeInfo = {
              key: this.getAstKey(nextKey, parentKey, isArray),
              index: i + 1,
              value: nextChild,
            };

            // Call the between callback when between children
            if (between) {
              const res = between(nodeInfo, childNodeInfo, nextChildNodeInfo, route, context);
              // If return is false, stop looping children
              if (res === false) break;
            }
          }
        }
      }
    }

    // Call the exit callback for the node before walking children
    if (isBranch) {
      if (exit) exit(nodeInfo, route, context);
    }
  }

  private getAstKey(key: string, parentKey: string, isParentArray: boolean): NodeTypeType {
    let astKey = key;

    if (isParentArray && parentKey) {
      astKey = `${parentKey}Value`;
    }

    // return astKey;
    return NodeType.fromKey(astKey) || (`unknown(${astKey})` as NodeTypeType);
    // return AstNodeType.fromKey(astKey) || AstNodeType.unknown;
  }

  private isArray(x: unknown): boolean {
    return Array.isArray(x);
    // return Object.prototype.toString.call(x) === '[object Array]';
  }

  private isObject(x: unknown): boolean {
    return Object.prototype.toString.call(x) === '[object Object]';
  }

  private isValue(x: unknown): boolean {
    return !this.isObject(x) && !this.isArray(x);
  }
}

export { Ast };
