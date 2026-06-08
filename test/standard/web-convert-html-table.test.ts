/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test } from 'vitest';

import * as bpgLibMinified from './web-bpg-minified-wrapper.js';

/**
 * Regression tests for convertHtmlTable run against the COMPILED, MINIFIED browser bundle
 * (dist/browser/bitmark-parser-generator.min.js), not the src/ TypeScript.
 *
 * These exist because of an upstream minification bug: HtmlTableGenerator / HtmlTableParser were
 * imported inside the browser STRIP block, so the bundler dropped the imports while still exposing
 * the classes as renamed public exports. convertHtmlTable's calls to `new HtmlTableGenerator()` /
 * `new HtmlTableParser()` then dangled as bare globals -> ReferenceError, but ONLY in the minified
 * bundle. A src/-based test cannot catch this; it must run against the built web bundle.
 */
const bpgLib = bpgLibMinified as typeof import('../../src/index.ts') & typeof bpgLibMinified;
const bpg = new bpgLib.BitmarkParserGenerator();

const HTML_TABLE =
  '<table><thead><tr><th>Name</th><th>Age</th></tr></thead>' +
  '<tbody><tr><td>John</td><td>30</td></tr></tbody></table>';

describe('web-convert-html-table (compiled minified bundle)', () => {
  test('HTML -> bitmark does not throw and emits a table bit', () => {
    const bitmark = bpg.convertHtmlTable(HTML_TABLE) as string;
    expect(typeof bitmark).toBe('string');
    // table-extended is the default tableFormat for HTML input
    expect(bitmark).toContain('[.table-extended]');
    expect(bitmark).toContain('Name');
    expect(bitmark).toContain('John');
  });

  test('HTML -> JSON does not throw and produces a table bit', () => {
    const json = bpg.convertHtmlTable(HTML_TABLE, { outputFormat: 'json' }) as any[];
    expect(Array.isArray(json)).toBe(true);
    expect(json[0].bit.type).toBe('table-extended');
    expect(json[0].bit.table).toBeDefined();
  });

  test('bitmark -> HTML does not throw and renders a <table>', () => {
    const bitmark = bpg.convertHtmlTable(HTML_TABLE) as string;
    const html = bpg.convertHtmlTable(bitmark) as string;
    expect(html).toContain('<table>');
    expect(html).toContain('<th>Name</th>');
    expect(html).toContain('<td>John</td>');
  });

  test('HTML -> bitmark -> HTML round-trips through the bundle', () => {
    const bitmark = bpg.convertHtmlTable(HTML_TABLE) as string;
    const html = bpg.convertHtmlTable(bitmark) as string;
    expect(html).toContain('<thead>');
    expect(html).toContain('<th>Age</th>');
    expect(html).toContain('<td>30</td>');
  });
});
