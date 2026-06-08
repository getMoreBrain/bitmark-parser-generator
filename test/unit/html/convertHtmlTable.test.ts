/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';

import { HtmlTableGenerator } from '../../../src/generator/html/HtmlTableGenerator.ts';
import { BitmarkParserGenerator } from '../../../src/index.ts';
import type { TableExtendedJson } from '../../../src/model/json/BitJson.ts';
import { HtmlTableParser } from '../../../src/parser/html/HtmlTableParser.ts';

const bpg = new BitmarkParserGenerator();

/** Helper: HTML -> bit JSON (array of bit wrappers) */
function toJson(html: string): any[] {
  return bpg.convertHtmlTable(html, { outputFormat: 'json' }) as any[];
}

/** Helper: first table payload from JSON output */
function firstTable(html: string): TableExtendedJson {
  const json = toJson(html);
  return json[0].bit.table as TableExtendedJson;
}

describe('HtmlTableParser (HTML -> bit JSON)', () => {
  it('maps thead/tbody/tfoot to header/body/footer', () => {
    const table = firstTable(
      '<table><thead><tr><th>H</th></tr></thead><tbody><tr><td>B</td></tr></tbody>' +
        '<tfoot><tr><td>F</td></tr></tfoot></table>',
    );
    expect(table.header?.rows).toHaveLength(1);
    expect(table.body?.rows).toHaveLength(1);
    expect(table.footer?.rows).toHaveLength(1);
  });

  it('rows outside a section default to body', () => {
    const table = firstTable('<table><tr><td>A</td></tr><tr><td>B</td></tr></table>');
    expect(table.header).toBeUndefined();
    expect(table.body?.rows).toHaveLength(2);
  });

  it('sets title:true for th and omits it for td', () => {
    const table = firstTable('<table><tr><th>A</th><td>B</td></tr></table>');
    const cells = table.body!.rows[0].cells;
    expect(cells[0].title).toBe(true);
    expect(cells[1].title).toBeUndefined();
  });

  it('extracts rowspan/colspan (>=2) and scope', () => {
    const table = firstTable(
      '<table><tr><td rowspan="2" colspan="3" scope="row">X</td><td rowspan="1">Y</td></tr></table>',
    );
    const cells = table.body!.rows[0].cells;
    expect(cells[0].rowspan).toBe(2);
    expect(cells[0].colspan).toBe(3);
    expect(cells[0].scope).toBe('row');
    // rowspan of 1 is dropped
    expect(cells[1].rowspan).toBeUndefined();
  });

  it('drops invalid scope', () => {
    const table = firstTable('<table><tr><td scope="bogus">X</td></tr></table>');
    expect(table.body!.rows[0].cells[0].scope).toBeUndefined();
  });

  it('reads colwidth from width attribute and style', () => {
    const table = firstTable(
      '<table><tr><td width="150">A</td><td style="width: 80px">B</td></tr></table>',
    );
    const cells = table.body!.rows[0].cells;
    expect(cells[0].colwidth).toBe(150);
    expect(cells[1].colwidth).toBe(80);
  });

  it('maps caption (inline marks) to the caption property', () => {
    const json = toJson('<table><caption>Q<sub>1</sub></caption><tr><td>x</td></tr></table>');
    const caption = json[0].bit.caption;
    expect(Array.isArray(caption)).toBe(true);
  });

  it('skips tables with no rows', () => {
    const json = toJson('<table></table>');
    expect(json).toHaveLength(0);
  });

  it('extracts all tables in order', () => {
    const json = toJson(
      '<table><tr><td>1</td></tr></table><p>x</p><table><tr><td>2</td></tr></table>',
    );
    expect(json).toHaveLength(2);
  });

  it('returns no bits when there are no tables', () => {
    const bits = new HtmlTableParser().parse('<p>nothing here</p>');
    expect(bits).toHaveLength(0);
  });
});

describe('cell content (inline marks)', () => {
  const content = (html: string): any[] => firstTable(html).body!.rows[0].cells[0].content as any[];

  it('maps b/strong to bold and i/em to italic', () => {
    const c = content('<table><tr><td><b>x</b> <em>y</em></td></tr></table>');
    const para = c[0];
    const boldNode = para.content.find((n: any) => n.text === 'x');
    const italicNode = para.content.find((n: any) => n.text === 'y');
    expect(boldNode.marks).toEqual([{ type: 'bold' }]);
    expect(italicNode.marks).toEqual([{ type: 'italic' }]);
  });

  it('maps sup/sub/code/s/u to their marks', () => {
    const c = content(
      '<table><tr><td><sup>a</sup><sub>b</sub><code>c</code><s>d</s><u>e</u></td></tr></table>',
    );
    const marks = c[0].content.map((n: any) => n.marks?.[0]?.type);
    expect(marks).toEqual(['superscript', 'subscript', 'code', 'strike', 'underline']);
  });

  it('maps a href to a link mark', () => {
    const c = content('<table><tr><td><a href="https://x.com">link</a></td></tr></table>');
    const node = c[0].content[0];
    expect(node.marks[0].type).toBe('link');
    expect(node.marks[0].attrs.href).toBe('https://x.com');
  });

  it('maps br to hardBreak', () => {
    const c = content('<table><tr><td>a<br>b</td></tr></table>');
    const types = c[0].content.map((n: any) => n.type);
    expect(types).toContain('hardBreak');
  });

  it('decodes entities and collapses whitespace', () => {
    const c = content('<table><tr><td>  a &amp;   b&nbsp;c  </td></tr></table>');
    expect(c[0].content[0].text).toBe('a & b c');
  });

  it('unwraps unknown tags by default', () => {
    const c = content('<table><tr><td>a <span class="x">b</span> c</td></tr></table>');
    const text = c[0].content.map((n: any) => n.text).join('');
    expect(text).toBe('a b c');
  });

  it('keeps unknown tags as literal text with keepUnknownTags', () => {
    const parser = new HtmlTableParser();
    const bits = parser.parse('<table><tr><td>a <span class="x">b</span> c</td></tr></table>', {
      keepUnknownTags: true,
    });
    const para = (bits[0].table as TableExtendedJson).body!.rows[0].cells[0].content as any[];
    const text = para[0].content.map((n: any) => n.text).join('');
    expect(text).toContain('<span class="x">');
    expect(text).toContain('</span>');
  });

  it('preserves multiple paragraphs', () => {
    const c = content('<table><tr><td><p>one</p><p>two</p></td></tr></table>');
    expect(c).toHaveLength(2);
    expect(c[0].type).toBe('paragraph');
    expect(c[1].type).toBe('paragraph');
  });

  it('maps ul/li to a bullet list', () => {
    const c = content('<table><tr><td><ul><li>a</li><li>b</li></ul></td></tr></table>');
    expect(c[0].type).toBe('bulletList');
    expect(c[0].content).toHaveLength(2);
    expect(c[0].content[0].type).toBe('listItem');
  });

  it('maps ol type/start to ordered list variants', () => {
    const c = content('<table><tr><td><ol type="a" start="3"><li>x</li></ol></td></tr></table>');
    expect(c[0].type).toBe('letteredListLower');
    expect(c[0].attrs.start).toBe(3);
  });

  it('maps a standalone img to a block image node', () => {
    const c = content('<table><tr><td><img src="x.png" alt="pic" width="40"></td></tr></table>');
    expect(c[0].type).toBe('image');
    expect(c[0].attrs.src).toBe('x.png');
    expect(c[0].attrs.alt).toBe('pic');
    expect(c[0].attrs.width).toBe(40);
  });
});

describe('lossy table format', () => {
  it('warns and flattens when emitting [.table] for a complex table', () => {
    const warnings: string[] = [];
    const parser = new HtmlTableParser();
    const bits = parser.parse(
      '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td colspan="2">x</td></tr></tbody></table>',
      { tableFormat: 'table', onWarning: (m) => warnings.push(m) },
    );
    expect(bits[0].type).toBe('table');
    expect((bits[0].table as any).columns).toBeDefined();
    expect(warnings.length).toBeGreaterThan(0);
  });
});

describe('HtmlTableGenerator (bit JSON -> HTML)', () => {
  it('renders th/td purely from the title flag (matching the bitmark generator)', () => {
    const html = new HtmlTableGenerator().generate([
      {
        type: 'table-extended',
        table: {
          header: { rows: [{ cells: [{ title: true, content: [] }] }] },
          // A data cell in the footer (title absent) must render as <td>, not <th>.
          footer: { rows: [{ cells: [{ content: [] }] }] },
        },
      },
    ]);
    expect(html).toContain('<thead>');
    expect(html).toContain('<th></th>');
    expect(html).toContain('<tfoot>');
    expect(html).toContain('<td></td>');
  });

  it('renders rowspan/colspan/scope/width attributes', () => {
    const html = new HtmlTableGenerator().generate([
      {
        type: 'table-extended',
        table: {
          body: {
            rows: [
              {
                cells: [
                  {
                    title: false,
                    rowspan: 2,
                    colspan: 3,
                    scope: 'row',
                    colwidth: 50,
                    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'x' }] }],
                  },
                ],
              },
            ],
          },
        },
      },
    ]);
    expect(html).toContain('rowspan="2"');
    expect(html).toContain('colspan="3"');
    expect(html).toContain('scope="row"');
    expect(html).toContain('width="50"');
  });

  it('escapes special characters in text', () => {
    const html = new HtmlTableGenerator().generate([
      {
        type: 'table-extended',
        table: {
          body: {
            rows: [
              {
                cells: [
                  {
                    content: [
                      { type: 'paragraph', content: [{ type: 'text', text: 'a < b & c' }] },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    ]);
    expect(html).toContain('a &lt; b &amp; c');
  });

  it('skips bits without a table and non table/table-extended types', () => {
    const html = new HtmlTableGenerator().generate([
      { type: 'article', body: [] },
      { type: 'pronunciation-table', pronunciationTable: { data: [] } },
    ]);
    expect(html).toBe('');
  });

  it('separates multiple tables with a blank line', () => {
    const html = new HtmlTableGenerator().generate([
      { type: 'table-extended', table: { body: { rows: [{ cells: [{ content: [] }] }] } } },
      { type: 'table-extended', table: { body: { rows: [{ cells: [{ content: [] }] }] } } },
    ]);
    expect(html.split('\n\n')).toHaveLength(2);
  });
});

describe('round-trip', () => {
  it('HTML -> JSON -> HTML preserves structure, marks, spans, scope and images', () => {
    const html =
      '<table>' +
      '<caption>Cap</caption>' +
      '<thead><tr><th scope="col">Name</th><th>Score</th></tr></thead>' +
      '<tbody>' +
      '<tr><td>John <b>Smith</b></td><td>10</td></tr>' +
      '<tr><td rowspan="2">Jane</td><td><img src="x.png" alt="p"></td></tr>' +
      '</tbody>' +
      '</table>';

    const json = bpg.convertHtmlTable(html, { outputFormat: 'json' });
    const out = new HtmlTableGenerator().generate(json);

    expect(out).toContain('<caption>Cap</caption>');
    expect(out).toContain('<thead>');
    expect(out).toContain('<th scope="col">Name</th>');
    expect(out).toContain('John <b>Smith</b>');
    expect(out).toContain('rowspan="2"');
    expect(out).toContain('<img src="x.png" alt="p">');
  });

  it('HTML -> bitmark -> HTML preserves marks/spans/scope (text content)', () => {
    const html =
      '<table><thead><tr><th scope="col">Name</th></tr></thead>' +
      '<tbody><tr><td>John <b>Smith</b></td></tr>' +
      '<tr><td rowspan="2">Jane</td></tr></tbody></table>';

    const bitmark = bpg.convertHtmlTable(html) as string;
    const out = bpg.convertHtmlTable(bitmark) as string;

    expect(out).toContain('scope="col"');
    expect(out).toContain('John <b>Smith</b>');
    expect(out).toContain('rowspan="2"');
  });
});

describe('error handling', () => {
  it('throws when converting non-HTML input to a non-HTML format', () => {
    const bitmark = '[.table-extended]\n====\nH\n';
    expect(() => bpg.convertHtmlTable(bitmark, { outputFormat: 'json' })).toThrow();
  });

  it('is lenient with malformed/unclosed table markup', () => {
    const table = firstTable('<table><tr><td>a<td>b<tr><td>c</table>');
    expect(table.body?.rows).toHaveLength(2);
    expect(table.body!.rows[0].cells).toHaveLength(2);
  });
});
