import { AstWalkCallbacks, Ast, NodeInfo } from '../../ast/Ast';
import { NodeType } from '../../model/ast/NodeType';
import { Bit } from '../../model/ast/Nodes';
import { ImageTextNode, TaskItemTextNode, TextAst, TextNode } from '../../model/ast/TextNodes';
import { BitTypeType } from '../../model/enum/BitType';
import { TextMarkType } from '../../model/enum/TextMarkType';
import { TextNodeType } from '../../model/enum/TextNodeType';
import { BodyBitJson, BodyBitsJson } from '../../model/json/BodyBitJson';
import { Generator } from '../Generator';

const DEFAULT_OPTIONS: TextOptions = {
  debugGenerationInline: false,
};

// Regex explanation:
// - Match a single character of a text mark and capture in group 1
// - check that the character BEFORE is NOT the same mark (look-behind)
// - check that the character AFTER IS the same mark
// - check that the character AFTER that is NOT the same mark (look-ahead)
// This will capture all double marks, and ignore single or more than double marks
const BREAKSCAPE_REGEX = new RegExp('([*_`!])(?<!\\1\\1)\\1(?!\\1)', 'g');

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
class TextGenerator implements Generator<TextAst, string>, AstWalkCallbacks {
  protected ast = new Ast();
  private options: TextOptions;

  // State
  private writerText = '';
  private currentIndent = 0;
  private placeholderIndex = 0;
  private placeholders: BodyBitsJson = {};

  // Debug
  private printed = false;

  /**
   * Generate text from a bitmark text AST
   *
   * @param writer - destination for the output
   * @param options - text generation options
   */
  constructor(options?: TextOptions) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

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
  public async generate(ast: TextAst): Promise<string> {
    // Reset the state
    this.resetState();

    // Walk the text AST
    this.walkAndWrite(ast);

    return this.writerText;
  }

  /**
   * Generate text from a bitmark text AST synchronously
   *
   * @param ast bitmark text AST
   */
  public generateSync(ast: TextAst): string {
    // Reset the state
    this.resetState();

    // Walk the text AST
    this.walkAndWrite(ast);

    return this.writerText;
  }

  public getPlaceholders(): BodyBitsJson {
    return this.placeholders;
  }

  private resetState(): void {
    this.printed = false;

    this.writerText = '';
    this.currentIndent = 0;
    this.placeholderIndex = 0;
    this.placeholders = {};
  }

  private walkAndWrite(ast: TextAst): void {
    // Walk the bitmark AST
    this.ast.walk(ast, NodeType.textAst, this, undefined);
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

  // * -> textAstValue

  protected enter_textAstValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.handleEnterNode(node.value);
  }

  protected between_textAstValue(
    node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.handleBetweenNode(node.value);
  }

  protected exit_textAstValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.handleExitNode(node.value);
  }

  // * -> contentValue

  protected enter_contentValueValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.handleEnterNode(node.value);
  }

  protected between_contentValueValue(
    node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.handleBetweenNode(node.value);
  }

  protected exit_contentValueValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.handleExitNode(node.value);
  }

  // END NODE HANDLERS

  protected handleEnterNode(node: TextNode): void {
    this.handleIndent(node);

    switch (node.type) {
      case TextNodeType.text:
        this.writeMarks(node, true);
        this.writeText(node);
        break;

      case TextNodeType.listItem:
      case TextNodeType.taskItem:
        this.writeBullet(node);
        break;

      case TextNodeType.image:
        this.writeImage(node as ImageTextNode);
        break;

      case TextNodeType.gap:
      case TextNodeType.select:
      case TextNodeType.highlight:
        this.writeBodyBit(node);
        break;
      default:
      // Ignore unknown type
    }
  }

  protected handleBetweenNode(node: TextNode): void {
    switch (node.type) {
      default:
      // Ignore unknown type
    }
  }

  protected handleExitNode(node: TextNode): void {
    switch (node.type) {
      case TextNodeType.text:
        this.writeMarks(node, false);
        break;

      case TextNodeType.paragraph:
      case TextNodeType.image:
        // Block type nodes, write a newline
        this.writeNL();
        break;

      case TextNodeType.bulletList:
      case TextNodeType.orderedList:
      case TextNodeType.taskList:
        // List Block type nodes, write a newline only if there is no indent
        if (this.currentIndent <= 1) this.writeNL();
        break;

      default:
      // Ignore unknown type
    }

    this.handleDedent(node);
  }

  protected handleIndent(node: TextNode) {
    switch (node.type) {
      case TextNodeType.bulletList:
      case TextNodeType.orderedList:
      case TextNodeType.taskList:
        this.currentIndent++;
        break;

      default:
      // Ignore unknown type
    }
  }

  protected handleDedent(node: TextNode) {
    switch (node.type) {
      case TextNodeType.bulletList:
      case TextNodeType.orderedList:
      case TextNodeType.taskList:
        this.currentIndent--;
        break;

      default:
      // Ignore unknown type
    }
  }

  //
  // WRITE FUNCTIONS
  //

  protected writeBodyBit(node: TextNode) {
    // Write placeholder to the text
    const placeholder = `[!${this.placeholderIndex}]`;
    this.writerText += placeholder;

    this.placeholders[placeholder] = node as unknown as BodyBitJson;

    this.placeholderIndex++;
  }

  protected writeText(node: TextNode): void {
    if (node.text == null) return;

    // Breakscape the text
    const s = node.text.replace(BREAKSCAPE_REGEX, '$1^$1');

    // Write the text
    this.write(s);
  }

  protected writeMarks(node: TextNode, _enter: boolean): void {
    if (node.marks) {
      for (const mark of node.marks) {
        switch (mark.type) {
          case TextMarkType.bold:
            this.writeBoldTag();
            break;
          case TextMarkType.light:
            this.writeLightTag();
            break;
          case TextMarkType.italic:
            this.writeItalicTag();
            break;
          case TextMarkType.highlight:
            this.writeHighlight();
            break;
          default:
          // Do nothing
        }
      }
    }
  }

  protected writeBullet(node: TextNode) {
    let bullet = '';

    // Add indentation
    for (let i = 1; i < this.currentIndent; i++) bullet += '\t';
    // for (let i = 1; i < this.currentIndent; i++) bullet += '_';

    // Add bullet
    if (node.parent === TextNodeType.bulletList) {
      bullet += '• ';
    } else if (node.parent === TextNodeType.orderedList) {
      bullet += '•1 ';
    } else if (node.parent === TextNodeType.taskList) {
      const taskList = node as TaskItemTextNode;
      const checked = taskList.attrs?.checked ?? false;
      bullet += checked ? '•+ ' : '•- ';
    }
    if (bullet) this.writeString(bullet);
  }

  protected writeImage(node: ImageTextNode): void {
    if (node.attrs == null || !node.attrs.src) return;
    const attrs = node.attrs;

    let s = `|image:${attrs.src}|`;

    // Loop and write the attributes
    for (const [k, v] of Object.entries(attrs)) {
      switch (k) {
        case 'textAlign':
          if (v !== 'left') s += `|captionAlign:${v}|`;
          break;
        case 'title':
          if (v) s += `|caption:${v}|`;
          break;
        case 'class':
          if (v !== 'center') if (v) s += `|align:${v}|`;
          break;
        case 'alt':
        case 'width':
        case 'height':
          if (v) s += `|${k}:${v}|`;
          break;
      }
    }

    // Write the text
    this.writeString(s);
  }

  protected writeString(s?: string): void {
    if (s != null) this.write(`${s}`);
  }

  protected writeBoldTag(): void {
    this.write('**');
  }

  protected writeLightTag(): void {
    this.write('``');
  }

  protected writeItalicTag(): void {
    this.write('__');
  }

  protected writeHighlight(): void {
    this.write('!!');
  }

  protected writeNL(): void {
    if (this.options.debugGenerationInline) {
      this.write('\\n');
      return;
    }
    this.write('\n');
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
    this.writerText += value;
    return this;
  }

  /**
   * Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.
   * @param value - The line to write. When omitted, only the endOfLineString is written.
   */
  writeLine(value?: string): this {
    this.writerText += `${value}\n`;
    return this;
  }

  /**
   * Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.
   * @param values - The lines to write.
   * @param delimiter - An optional delimiter to be written at the end of each line, except for the last one.
   */
  writeLines(values: string[], delimiter?: string): this {
    for (const value of values) {
      this.writerText += `${value}${delimiter ?? ''}\n`;
    }
    return this;
  }

  /**
   * Writes a single whitespace character to the output.
   */
  writeWhiteSpace(): this {
    this.writerText += ' ';
    return this;
  }
}

export { TextGenerator };
