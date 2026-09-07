/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Helpers for the text generator representability tests (PLAN-022).
 *
 * The oracles express the rule "the generator writes only markup the parser turns back into
 * the JSON it came from" mechanically:
 *  1. generate(json) equals the expected markup
 *  2. parse(generate(json)) equals the expected (reduced) AST, modulo parser-injected defaults
 *  3. no leaked markup: every re-parsed text node's text is (whitespace-insensitively) a
 *     substring of the input's text content
 *  4. idempotence: generate(parse(generate(json))) === generate(json)
 */
import { expect } from 'vitest';

import { TextGenerator } from '../../../src/generator/text/TextGenerator.ts';
import { type TextAst, type TextMark, type TextNode } from '../../../src/model/ast/TextNodes.ts';
import { TextFormat } from '../../../src/model/enum/TextFormat.ts';
import { TextLocation, type TextLocationType } from '../../../src/model/enum/TextLocation.ts';
import { TextParser } from '../../../src/parser/text/TextParser.ts';

const textGenerator = new TextGenerator();
const textParser = new TextParser();

export const LOCATIONS: TextLocationType[] = [TextLocation.body, TextLocation.tag];

// Compact AST builders
export const m = (type: string, attrs?: Record<string, unknown>): TextMark =>
  (attrs === undefined ? { type } : { type, attrs }) as unknown as TextMark;
export const t = (text: unknown, marks?: unknown): TextNode =>
  (marks === undefined ? { type: 'text', text } : { type: 'text', text, marks }) as TextNode;
export const hb = (): TextNode => ({ type: 'hardBreak' }) as TextNode;
export const p = (...content: TextNode[]): TextNode =>
  ({ type: 'paragraph', attrs: {}, content }) as unknown as TextNode;
export const node = (
  type: string,
  attrs?: Record<string, unknown>,
  content?: TextNode[],
): TextNode =>
  ({
    type,
    ...(attrs !== undefined ? { attrs } : {}),
    ...(content !== undefined ? { content } : {}),
  }) as unknown as TextNode;
export const li = (...content: TextNode[]): TextNode => node('listItem', undefined, content);
export const list = (type: string, ...items: TextNode[]): TextNode => node(type, {}, items);

export function generate(ast: unknown, location: TextLocationType = TextLocation.body): string {
  return textGenerator.generateSync(
    JSON.parse(JSON.stringify(ast)),
    TextFormat.bitmarkText,
    location,
  );
}

export function parse(markup: string, location: TextLocationType = TextLocation.body): TextAst {
  return textParser.toAst(markup, { format: TextFormat.bitmarkText, location });
}

/** All text content of an AST (text nodes, recursively, including footnote content) */
export function allText(ast: unknown): string {
  const out: string[] = [];
  const walk = (n: any) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== 'object') return;
    if (typeof n.text === 'string') out.push(n.text);
    if (Array.isArray(n.content)) walk(n.content);
    if (Array.isArray(n.marks)) {
      for (const mark of n.marks) if (mark?.attrs?.content) walk(mark.attrs.content);
    }
  };
  walk(ast);
  return out.join('\n');
}

const stripWs = (s: string) => s.replace(/\s+/g, '');

/**
 * Remove parser-injected defaults and empty containers so a terse expected AST can be compared
 * with the parser's output.
 */
export function comparable(ast: unknown): unknown {
  const clean = (n: any): any => {
    if (Array.isArray(n)) return n.map(clean);
    if (!n || typeof n !== 'object') return n;
    const r: any = { ...n };
    if (r.attrs && typeof r.attrs === 'object') {
      const a = { ...r.attrs };
      if (r.type === 'link') delete a.target;
      if (r.type === 'code' && a.language === 'plain text') delete a.language;
      if (r.type === 'xref' && a.reference === '') delete a.reference;
      if (r.type === 'timer' && a.name === '') delete a.name;
      if (r.type === 'extref') {
        if (Array.isArray(a.references) && a.references.length === 0) delete a.references;
        if (a.provider === '') delete a.provider;
      }
      if (r.type === 'imageInline') {
        if (a.alignmentVertical === 'top') delete a.alignmentVertical;
        if (a.size === 'line-height') delete a.size;
        if (a.zoomDisabled === true) delete a.zoomDisabled;
        if (a.title == null) delete a.title;
        if (a.alt === '') delete a.alt;
      }
      if (r.type === 'image') {
        if (a.alignment === 'center') delete a.alignment;
        if (a.textAlign === 'left') delete a.textAlign;
        if (a.class === 'center') delete a.class;
        if (a.zoomDisabled === true) delete a.zoomDisabled;
        if (a.alt == null) delete a.alt;
        if (a.title == null) delete a.title;
      }
      if (a.start === 1) delete a.start;
      if (r.type === 'taskItem' && a.checked === false) delete a.checked;
      if (r.type === 'heading' && a.level === 1) delete a.level;
      if (Object.keys(a).length === 0) delete r.attrs;
      else r.attrs = clean(a);
    }
    if (r.type === 'codeBlock' && r.language === '') delete r.language;
    if (Array.isArray(r.marks)) r.marks = r.marks.map(clean);
    if (Array.isArray(r.content)) r.content = r.content.map(clean);
    return r;
  };
  return clean(ast);
}

export interface Expectation {
  /** Expected markup (trailing whitespace ignored) */
  markup?: string;
  /** Expected re-parsed AST (parser defaults may be omitted) */
  ast?: unknown;
  /**
   * Idempotence oracle level: 'markup' (default) compares the regenerated markup string; 'ast'
   * compares the re-parsed ASTs (for rows where the parser merges adjacent plain text nodes and
   * the breakscaping of the merged text differs).
   */
  idempotence?: 'markup' | 'ast';
}

/**
 * Assert the four oracles for one input.
 */
export function expectRepresentable(
  input: unknown,
  expected: Expectation,
  location: TextLocationType = TextLocation.body,
): void {
  const markup = generate(input, location);
  const reparsed = parse(markup, location);

  // 1. expected markup
  if (expected.markup !== undefined) {
    expect(markup.trimEnd(), `markup [${location}]`).toBe(expected.markup);
  }

  // 2. expected AST
  if (expected.ast !== undefined) {
    expect(comparable(reparsed), `re-parsed AST [${location}] of ${markup}`).toEqual(
      comparable(expected.ast),
    );
  }

  // 3. no leaked markup
  const inputText = stripWs(allText(input));
  const leaked = (n: any): void => {
    if (Array.isArray(n)) return n.forEach(leaked);
    if (!n || typeof n !== 'object') return;
    if (typeof n.text === 'string') {
      expect(
        inputText,
        `leaked markup [${location}]: ${JSON.stringify(n.text)} from ${markup}`,
      ).toContain(stripWs(n.text));
    }
    if (Array.isArray(n.content)) leaked(n.content);
    if (Array.isArray(n.marks)) {
      for (const mark of n.marks) if (mark?.attrs?.content) leaked(mark.attrs.content);
    }
  };
  leaked(reparsed);

  // 4. idempotence
  const regenerated = generate(reparsed, location);
  if (expected.idempotence === 'ast') {
    expect(
      comparable(parse(regenerated, location)),
      `idempotence [${location}] of ${markup}`,
    ).toEqual(comparable(reparsed));
  } else {
    expect(regenerated, `idempotence [${location}] of ${markup}`).toBe(markup);
  }
}

/** Assert the oracles in both locations (body and tag) */
export function expectRepresentableEverywhere(input: unknown, expected: Expectation): void {
  for (const location of LOCATIONS) expectRepresentable(input, expected, location);
}
