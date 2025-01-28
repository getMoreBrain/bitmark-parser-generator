import { EnumType } from '@ncoderz/superenum';

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
  FootnoteMark,
  HeadingTextNode,
  ImageTextNode,
  LatexTextNode,
  LinkMark,
  ListTextNode,
  RefMark,
  SectionTextNode,
  TaskItemTextNode,
  TextAst,
  TextMark,
  TextNode,
  XRefMark,
} from '../../model/ast/TextNodes';

const DEFAULT_OPTIONS: TextOptions = {
  bodyBitCallback: undefined,
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
  TextMarkType.ref,
  TextMarkType.xref,
  TextMarkType.footnote,
  TextMarkType.footnoteStar,
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
   * Callback for writing text
   *
   * If set, the callback will be called, rather than writing to the output string
   */
  writeCallback?: WriteCallback;

  /**
   * Callback for rendering body bits
   */
  bodyBitCallback?: BodyBitCallback;

  /**
   * [development only]
   * Generate debug information in the output.
   */
  debugGenerationInline?: boolean;
}

const Stage = {
  enter: 'enter',
  between: 'between',
  exit: 'exit',
};

export type StageType = EnumType<typeof Stage>;

export type WriteCallback = (s: string) => void;
export type BodyBitCallback = (bodyBit: BodyBitJson, index: number, route: NodeInfo[]) => string;

/**
 * Generate text from a bitmark text AST
 */
class TextGenerator extends AstWalkerGenerator<TextAst, BreakscapedString> {
  protected ast = new Ast();
  private bitmarkVersion: BitmarkVersionType;
  private options: TextOptions;

  // State
  private textFormat: TextFormatType = TextFormat.bitmarkMinusMinus;
  private writerText = '';
  private nodeIndex = 0;
  private currentIndent = 0;
  private prevIndent = 0;
  private indentationStringCache = '';
  private inCodeBlock = false;
  private exitedCodeBlock = false;
  private inBulletList = false;
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
    this.nodeIndex = 0;
    this.currentIndent = 0;
    this.prevIndent = 0;
    this.indentationStringCache = '';
    this.inCodeBlock = false;
    this.exitedCodeBlock = false;
    this.inBulletList = false;
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
        this.writeMarks(node, Stage.enter);
        this.writeText(node);
        this.writeMarks(node, Stage.between);
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

      case TextNodeType.latex:
        this.writeLatex(node as LatexTextNode);
        break;

      case TextNodeType.noBulletList:
      case TextNodeType.bulletList:
      case TextNodeType.orderedList:
      case TextNodeType.orderedListRoman:
      case TextNodeType.orderedListRomanLower:
      case TextNodeType.letteredList:
      case TextNodeType.letteredListLower:
      case TextNodeType.taskList:
        this.inBulletList = true;
        break;

      case TextNodeType.gap:
      case TextNodeType.select:
      case TextNodeType.highlight:
      case TextNodeType.mark:
        this.writeBodyBit(node, route);
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
        this.writeMarks(node, Stage.exit);
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

      case TextNodeType.noBulletList:
      case TextNodeType.bulletList:
      case TextNodeType.orderedList:
      case TextNodeType.orderedListRoman:
      case TextNodeType.orderedListRomanLower:
      case TextNodeType.letteredList:
      case TextNodeType.letteredListLower:
      case TextNodeType.taskList:
        // List Block type nodes, write a newline only if there is no indent
        if (this.currentIndent <= 1) {
          this.writeNL();
          // Exit 'inBulletList' state only if not in a nested list
          this.inBulletList = false;
        }
        break;

      default:
      // Ignore unknown type
    }

    this.handleDedent(node);

    // Increment the node index for the next node
    this.nodeIndex++;
  }

  protected handleIndent(node: TextNode) {
    switch (node.type) {
      case TextNodeType.noBulletList:
      case TextNodeType.bulletList:
      case TextNodeType.orderedList:
      case TextNodeType.orderedListRoman:
      case TextNodeType.orderedListRomanLower:
      case TextNodeType.letteredList:
      case TextNodeType.letteredListLower:
      case TextNodeType.taskList:
        this.currentIndent++;
        break;

      default:
      // Ignore unknown type
    }
  }

  protected handleDedent(node: TextNode) {
    switch (node.type) {
      case TextNodeType.noBulletList:
      case TextNodeType.bulletList:
      case TextNodeType.orderedList:
      case TextNodeType.orderedListRoman:
      case TextNodeType.orderedListRomanLower:
      case TextNodeType.letteredList:
      case TextNodeType.letteredListLower:
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

  protected writeBodyBit(node: TextNode, route: NodeInfo[]) {
    const placeholder = `[!${this.placeholderIndex}]`;
    this.placeholders[placeholder] = node as unknown as BodyBitJson;

    if (this.options.bodyBitCallback) {
      const bodyBit = this.options.bodyBitCallback(node as unknown as BodyBitJson, this.placeholderIndex, route);
      this.write(bodyBit);
    } else {
      // Write placeholder to the text
      this.write(placeholder);
    }

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
      s = Breakscape.breakscape(s, {
        textFormat: this.textFormat,
      });
    } else {
      // s = Breakscape.breakscapeCode(s);
      s = Breakscape.breakscape(s, {
        textFormat: this.textFormat,
      });
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
      let s = Breakscape.breakscape(node.text, {
        textFormat: this.textFormat,
      });

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
   * @param start true if starting (before) the text, false if ending (after) the text
   */
  protected writeMarks(node: TextNode, stage: StageType): void {
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
        // Write the mark start / end around the text (==)
        if (stage == Stage.enter || stage == Stage.between) {
          this.writeMarkTextWrapper(markStartEnd);
        }

        // Write the inline/comment mark if not entering (|<mark content>)
        if (stage == Stage.between) {
          for (const mark of node.marks) {
            if (STANDARD_MARK_TYPES.indexOf(mark.type) !== -1) {
              if (!singleMark) {
                this.writeInlineMarkStartEnd();
                this.writeInlineMark(mark);
              }
            } else if (TextMarkType.comment === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeCommentMark(mark as CommentMark);
            } else if (TextMarkType.ref === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeRefMark(mark as RefMark);
            } else if (TextMarkType.xref === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeXRefMark(mark as XRefMark);
            } else if (TextMarkType.footnote === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeFootnoteMark(mark as FootnoteMark);
            } else if (TextMarkType.footnoteStar === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeFootnoteStarMark(mark as FootnoteMark);
            } else if (INLINE_MARK_TYPES.indexOf(mark.type) !== -1) {
              this.writeInlineMarkStartEnd();
              this.writeInlineMark(mark);
            } else {
              // Do nothing (NOTE: link is handled in writeText)
            }
          }
        }

        // Write the inline/comment mark end when exiting (|)
        if (stage == Stage.exit) {
          let inlineMarkWritten = false;
          for (const mark of node.marks) {
            if (STANDARD_MARK_TYPES.indexOf(mark.type) !== -1) {
              if (!singleMark) {
                inlineMarkWritten = true;
              }
            } else if (
              TextMarkType.comment === mark.type ||
              TextMarkType.ref === mark.type ||
              TextMarkType.xref === mark.type ||
              TextMarkType.footnote === mark.type ||
              TextMarkType.footnoteStar === mark.type ||
              INLINE_MARK_TYPES.indexOf(mark.type) !== -1
            ) {
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

  protected writeParagraph(node: TextNode): void {
    // Write paragraph marker for bitmark++
    if (this.textFormat === TextFormat.bitmarkPlusPlus) {
      // Do not write a paragraph marker when in a bullet list
      if (this.inBulletList) return;

      // Do not write a paragraph marker for the first node if it is a paragraph - it is implicit
      // (unless it is empty, or an empty string)
      // This is a nasty look-ahead but otherwise the entire paragraph block would need to be written before
      // determining if it is the first node and if it is empty
      const nodeContentLength = node.content?.length ?? 0;
      if (this.nodeIndex === 0) {
        if (nodeContentLength === 1) {
          const isTextNode = node.content?.[0].type === TextNodeType.text;
          const text = node.content?.[0].text ?? '';
          if (!isTextNode || text !== '') return;
        }
        if (nodeContentLength > 1) return;
      }

      this.write('|');
      this.writeNL();
      if (this.exitedCodeBlock) {
        // Write an extra newline after a code block
        this.writeNL();
      }
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
    // if (node.attrs == null || !node.attrs.start) return;
    // const attrs = node.attrs;

    // const s = `|code:${attrs.language}\n`;

    // Add indentation
    let bullet = this.getIndentationString();
    const listParent = this.getParentNode(route, 2);
    const listParentNode: ListTextNode | undefined = listParent?.value;
    const listType = listParentNode?.type;
    const start = listParentNode?.attrs?.start ?? 1;

    // Add bullet
    if (listType === TextNodeType.bulletList) {
      bullet += '• ';
    } else if (listType === TextNodeType.noBulletList) {
      bullet += '•_ ';
    } else if (listType === TextNodeType.orderedList) {
      bullet += `•${start} `;
    } else if (listType === TextNodeType.orderedListRoman) {
      bullet += `•${start}I `;
    } else if (listType === TextNodeType.orderedListRomanLower) {
      bullet += `•${start}i `;
    } else if (listType === TextNodeType.letteredList) {
      bullet += '•A ';
    } else if (listType === TextNodeType.letteredListLower) {
      bullet += '•a ';
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
        case 'alignment':
          if (v !== 'center') if (v) s += `@alignment:${v}|`;
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

  protected writeLatex(node: LatexTextNode): void {
    if (node.attrs == null || !node.attrs.formula) return;
    const attrs = node.attrs;

    const s = `==${attrs.formula}==|latex|`;

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
    const comment = mark.comment || '';

    const s = `#${comment}`;
    this.write(s);
  }

  protected writeRefMark(mark: RefMark) {
    const ref = mark.attrs?.reference ?? '';

    const s = `►${ref}`;
    this.write(s);
  }

  protected writeXRefMark(mark: XRefMark) {
    const xref = mark.attrs?.xref ?? '';
    const ref = mark.attrs?.reference ?? '';

    let s = `xref:${xref}`;
    if (ref) s += `|►${ref}`;
    this.write(s);
  }

  protected writeFootnoteMark(_mark: FootnoteMark) {
    const s = `footnote:`;
    this.write(s);
  }

  protected writeFootnoteStarMark(_mark: FootnoteMark) {
    const s = `footnote*:`;
    this.write(s);
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
    if (this.options.writeCallback) {
      this.options.writeCallback(value);
    } else {
      this.writerText += value;
    }
    // for debugging console.log(this.writerText);

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
