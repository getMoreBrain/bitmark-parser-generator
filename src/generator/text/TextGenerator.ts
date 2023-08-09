import { AstWalkCallbacks, Ast, NodeInfo } from '../../ast/Ast';
import { NodeType } from '../../model/ast/NodeType';
import { Bit } from '../../model/ast/Nodes';
import { BitType } from '../../model/enum/BitType';
import { BitmarkVersion, BitmarkVersionType, DEFAULT_BITMARK_VERSION } from '../../model/enum/BitmarkVersion';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { TextMarkType } from '../../model/enum/TextMarkType';
import { TextNodeType } from '../../model/enum/TextNodeType';
import { BodyBitJson, BodyBitsJson } from '../../model/json/BodyBitJson';

import {
  CodeBlockTextNode,
  CommentMark,
  HeadingTextNode,
  ImageTextNode,
  LinkMark,
  SectionTextNode,
  TaskItemTextNode,
  TextAst,
  TextMark,
  TextNode,
} from '../../model/ast/TextNodes';

const DEFAULT_OPTIONS: TextOptions = {
  debugGenerationInline: false,
};

const BOLD_HALF_MARK = '*';
const LIGHT_HALF_MARK = '`';
const ITALIC_HALF_MARK = '_';
const HIGHLIGHT_HALF_MARK = '!';

const BOLD_MARK = BOLD_HALF_MARK + BOLD_HALF_MARK;
const LIGHT_MARK = LIGHT_HALF_MARK + LIGHT_HALF_MARK;
const ITALIC_MARK = ITALIC_HALF_MARK + ITALIC_HALF_MARK;
const HIGHLIGHT_MARK = HIGHLIGHT_HALF_MARK + HIGHLIGHT_HALF_MARK;

// const ALL_HALF_MARKS = [BOLD_HALF_MARK, LIGHT_HALF_MARK, ITALIC_HALF_MARK, HIGHLIGHT_HALF_MARK];

const HEADING_TAG = '#';

const STANDARD_MARKS: { [key: string]: string } = {
  [TextMarkType.bold]: BOLD_MARK,
  [TextMarkType.light]: LIGHT_MARK,
  [TextMarkType.italic]: ITALIC_MARK,
  [TextMarkType.highlight]: HIGHLIGHT_MARK,
};

// Regex explanation:
// - match a single character of a text mark = * ` ! ! and capture in group 1
// - match zero or more ^ characters and capture in group 2
// - match the same character as group 1
// - match a single | or [ and capture in group 3
// This will capture all double marks, escaped double marks, and [ or |
// Replace with group 1 (half mark), ^, group 2 (captured ^s), group 1 (half mark)
// Or if captured [ or |, it will be replaced with [^ or [^
const BREAKSCAPE_REGEX = new RegExp('([=*_`!])([\\^]*)\\1|([\\|\\[])', 'g');
const BREAKSCAPE_REGEX_REPLACER = '$1$3^$2$1';

// Regex explanation:
// - match a single | or • or # character at the start of a line and capture in group 1
// This will capture all new block characters within the code text.
// Replace with group 1, ^
const BREAKSCAPE_CODE_REGEX = new RegExp('^(\\||•|#)', 'gm');
const BREAKSCAPE_CODE_REGEX_REPLACER = '$1^';

// Regex explanation:
// - Match newline or carriage return + newline
const INDENTATION_REGEX = new RegExp(/(\n|\r\n)/, 'g');

const LINK_REGEX = new RegExp(/https?:\/\/|mailto:(.*)/, 'g');

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
class TextGenerator implements AstWalkCallbacks {
  protected ast = new Ast();
  private bitmarkVersion: BitmarkVersionType;
  private options: TextOptions;

  // State
  private textFormat: string = TextFormat.bitmarkMinusMinus;
  private writerText = '';
  private currentIndent = 0;
  private prevIndent = 0;
  private indentationStringCache = '';
  private inCodeBlock = false;
  private exitedCodeBlock = false;
  private placeholderIndex = 0;
  private placeholders: BodyBitsJson = {};

  // Debug
  private printed = false;

  /**
   * Generate text from a bitmark text AST
   *
   * @param bitmarkVersion - bitmark version, use null to use latest version
   * @param options - text generation options
   */
  constructor(bitmarkVersion?: BitmarkVersionType, options?: TextOptions) {
    this.bitmarkVersion = BitmarkVersion.fromValue(bitmarkVersion) ?? DEFAULT_BITMARK_VERSION;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    // Set defaults according to bitmark version
    if (this.bitmarkVersion === BitmarkVersion.v2) {
      //
    } else {
      //
    }

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
  public async generate(ast: TextAst, textFormat?: TextFormatType): Promise<string> {
    // Reset the state
    this.resetState(textFormat);

    // Walk the text AST
    this.walkAndWrite(ast);

    return this.writerText;
  }

  /**
   * Generate text from a bitmark text AST synchronously
   *
   * @param ast bitmark text AST
   */
  public generateSync(ast: TextAst, textFormat?: TextFormatType): string {
    // Reset the state
    this.resetState(textFormat);

    // Walk the text AST
    this.walkAndWrite(ast);

    return this.writerText;
  }

  public getPlaceholders(): BodyBitsJson {
    return this.placeholders;
  }

  private resetState(textFormat?: TextFormatType): void {
    this.printed = false;

    this.textFormat = textFormat ?? TextFormat.bitmarkMinusMinus;
    this.writerText = '';
    this.currentIndent = 0;
    this.prevIndent = 0;
    this.indentationStringCache = '';
    this.inCodeBlock = false;
    this.exitedCodeBlock = false;
    this.placeholderIndex = 0;
    this.placeholders = {};
  }

  private walkAndWrite(ast: TextAst): void {
    // Walk the bitmark AST
    this.ast.walk(ast, NodeType.textAst, this, undefined);
  }

  enter(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    let res: boolean | void = void 0;
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
    let res: boolean | void = void 0;
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
      case TextNodeType.paragraph:
        this.writeParagraph(node);
        break;

      case TextNodeType.hardBreak:
        this.writeHardBreak(node);
        break;

      case TextNodeType.text:
        this.writeMarks(node, true);
        this.writeText(node);
        break;

      case TextNodeType.heading:
        this.writeHeading(node as HeadingTextNode);
        break;

      case TextNodeType.section:
        this.writeSection(node as SectionTextNode);
        break;

      case TextNodeType.listItem:
      case TextNodeType.taskItem:
        this.writeBullet(node);
        break;

      case TextNodeType.image:
        this.writeImage(node as ImageTextNode);
        break;

      case TextNodeType.codeBlock:
        this.inCodeBlock = true;
        this.writeCodeBlock(node as CodeBlockTextNode);
        break;

      case TextNodeType.gap:
      case TextNodeType.select:
      case TextNodeType.highlight:
        this.writeBodyBit(node);
        break;
      default:
      // Ignore unknown type
    }

    // Clear exited flags
    this.exitedCodeBlock = false;
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
        if (this.textFormat !== TextFormat.bitmarkMinusMinus) {
          // Paragraph Block type node, write 1x newline
          // Except:
          // - for bitmark-- where we don't write newlines for the single wrapping block
          this.writeNL();
        }
        break;

      case TextNodeType.heading:
      case TextNodeType.section:
      case TextNodeType.image:
        // Block type nodes, write 2x newline
        this.writeNL();
        this.writeNL();
        break;

      case TextNodeType.codeBlock:
        // CodeBlock type node, write 2x newline
        this.writeNL();
        this.writeNL();
        this.inCodeBlock = false;
        this.exitedCodeBlock = true;
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

  /**
   * Check if a text node has a link mark, and if so, return the href
   *
   * @param node the node to check for a link mark
   * @returns the href, or false if no link mark
   */
  protected getLinkHref(node: TextNode): string | false {
    if (node.type === TextNodeType.text && node.marks) {
      const href = node.marks.reduce((acc, mark) => {
        if (mark.type === TextMarkType.link) {
          const linkMark = mark as LinkMark;
          const href = linkMark.attrs?.href;
          if (href) return href;
        }
        return acc;
      }, '');

      if (href) return href;
    }

    return false;
  }

  /**
   * Get the current indentation string
   * @returns
   */
  protected getIndentationString(): string {
    // Return the cached indent if indent hasn't changed
    if (this.currentIndent === this.prevIndent) return this.indentationStringCache;

    let s = '';
    for (let i = 1; i < this.currentIndent; i++) s += '\t';
    // for (let i = 1; i < this.currentIndent; i++) s += '_';

    this.indentationStringCache = s;
    this.prevIndent = this.currentIndent;

    return s;
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

    // Handle link - if it is a link, will return true and write the link
    if (this.writeLink(node)) return;

    // Handle normal text
    const codeBreakscaping = this.inCodeBlock;

    // Breakscape the text
    let s: string = node.text;
    if (!codeBreakscaping) {
      s = s.replace(BREAKSCAPE_REGEX, BREAKSCAPE_REGEX_REPLACER);
    } else {
      s = s.replace(BREAKSCAPE_CODE_REGEX, BREAKSCAPE_CODE_REGEX_REPLACER);
    }

    // Apply any required indentation
    if (this.currentIndent > 1) {
      const indentationString = this.getIndentationString();
      s = s.replace(INDENTATION_REGEX, `$1${indentationString}`);
    }

    // Write the text
    this.write(s);
  }

  protected writeLink(node: TextNode): boolean {
    if (node.text == null) return false;

    const href = this.getLinkHref(node);
    if (href) {
      // Breakscape the text
      let s = node.text.replace(BREAKSCAPE_REGEX, BREAKSCAPE_REGEX_REPLACER);

      // Apply any required indentation
      if (this.currentIndent > 1) {
        const indentationString = this.getIndentationString();
        s = s.replace(INDENTATION_REGEX, `$1${indentationString}`);
      }

      // The node is a link.
      // Get the text part of the link
      const hrefText = href.replace(LINK_REGEX, '$1');
      if (hrefText === s) {
        // Write the link instead of the text
        this.write(href);
      } else {
        // Write as an inline mark
        s = `==${s}==|link:${href}|`;
        this.write(s);
      }

      return true;
    }

    return false;
  }

  protected writeMarks(node: TextNode, enter: boolean): void {
    if (node.marks) {
      for (const mark of node.marks) {
        switch (mark.type) {
          case TextMarkType.bold:
          case TextMarkType.light:
          case TextMarkType.italic:
          case TextMarkType.highlight:
            this.writeStandardMark(mark);
            break;
          case TextMarkType.strike:
          case TextMarkType.sub:
          case TextMarkType.super:
          case TextMarkType.ins:
          case TextMarkType.del:
          case TextMarkType.var:
          case TextMarkType.code:
          case TextMarkType.color:
            this.writeInlineMark(mark, enter);
            break;

          case TextMarkType.comment: {
            this.writeCommentMark(mark as CommentMark, enter);
            break;
          }
          case TextMarkType.link:
          default:
          // Do nothing (link is handled in writeText)
        }
      }
    }
  }

  protected writeParagraph(_node: TextNode): void {
    if (this.exitedCodeBlock) {
      this.write('|');
      this.writeNL();
      this.writeNL();
    }
  }

  protected writeHardBreak(_node: TextNode): void {
    this.writeNL();

    // Apply any required indentation (when in list)
    if (this.currentIndent > 1) {
      const indentationString = this.getIndentationString();
      this.write(indentationString);
    }
  }

  protected writeHeading(node: HeadingTextNode): void {
    let s = '';
    const level = node.attrs?.level ?? 1;
    for (let i = 0; i < +level; i++) s += HEADING_TAG;

    s += ' ';

    // Write the heading tag
    this.write(s);
  }

  protected writeSection(node: SectionTextNode): void {
    let s = '';
    if (node.section) {
      s = `|${node.section}: `;
    } else {
      s = '|';
    }

    // Write the section tag
    this.write(s);
  }

  protected writeBullet(node: TextNode) {
    // Add indentation
    let bullet = this.getIndentationString();

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
    if (bullet) this.write(bullet);
  }

  protected writeImage(node: ImageTextNode): void {
    if (node.attrs == null || !node.attrs.src) return;
    const attrs = node.attrs;

    let s = `|image:${attrs.src}|`;

    // Loop and write the attributes
    for (const [k, v] of Object.entries(attrs)) {
      switch (k) {
        case 'textAlign':
          if (v !== 'left') s += `@captionAlign:${v}|`;
          break;
        case 'title':
          if (v) s += `@caption:${v}|`;
          break;
        case 'class':
          if (v !== 'center') if (v) s += `@align:${v}|`;
          break;
        case 'comment':
          if (v) s += `#${v}|`;
          break;
        case 'alt':
        case 'width':
        case 'height':
        default:
          if (v) s += `@${k}:${v}|`;
          break;
        case 'src':
          // Ignore, written above
          break;
      }
    }

    // Write the text
    this.write(s);
  }

  protected writeCodeBlock(node: CodeBlockTextNode): void {
    if (node.attrs == null || !node.attrs.language) return;
    const attrs = node.attrs;

    const s = `|code:${attrs.language}\n`;

    // Write the text
    this.write(s);
  }

  protected writeStandardMark(mark: TextMark) {
    const s = STANDARD_MARKS[mark.type];
    if (s) this.write(s);
  }

  protected writeInlineMark(mark: TextMark, enter: boolean) {
    if (enter) {
      this.write('==');
    } else {
      let s = `==|${mark.type}`;
      if (mark.attrs) {
        for (const [k, v] of Object.entries(mark.attrs)) {
          if ((k === 'language' && v !== 'plain text') || k === 'color') {
            s = `${s}:${v}`;
          }
        }
      }
      s = `${s}|`;
      this.write(s);
    }
  }

  protected writeCommentMark(mark: CommentMark, enter: boolean) {
    if (enter) {
      // Do nothing
    } else {
      if (mark.comment) {
        const s = `#${mark.comment}|`;
        this.write(s);
      }
    }
  }

  protected writeString(s?: string): void {
    if (s != null) this.write(`${s}`);
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

  protected getBitType(route: NodeInfo[]): BitType | undefined {
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
    this.write(`${value}\n`);
    return this;
  }

  /**
   * Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.
   * @param values - The lines to write.
   * @param delimiter - An optional delimiter to be written at the end of each line, except for the last one.
   */
  writeLines(values: string[], delimiter?: string): this {
    for (const value of values) {
      this.write(`${value}${delimiter ?? ''}\n`);
    }
    return this;
  }

  /**
   * Writes a single whitespace character to the output.
   */
  writeWhiteSpace(): this {
    this.write(' ');
    return this;
  }
}

export { TextGenerator };
