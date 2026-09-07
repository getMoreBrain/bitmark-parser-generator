/**
 * PLAN-022 T3: the generator's mirror of the text grammar's value rules must not drift from the
 * grammar. Reads assets/grammar/text/text-grammar.pegjs and compares the literal alternatives of
 * each mirrored rule with the tables in TextGrammarConstraints.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  ALTERNATIVE_STYLE_TAGS,
  COLORS,
  HIGHLIGHT_COLORS,
  INLINE_MEDIA_ALIGNMENTS,
  INLINE_MEDIA_SIZES,
  MEDIA_ALIGNMENTS,
  MEDIA_BOOLEAN_TAGS,
  MEDIA_SIZE_TAGS,
  MEDIA_TEXT_TAGS,
  TEXT_GRAMMAR_VERSION,
} from '../../../src/generator/text/TextGrammarConstraints.ts';
import { TextMarkType } from '../../../src/model/enum/TextMarkType.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const GRAMMAR = fs.readFileSync(
  path.resolve(dirname, '../../../assets/grammar/text/text-grammar.pegjs'),
  'utf8',
);

/**
 * The quoted literal alternatives of a grammar rule of the form:
 *   Rule
 *     = 'a'
 *     / 'b'
 */
function ruleLiterals(rule: string): string[] {
  const match = GRAMMAR.match(
    new RegExp(`\\n${rule}\\n((?:\\s*[=/]\\s*'[^']*'\\s*(?://[^\\n]*)?\\n)+)`),
  );
  expect(match, `rule ${rule} not found in the grammar`).not.toBeNull();
  return [...(match as RegExpMatchArray)[1].matchAll(/'([^']*)'/g)].map((x) => x[1]);
}

/** Literal alternatives on a single line: `Rule = 'a' / 'b'` */
function inlineRuleLiterals(rule: string): string[] {
  const match = GRAMMAR.match(new RegExp(`\\n${rule}\\n\\s*=\\s*([^\\n]+)`));
  expect(match, `rule ${rule} not found in the grammar`).not.toBeNull();
  return [...(match as RegExpMatchArray)[1].matchAll(/'([^']*)'/g)].map((x) => x[1]);
}

describe('TextGrammarConstraints mirrors text-grammar.pegjs', () => {
  it('grammar version', () => {
    expect(GRAMMAR).toContain(`const VERSION = "${TEXT_GRAMMAR_VERSION}"`);
  });

  it.each([
    ['Color', COLORS],
    ['HighlightColor', HIGHLIGHT_COLORS],
    ['AlternativeStyleTags', ALTERNATIVE_STYLE_TAGS],
  ])('%s', (rule, table) => {
    expect([...table].sort()).toEqual(ruleLiterals(rule).sort());
  });

  it.each([
    ['MediaAlignment', MEDIA_ALIGNMENTS],
    ['InlineMediaAlignment', INLINE_MEDIA_ALIGNMENTS],
    ['InlineMediaSize', INLINE_MEDIA_SIZES],
    ['MediaSizeTags', MEDIA_SIZE_TAGS],
    ['MediaTextTags', MEDIA_TEXT_TAGS],
    ['MediaBooleanTags', MEDIA_BOOLEAN_TAGS],
  ])('%s', (rule, table) => {
    expect([...table].sort()).toEqual(inlineRuleLiterals(rule).sort());
  });

  it('every AlternativeStyleTag is a TextMarkType', () => {
    const markTypes = Object.values(TextMarkType) as string[];
    for (const tag of ALTERNATIVE_STYLE_TAGS) expect(markTypes).toContain(tag);
  });

  it('every AttrChainItem key is handled by the sanitizer (mark types)', () => {
    // Keys of the AttrChainItem rule that produce a mark type
    const keys = [...GRAMMAR.matchAll(/return \{ type: '([A-Za-z*]+)'/g)].map((x) => x[1]);
    const markTypes = Object.values(TextMarkType) as string[];
    for (const key of new Set(keys)) expect(markTypes, key).toContain(key);
  });
});
