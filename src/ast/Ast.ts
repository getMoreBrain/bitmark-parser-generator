import { stringUtils } from '../utils/stringUtils';

import { AstNodeTypeType } from './AstNodeType';

export interface AstNode {
  type: AstNodeTypeType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value?: any;
  readonly children?: AstNode[];
}

export interface AstNodeInfo {
  index: number;
  type: AstNodeTypeType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export type WalkCallback = (node: AstNode, route: AstNodeInfo[]) => void;

class Ast {
  createNode(type: AstNodeTypeType): AstNode {
    return {
      type,
    };
  }

  // addNode(parent: AstNode, child: AstNode): AstNode {
  //   if (!parent.children) parent.children = [];

  //   // Remove node if already a child
  //   const i = parent.children.indexOf(child);
  //   if (i >= 0) {
  //     parent.children.splice(i, 1);
  //   }

  //   // Add node as a child
  //   parent.children.push(child);

  //   return child;
  // }

  // removeNode(parent: AstNode, child: AstNode): AstNode {
  //   if (!parent.children) return child;

  //   // Remove node if a child
  //   const i = parent.children.indexOf(child);
  //   if (i >= 0) {
  //     parent.children.splice(i, 1);
  //   }
  //   if (parent.children.length === 0) {
  //     delete parent.children;
  //   }

  //   return child;
  // }

  walk(root: AstNode, enter: WalkCallback, exit?: WalkCallback): void {
    this.walkRecursive(root, enter, exit, [{ index: 0, type: root.type }]);
  }

  routeToString(route: AstNodeInfo[]): string {
    return route.reduce((acc, val, idx) => {
      acc += `${val.index},${val.type}`;
      if (idx < route.length - 1) {
        acc += ' -> ';
      } else {
        if (val.value) {
          const s = stringUtils.firstLine(val.value, 100);
          acc += `(${s})`;
        }
      }
      return acc;
    }, '');
  }

  private walkRecursive(
    node: AstNode,
    enter: WalkCallback,
    exit: WalkCallback | undefined,
    route: AstNodeInfo[],
  ): void {
    // Call the enter callback for the node before walking children
    enter(node, route);

    // Walk child nodes first
    if (node.children) {
      let ci = 0;
      for (const c of node.children) {
        if (c) {
          const r = route.slice();
          r.push({
            type: c.type,
            index: ci,
            value: c.value,
          });
          this.walkRecursive(c, enter, exit, r);
          ci++;
        }
      }
    }

    // Call the exit callback for the node before walking children
    if (exit) exit(node, route);
  }
}

export { Ast };
