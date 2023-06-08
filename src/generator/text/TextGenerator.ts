import { AstWalkCallbacks, Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { NodeType } from '../../model/ast/NodeType';
import { Bit, Resource, ArticleResource, StillImageFilmResource } from '../../model/ast/Nodes';
import { TextAst } from '../../model/ast/TextNodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';
import { TextFormat } from '../../model/enum/TextFormat';
import { Generator } from '../Generator';

const DEFAULT_OPTIONS: TextOptions = {
  debugGenerationInline: false,
};

/**
 * Text generation options
 */
export interface TextOptions {
  /**
   * [development only]
   * Generate debug information in the output.
   */
  debugGenerationInline?: boolean;
}

/**
 * Generate text from a bitmark text AST
 */
class TextGenerator implements Generator<TextAst, void>, AstWalkCallbacks {
  protected ast = new Ast();
  private options: TextOptions;
  private writer: Writer;

  // State

  // Debug
  private printed = false;

  /**
   * Generate text from a bitmark text AST
   *
   * @param writer - destination for the output
   * @param options - text generation options
   */
  constructor(writer: Writer, options?: TextOptions) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.writer = writer;

    this.enter = this.enter.bind(this);
    this.between = this.between.bind(this);
    this.exit = this.exit.bind(this);
    this.leaf = this.leaf.bind(this);
  }

  /**
   * Generate text from a bitmark text AST
   *
   * @param ast bitmark text AST
   */
  public async generate(ast: TextAst): Promise<void> {
    // Reset the state
    this.resetState();

    // Open the writer
    await this.writer.open();

    // Walk the text AST
    this.walkAndWrite(ast);

    // Close the writer
    await this.writer.close();
  }

  /**
   * Generate text from a bitmark text AST synchronously
   *
   * @param ast bitmark text AST
   */
  public generateSync(ast: TextAst): void {
    // Reset the state
    this.resetState();

    // Open the writer
    this.writer.openSync();

    // Walk the text AST
    this.walkAndWrite(ast);

    // Close the writer
    this.writer.closeSync();
  }

  private resetState(): void {
    this.printed = false;
  }

  private walkAndWrite(ast: TextAst): void {
    // Walk the bitmark AST
    this.ast.walk(ast, this, undefined);

    // Ensure a blank line at end of file
    this.writeLine();
  }

  enter(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    let res: boolean | void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `enter_${node.key}`;

    if (!this.printed) {
      this.printed = true;
    }

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { open: true });

    if (typeof gen[funcName] === 'function') {
      res = gen[funcName](node, parent, route);
    }

    return res;
  }

  between(
    node: NodeInfo,
    left: NodeInfo,
    right: NodeInfo,
    parent: NodeInfo | undefined,
    route: NodeInfo[],
  ): boolean | void {
    let res: boolean | void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `between_${node.key}`;

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { single: true });

    if (typeof gen[funcName] === 'function') {
      res = gen[funcName](node, left, right, parent, route);
    }

    return res;
  }

  exit(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `exit_${node.key}`;

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { close: true });

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }
  }

  leaf(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `leaf_${node.key}`;

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { open: true });

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { close: true });
  }

  //
  // NODE HANDLERS
  //

  // END NODE HANDLERS

  //
  // WRITE FUNCTIONS
  //

  protected writeString(s?: string): void {
    if (s != null) this.write(`${s}`);
  }

  protected writeOPBUL(): void {
    this.write('[•');
  }

  protected writeOPESC(): void {
    this.write('[^');
  }

  protected writeOPRANGLE(): void {
    this.write('[►');
  }

  protected writeOPDANGLE(): void {
    this.write('[▼');
  }

  protected writeOPD(): void {
    this.write('[.');
  }

  protected writeOPU(): void {
    this.write('[_');
  }

  protected writeOPB(): void {
    this.write('[!');
  }

  protected writeOPQ(): void {
    this.write('[?');
  }

  protected writeOPA(): void {
    this.write('[@');
  }

  protected writeOPP(): void {
    this.write('[+');
  }

  protected writeOPM(): void {
    this.write('[-');
  }

  protected writeOPS(): void {
    this.write('[\\');
  }

  protected writeOPR(): void {
    this.write('[*');
  }

  protected writeOPC(): void {
    this.write('[%');
  }

  protected writeOPAMP(): void {
    this.write('[&');
  }

  protected writeOPDOLLAR(): void {
    this.write('[$');
  }

  protected writeOPHASH(): void {
    this.write('[#');
  }

  protected writeOPPRE(): void {
    this.write("['");
  }

  protected writeOPPOST(): void {
    this.write('['); // TODO - not sure what symbol is for postfix
  }

  protected writeOP(): void {
    this.write('[');
  }

  protected writeCL(): void {
    this.write(']');
  }

  protected writeAmpersand(): void {
    this.write('&');
  }

  protected writeColon(): void {
    this.write(':');
  }

  // protected writeDoubleColon(): void {
  //   this.write('::');
  // }

  protected writeHash(): void {
    this.write('#');
  }

  protected writeNL(): void {
    if (this.options.debugGenerationInline) {
      this.write('\\n');
      return;
    }
    this.write('\n');
  }

  protected writeResource(resource: Resource): boolean | void {
    const resourceAsArticle = resource as ArticleResource;

    if (resource) {
      // All resources should now be valid as they are validated in the AST
      // TODO: remove code below

      // // Check if a resource has a value, if not, we should not write it (or any of its chained properties)
      // let valid = false;
      // if (resource.value) {
      //   valid = true;
      // }

      // // Resource is not valid, cancel walking it's tree.
      // if (!valid) return false;

      // Special case for embedded resources
      if (resource.type === ResourceType.stillImageFilm) {
        const r = resource as StillImageFilmResource;
        this.writeResource(r.image);
        this.writeNL();
        this.writeResource(r.audio);
      } else {
        // Standard case
        this.writeOPAMP();
        this.writeString(resource.type);
        if (resource.type === ResourceType.article && resourceAsArticle.value) {
          this.writeColon();
          // this.writeNL();
          this.writeString(resourceAsArticle.value);
          this.writeNL();
        } else if (resource.value) {
          this.writeColon();
          this.writeString(resource.value);
        }
        this.writeCL();
      }
    }
  }

  protected writeProperty(
    name: string,
    values?: unknown | unknown[],
    singleOnly?: boolean,
    ignoreFalse?: boolean,
    ignoreTrue?: boolean,
  ): void {
    let valuesArray: unknown[];
    // let wroteSomething = false;

    if (values !== undefined) {
      if (!Array.isArray(values)) {
        valuesArray = [values];
      } else {
        valuesArray = values;
      }

      if (valuesArray.length > 0) {
        if (singleOnly) valuesArray = valuesArray.slice(valuesArray.length - 1);

        for (const val of valuesArray) {
          if (val !== undefined) {
            if (ignoreFalse && val === false) continue;
            if (ignoreTrue && val === true) continue;
            this.writeOPA();
            this.writeString(name);
            this.writeColon();
            this.writeString(`${val}`);
            this.writeCL();
            // wroteSomething = true;
          }
        }
      }
    }
  }

  protected writeInlineDebug(key: string, state: { open?: boolean; close?: boolean; single?: boolean }) {
    let tag = key;
    if (state.open) {
      tag = `<${key}>`;
    } else if (state.close) {
      tag = `</${key}>`;
    } else if (state.single) {
      tag = `<${key} />`;
    }

    this.writeString(tag);
  }

  protected isWriteTextFormat(bitsValue: string): boolean {
    const isMinusMinus = TextFormat.fromValue(bitsValue) === TextFormat.bitmarkMinusMinus;
    const writeFormat = !isMinusMinus;
    return !!writeFormat;
  }

  protected isStatementDivider(route: NodeInfo[]) {
    const bitType = this.getBitType(route);
    return !(bitType === BitType.trueFalse1);
  }

  protected getBitType(route: NodeInfo[]): BitTypeType | undefined {
    for (const node of route) {
      if (node.key === NodeType.bitsValue) {
        const n = node.value as Bit;
        return n?.bitType;
      }
    }

    return undefined;
  }

  //
  // Writer interface
  //

  /**
   * Writes a string value to the output.
   * @param value - The string value to be written.
   */
  write(value: string): this {
    this.writer.write(value);
    return this;
  }

  /**
   * Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.
   * @param value - The line to write. When omitted, only the endOfLineString is written.
   */
  writeLine(value?: string): this {
    this.writer.writeLine(value);
    return this;
  }

  /**
   * Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.
   * @param values - The lines to write.
   * @param delimiter - An optional delimiter to be written at the end of each line, except for the last one.
   */
  writeLines(values: string[], delimiter?: string): this {
    this.writer.writeLines(values, delimiter);
    return this;
  }

  /**
   * Writes a single whitespace character to the output.
   */
  writeWhiteSpace(): this {
    this.writer.writeWhiteSpace();
    return this;
  }
}

export { TextGenerator };
