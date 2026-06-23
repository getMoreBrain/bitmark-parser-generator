/**
 * Generate HTML `<table>` fragments from bitmark table bit-JSON.
 *
 * Consumes the JSON bit array (a string or parsed value), like {@link PlainTextGenerator}, and
 * renders each `table` / `table-extended` bit as a pretty-printed HTML `<table>` fragment. Cell
 * content (TextAst) is rendered back to inline/block HTML, mapping bitmark marks to inline tags.
 *
 * See PLAN-013 for the full specification.
 */

import type { TextAst, TextMark, TextNode } from '../../model/ast/TextNodes.ts';
import type {
  TableCellJson,
  TableExtendedJson,
  TableJson,
  TableSectionJson,
} from '../../model/json/BitJson.ts';
import { convertBasicToExtendedTableFormat } from '../../parser/json/TableUtils.ts';

type Section = 'header' | 'body' | 'footer';

// bitmark TextMarkType value -> HTML inline tag
const MARK_TO_TAG: Record<string, string> = {
  bold: 'b',
  italic: 'i',
  superscript: 'sup',
  subscript: 'sub',
  strike: 's',
  del: 'del',
  ins: 'ins',
  underline: 'u',
  highlight: 'mark',
  code: 'code',
};

// Existing bitmark text parsing can leave inline images as text tokens in table cells.
// Match the bitmark inline image shape `==alt==|imageInline:src|width:40|`:
// group 1 = text between `==` delimiters (alt), group 2 = src after `imageInline:`,
// group 3 = zero or more pipe-delimited attributes/comments following the src.
const INLINE_IMAGE_RE =
  /==([^=]*(?:=(?!=)[^=]*)*)==\|imageInline:([^|\s]+)((?:\|(?:@?[A-Za-z][A-Za-z0-9_-]*:[^|\s]+|#[^|\s]*))*)\|?/g;

interface BitLike {
  type?: string;
  caption?: TextAst | string;
  table?: TableJson | TableExtendedJson;
}

class HtmlTableGenerator {
  private readonly indentUnit = '  ';

  /**
   * Generate HTML table fragments from a string or JSON value.
   * @returns the concatenated `<table>` fragments, blank-line separated (empty string if none).
   */
  generate(input: string | unknown): string {
    let data: unknown = input;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return '';
      }
    }

    const bits = this.collectBits(data);
    const fragments: string[] = [];
    for (const bit of bits) {
      const html = this.renderTableBit(bit);
      if (html) fragments.push(html);
    }
    return fragments.join('\n\n');
  }

  // --- bit collection -------------------------------------------------------

  private collectBits(data: unknown): BitLike[] {
    const out: BitLike[] = [];
    const visit = (value: unknown): void => {
      if (value == null || typeof value !== 'object') return;
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      const obj = value as Record<string, unknown>;
      if ('bit' in obj && obj.bit && typeof obj.bit === 'object') {
        out.push(obj.bit as BitLike);
      } else if ('type' in obj) {
        out.push(obj as BitLike);
      }
    };
    visit(data);
    return out;
  }

  // --- table rendering ------------------------------------------------------

  private renderTableBit(bit: BitLike): string {
    const table = bit.table;
    if (!table) return '';
    if (bit.type !== 'table' && bit.type !== 'table-extended') return '';

    const extended = this.toExtended(table);

    const lines: string[] = [];
    lines.push('<table>');

    if (bit.caption != null) {
      const caption = this.cellContentToHtml(this.asTextAst(bit.caption));
      if (caption) lines.push(`${this.indentUnit}<caption>${caption}</caption>`);
    }

    this.renderSection(lines, 'thead', extended.header, 'header');
    this.renderSection(lines, 'tbody', extended.body, 'body');
    this.renderSection(lines, 'tfoot', extended.footer, 'footer');

    lines.push('</table>');
    return lines.join('\n');
  }

  private toExtended(table: TableJson | TableExtendedJson): TableExtendedJson {
    const t = table as TableJson & TableExtendedJson;
    if (t.header || t.body || t.footer) return table as TableExtendedJson;
    return convertBasicToExtendedTableFormat(table as TableJson);
  }

  private renderSection(
    lines: string[],
    tag: string,
    section: TableSectionJson | undefined,
    key: Section,
  ): void {
    if (!section || !section.rows || section.rows.length === 0) return;

    lines.push(`${this.indentUnit}<${tag}>`);
    for (const row of section.rows) {
      lines.push(`${this.indentUnit.repeat(2)}<tr>`);
      for (const cell of row.cells ?? []) {
        lines.push(`${this.indentUnit.repeat(3)}${this.renderCell(cell, key)}`);
      }
      lines.push(`${this.indentUnit.repeat(2)}</tr>`);
    }
    lines.push(`${this.indentUnit}</${tag}>`);
  }

  private renderCell(cell: TableCellJson, _key: Section): string {
    // Title-driven, matching the bitmark generator (section defaults are applied at parse time
    // when setting `title`, not at render time).
    const tag = cell.title === true ? 'th' : 'td';

    const attrs: string[] = [];
    if (cell.rowspan && cell.rowspan > 1) attrs.push(`rowspan="${cell.rowspan}"`);
    if (cell.colspan && cell.colspan > 1) attrs.push(`colspan="${cell.colspan}"`);
    if (cell.scope) attrs.push(`scope="${cell.scope}"`);
    if (cell.colwidth && cell.colwidth > 0) attrs.push(`width="${cell.colwidth}"`);

    const open = attrs.length > 0 ? `<${tag} ${attrs.join(' ')}>` : `<${tag}>`;
    return `${open}${this.cellContentToHtml(this.asTextAst(cell.content))}</${tag}>`;
  }

  // --- cell content (TextAst -> HTML) ---------------------------------------

  private asTextAst(content: TextAst | string | undefined): TextAst {
    if (content == null) return [];
    if (typeof content === 'string') return [{ type: 'text', text: content } as TextNode];
    return content;
  }

  private cellContentToHtml(blocks: TextAst): string {
    if (blocks.length === 0) return '';
    // Single bare paragraph: omit the <p> wrapper.
    if (blocks.length === 1 && blocks[0].type === 'paragraph') {
      return this.inlineToHtml(blocks[0].content ?? []);
    }
    return blocks.map((b) => this.blockToHtml(b)).join('');
  }

  private blockToHtml(node: TextNode): string {
    switch (node.type) {
      case 'paragraph':
        return `<p>${this.inlineToHtml(node.content ?? [])}</p>`;
      case 'bulletList':
      case 'noBulletList':
      case 'orderedList':
      case 'orderedListRoman':
      case 'orderedListRomanLower':
      case 'letteredList':
      case 'letteredListLower':
      case 'taskList':
        return this.listToHtml(node);
      case 'image':
      case 'imageInline':
        return this.imageToHtml(node);
      case 'latex':
        return this.latexToHtml(node);
      default:
        return this.inlineToHtml([node]);
    }
  }

  private inlineToHtml(nodes: TextNode[]): string {
    return nodes.map((n) => this.inlineNodeToHtml(n)).join('');
  }

  private inlineNodeToHtml(node: TextNode): string {
    if (node.type === 'hardBreak') return '<br>';
    if (node.type === 'image' || node.type === 'imageInline') return this.imageToHtml(node);
    if (node.type === 'latex') return this.latexToHtml(node);

    if (node.type === 'text') {
      return this.wrapMarks(this.textToHtml(node.text ?? ''), node.marks);
    }

    // Any other node: render its children inline.
    if (node.content) return this.inlineToHtml(node.content);
    return this.escapeText(node.text ?? '');
  }

  private wrapMarks(text: string, marks: TextMark[] | undefined): string {
    if (!marks || marks.length === 0) return text;

    let open = '';
    let close = '';
    for (const mark of marks) {
      if (mark.type === 'link') {
        const href = (mark as { attrs?: { href?: string } }).attrs?.href ?? '';
        open += `<a href="${this.escapeAttr(href)}">`;
        close = `</a>${close}`;
      } else {
        const tag = MARK_TO_TAG[mark.type];
        if (tag) {
          open += `<${tag}>`;
          close = `</${tag}>${close}`;
        }
        // Marks with no HTML mapping (light, highlight colours, etc.) -> inner text only.
      }
    }
    return `${open}${text}${close}`;
  }

  // --- lists ----------------------------------------------------------------

  private listToHtml(node: TextNode): string {
    const { tag, attrs } = this.listTag(node);
    const items = (node.content ?? [])
      .map((item) => this.listItemToHtml(item, node.type === 'taskList'))
      .join('');
    return `<${tag}${attrs}>${items}</${tag}>`;
  }

  private listTag(node: TextNode): { tag: string; attrs: string } {
    const start = (node as { attrs?: { start?: number } }).attrs?.start;
    const startAttr = typeof start === 'number' && start !== 1 ? ` start="${start}"` : '';
    switch (node.type) {
      case 'orderedList':
        return { tag: 'ol', attrs: startAttr };
      case 'orderedListRoman':
        return { tag: 'ol', attrs: ` type="I"${startAttr}` };
      case 'orderedListRomanLower':
        return { tag: 'ol', attrs: ` type="i"${startAttr}` };
      case 'letteredList':
        return { tag: 'ol', attrs: ` type="A"${startAttr}` };
      case 'letteredListLower':
        return { tag: 'ol', attrs: ` type="a"${startAttr}` };
      case 'noBulletList':
        return { tag: 'ul', attrs: ' style="list-style:none"' };
      case 'taskList':
      case 'bulletList':
      default:
        return { tag: 'ul', attrs: '' };
    }
  }

  private listItemToHtml(item: TextNode, task: boolean): string {
    const inner = (item.content ?? [])
      .map((b) => {
        // List-item paragraphs render inline (no <p> wrapper); nested lists render as lists.
        if (b.type === 'paragraph') return this.inlineToHtml(b.content ?? []);
        return this.blockToHtml(b);
      })
      .join('');

    if (task) {
      const checked = (item as { attrs?: { checked?: boolean } }).attrs?.checked ? ' checked' : '';
      return `<li><input type="checkbox"${checked}>${inner}</li>`;
    }
    return `<li>${inner}</li>`;
  }

  // --- images ---------------------------------------------------------------

  private imageToHtml(node: TextNode): string {
    const attrs = (node as { attrs?: Record<string, unknown> }).attrs ?? {};
    const parts: string[] = [];
    const src = attrs.src;
    parts.push(`src="${this.escapeAttr(typeof src === 'string' ? src : '')}"`);
    if (typeof attrs.alt === 'string') parts.push(`alt="${this.escapeAttr(attrs.alt)}"`);
    if (typeof attrs.title === 'string') parts.push(`title="${this.escapeAttr(attrs.title)}"`);
    if (attrs.width != null) parts.push(`width="${attrs.width}"`);
    if (attrs.height != null) parts.push(`height="${attrs.height}"`);
    if (typeof attrs.class === 'string' && attrs.class) {
      parts.push(`class="${this.escapeAttr(attrs.class)}"`);
    }
    return `<img ${parts.join(' ')}>`;
  }

  private textToHtml(text: string): string {
    let html = '';
    let lastIndex = 0;

    for (const match of text.matchAll(INLINE_IMAGE_RE)) {
      const index = match.index ?? 0;
      html += this.escapeText(text.slice(lastIndex, index));
      html += this.inlineImageTokenToHtml(match);
      lastIndex = index + match[0].length;
    }

    html += this.escapeText(text.slice(lastIndex));
    return html;
  }

  private inlineImageTokenToHtml(match: RegExpMatchArray): string {
    const attrs: Record<string, unknown> = {
      alt: match[1],
      src: match[2],
    };

    const rawAttrs = match[3] ?? '';
    for (const attr of rawAttrs.split('|')) {
      if (!attr || attr.startsWith('#')) continue;
      const colon = attr.indexOf(':');
      if (colon < 1) continue;

      const key = attr.slice(0, colon).replace(/^@/, '');
      const value = attr.slice(colon + 1);
      if (key === 'width' || key === 'height') {
        const n = Number.parseInt(value, 10);
        if (!Number.isNaN(n) && n > 0) attrs[key] = n;
      } else if (key === 'class' || key === 'title') {
        attrs[key] = value;
      }
    }

    return this.imageToHtml({ type: 'imageInline', attrs } as unknown as TextNode);
  }

  // --- formulas -------------------------------------------------------------

  private latexToHtml(node: TextNode): string {
    const formula = (node as { attrs?: { formula?: string } }).attrs?.formula ?? '';
    return `<math alttext="${this.escapeAttr(formula)}"></math>`;
  }

  // --- escaping -------------------------------------------------------------

  private escapeText(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private escapeAttr(text: string): string {
    return this.escapeText(text).replace(/"/g, '&quot;');
  }
}

export { HtmlTableGenerator };
