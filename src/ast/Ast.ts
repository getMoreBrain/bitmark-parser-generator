import { AstNodeTypeType } from './AstNodeType';
import { stringUtils } from './tools/StringUtils';

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

export interface AstWalkCallbacks {
  enter?: (node: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) => void;
  between?: (
    node: AstNode,
    leftNode: AstNode,
    rightNode: AstNode,
    parent: AstNode | undefined,
    route: AstNodeInfo[],
  ) => void;
  exit?: (node: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) => void;
}

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

  walk(root: AstNode, callbacks: AstWalkCallbacks): void {
    this.walkRecursive(root, undefined, callbacks, [{ index: 0, type: root.type }]);
  }

  routeToString(route: AstNodeInfo[]): string {
    return route.reduce((acc, val, idx) => {
      acc += `${val.index},${val.type}`;
      if (idx < route.length - 1) {
        acc += ' -> ';
      } else {
        if (val.value) {
          const s = stringUtils.firstLine(`${val.value}`, 100);
          acc += `(${s})`;
        }
      }
      return acc;
    }, '');
  }

  routeToTreeString(route: AstNodeInfo[]): string {
    let str = '';
    for (let i = 0, len = route.length; i < len; i++) {
      const val = route[i];
      const last = i === route.length - 1;
      const secondToLast = i === route.length - 2;

      if (last) {
        str += `${val.type}[${val.index}]`;
        if (val.value) {
          const s = stringUtils.firstLine(`${val.value}`, 100);
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

  private walkRecursive(
    node: AstNode,
    parent: AstNode | undefined,
    callbacks: AstWalkCallbacks,
    route: AstNodeInfo[],
  ): void {
    const { enter, between, exit } = callbacks;

    // Call the enter callback for the node before walking children
    if (enter) enter(node, parent, route);

    // Walk child nodes first
    if (node.children) {
      for (let i = 0, len = node.children.length; i < len; i++) {
        const lastChild = i === len - 1;
        const child = node.children[i];

        if (child) {
          const r = route.slice();
          r.push({
            type: child.type,
            index: i,
            value: child.value,
          });
          this.walkRecursive(child, node, callbacks, r);

          if (!lastChild) {
            const nextChild = node.children[i + 1];
            // Call the between callback when between children
            if (between) between(node, child, nextChild, parent, route);
          }
        }
      }
    }

    // Call the exit callback for the node before walking children
    if (exit) exit(node, parent, route);
  }
}

export { Ast };
