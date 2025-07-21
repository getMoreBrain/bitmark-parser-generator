import { type EnumType } from '@ncoderz/superenum';

import { Ast, type NodeInfo } from '../../ast/Ast.ts';
import { Breakscape } from '../../breakscaping/Breakscape.ts';
import { type BreakscapeOptions } from '../../breakscaping/BreakscapeOptions.ts';
import { type BreakscapedString } from '../../model/ast/BreakscapedString.ts';
import { type Bit } from '../../model/ast/Nodes.ts';
import { NodeType } from '../../model/ast/NodeType.ts';
import {
  type CodeBlockTextNode,
  type CommentMark,
  type ExtRefMark,
  type FootnoteMark,
  type HeadingTextNode,
  type ImageInlineTextNode,
  type ImageTextNode,
  type LatexTextNode,
  type LinkMark,
  type ListTextNode,
  type MediaAttributes,
  type RefMark,
  type SectionTextNode,
  type SymbolMark,
  type TaskItemTextNode,
  type TextAst,
  type TextMark,
  type TextNode,
  type XRefMark,
} from '../../model/ast/TextNodes.ts';
import {
  BitmarkVersion,
  type BitmarkVersionType,
  DEFAULT_BITMARK_VERSION,
} from '../../model/enum/BitmarkVersion.ts';
import { type BitTypeType } from '../../model/enum/BitType.ts';
import { TextFormat, type TextFormatType } from '../../model/enum/TextFormat.ts';
import { TextLocation, type TextLocationType } from '../../model/enum/TextLocation.ts';
import { TextMarkType, type TextMarkTypeType } from '../../model/enum/TextMarkType.ts';
import { TextNodeType, type TextNodeTypeType } from '../../model/enum/TextNodeType.ts';
import { type BodyBitJson, type BodyBitsJson } from '../../model/json/BodyBitJson.ts';
import { StringUtils } from '../../utils/StringUtils.ts';
import { AstWalkerGenerator } from '../AstWalkerGenerator.ts';

const DEFAULT_OPTIONS: TextOptions = {
  bodyBitCallback: undefined,
  debugGenerationInline: false,
};

const FIRST_PARAGRAPH_CONTENT_DEPTH = 3;

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

const ALL_HALF_MARKS = [
  BOLD_HALF_MARK,
  LIGHT_HALF_MARK,
  ITALIC_HALF_MARK,
  HIGHLIGHT_HALF_MARK,
  INLINE_HALF_MARK,
];

const ALL_TAG_OPENING_ENDS = '@#▼►%!?+-$_=&';

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
  TextMarkType.languageEmRed,
  TextMarkType.languageEmOrange,
  TextMarkType.languageEmYellow,
  TextMarkType.languageEmGreen,
  TextMarkType.languageEmBlue,
  TextMarkType.languageEmPurple,
  TextMarkType.languageEmPink,
  TextMarkType.languageEmBrown,
  TextMarkType.languageEmBlack,
  TextMarkType.languageEmWhite,
  TextMarkType.languageEmGray,
  TextMarkType.languageEm,
  TextMarkType.userUnderline,
  TextMarkType.userDoubleUnderline,
  TextMarkType.userStrike,
  TextMarkType.userCircle,
  TextMarkType.userHighlight,
  TextMarkType.notranslate,
  //
  TextMarkType.link,
  TextMarkType.ref,
  TextMarkType.xref,
  TextMarkType.extref,
  TextMarkType.footnote,
  TextMarkType.footnoteStar,
  TextMarkType.symbol,
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
const LINK_BREAKSCAPE_REGEX = new RegExp(/\]/, 'g');

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

export type GenerateOptions = {
  plainTextDividerAllowed?: boolean;
  noBreakscaping?: boolean;
};

const Stage = {
  enter: 'enter',
  between: 'between',
  exit: 'exit',
};

export type StageType = EnumType<typeof Stage>;

export type WriteCallback = (s: string) => void;
export type BodyBitCallback = (bodyBit: BodyBitJson, index: number, route: NodeInfo[]) => string;

interface MediaAttributeOptions {
  ignoreAttributes?: Set<string>;
}

/**
 * Generate text from a bitmark text AST
 */
class TextGenerator extends AstWalkerGenerator<TextAst, BreakscapedString> {
  protected ast = new Ast();
  private bitmarkVersion: BitmarkVersionType;
  private options: TextOptions;

  // State
  private generateOptions: GenerateOptions = {};
  private textFormat: TextFormatType = TextFormat.bitmarkText;
  private textLocation: TextLocationType = TextLocation.body;
  private writerText = '';
  private nodeIndex = 0;
  private currentIndent = 0;
  private prevIndent = 0;
  private indentationStringCache = '';
  private inParagraph = false;
  private inHeading = false;
  private inCodeBlock = false;
  private exitedCodeBlock = false;
  private inBulletList = false;
  private inInline = false;
  private textDepth = 0;
  private placeholderIndex = 0;
  private placeholders: BodyBitsJson = {};

  // For pre-text
  private rootParagraphNodeContentIndex = 0;
  private previousRootParagraphContextType: TextNodeTypeType = TextNodeType.text;
  private inPreText = false;
  private thisNodeIsPreText = false;
  private preTextIndexTemp = -1;
  private havePreText = false;
  private preTextIndex = -1;

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
  public async generate(
    ast: TextAst,
    textFormat: TextFormatType,
    textLocation: TextLocationType,
    options?: GenerateOptions,
  ): Promise<BreakscapedString> {
    return this.generateSync(ast, textFormat, textLocation, options);
  }

  /**
   * Generate text from a bitmark text AST synchronously
   *
   * @param ast bitmark text AST
   */
  public generateSync(
    ast: TextAst,
    textFormat: TextFormatType,
    textLocation: TextLocationType,
    options?: GenerateOptions,
  ): BreakscapedString {
    this.generateOptions = Object.assign({}, options);

    this.validateGenerateOptions(ast);

    if (!this.generateOptions.plainTextDividerAllowed) {
      // Normal case with no pre-text - need only walk once

      // Reset the state
      this.resetState(textFormat, textLocation);

      // Walk the text AST - this 1st walk is to determine if there is pre-text
      this.walkAndWrite(ast);
    } else {
      // Plain text divider is allowed. We need to walk the text AST twice:
      // 1. To determine if there is pre-text
      // 2. To generate the text

      // Save and clear the write callback / body bit callback for the first walk as we don't want to write the text
      const writeCallback = this.options.writeCallback;
      const bodyBitCallback = this.options.bodyBitCallback;
      this.options.writeCallback = undefined;
      this.options.bodyBitCallback = undefined;

      // Reset the state
      this.resetState(textFormat, textLocation);

      // Walk the text AST - this 1st walk is to determine if there is pre-text
      this.walkAndWrite(ast);

      // Restore the write callback
      this.options.writeCallback = writeCallback;
      this.options.bodyBitCallback = bodyBitCallback;

      // Reset the state, preserving havePreText / preTextIndex from the first walk
      const havePreText = this.havePreText;
      const pti = this.preTextIndex;
      this.resetState(textFormat, textLocation);
      this.havePreText = havePreText;
      this.preTextIndex = pti;

      // Walk the text AST - this is the 2nd walk to generate the text
      this.walkAndWrite(ast);
    }

    return this.writerText as BreakscapedString;
  }

  public getPlaceholders(): BodyBitsJson {
    return this.placeholders;
  }

  private resetState(textFormat: TextFormatType, textLocation: TextLocationType): void {
    this.printed = false;

    this.textFormat = textFormat ?? TextFormat.bitmarkText;
    this.textLocation = textLocation;
    this.writerText = '';
    this.nodeIndex = 0;
    this.currentIndent = 0;
    this.prevIndent = 0;
    this.indentationStringCache = '';
    this.inParagraph = false;
    this.inHeading = false;
    this.inCodeBlock = false;
    this.exitedCodeBlock = false;
    this.inBulletList = false;
    this.inInline = false;
    this.textDepth = 0;
    this.placeholderIndex = 0;
    this.placeholders = {};

    // For pre-text
    this.rootParagraphNodeContentIndex = 0;
    this.previousRootParagraphContextType = TextNodeType.hardBreak;
    this.inPreText = false;
    this.thisNodeIsPreText = false;
    this.preTextIndexTemp = -1;
    this.havePreText = false;
    this.preTextIndex = -1;
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

  protected between_textAstValue(
    node: NodeInfo,
    left: NodeInfo,
    right: NodeInfo,
    route: NodeInfo[],
  ): void | false {
    return this.handleBetweenNode(node.value, left, right, route);
  }

  protected exit_textAstValue(node: NodeInfo, route: NodeInfo[]): void | false {
    return this.handleExitNode(node.value, route);
  }

  // * -> contentValue

  protected enter_contentValue(node: NodeInfo, route: NodeInfo[]): void | false {
    return this.handleEnterContentValueNode(node, route);
  }

  protected between_contentValue(
    node: NodeInfo,
    left: NodeInfo,
    right: NodeInfo,
    route: NodeInfo[],
  ): void {
    this.handleBetweenContentValueNode(node, left, right, route);
  }

  protected exit_contentValue(node: NodeInfo, route: NodeInfo[]): void | false {
    this.handleExitContentValueNode(node, route);
  }

  // * -> contentValueValue

  protected enter_contentValueValue(node: NodeInfo, route: NodeInfo[]): void | false {
    return this.handleEnterNode(node.value, route);
  }

  protected between_contentValueValue(
    node: NodeInfo,
    left: NodeInfo,
    right: NodeInfo,
    route: NodeInfo[],
  ): void {
    this.handleBetweenNode(node.value, left, right, route);
  }

  protected exit_contentValueValue(node: NodeInfo, route: NodeInfo[]): void | false {
    return this.handleExitNode(node.value, route);
  }

  // END NODE HANDLERS

  protected handleEnterNode(node: TextNode, route: NodeInfo[]): void | false {
    this.handleEnterNodePreTextCheck(node, route);

    this.handleIndent(node);

    switch (node.type) {
      case TextNodeType.paragraph:
        this.inParagraph = true;
        this.writeParagraph(node);
        break;

      case TextNodeType.hardBreak:
        this.writeHardBreak(node);
        break;

      case TextNodeType.text:
        this.writeMarks(node, Stage.enter);
        this.writeText(node);
        this.writeMarks(node, Stage.between);
        if (this.textDepth === 0) {
          this.inInline = true;
        }
        this.textDepth++;
        break;

      case TextNodeType.heading:
        this.writeHeading(node as HeadingTextNode);
        this.inHeading = true;
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

      case TextNodeType.imageInline:
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

  protected handleBetweenNode(
    node: TextNode,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    switch (node.type) {
      default:
      // Ignore unknown type
    }
  }

  protected handleExitNode(node: TextNode, _route: NodeInfo[]): void | false {
    switch (node.type) {
      case TextNodeType.text:
        this.textDepth--;
        if (this.textDepth === 0) {
          this.inInline = false;
        }
        this.writeMarks(node, Stage.exit);
        break;

      case TextNodeType.paragraph:
        // if (this.textFormat !== TextFormat.bitmarkText) {
        // Paragraph Block type node, write 1x newline
        // Except:
        // - for bitmark-- where we don't write newlines for the single wrapping block
        this.writeNL();
        // }
        this.inParagraph = false;
        break;

      case TextNodeType.heading:
        this.inHeading = false;

      case TextNodeType.section:
      case TextNodeType.image:
        if (!this.inParagraph) {
          // Block type nodes, write 2x newline
          this.writeNL();
          this.writeNL();
        }
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

  protected handleEnterContentValueNode(_node: NodeInfo, route: NodeInfo[]): void | false {
    if (route.length === FIRST_PARAGRAPH_CONTENT_DEPTH) {
      this.thisNodeIsPreText = true;
      this.inPreText = false;
      this.previousRootParagraphContextType = TextNodeType.hardBreak;
    }
  }

  protected handleBetweenContentValueNode(
    _node: NodeInfo,
    left: NodeInfo,
    _right: NodeInfo,
    route: NodeInfo[],
  ): void {
    if (route.length === FIRST_PARAGRAPH_CONTENT_DEPTH) {
      const leftNode = left.value as TextNode;
      this.updatePreTextState();

      this.thisNodeIsPreText = true;
      this.previousRootParagraphContextType = leftNode.type;
      this.rootParagraphNodeContentIndex++;
    }
  }

  protected handleExitContentValueNode(_node: NodeInfo, route: NodeInfo[]): void | false {
    if (route.length === FIRST_PARAGRAPH_CONTENT_DEPTH) {
      this.updatePreTextState();

      this.thisNodeIsPreText = false;
      if (this.generateOptions.plainTextDividerAllowed && this.inPreText) {
        this.havePreText = true;
        this.preTextIndex = this.preTextIndexTemp;
      }
      this.inPreText = false;
    }
  }

  private updatePreTextState(): void {
    if (
      !this.inPreText &&
      this.thisNodeIsPreText &&
      this.previousRootParagraphContextType === TextNodeType.hardBreak
    ) {
      // Enter pre-text if this node could be pre-text, and the previous node was a hard break
      this.inPreText = true;
      this.preTextIndexTemp = this.rootParagraphNodeContentIndex;
    } else if (this.inPreText && !this.thisNodeIsPreText) {
      this.inPreText = false;
      this.preTextIndexTemp = -1;
    }
  }

  protected handleEnterNodePreTextCheck(node: TextNode, route: NodeInfo[]) {
    const firstParagraphContent = route.length === 4;

    // If this is the first paragraph content node, check for pre-text, otherwise cannot be pre-text
    if (firstParagraphContent) {
      // If in pre-text, and this node is a hard break, stay in pre-text
      if (this.inPreText && node.type === TextNodeType.hardBreak) return;

      // If this node is text, then we might be in pre-text
      if (node.type === TextNodeType.text) return;
    }

    // Any other node and we are not in pre-text any longer
    this.thisNodeIsPreText = false;
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
      const bodyBit = this.options.bodyBitCallback(
        node as unknown as BodyBitJson,
        this.placeholderIndex,
        route,
      );
      this.write(bodyBit);
    } else {
      // Write placeholder to the text
      this.write(placeholder);
    }

    this.placeholderIndex++;
  }

  protected writeText(node: TextNode): void {
    if (node.text == null) return;

    // Handle normal text
    const codeBreakscaping = this.inCodeBlock;

    // Get the text
    let s: string = node.text;

    // If the node has a single link mark, and the mark is the same (without protocol) as the text, write the link
    // instead of the text. This is a special case.
    const linkText = this.getLinkText(node);
    if (linkText) s = linkText;

    // Breakscape the text
    if (linkText) {
      // Only breakscape ] in links (done in getLinkText)
      s = linkText;
    } else {
      if (!codeBreakscaping) {
        s = this.breakscape(s, {
          format: this.textFormat,
          location: this.textLocation,
        });
      } else {
        s = this.breakscape(s, {
          format: this.textFormat,
          location: this.textLocation,
        });
      }
    }

    // Apply any required indentation
    if (this.currentIndent > 1) {
      const indentationString = this.getIndentationString();
      s = s.replace(INDENTATION_REGEX, `$1${indentationString}`);
    }

    // If have pre-text, and this is the correct index, write the plain text divider
    if (this.havePreText && this.rootParagraphNodeContentIndex === this.preTextIndex) {
      // Write the plain text divider
      this.writePlainTextDivider();
      this.writeNL();
    }
    if (this.havePreText && this.rootParagraphNodeContentIndex >= this.preTextIndex) {
      // Write the text as pre-text
      const s = this.breakscape(node.text, {
        format: TextFormat.plainText,
        location: this.textLocation, // Must be body for pre-text
      });
      this.write(s);
    } else {
      // Write the text
      this.write(s);
    }

    // Handle pre-text check
    if (this.currentIndent > 1 || codeBreakscaping) {
      this.thisNodeIsPreText = false; // Not pre-text if indented or in code block
    }
    if (!this.inPreText && node.text === s) {
      this.thisNodeIsPreText = false; // No-breakscaping, so don't enter pre-text
    }
  }

  /**
   * Check if a node is a link node and if so and the node has only the link mark, and the link without the
   * protocol is the same as the text, return true. Otherwise return false.
   *
   * @param node
   * @returns true if a simple link, otherwise false
   */
  protected isSimpleLink(node: TextNode): boolean {
    if (node.text == null) return false;
    if (node.marks?.length !== 1) return false;

    const href = this.getLinkHref(node);
    if (href) {
      // Get the text part of the link
      const hrefText = href.replace(LINK_REGEX, '$1');
      return hrefText === node.text;
    }
    return false;
  }

  /**
   * Get the link text if the node is a link, otherwise return false
   *
   * @param node
   * @returns
   */
  protected getLinkText(node: TextNode): string | false {
    if (node.text == null) return false;

    const href = this.getLinkHref(node);
    if (href) {
      let res: string;
      // Get the text part of the link
      const hrefText = href.replace(LINK_REGEX, '$1');
      if (hrefText === node.text) {
        // Return the link as the text
        res = href;
      } else {
        res = node.text;
      }
      res = (res ?? '').replace(LINK_BREAKSCAPE_REGEX, '^]'); // Link breakscaping
      return res;
    }
    return false;
  }

  /**
   * If the existing written text ends with a half-mark, and the new text starts with the same half-mark, insert a
   * breakscape ^ between them to break the sequence.
   *
   * Only applies to bitmark version > 2
   *
   * @param s
   */
  protected getInterTextBreakscape(s: string): string {
    if (this.bitmarkVersion === BitmarkVersion.v2) return '';
    if (this.textFormat === TextFormat.plainText) return '';

    const lastChar = this.writerText.slice(-1);
    const firstChar = s.slice(0, 1);

    // If the last char is a half-mark, and the first char is the same half-mark, insert a breakscape
    if (lastChar === firstChar && ALL_HALF_MARKS.indexOf(lastChar) !== -1) {
      return '^';
    }

    // If in the body and the first char is a bit tag start, and the last char is the second part of the tag,
    // insert a breakscape
    if (this.textLocation === TextLocation.body) {
      if (lastChar === '[' && ALL_TAG_OPENING_ENDS.indexOf(firstChar) !== -1) {
        return '^';
      }
    }

    // Normal case, no breakscape
    return '';
  }

  // protected getHrefTextFromHref

  protected validateGenerateOptions(ast: TextNode[]): void {
    // Validate plain text divider allowed
    if (this.generateOptions.plainTextDividerAllowed) {
      // Check there is only one node in the AST, and that it is a paragraph
      if (ast.length !== 1) {
        this.generateOptions.plainTextDividerAllowed = false;
      } else if (ast.length === 1 && ast[0].type !== TextNodeType.paragraph) {
        this.generateOptions.plainTextDividerAllowed = false;
      }
    }
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
      // If this is a mark within inline text, or a heading, only inline marks are allowed
      const forceSingleMark = !!(this.inInline || this.inHeading);

      // If node has marks, it cannot be a pre-text node
      this.thisNodeIsPreText = false;

      // Empty marks occur when the inline mark has no attributes - write an inline mark with no attributes
      const emptyMarks = node.marks.length === 0;
      if (emptyMarks) {
        // Write the mark start / end around the text
        this.writeMarkTextWrapper(INLINE_MARK);
        return;
      }

      // Single marks are only valid if there is only one mark for this text
      // They are only used in inline / heading marks since bitmark-- was dropped.
      const singleMark = node.marks.length === 1 && forceSingleMark;

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

      // Check the special case of a simple link mark
      const isSimpleLinkMark = this.isSimpleLink(node);

      const haveMark = markStartEnd != null && !isSimpleLinkMark;

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
            } else if (TextMarkType.link === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeLinkMark(mark as LinkMark);
            } else if (TextMarkType.ref === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeRefMark(mark as RefMark);
            } else if (TextMarkType.xref === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeXRefMark(mark as XRefMark);
            } else if (TextMarkType.extref === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeExtRefMark(mark as ExtRefMark);
            } else if (TextMarkType.footnote === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeFootnoteMark(mark as FootnoteMark);
            } else if (TextMarkType.footnoteStar === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeFootnoteStarMark(mark as FootnoteMark);
            } else if (TextMarkType.symbol === mark.type) {
              this.writeInlineMarkStartEnd();
              this.writeSymbolMark(mark as SymbolMark);
            } else if (INLINE_MARK_TYPES.indexOf(mark.type) !== -1) {
              this.writeInlineMarkStartEnd();
              this.writeInlineMark(mark);
            } else {
              // Do nothing
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
              TextMarkType.link === mark.type ||
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
    if (this.textFormat === TextFormat.bitmarkText) {
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

  protected writeImage(node: ImageTextNode | ImageInlineTextNode): void {
    if (node.attrs == null || !node.attrs.src) return;
    const attrs = node.attrs;

    const inlineImage = node.type === TextNodeType.imageInline;

    const mediaAttrs = this.getMediaAttrs(inlineImage ? 'imageInline' : 'image', attrs, {
      ignoreAttributes: inlineImage ? new Set(['alt', 'zoomDisabled', 'title']) : undefined,
    });

    let s = '';
    if (inlineImage) {
      s = `==${attrs.alt ?? ''}==`;
    }
    s += mediaAttrs ? `|${mediaAttrs}|` : '';

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

    const formula = this.breakscape(attrs.formula, {
      format: this.textFormat,
      location: this.textLocation,
    });

    const s = `==${formula}==|latex|`;

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
        if (
          (k === 'language' && v !== 'plain text') ||
          k === 'color' ||
          k === 'name' ||
          k === 'duration'
        ) {
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

  protected writeLinkMark(mark: LinkMark) {
    const href = mark.attrs?.href || '';

    // Apply link breakscaping
    const linkText = (href ?? '').replace(LINK_BREAKSCAPE_REGEX, '^]');

    const s = `link:${linkText}`;
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

  protected writeExtRefMark(mark: ExtRefMark) {
    const extref = mark.attrs?.extref ?? '';
    const refs = mark.attrs?.references ?? [];
    const provider = mark.attrs?.provider ?? '';

    let s = `extref:${extref}`;
    for (const ref of refs) {
      s += `|►${ref ?? ''}`;
    }
    s += `|provider:${provider}`;

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

  protected writeSymbolMark(mark: SymbolMark) {
    if (mark.attrs == null) return;
    const attrs = mark.attrs;

    const mediaAttrs = this.getMediaAttrs('symbol', attrs);
    const s = mediaAttrs ?? '';

    // Write the text
    this.write(s);
  }

  protected writeInlineMarkStartEnd() {
    this.write('|');
  }

  protected writePlainTextDivider(): void {
    this.write('==== text ====');
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

  protected writeInlineDebug(
    key: string,
    state: { open?: boolean; close?: boolean; single?: boolean },
  ) {
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

  protected getMediaAttrs(
    mediaType: string,
    attrs: MediaAttributes,
    options?: MediaAttributeOptions,
  ): string | undefined {
    if (!mediaType) return undefined;

    const opts = Object.assign({}, options);
    const ignoreAttributes = opts.ignoreAttributes ?? new Set();

    let s = `${mediaType}:${attrs?.src ?? ''}`;

    // Loop and write the attributes (except src, as written above)
    const entries = Object.entries(attrs).filter(([k, _v]) => k !== 'src');

    for (let i = 0; i < entries.length; i++) {
      const [k, v] = entries[i];

      // Ignore certain attributes
      if (ignoreAttributes.has(k)) continue;

      switch (k) {
        case 'textAlign':
          if (v !== 'left') s += `|captionAlign:${v}`;
          break;
        case 'alignment':
          if (v !== 'center') if (v) s += `|alignment:${v}`;
          break;
        case 'title':
          if (v) s += `|caption:${v}`;
          break;
        case 'class':
          if (v !== 'center') if (v) s += `|align:${v}`;
          break;
        case 'comment':
          if (v) s += `|#${v}`;
          break;
        case '':
          // This case handles reverse of strange behaviour in the text parser when a key is empty
          if (StringUtils.isString(v)) s += `|:${v}`;
          else s += `|`;
          break;
        case 'zoomDisabled':
          if (!v) s += '|zoomDisabled:false';
          break;
        case 'alt':
        case 'width':
        case 'height':
        default:
          if (k && v) s += `|${k}:${v}`;
          break;
      }
    }

    return s;
  }

  //
  // Helper functions
  //

  protected breakscape(s: string, options: BreakscapeOptions): string {
    if (this.generateOptions.noBreakscaping) return s;
    return Breakscape.breakscape(s, options);
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
    // Handle case where the already written text, combined with this text, would create an unwanted control
    // sequence, e.g. old* **new**. In this case, a ^ is inserted to break the sequence.
    value = this.getInterTextBreakscape(value) + value;

    if (this.options.writeCallback) {
      this.options.writeCallback(value);
    }
    this.writerText += value;

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
