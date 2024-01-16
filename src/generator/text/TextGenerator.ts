import { Ast, NodeInfo } from '../../ast/Ast';
import { Breakscape } from '../../breakscaping/Breakscape';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { NodeType } from '../../model/ast/NodeType';
import { Bit } from '../../model/ast/Nodes';
import { BitTypeType } from '../../model/enum/BitType';
import { BitmarkVersion, BitmarkVersionType, DEFAULT_BITMARK_VERSION } from '../../model/enum/BitmarkVersion';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { TextMarkType, TextMarkTypeType } from '../../model/enum/TextMarkType';
import { TextNodeType } from '../../model/enum/TextNodeType';
import { BodyBitJson, BodyBitsJson } from '../../model/json/BodyBitJson';
import { AstWalkerGenerator } from '../AstWalkerGenerator';

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
const INLINE_HALF_MARK = '=';

const BOLD_MARK = BOLD_HALF_MARK + BOLD_HALF_MARK;
const LIGHT_MARK = LIGHT_HALF_MARK + LIGHT_HALF_MARK;
const ITALIC_MARK = ITALIC_HALF_MARK + ITALIC_HALF_MARK;
const HIGHLIGHT_MARK = HIGHLIGHT_HALF_MARK + HIGHLIGHT_HALF_MARK;
const INLINE_MARK = INLINE_HALF_MARK + INLINE_HALF_MARK;

// const ALL_HALF_MARKS = [BOLD_HALF_MARK, LIGHT_HALF_MARK, ITALIC_HALF_MARK, HIGHLIGHT_HALF_MARK];

const HEADING_TAG = '#';

const STANDARD_MARKS: { [key: string]: string } = {
  [TextMarkType.bold]: BOLD_MARK,
  [TextMarkType.light]: LIGHT_MARK,
  [TextMarkType.italic]: ITALIC_MARK,
  [TextMarkType.highlight]: HIGHLIGHT_MARK,
};

const STANDARD_MARK_TYPES: TextMarkTypeType[] = [
  TextMarkType.bold,
  TextMarkType.light,
  TextMarkType.italic,
  TextMarkType.highlight,
];
const INLINE_MARK_TYPES: TextMarkTypeType[] = [
  TextMarkType.strike,
  TextMarkType.subscript,
  TextMarkType.superscript,
  TextMarkType.ins,
  TextMarkType.del,
  TextMarkType.underline,
  TextMarkType.doubleUnderline,
  TextMarkType.circle,
  TextMarkType.languageEm,
  TextMarkType.userUnderline,
  TextMarkType.userDoubleUnderline,
  TextMarkType.userStrike,
  TextMarkType.userCircle,
  TextMarkType.userHighlight,
  //
  TextMarkType.var,
  TextMarkType.code,
  TextMarkType.timer,
  TextMarkType.duration,
  TextMarkType.color,
  TextMarkType.comment,
];

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
class TextGenerator extends AstWalkerGenerator<TextAst, BreakscapedString> {
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

  /**
   * Generate text from a bitmark text AST
   *
   * @param bitmarkVersion - bitmark version, use null to use latest version
   * @param options - text generation options
   */
  constructor(bitmarkVersion?: BitmarkVersionType, options?: TextOptions) {
    super();

    this.bitmarkVersion = BitmarkVersion.fromValue(bitmarkVersion) ?? DEFAULT_BITMARK_VERSION;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.debugGenerationInline = this.options.debugGenerationInline ?? false;

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
  public async generate(ast: TextAst, textFormat: TextFormatType): Promise<BreakscapedString> {
    // Reset the state
    this.resetState(textFormat);

    // Walk the text AST
    this.walkAndWrite(ast);

    return this.writerText as BreakscapedString;
  }

  /**
   * Generate text from a bitmark text AST synchronously
   *
   * @param ast bitmark text AST
   */
  public generateSync(ast: TextAst, textFormat: TextFormatType): BreakscapedString {
    // Reset the state
    this.resetState(textFormat);

    // Walk the text AST
    this.walkAndWrite(ast);

    return this.writerText as BreakscapedString;
  }

  public getPlaceholders(): BodyBitsJson {
    return this.placeholders;
  }

  private resetState(textFormat: TextFormatType): void {
    this.printed = false;

    this.textFormat = textFormat;
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

  //
  // NODE HANDLERS
  //

  // * -> textAstValue

  protected enter_textAstValue(node: NodeInfo, route: NodeInfo[]): void | false {
    return this.handleEnterNode(node.value, route);
  }

  protected between_textAstValue(node: NodeInfo, left: NodeInfo, right: NodeInfo, route: NodeInfo[]): void | false {
    return this.handleBetweenNode(node.value, left, right, route);
  }

  protected exit_textAstValue(node: NodeInfo, route: NodeInfo[]): void | false {
    return this.handleExitNode(node.value, route);
  }

  // * -> contentValue

  protected enter_contentValueValue(node: NodeInfo, route: NodeInfo[]): void | false {
    return this.handleEnterNode(node.value, route);
  }

  protected between_contentValueValue(node: NodeInfo, left: NodeInfo, right: NodeInfo, route: NodeInfo[]): void {
    this.handleBetweenNode(node.value, left, right, route);
  }

  protected exit_contentValueValue(node: NodeInfo, route: NodeInfo[]): void | false {
    return this.handleExitNode(node.value, route);
  }

  // END NODE HANDLERS

  protected handleEnterNode(node: TextNode, route: NodeInfo[]): void | false {
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
        this.writeBullet(node, route);
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
      case TextNodeType.mark:
        this.writeBodyBit(node);
        // Stop parsing the body bit
        return false;
      default:
      // Ignore unknown type
    }

    // Clear exited flags
    this.exitedCodeBlock = false;
  }

  protected handleBetweenNode(node: TextNode, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    switch (node.type) {
      default:
      // Ignore unknown type
    }
  }

  protected handleExitNode(node: TextNode, _route: NodeInfo[]): void | false {
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
      case TextNodeType.letteredList:
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
      case TextNodeType.letteredList:
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
      case TextNodeType.letteredList:
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
      s = Breakscape.breakscape(s);
    } else {
      // s = Breakscape.breakscapeCode(s);
      s = Breakscape.breakscape(s);
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
      let s = Breakscape.breakscape(node.text);

      // Apply any required indentation
      if (this.currentIndent > 1) {
        const indentationString = this.getIndentationString();
        s = s.replace(INDENTATION_REGEX, `$1${indentationString}`) as BreakscapedString;
      }

      // The node is a link.
      // Get the text part of the link
      const hrefText = href.replace(LINK_REGEX, '$1');
      if (hrefText === s) {
        // Write the link instead of the text
        this.write(href);
      } else {
        // Write as an inline mark
        s = `==${s}==|link:${href}|` as BreakscapedString;
        this.write(s);
      }

      return true;
    }

    return false;
  }

  /**
   * Write the marks for the node.
   *
   * All marks need to be considered at once, because if there are multiple marks, they need to be written in
   * a combined manner.
   *
   * e.g. if there are bold and italic marks, they need to be written as
   *
   * ==the text==|bold|italic|
   * rather than
   * **__the text__**
   * or
   * **__the text**__
   *
   * @param node the text node
   * @param enter true if entering (before) the text, false if exiting (after) the text
   */
  protected writeMarks(node: TextNode, enter: boolean): void {
    if (node.marks) {
      // Empty marks occur when the inline mark has no attributes - write an inline mark with no attributes
      const emptyMarks = node.marks.length === 0;
      if (emptyMarks) {
        // Write the mark start / end around the text
        this.writeMarkTextWrapper(INLINE_MARK);
        return;
      }

      // Single marks are only valid if there is only one mark for this text
      const singleMark = node.marks.length === 1;

      // Get the correct mark start / end
      const markStartEnd = node.marks.reduce(
        (acc, mark) => {
          if (acc) return acc;
          if (STANDARD_MARK_TYPES.indexOf(mark.type) !== -1) {
            if (singleMark) return STANDARD_MARKS[mark.type];
            return INLINE_MARK;
          } else if (INLINE_MARK_TYPES.indexOf(mark.type) !== -1) {
            return INLINE_MARK;
          } else {
            // Do nothing (NOTE: link is handled in writeText)
          }
          return acc;
        },
        undefined as string | undefined,
      );

      const haveMark = markStartEnd != null;

      if (haveMark) {
        // Write the mark start / end around the text
        this.writeMarkTextWrapper(markStartEnd);

        // Write the inline/comment mark if not entering
        if (!enter) {
          let inlineMarkWritten = false;
          for (const mark of node.marks) {
            if (STANDARD_MARK_TYPES.indexOf(mark.type) !== -1) {
              if (!singleMark) {
                this.writeInlineMarkStartEnd();
                this.writeInlineMark(mark);
                inlineMarkWritten = true;
              }
            } else if (TextMarkType.comment === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeCommentMark(mark as CommentMark);
              inlineMarkWritten = true;
            } else if (INLINE_MARK_TYPES.indexOf(mark.type) !== -1) {
              this.writeInlineMarkStartEnd();
              this.writeInlineMark(mark);
              inlineMarkWritten = true;
            } else {
              // Do nothing (NOTE: link is handled in writeText)
            }
          }
          // Write the mark end
          if (inlineMarkWritten) this.writeInlineMarkStartEnd();
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

  protected writeBullet(node: TextNode, route: NodeInfo[]) {
    // Add indentation
    let bullet = this.getIndentationString();
    const listParent = this.getParentNode(route, 2);
    const listType = listParent?.value.type;

    // Add bullet
    if (listType === TextNodeType.bulletList) {
      bullet += '• ';
    } else if (listType === TextNodeType.orderedList) {
      bullet += '•1 ';
    } else if (listType === TextNodeType.letteredList) {
      bullet += '•A ';
    } else if (listType === TextNodeType.taskList) {
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

  protected writeMarkTextWrapper(s: string) {
    if (s) this.write(s);
  }

  protected writeInlineMark(mark: TextMark) {
    let s = `${mark.type}`;
    if (mark.attrs) {
      for (const [k, v] of Object.entries(mark.attrs)) {
        if ((k === 'language' && v !== 'plain text') || k === 'color' || k === 'name' || k === 'duration') {
          s = `${s}:${v}`;
        }
      }
    }
    this.write(s);
  }

  protected writeCommentMark(mark: CommentMark) {
    if (mark.comment) {
      const s = `#${mark.comment}`;
      this.write(s);
    }
  }

  protected writeInlineMarkStartEnd() {
    this.write('|');
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

  //
  // Helper functions
  //

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
