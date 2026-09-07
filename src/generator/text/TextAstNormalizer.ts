/**
 * Rewrites a text AST into one the text grammar can express (PLAN-022).
 *
 * The generator walks the result and can then write every node as-is. Each container admits only
 * the child node types its grammar rule produces; anything else is reduced at the smallest
 * granularity, always keeping the text:
 *
 * - block context (root, body): heading / paragraph / lists / image / codeBlock
 * - inline context (paragraph and heading content; the root at tag location): text / hardBreak /
 *   imageInline / latex / body bits - block children are flattened
 * - list: listItem / taskItem, each starting with a paragraph and holding at most one sublist
 * - code: plain text
 * - chain value (footnote content): plain text and single short-form standard marks
 */
import { type TextAst, type TextMark, type TextNode } from '../../model/ast/TextNodes.ts';
import { type TextFormatType } from '../../model/enum/TextFormat.ts';
import { TextLocation, type TextLocationType } from '../../model/enum/TextLocation.ts';
import { TextMarkType } from '../../model/enum/TextMarkType.ts';
import { TextNodeType, type TextNodeTypeType } from '../../model/enum/TextNodeType.ts';
import {
  bareUrlText,
  hasLineTerminator,
  isHeadingLevel,
  isInlineAlt,
  isUrl,
  isUrlChar,
  isUrlHttp,
  toUInt,
} from './TextGrammarConstraints.ts';
import { sanitizeMarks } from './TextMarkSanitizer.ts';
import { sanitizeMediaAttrs } from './TextMediaAttrs.ts';

export interface NormalizeOptions {
  format: TextFormatType;
  location: TextLocationType;
  /** The AST is footnote content (chain value context) */
  chainValue?: boolean;
}

interface InlineOptions {
  /** No inline media, marks restricted (chain value) */
  plain?: boolean;
  /** Footnote content */
  chainValue?: boolean;
  /** hardBreak → space (single-line containers) */
  singleLine?: boolean;
  /** Continuation lines of a list item cannot start with tabs (indentation to the parser) */
  stripLeadingTabs?: boolean;
}

type Loose = Record<string, unknown> & { type?: unknown; content?: unknown; attrs?: unknown };

const LIST_TYPES: readonly TextNodeTypeType[] = [
  TextNodeType.noBulletList,
  TextNodeType.bulletList,
  TextNodeType.orderedList,
  TextNodeType.orderedListRoman,
  TextNodeType.orderedListRomanLower,
  TextNodeType.letteredList,
  TextNodeType.letteredListLower,
  TextNodeType.taskList,
];

const ORDERED_LIST_TYPES: readonly TextNodeTypeType[] = [
  TextNodeType.orderedList,
  TextNodeType.orderedListRoman,
  TextNodeType.orderedListRomanLower,
];

const BODY_BIT_TYPES: readonly TextNodeTypeType[] = [
  TextNodeType.gap,
  TextNodeType.select,
  TextNodeType.highlight,
  TextNodeType.mark,
];

const LEADING_TAB_REGEX = /(^|[\n\r\u2028\u2029])\t+/g;

const isList = (n: Loose) => LIST_TYPES.indexOf(n.type as TextNodeTypeType) !== -1;
const isListItem = (n: Loose) =>
  n.type === TextNodeType.listItem || n.type === TextNodeType.taskItem;
const isBodyBit = (n: Loose) => BODY_BIT_TYPES.indexOf(n.type as TextNodeTypeType) !== -1;
const isNode = (n: unknown): n is Loose =>
  !!n && typeof n === 'object' && typeof (n as Loose).type === 'string';
const contentOf = (n: Loose): Loose[] =>
  Array.isArray(n.content) ? (n.content as unknown[]).filter(isNode) : [];
const attrsOf = (n: Loose): Record<string, unknown> =>
  n.attrs && typeof n.attrs === 'object' ? (n.attrs as Record<string, unknown>) : {};
const asNode = (n: unknown): TextNode => n as TextNode;
const paragraph = (content: TextNode[]): TextNode =>
  asNode({ type: TextNodeType.paragraph, attrs: {}, content });
const hardBreak = (): TextNode => ({ type: TextNodeType.hardBreak }) as TextNode;
const isHardBreak = (n: TextNode | undefined) => n?.type === TextNodeType.hardBreak;
const hasText = (nodes: TextNode[]) =>
  nodes.some(
    (n) =>
      n.type !== TextNodeType.hardBreak &&
      (n.type !== TextNodeType.text || (typeof n.text === 'string' && n.text.trim() !== '')),
  );

/**
 * True if a bare URL (the link short form) can be followed by `next`: the parser's Url rule
 * consumes every following UrlChar, including the '=' of '==...==' and the '*' of '**'.
 */
export function canFollowBareUrl(next: TextNode | undefined): boolean {
  if (!next) return true;
  if (next.type === TextNodeType.hardBreak) return true;
  if (next.type !== TextNodeType.text) return false;
  if (next.marks && next.marks.length > 0) return false;
  const first = (next.text ?? '').charAt(0);
  return first === '' || !isUrlChar(first);
}

/**
 * True if the text node is a simple link: a single link mark whose href is a Url and whose text
 * is the href without protocol, so it can be written as the bare URL.
 */
export function isSimpleLinkNode(node: TextNode, next: TextNode | undefined): boolean {
  if (node.type !== TextNodeType.text || node.marks?.length !== 1) return false;
  const m = node.marks[0];
  if (m.type !== TextMarkType.link) return false;
  const href = (m.attrs as { href?: unknown } | undefined)?.href;
  return isUrl(href) && bareUrlText(href) === node.text && canFollowBareUrl(next);
}

const FLATTENED_BLOCK_TYPES: readonly TextNodeTypeType[] = [
  TextNodeType.paragraph,
  TextNodeType.heading,
  TextNodeType.section,
  TextNodeType.listItem,
  TextNodeType.taskItem,
  TextNodeType.codeBlock,
];

class TextAstNormalizer {
  private options: NormalizeOptions;

  constructor(options: NormalizeOptions) {
    this.options = options;
  }

  normalize(ast: unknown): TextAst {
    if (!Array.isArray(ast)) return [];
    const nodes = ast.filter(isNode);

    if (this.options.chainValue) return this.inline(nodes, { plain: true, chainValue: true });

    // Tag text (bitmarkPlus) has no blocks. Note: the text format does not restrict the
    // markup - the bitmark generator regenerates plain-text bodies from a parsed AST too.
    if (this.options.location === TextLocation.tag) {
      return nodes.flatMap((n) => this.inlineRootNode(n, {}));
    }

    return nodes.flatMap((n) => this.block(n));
  }

  //
  // Block context
  //

  private block(n: Loose): TextNode[] {
    switch (n.type) {
      case TextNodeType.paragraph:
        return [{ ...n, content: this.inline(contentOf(n)) } as TextNode];

      case TextNodeType.heading:
        return this.heading(n);

      case TextNodeType.section:
        return [paragraph(this.inline(contentOf(n)))];

      case TextNodeType.image: {
        const image = this.image(n);
        return image ? [image] : [];
      }

      case TextNodeType.codeBlock:
        return [{ ...n, content: this.code(contentOf(n)) } as TextNode];

      case TextNodeType.text:
      case TextNodeType.hardBreak:
      case TextNodeType.imageInline:
      case TextNodeType.latex:
        return this.inline([n]);

      default:
        if (isList(n)) return this.list(n);
        if (isListItem(n)) return [paragraph(this.inline(contentOf(n)))];
        if (isBodyBit(n)) return [n as TextNode];
        // Unknown block type: content written as-is (existing behaviour), sanitised
        if (Array.isArray(n.content))
          return [{ ...n, content: this.blocks(contentOf(n)) } as TextNode];
        return [n as TextNode];
    }
  }

  private blocks(nodes: Loose[]): TextNode[] {
    return nodes.flatMap((n) => this.block(n));
  }

  private heading(n: Loose): TextNode[] {
    const level = attrsOf(n).level;
    if (level != null && !isHeadingLevel(level)) {
      // TitleTags are mandatory: not a heading
      return [paragraph(this.inline(contentOf(n)))];
    }
    const content = this.inline(contentOf(n), { singleLine: true });
    // '# ' alone re-parses as the paragraph '#'
    if (!hasText(content)) return [];
    return [{ ...n, content } as TextNode];
  }

  private image(n: Loose): TextNode | undefined {
    const attrs = attrsOf(n);
    if (!isUrlHttp(attrs.src)) return undefined;
    return asNode({ ...n, attrs: { src: attrs.src, ...sanitizeMediaAttrs('image', attrs) } });
  }

  private code(nodes: Loose[]): TextNode[] {
    const result: TextNode[] = [];
    for (const n of nodes) {
      if (n.type === TextNodeType.text) {
        if (typeof n.text === 'string' && n.text) {
          result.push({ type: TextNodeType.text, text: n.text } as TextNode);
        }
      } else if (n.type === TextNodeType.hardBreak) {
        result.push(hardBreak());
      } else {
        result.push(...this.code(contentOf(n)));
      }
    }
    return result;
  }

  //
  // List context
  //

  private list(n: Loose): TextNode[] {
    const attrs = attrsOf(n);
    const ordered = ORDERED_LIST_TYPES.indexOf(n.type as TextNodeTypeType) !== -1;
    let start: number | undefined;
    if (ordered && attrs.start != null) {
      start = toUInt(attrs.start);
      // The bullet digits are mandatory: not a list. Each item becomes a paragraph.
      if (start === undefined) {
        return contentOf(n).map((item) =>
          paragraph(this.inline([item], { stripLeadingTabs: true })),
        );
      }
    }

    const items: TextNode[] = [];
    for (const child of contentOf(n)) {
      if (isListItem(child)) {
        items.push(...this.listItem(child));
      } else {
        // A list (or anything else) directly inside a list: an item holds it
        items.push(...this.listItem({ type: TextNodeType.listItem, content: [child] }));
      }
    }
    if (items.length === 0) return [];

    const newAttrs = { ...attrs };
    if (ordered && start !== undefined) newAttrs.start = start;
    return [asNode({ ...n, attrs: newAttrs, content: items })];
  }

  /**
   * A list item holds a paragraph, then at most one sublist. Everything else is merged into the
   * paragraph; further sublists become new items (with an empty paragraph, which keeps them
   * attached). Returns the resulting item(s).
   */
  private listItem(item: Loose): TextNode[] {
    const inlineOpts: InlineOptions = { stripLeadingTabs: true };
    const acc: { para?: TextNode[] } = {};
    let sublist: TextNode | undefined;
    const extraItems: TextNode[] = [];

    const merge = (inline: TextNode[]) => {
      if (!acc.para) acc.para = inline;
      else if (inline.length > 0) acc.para.push(hardBreak(), ...inline);
    };

    for (const child of contentOf(item)) {
      if (isList(child)) {
        for (const list of this.list(child)) {
          if (list.type === TextNodeType.paragraph) {
            merge(list.content ?? []);
          } else if (!sublist) {
            sublist = list;
          } else {
            extraItems.push({ ...item, content: [paragraph([]), list] } as TextNode);
          }
        }
      } else if (child.type === TextNodeType.image) {
        // no inline form
      } else {
        merge(this.inline([child], inlineOpts));
      }
    }

    const paraContent = acc.para ?? [];
    // An item with nothing in it ('• ' alone) re-parses as literal text
    if (!hasText(paraContent) && !sublist) return extraItems;

    const content: TextNode[] = [paragraph(paraContent)];
    if (sublist) content.push(sublist);
    return [{ ...item, content } as TextNode, ...extraItems];
  }

  //
  // Inline context
  //

  /** A root node at tag location: paragraphs of inline content only */
  private inlineRootNode(n: Loose, opts: InlineOptions): TextNode[] {
    switch (n.type) {
      case TextNodeType.text:
      case TextNodeType.hardBreak:
      case TextNodeType.imageInline:
      case TextNodeType.latex:
        return this.inline([n], opts);
      case TextNodeType.image:
        return [];
      default:
        if (isBodyBit(n)) return [n as TextNode];
        if (isList(n)) {
          // One paragraph per item
          return contentOf(n).map((item) =>
            paragraph(this.inline([item], { ...opts, stripLeadingTabs: true })),
          );
        }
        return [paragraph(this.inline(contentOf(n), opts))];
    }
  }

  private inline(nodes: Loose[], opts: InlineOptions = {}): TextNode[] {
    const result: TextNode[] = [];
    const separator = () => (opts.singleLine ? this.spaceText() : hardBreak());
    const separate = () => {
      if (result.length > 0 && !isHardBreak(result[result.length - 1])) result.push(separator());
    };

    for (const n of nodes) {
      switch (n.type) {
        case TextNodeType.text: {
          const text = this.text(n, opts);
          if (text) result.push(text);
          break;
        }
        case TextNodeType.hardBreak:
          result.push(separator());
          break;
        case TextNodeType.imageInline: {
          if (opts.plain) break;
          const image = this.imageInline(n);
          if (image) result.push(image);
          break;
        }
        case TextNodeType.latex:
          if (opts.plain) break;
          if (typeof attrsOf(n).formula === 'string') result.push(n as TextNode);
          break;
        case TextNodeType.image:
          break;
        default:
          if (isBodyBit(n)) {
            result.push(n as TextNode);
          } else if (isList(n)) {
            // Each item on its own line
            for (const item of contentOf(n)) {
              separate();
              result.push(...this.inline([item], opts));
            }
          } else if (FLATTENED_BLOCK_TYPES.indexOf(n.type as TextNodeTypeType) !== -1) {
            // paragraph, heading, listItem, codeBlock, section: flatten onto its own line
            separate();
            result.push(...this.inline(contentOf(n), opts));
          } else if (Array.isArray(n.content)) {
            // Unknown node type: kept, content sanitised (existing behaviour)
            result.push({ ...n, content: this.inline(contentOf(n), opts) } as TextNode);
          } else {
            result.push(n as TextNode);
          }
      }
    }
    return this.dropSymbolsBeforePipes(result);
  }

  /**
   * A symbol's media chain swallows every following `...|` segment on its line (even when sealed
   * with `^`), so a symbol mark has no representable form when the rest of the line contains `|`.
   */
  private dropSymbolsBeforePipes(nodes: TextNode[]): TextNode[] {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (!n.marks?.some((m) => m.type === TextMarkType.symbol)) continue;
      let pipeFollows = false;
      for (let j = i + 1; j < nodes.length && !isHardBreak(nodes[j]); j++) {
        const text = nodes[j].text;
        if (typeof text !== 'string') continue;
        const firstLine = text.split(/[\n\r\u2028\u2029]/, 1)[0];
        if (firstLine.indexOf('|') !== -1) pipeFollows = true;
        if (hasLineTerminator(text)) break;
      }
      if (pipeFollows) {
        const marks = n.marks.filter((m) => m.type !== TextMarkType.symbol);
        const { marks: _m, ...rest } = n;
        nodes[i] = (marks.length > 0 ? { ...rest, marks } : rest) as TextNode;
      }
    }
    return nodes;
  }

  private text(n: Loose, opts: InlineOptions): TextNode | undefined {
    if (typeof n.text !== 'string') return undefined;
    let text = n.text;
    if (opts.stripLeadingTabs) text = text.replace(LEADING_TAB_REGEX, '$1');
    if (opts.singleLine) text = text.replace(/[\n\r\u2028\u2029]+/g, ' ');
    if (!text) return undefined;

    const marks: TextMark[] = sanitizeMarks(n.marks, {
      chainValue: opts.chainValue,
      normalizeChainValue: (content) => this.chainValue(content),
    });

    const { marks: _m, ...rest } = n;
    return (marks.length > 0 ? { ...rest, text, marks } : { ...rest, text }) as TextNode;
  }

  private spaceText(): TextNode {
    return { type: TextNodeType.text, text: ' ' } as TextNode;
  }

  private imageInline(n: Loose): TextNode | undefined {
    const attrs = attrsOf(n);
    // src (Url) and the ==alt== segment are mandatory
    if (!isUrl(attrs.src)) return undefined;
    const alt = attrs.alt;
    if (!isInlineAlt(alt)) return undefined;
    return asNode({
      ...n,
      attrs: { src: attrs.src, alt, ...sanitizeMediaAttrs('imageInline', attrs) },
    });
  }

  /**
   * Footnote content: a `|`-free single line of plain text with short-form standard marks.
   * Returns undefined when the content cannot be represented.
   */
  private chainValue(content: unknown): TextNode[] | undefined {
    if (!Array.isArray(content)) return [];
    const nodes = this.inline(content.filter(isNode), {
      plain: true,
      chainValue: true,
      singleLine: true,
    });
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const text = n.text;
      if (typeof text === 'string' && (text.indexOf('|') !== -1 || hasLineTerminator(text))) {
        return undefined;
      }
      // A link survives only as a bare URL (the chain form contains '|')
      if (
        n.marks?.some((m) => m.type === TextMarkType.link) &&
        !isSimpleLinkNode(n, nodes[i + 1])
      ) {
        const { marks: _m, ...rest } = n;
        nodes[i] = rest as TextNode;
      }
    }
    return nodes;
  }
}

/**
 * Normalise a text AST so that every node can be written as markup the text grammar parses back.
 */
export function normalizeTextAst(ast: unknown, options: NormalizeOptions): TextAst {
  return new TextAstNormalizer(options).normalize(ast);
}
