import { StringUtils } from '../utils/StringUtils';

import { AstNodeType, AstNodeTypeType } from './AstNodeType';
import { Bitmark, Node } from './nodes/BitmarkNodes';

export interface AstNode {
  type: AstNodeTypeType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value?: any;
  readonly children?: AstNode[];
}

export interface NodeInfo {
  index: number;
  key: AstNodeTypeType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export interface AstWalkCallbacks {
  enter?: (node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]) => void | boolean;
  between?: (
    node: NodeInfo,
    leftNode: NodeInfo,
    rightNode: NodeInfo,
    parent: NodeInfo | undefined,
    route: NodeInfo[],
  ) => void | boolean;
  exit?: (node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]) => void;
  leaf?: (node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]) => void;
}

class Ast {
  walk(bitmark: Bitmark, callbacks: AstWalkCallbacks): void {
    this.walkRecursive(bitmark, undefined, callbacks, [{ index: 0, key: 'bitmark', value: bitmark }]);
  }

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

  routeToString(route: NodeInfo[]): string {
    return route.reduce((acc, val, idx) => {
      // acc += `${val.type}[${val.index}]`;
      acc += `${val.key}`;
      if (idx < route.length - 1) {
        acc += ' -> ';
      } else {
        if (val.value != null) {
          const s = StringUtils.firstLine(`${val.value}`, 100);
          acc += `(${s})`;
        }
      }
      return acc;
    }, '');
  }

  routeToTreeString(route: NodeInfo[]): string {
    let str = '';
    for (let i = 0, len = route.length; i < len; i++) {
      const val = route[i];
      const last = i === route.length - 1;
      const secondToLast = i === route.length - 2;

      if (last) {
        str += `${val.key}[${val.index}]`;
        if (val.value) {
          const s = StringUtils.firstLine(`${val.value}`, 100);
          str += `(${s})`;
        }
      } else if (secondToLast) {
        str += '|__';
      } else {
        str += '   ';
      }
    }

    return str;
  }

  printTree(bitmark: Bitmark): void {
    this.walkRecursive(
      bitmark,
      undefined,
      {
        enter: (_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]) => {
          console.log('Enter:   ' + this.getRouteKey(route));
        },
        between: (
          _node: NodeInfo,
          _left: NodeInfo,
          _right: NodeInfo,
          _parent: NodeInfo | undefined,
          route: NodeInfo[],
        ) => {
          console.log('Between: ' + this.getRouteKey(route));
        },
        exit: (_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]) => {
          console.log('Exit:    ' + this.getRouteKey(route));
        },
        leaf: (_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]) => {
          console.log('Leaf:    ' + this.getRouteKey(route));
        },
      },
      [{ index: 0, key: 'bitmark', value: bitmark }],
    );
  }

  private walkRecursive(
    node: Node,
    parent: NodeInfo | undefined,
    callbacks: AstWalkCallbacks,
    route: NodeInfo[],
  ): void {
    const { enter, between, exit, leaf } = callbacks;

    const parentKey = route[route.length - 1].key;
    const isValue = this.isValue(node);
    const isBranch = !isValue;
    const nodeInfo = route[route.length - 1];

    // Call the enter callback for the node before walking children
    if (isBranch) {
      if (enter) {
        const res = enter(nodeInfo, parent, route);
        // If return is false, stop walking this node
        if (res === false) return;
      }
    } else {
      if (leaf) leaf(nodeInfo, parent, route);
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
          this.walkRecursive(child, nodeInfo, callbacks, r);

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
              const res = between(nodeInfo, childNodeInfo, nextChildNodeInfo, parent, route);
              // If return is false, stop looping children
              if (res === false) break;
            }
          }
        }
      }
    }

    // Call the exit callback for the node before walking children
    if (isBranch) {
      if (exit) exit(nodeInfo, parent, route);
    }
  }

  private getAstKey(key: string, parentKey: string, isParentArray: boolean): AstNodeTypeType {
    let astKey = key;

    if (isParentArray && parentKey) {
      astKey = `${parentKey}Value`;
    }

    // return astKey;
    return AstNodeType.fromKey(astKey) || (`unknown(${astKey})` as AstNodeTypeType);
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

// Singleton
const ast = new Ast();

export { ast as Ast };
