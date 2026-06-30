/**
 * Extract HTML tables and convert them into bitmark table bit-JSON.
 *
 * Produces an array of bare `BitJson`-shaped objects (`type` = `table-extended` or `table`) that
 * can be fed directly into the existing JSON → AST → output pipeline. Cell content is built as
 * `TextAst` (rich text nodes) directly; the downstream generators handle serialisation and
 * breakscaping.
 *
 * See PLAN-013 for the full specification.
 */

import type { TextAst, TextMark, TextNode } from '../../model/ast/TextNodes.ts';
import type {
  TableCellJson,
  TableExtendedJson,
  TableJson,
  TableRowJson,
} from '../../model/json/BitJson.ts';
import { convertExtendedToBasicTableFormat } from '../json/TableUtils.ts';
import { childElements, type HtmlElement, type HtmlNode, parseHtml } from './HtmlDom.ts';

export type HtmlTableFormat = 'table' | 'table-extended';

export interface HtmlTableParseOptions {
  /** Output bit type. Default `table-extended` (lossless). `table` is lossy. */
  tableFormat?: HtmlTableFormat;
  /** Keep unmappable tags as literal text instead of unwrapping them. Default false. */
  keepUnknownTags?: boolean;
  /** Called with a human-readable message when information is lost (e.g. lossy `table` output). */
  onWarning?: (message: string) => void;
}

/** Loosely-typed table bit JSON (matches a subset of BitJson). */
export interface TableBitJson {
  type: HtmlTableFormat;
  format: 'bitmark++';
  caption?: TextAst;
  table: TableJson | TableExtendedJson;
}

// HTML inline tag -> bitmark TextMarkType value
const MARK_TAGS: Record<string, string> = {
  b: 'bold',
  strong: 'bold',
  i: 'italic',
  em: 'italic',
  sup: 'superscript',
  sub: 'subscript',
  s: 'strike',
  strike: 'strike',
  del: 'del',
  ins: 'ins',
  u: 'underline',
  mark: 'highlight',
  code: 'code',
};

const SECTION_TAGS = new Set(['thead', 'tbody', 'tfoot']);
const ROW_TAGS = new Set(['tr']);
const CELL_TAGS = new Set(['td', 'th']);
const LI_TAGS = new Set(['li']);
const VALID_SCOPES = new Set(['row', 'col', 'rowgroup', 'colgroup']);

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (whole, body: string) => {
    if (body[0] === '#') {
      const code =
        body[1] === 'x' || body[1] === 'X'
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10);
      if (Number.isFinite(code) && code >= 0 && code <= 0x10ffff) {
        try {
          return String.fromCodePoint(code);
        } catch {
          return whole;
        }
      }
      return whole;
    }
    return NAMED_ENTITIES[body] ?? whole;
  });
}

function intAttr(value: string | undefined): number | undefined {
  if (value == null) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) ? n : undefined;
}

function isElement(node: HtmlNode): node is HtmlElement {
  return node.type === 'element';
}

export class HtmlTableParser {
  private keepUnknownTags = false;

  /**
   * Parse an HTML string and return one table bit per top-level `<table>`.
   */
  parse(html: string, options?: HtmlTableParseOptions): TableBitJson[] {
    this.keepUnknownTags = options?.keepUnknownTags ?? false;
    const tableFormat: HtmlTableFormat = options?.tableFormat ?? 'table-extended';
    const onWarning = options?.onWarning;

    const tables = this.collectTopLevelTables(parseHtml(html));
    const bits: TableBitJson[] = [];

    for (const table of tables) {
      const bit = this.tableToBit(table, tableFormat, onWarning);
      if (bit) bits.push(bit);
    }

    return bits;
  }

  // --- table extraction -----------------------------------------------------

  /** Collect every `<table>` element, NOT descending into nested tables. */
  private collectTopLevelTables(nodes: HtmlNode[]): HtmlElement[] {
    const tables: HtmlElement[] = [];
    const visit = (node: HtmlNode): void => {
      if (!isElement(node)) return;
      if (node.name === 'table') {
        tables.push(node);
        return; // do not recurse into nested tables
      }
      node.children.forEach(visit);
    };
    nodes.forEach(visit);
    return tables;
  }

  private tableToBit(
    table: HtmlElement,
    tableFormat: HtmlTableFormat,
    onWarning?: (message: string) => void,
  ): TableBitJson | undefined {
    const header: TableRowJson[] = [];
    const body: TableRowJson[] = [];
    const footer: TableRowJson[] = [];

    let caption: TextAst | undefined;

    for (const child of table.children) {
      if (!isElement(child)) continue;

      if (child.name === 'caption') {
        const capContent = this.inlineNodes(child.children, []);
        const trimmed = this.trimInline(capContent);
        if (trimmed.length > 0) caption = trimmed;
      } else if (SECTION_TAGS.has(child.name)) {
        const target = child.name === 'thead' ? header : child.name === 'tfoot' ? footer : body;
        for (const tr of childElements(child, ROW_TAGS)) {
          target.push(this.rowToCells(tr));
        }
      } else if (ROW_TAGS.has(child.name)) {
        body.push(this.rowToCells(child));
      }
      // colgroup / col and other elements are ignored
    }

    if (header.length === 0 && body.length === 0 && footer.length === 0) {
      return undefined; // skip zero-row tables
    }

    const tableExtended: TableExtendedJson = {};
    if (header.length > 0) tableExtended.header = { rows: header };
    if (body.length > 0) tableExtended.body = { rows: body };
    if (footer.length > 0) tableExtended.footer = { rows: footer };

    let tableData: TableJson | TableExtendedJson = tableExtended;

    if (tableFormat === 'table') {
      if (this.isLossyAsBasic(tableExtended)) {
        onWarning?.(
          'Converting an HTML table to [.table] loses rowspan/colspan/scope and multi-section ' +
            'structure; use --tableFormat table-extended to preserve them.',
        );
      }
      tableData = convertExtendedToBasicTableFormat(tableExtended);
    }

    const bit: TableBitJson = {
      type: tableFormat,
      format: 'bitmark++',
      table: tableData,
    };
    if (caption) bit.caption = caption;
    return bit;
  }

  private rowToCells(tr: HtmlElement): TableRowJson {
    const cells: TableCellJson[] = [];
    for (const cell of childElements(tr, CELL_TAGS)) {
      cells.push(this.cellToJson(cell));
    }
    return { cells };
  }

  private cellToJson(cell: HtmlElement): TableCellJson {
    const json: TableCellJson = {
      content: this.blockNodes(cell.children),
    };

    if (cell.name === 'th') json.title = true;

    const rowspan = intAttr(cell.attrs.rowspan);
    if (rowspan != null && rowspan >= 2) json.rowspan = rowspan;

    const colspan = intAttr(cell.attrs.colspan);
    if (colspan != null && colspan >= 2) json.colspan = colspan;

    const scope = cell.attrs.scope?.toLowerCase();
    if (scope && VALID_SCOPES.has(scope)) {
      json.scope = scope as TableCellJson['scope'];
    }

    const width = this.widthFromCell(cell);
    if (width != null) json.colwidth = width;

    return json;
  }

  private widthFromCell(cell: HtmlElement): number | undefined {
    const attrWidth = intAttr(cell.attrs.width);
    if (attrWidth != null && attrWidth > 0) return attrWidth;

    const style = cell.attrs.style;
    if (style) {
      const m = style.match(/width\s*:\s*(\d+)\s*px/i);
      if (m) {
        const n = Number.parseInt(m[1], 10);
        if (Number.isInteger(n) && n > 0) return n;
      }
    }
    return undefined;
  }

  private isLossyAsBasic(table: TableExtendedJson): boolean {
    if (table.footer) return true;
    if (table.header && table.header.rows.length > 1) return true;
    const sections = [table.header, table.body, table.footer];
    for (const section of sections) {
      if (!section) continue;
      for (const row of section.rows) {
        for (const cell of row.cells) {
          if (cell.rowspan || cell.colspan || cell.scope) return true;
        }
      }
    }
    return false;
  }

  // --- content conversion (HTML -> TextAst) ---------------------------------

  /**
   * Convert a cell/li's child nodes into block-level TextAst nodes (paragraphs, lists, images).
   */
  private blockNodes(nodes: HtmlNode[]): TextAst {
    const blocks: TextNode[] = [];
    let inline: TextNode[] = [];

    const flush = (): void => {
      const trimmed = this.trimInline(inline);
      inline = [];
      if (trimmed.length === 0) return;
      // A paragraph that is just a single inline image becomes a block image.
      if (trimmed.length === 1 && trimmed[0].type === 'imageInline') {
        blocks.push({ ...trimmed[0], type: 'image' } as unknown as TextNode);
      } else {
        blocks.push({ type: 'paragraph', content: trimmed, attrs: {} } as unknown as TextNode);
      }
    };

    for (const node of nodes) {
      if (!isElement(node)) {
        inline.push(...this.inlineText(node.value, []));
        continue;
      }

      const name = node.name;
      if (name === 'p') {
        flush();
        const content = this.trimInline(this.inlineNodes(node.children, []));
        if (content.length > 0) {
          blocks.push({ type: 'paragraph', content, attrs: {} } as unknown as TextNode);
        }
      } else if (this.isListTag(name)) {
        flush();
        const list = this.listNode(node);
        if (list) blocks.push(list);
      } else {
        // inline content (marks, links, br, img) or unknown tags -> inline buffer
        inline.push(...this.inlineFromElement(node, []));
      }
    }
    flush();

    return blocks;
  }

  /** Convert child nodes to a flat list of inline TextNodes, applying the given marks. */
  private inlineNodes(nodes: HtmlNode[], marks: TextMark[]): TextNode[] {
    const out: TextNode[] = [];
    for (const node of nodes) {
      if (!isElement(node)) {
        out.push(...this.inlineText(node.value, marks));
      } else {
        out.push(...this.inlineFromElement(node, marks));
      }
    }
    return out;
  }

  private inlineFromElement(el: HtmlElement, marks: TextMark[]): TextNode[] {
    const name = el.name;

    if (name === 'br') {
      return [{ type: 'hardBreak' } as unknown as TextNode];
    }

    if (name === 'img') {
      return [this.imageNode(el, true)];
    }

    if (this.isMathTag(name)) {
      return [this.latexNode(el)];
    }

    const markType = MARK_TAGS[name];
    if (markType) {
      return this.inlineNodes(el.children, [...marks, { type: markType } as TextMark]);
    }

    if (name === 'a') {
      const linkMark = {
        type: 'link',
        attrs: {
          href: el.attrs.href ?? '',
          ...(el.attrs.target ? { target: el.attrs.target } : {}),
        },
      } as unknown as TextMark;
      return this.inlineNodes(el.children, [...marks, linkMark]);
    }

    // Unknown tag
    if (this.keepUnknownTags) {
      const open = this.serializeOpenTag(el);
      const close = `</${name}>`;
      return [
        ...this.inlineText(open, marks),
        ...this.inlineNodes(el.children, marks),
        ...this.inlineText(close, marks),
      ];
    }

    // Default: unwrap (drop the tag, keep inner content)
    return this.inlineNodes(el.children, marks);
  }

  private inlineText(raw: string, marks: TextMark[]): TextNode[] {
    // Collapse runs of whitespace to a single space (HTML-standard).
    const text = decodeEntities(raw).replace(/\s+/g, ' ');
    if (text === '') return [];
    const node: TextNode = { text, type: 'text' };
    if (marks.length > 0) node.marks = marks.map((m) => ({ ...m }));
    return [node];
  }

  private serializeOpenTag(el: HtmlElement): string {
    const attrs = Object.entries(el.attrs)
      .map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${v}"`))
      .join('');
    return `<${el.name}${attrs}>`;
  }

  // --- lists ----------------------------------------------------------------

  private isListTag(name: string): boolean {
    return name === 'ul' || name === 'ol';
  }

  private listNode(el: HtmlElement): TextNode | undefined {
    const items = childElements(el, LI_TAGS);
    if (items.length === 0) return undefined;

    const isTask =
      el.name === 'ul' &&
      items.some((li) => {
        const firstEl = li.children.find(isElement);
        return firstEl?.name === 'input' && firstEl.attrs.type?.toLowerCase() === 'checkbox';
      });

    if (isTask) {
      return {
        type: 'taskList',
        content: items.map((li) => this.taskItemNode(li)),
      } as unknown as TextNode;
    }

    const type = this.listType(el);
    const node: TextNode = {
      type,
      content: items.map((li) => this.listItemNode(li)),
    } as unknown as TextNode;

    if (el.name === 'ol') {
      const start = intAttr(el.attrs.start);
      if (start != null) {
        (node as { attrs?: { start: number } }).attrs = { start };
      }
    }
    return node;
  }

  private listType(el: HtmlElement): TextNode['type'] {
    if (el.name === 'ol') {
      switch (el.attrs.type) {
        case 'i':
          return 'orderedListRomanLower';
        case 'I':
          return 'orderedListRoman';
        case 'a':
          return 'letteredListLower';
        case 'A':
          return 'letteredList';
        default:
          return 'orderedList';
      }
    }
    const style = el.attrs.style ?? '';
    if (/list-style(-type)?\s*:\s*none/i.test(style)) return 'noBulletList';
    return 'bulletList';
  }

  private listItemNode(li: HtmlElement): TextNode {
    let content = this.blockNodes(li.children);
    if (content.length === 0) {
      content = [{ type: 'paragraph', content: [], attrs: {} } as unknown as TextNode];
    }
    return { type: 'listItem', content } as unknown as TextNode;
  }

  private taskItemNode(li: HtmlElement): TextNode {
    const checkbox = li.children.find(
      (c): c is HtmlElement =>
        isElement(c) && c.name === 'input' && c.attrs.type?.toLowerCase() === 'checkbox',
    );
    const checked = checkbox ? 'checked' in checkbox.attrs : false;
    // Build content from the remaining children (excluding the checkbox input).
    const rest = li.children.filter((c) => c !== checkbox);
    let content = this.blockNodes(rest);
    if (content.length === 0) {
      content = [{ type: 'paragraph', content: [], attrs: {} } as unknown as TextNode];
    }
    return { type: 'taskItem', attrs: { checked }, content } as unknown as TextNode;
  }

  // --- images ---------------------------------------------------------------

  private imageNode(el: HtmlElement, inline: boolean): TextNode {
    const attrs: Record<string, unknown> = { src: el.attrs.src ?? '' };
    attrs.alt = el.attrs.alt ?? null;
    attrs.title = el.attrs.title ?? null;

    const width = intAttr(el.attrs.width);
    if (width != null) attrs.width = width;
    const height = intAttr(el.attrs.height);
    if (height != null) attrs.height = height;
    if (el.attrs.class) attrs.class = el.attrs.class;

    return { type: inline ? 'imageInline' : 'image', attrs } as unknown as TextNode;
  }

  // --- formulas -------------------------------------------------------------

  private isMathTag(name: string): boolean {
    return this.localName(name) === 'math';
  }

  private latexNode(el: HtmlElement): TextNode {
    return {
      type: 'latex',
      attrs: {
        formula: this.latexFromMath(el),
      },
    } as unknown as TextNode;
  }

  private latexFromMath(el: HtmlElement): string {
    // Prefer explicit LaTeX from common HTML/MathML fallbacks before using visible text.
    const alt = el.attrs.alttext ?? el.attrs.alt ?? el.attrs.title;
    if (alt != null) return decodeEntities(alt);

    const annotation = this.findLatexAnnotation(el);
    if (annotation) return this.textContent(annotation).trim();

    return this.textContent(el).trim();
  }

  private findLatexAnnotation(el: HtmlElement): HtmlElement | undefined {
    for (const child of el.children) {
      if (!isElement(child)) continue;
      const lowerEncoding = (child.attrs.encoding ?? '').toLowerCase();
      if (
        this.localName(child.name) === 'annotation' &&
        (/\btex\b/.test(lowerEncoding) || /\blatex\b/.test(lowerEncoding))
      ) {
        return child;
      }
      const nested = this.findLatexAnnotation(child);
      if (nested) return nested;
    }
    return undefined;
  }

  private textContent(el: HtmlElement): string {
    return el.children
      .map((child) => (isElement(child) ? this.textContent(child) : decodeEntities(child.value)))
      .join('')
      .replace(/\s+/g, ' ');
  }

  private localName(name: string): string {
    return name.includes(':') ? name.slice(name.indexOf(':') + 1) : name;
  }

  // --- whitespace -----------------------------------------------------------

  /** Trim leading/trailing whitespace from inline content (edges only). */
  private trimInline(nodes: TextNode[]): TextNode[] {
    const out = nodes.slice();
    const isWs = (n: TextNode): boolean => n.type === 'text' && /^\s*$/.test(n.text ?? '');

    while (out.length > 0 && isWs(out[0])) out.shift();
    if (out.length > 0 && out[0].type === 'text') {
      out[0] = { ...out[0], text: (out[0].text ?? '').replace(/^\s+/, '') };
    }
    while (out.length > 0 && isWs(out[out.length - 1])) out.pop();
    if (out.length > 0 && out[out.length - 1].type === 'text') {
      const last = out.length - 1;
      out[last] = { ...out[last], text: (out[last].text ?? '').replace(/\s+$/, '') };
    }
    return out.filter((n) => !(n.type === 'text' && n.text === ''));
  }
}
