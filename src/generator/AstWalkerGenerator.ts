import { Ast, type AstWalkCallbacks, type NodeInfo } from '../ast/Ast.ts';
import { type Generator } from './Generator.ts';

/**
 * Generator that walks bitmark AST.
 *
 * The implementation should implement functions with the correct naming, and these will be called when
 * walking the AST:
 *
 * enter_<nodeKey>() - called when entering a branch node
 * between_<nodeKey>() - called when between child nodes
 * exit_<nodeKey>() - called when exiting a branch node
 * leaf_<nodeKey>() - called when entering a leaf node
 */
abstract class AstWalkerGenerator<AstType, R, Context = undefined>
  implements Generator<AstType, R>, AstWalkCallbacks<Context>
{
  protected ast = new Ast();

  // Debugging
  protected debugGenerationInline = false;
  protected printed = false;

  public abstract generate(ast: AstType, param1?: unknown, param2?: unknown): Promise<R>;

  public abstract generateSync(ast: AstType, param1?: unknown, param2?: unknown): R;

  enter(node: NodeInfo, route: NodeInfo[], context: Context): boolean | void {
    let res: boolean | void = void 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `enter_${node.key}`;

    if (!this.printed) {
      this.printed = true;
    }

    if (this.debugGenerationInline) this.writeInlineDebug(node.key, { open: true });

    if (typeof gen[funcName] === 'function') {
      res = gen[funcName](node, route, context);
    }

    return res;
  }

  between(
    node: NodeInfo,
    left: NodeInfo,
    right: NodeInfo,
    route: NodeInfo[],
    context: Context,
  ): boolean | void {
    let res: boolean | void = void 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `between_${node.key}`;

    if (this.debugGenerationInline) this.writeInlineDebug(node.key, { single: true });

    if (typeof gen[funcName] === 'function') {
      res = gen[funcName](node, left, right, route, context);
    }

    return res;
  }

  exit(node: NodeInfo, route: NodeInfo[], context: Context): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `exit_${node.key}`;

    if (this.debugGenerationInline) this.writeInlineDebug(node.key, { close: true });

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, route, context);
    }
  }

  leaf(node: NodeInfo, route: NodeInfo[], context: Context): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `leaf_${node.key}`;

    if (this.debugGenerationInline) this.writeInlineDebug(node.key, { open: true });

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, route, context);
    }

    if (this.debugGenerationInline) this.writeInlineDebug(node.key, { close: true });
  }

  //
  // HELPER FUNCTIONS
  //

  protected getParentNode(route: NodeInfo[], nodesBack = 1): NodeInfo | undefined {
    // if (route.length > nodesBack + 1) {
    //   return route[route.length - nodesBack - 1];
    // }
    if (route.length > nodesBack) {
      return route[route.length - nodesBack - 1];
    }

    return undefined;
  }
  //
  // WRITER FUNCTIONS
  //

  protected abstract writeInlineDebug(
    key: string,
    state: { open?: boolean; close?: boolean; single?: boolean },
  ): void;
}

export { AstWalkerGenerator };
