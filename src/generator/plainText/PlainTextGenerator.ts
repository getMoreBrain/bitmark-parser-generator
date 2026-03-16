import {
  type FootnoteMark,
  type ImageTextNode,
  type LatexTextNode,
  type LinkMark,
  type ListTextNode,
  type TaskItemTextNode,
  type TextAst,
  type TextMark,
  type TextNode,
} from '../../model/ast/TextNodes.ts';
import { TextNodeType } from '../../model/enum/TextNodeType.ts';

const TEXT_NODE_TYPES = new Set<string>(Object.values(TextNodeType));

/**
 * Extracts plain text from bitmark JSON structures.
 *
 * Accepts a string (optionally JSON-encoded) or a parsed JSON value that is one of:
 * - BitWrapperJson (single or array)
 * - BitJson
 * - TextAst
 * - TextNode
 * - plain string
 *
 * Walks the structure, converts every TextNode to unformatted text, and returns
 * the concatenated result.
 */
class PlainTextGenerator {
  /**
   * Generate plain text from a string or JSON object.
   *
   * @param input - A string (plain or JSON-encoded) or a parsed JSON value.
   * @returns The extracted plain text.
   */
  generate(input: string | unknown): string {
    let data: unknown = input;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (_e) {
        // Not valid JSON – treat as a plain string
        return data as string;
      }
    }

    return this.walk(data).trim();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private walk(value: unknown): string {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value !== 'object') return '';

    if (Array.isArray(value)) {
      if (value.length === 0) return '';

      // Array of TextNodes → TextAst
      if (this.isTextAst(value)) {
        return this.textAstToPlainText(value as TextAst);
      }

      // Array of BitWrapperJson, or other mixed array – recurse each element
      return value
        .map((v) => this.walk(v))
        .filter(Boolean)
        .join('\n');
    }

    const obj = value as Record<string, unknown>;

    // Single TextNode
    if (this.isTextNode(obj)) {
      return this.textNodeToPlainText(obj as unknown as TextNode);
    }

    // BitWrapperJson – delegate to the inner bit
    if (this.isBitWrapper(obj)) {
      return this.walk(obj['bit']);
    }

    // Generic object (BitJson or any nested structure) – walk all values,
    // collecting text only from structurally-detected TextNode / TextAst children.
    const parts: string[] = [];
    for (const val of Object.values(obj)) {
      if (val == null || typeof val !== 'object') continue;

      const text = this.walk(val);
      if (text) parts.push(text);
    }

    return parts.join('\n');
  }

  // -- Type guards -----------------------------------------------------------

  private isTextNode(obj: Record<string, unknown>): boolean {
    return typeof obj['type'] === 'string' && TEXT_NODE_TYPES.has(obj['type']);
  }

  private isTextAst(arr: unknown[]): boolean {
    const first = arr[0];
    return (
      typeof first === 'object' &&
      first !== null &&
      !Array.isArray(first) &&
      this.isTextNode(first as Record<string, unknown>)
    );
  }

  private isBitWrapper(obj: Record<string, unknown>): boolean {
    return (
      'bit' in obj &&
      typeof obj['bit'] === 'object' &&
      obj['bit'] !== null &&
      !Array.isArray(obj['bit'])
    );
  }

  // -- TextNode extraction ---------------------------------------------------

  private textAstToPlainText(ast: TextAst): string {
    return ast.map((node) => this.textNodeToPlainText(node)).join('\n');
  }

  private textNodeToPlainText(node: TextNode): string {
    const { type, text, content } = node;

    switch (type) {
      case TextNodeType.text:
        return this.textWithMarks(node);

      case TextNodeType.hardBreak:
        return '\n';

      // Block elements whose children are joined without extra separator
      case TextNodeType.paragraph:
      case TextNodeType.heading:
      case TextNodeType.section:
      case TextNodeType.gap:
      case TextNodeType.select:
      case TextNodeType.highlight:
      case TextNodeType.mark:
      case TextNodeType.codeBlock:
        return content ? content.map((c) => this.textNodeToPlainText(c)).join('') : (text ?? '');

      // List items are handled by listToPlainText with indent context
      case TextNodeType.listItem:
        return content ? content.map((c) => this.textNodeToPlainText(c)).join('') : (text ?? '');

      // Task item – handled by taskListToPlainText, but fallback if encountered standalone
      case TextNodeType.taskItem: {
        const checked = (node as TaskItemTextNode).attrs?.checked ?? false;
        const prefix = checked ? '[x] ' : '[ ] ';
        const itemText = content
          ? content.map((c) => this.textNodeToPlainText(c)).join('')
          : (text ?? '');
        return `${prefix}${itemText}`;
      }

      // List containers – rendered with indent-aware helper
      case TextNodeType.noBulletList:
      case TextNodeType.bulletList:
      case TextNodeType.orderedList:
      case TextNodeType.orderedListRoman:
      case TextNodeType.orderedListRomanLower:
      case TextNodeType.letteredList:
      case TextNodeType.letteredListLower:
        return this.listToPlainText(node as ListTextNode, 0);

      // Task list – rendered with indent-aware helper
      case TextNodeType.taskList:
        return this.taskListToPlainText(node, 0);

      // Images – return alt text when available
      case TextNodeType.image:
      case TextNodeType.imageInline: {
        const attrs = (node as ImageTextNode).attrs;
        return attrs?.alt ?? '';
      }

      // LaTeX – return the formula source
      case TextNodeType.latex: {
        const latexAttrs = (node as LatexTextNode).attrs;
        return latexAttrs?.formula ?? '';
      }

      default:
        return content ? content.map((c) => this.textNodeToPlainText(c)).join('') : (text ?? '');
    }
  }

  private listToPlainText(node: ListTextNode, depth: number): string {
    const { type, content } = node;
    if (!content || content.length === 0) return '';

    const indent = '  '.repeat(depth);
    const start = node.attrs?.start ?? 1;
    // Roman numeral lists use 0-based start in bitmark; adjust to 1-based for display
    const displayStart = start < 1 ? start + 1 : start;

    return content
      .map((child, i) => {
        const { inline, nested } = this.splitListItemContent(child, depth);
        const prefix = this.listItemPrefix(type, displayStart + i);
        const line = `${indent}${prefix}${inline}`;
        return nested ? `${line}\n${nested}` : line;
      })
      .join('\n');
  }

  private taskListToPlainText(node: TextNode, depth: number): string {
    const { content } = node;
    if (!content || content.length === 0) return '';

    const indent = '  '.repeat(depth);

    return content
      .map((child) => {
        const checked = (child as TaskItemTextNode).attrs?.checked ?? false;
        const prefix = checked ? '[x] ' : '[ ] ';
        const { inline, nested } = this.splitListItemContent(child, depth);
        const line = `${indent}${prefix}${inline}`;
        return nested ? `${line}\n${nested}` : line;
      })
      .join('\n');
  }

  private splitListItemContent(item: TextNode, depth: number): { inline: string; nested: string } {
    const children = item.content ?? [];
    const inlineParts: string[] = [];
    const nestedParts: string[] = [];

    for (const child of children) {
      if (this.isListType(child.type)) {
        nestedParts.push(this.renderNestedList(child, depth + 1));
      } else {
        inlineParts.push(this.textNodeToPlainText(child));
      }
    }

    return {
      inline: inlineParts.join(''),
      nested: nestedParts.join('\n'),
    };
  }

  private isListType(type: string): boolean {
    return (
      type === TextNodeType.bulletList ||
      type === TextNodeType.orderedList ||
      type === TextNodeType.orderedListRoman ||
      type === TextNodeType.orderedListRomanLower ||
      type === TextNodeType.letteredList ||
      type === TextNodeType.letteredListLower ||
      type === TextNodeType.noBulletList ||
      type === TextNodeType.taskList
    );
  }

  private renderNestedList(node: TextNode, depth: number): string {
    if (node.type === TextNodeType.taskList) {
      return this.taskListToPlainText(node, depth);
    }
    return this.listToPlainText(node as ListTextNode, depth);
  }

  private listItemPrefix(listType: ListTextNode['type'], index: number): string {
    switch (listType) {
      case TextNodeType.bulletList:
        return '\u2022 ';
      case TextNodeType.orderedList:
        return `${index}. `;
      case TextNodeType.orderedListRoman:
        return `${this.toRoman(index)}. `;
      case TextNodeType.orderedListRomanLower:
        return `${this.toRoman(index).toLowerCase()}. `;
      case TextNodeType.letteredList:
        return `${this.toLetter(index)}. `;
      case TextNodeType.letteredListLower:
        return `${this.toLetter(index).toLowerCase()}. `;
      case TextNodeType.noBulletList:
      default:
        return '';
    }
  }

  private toRoman(num: number): string {
    const romanNumerals: [number, string][] = [
      [1000, 'M'],
      [900, 'CM'],
      [500, 'D'],
      [400, 'CD'],
      [100, 'C'],
      [90, 'XC'],
      [50, 'L'],
      [40, 'XL'],
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I'],
    ];
    let result = '';
    let remaining = num;
    for (const [value, numeral] of romanNumerals) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }
    return result;
  }

  private toLetter(num: number): string {
    // 1 → A, 2 → B, ..., 26 → Z, 27 → AA, etc.
    let result = '';
    let remaining = num;
    while (remaining > 0) {
      remaining--;
      result = String.fromCharCode(65 + (remaining % 26)) + result;
      remaining = Math.floor(remaining / 26);
    }
    return result;
  }

  private textWithMarks(node: TextNode): string {
    const { text, marks } = node;
    const parts: string[] = [];

    // Check for a link mark
    const linkMark = marks?.find((m: TextMark) => m.type === 'link') as LinkMark | undefined;
    const href = linkMark?.attrs?.href;

    if (text && href && text !== href) {
      // Strip protocol to get the bare domain/path form
      const hrefBare = href.replace(/^https?:\/\//, '');
      if (text.includes(hrefBare)) {
        // The display text contains the bare URL – replace with the full URL
        parts.push(text.replace(hrefBare, href));
      } else if (text.includes(href)) {
        // The display text already contains the full URL
        parts.push(text);
      } else {
        // Display text is unrelated to the URL – append it
        parts.push(`${text} ${href}`);
      }
    } else if (text) {
      parts.push(text);
    } else if (href) {
      parts.push(href);
    }

    // Append content from marks that carry their own text (e.g. footnotes)
    if (marks) {
      for (const mark of marks) {
        if (mark.type === 'footnote') {
          const footnote = mark as unknown as FootnoteMark;
          if (footnote.attrs?.content) {
            const footnoteText = footnote.attrs.content
              .map((c) => this.textNodeToPlainText(c))
              .join('');
            if (footnoteText) parts.push(footnoteText);
          }
        }
      }
    }

    return parts.join(' ');
  }
}

export { PlainTextGenerator };
