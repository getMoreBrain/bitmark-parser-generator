/**
 * PLAN-022 T1b: generative adjacency sweep.
 *
 * Every mark type followed by text that looks like a chain item, and every ordered pair of chain
 * mark types on one node, must re-parse to the same marks (no text swallowed into a mark, no mark
 * swallowed into another) and generate idempotently, in both locations.
 */
import { describe, expect, it } from 'vitest';

import { type TextMark } from '../../../src/model/ast/TextNodes.ts';
import {
  comparable,
  expectRepresentable,
  generate,
  LOCATIONS,
  m,
  p,
  parse,
  t,
} from './textRoundTrip.ts';

/** One valid instance of every mark type the grammar can express */
const MARKS: TextMark[] = [
  m('bold'),
  m('italic'),
  m('light'),
  m('highlight'),
  m('highlight', { color: 'yellow' }),
  m('userHighlight', { color: 'pink' }),
  m('strike'),
  m('smallcaps'),
  m('notranslate'),
  m('textStyle', { color: 'red' }),
  m('link', { href: 'https://a.com/x' }),
  m('ref', { reference: 'r' }),
  m('xref', { xref: 'x', reference: '' }),
  m('xref', { xref: 'x', reference: 'r' }),
  m('extref', { extref: 'e', references: ['a'], provider: 'p' }),
  m('footnote', { content: [t('f')] }),
  m('footnote*', { content: [t('f')] }),
  m('symbol', { src: 's', width: 1 }),
  m('var', { name: 'n' }),
  m('code', { language: 'js' }),
  m('code'),
  m('timer', { name: 'n', duration: 'P1D' }),
  m('colorPicker', { propertyRef: 'r' }),
  { type: 'comment', comment: 'c' } as unknown as TextMark,
];

/** Following text that could be read as a continuation of a chain or a URL */
const FOLLOWING_TEXT = [
  'bold|',
  'color:red|',
  '►x|',
  'link:x|',
  '#c|',
  'footnote*:x|',
  '|x',
  '|',
  '.',
  '/path',
  '=x',
  '*x',
  ' next',
  'plain',
  'a|b|c',
];

const typesOf = (marks: TextMark[] | undefined) => (marks ?? []).map((x) => x.type).sort();

describe('TextGenerator adjacency sweep', () => {
  describe('mark followed by text', () => {
    for (const mark of MARKS) {
      for (const following of FOLLOWING_TEXT) {
        const name = `${JSON.stringify(mark)} then ${JSON.stringify(following)}`;
        it(name, () => {
          for (const location of LOCATIONS) {
            const input = [p(t('a', [mark]), t(following))];
            // A symbol's chain would swallow a following '...|' segment: the symbol is dropped
            // (and the parser then merges the two plain text nodes)
            const symbolDropped = mark.type === 'symbol' && following.indexOf('|') !== -1;
            const expected = symbolDropped ? [p(t(`a${following}`))] : input;
            expectRepresentable(
              input,
              { ast: expected, idempotence: symbolDropped ? 'ast' : 'markup' },
              location,
            );
          }
        });
      }
    }
  });

  describe('ordered pairs of marks on one node', () => {
    for (const a of MARKS) {
      for (const b of MARKS) {
        if (a === b) continue;
        it(`${JSON.stringify(a)} + ${JSON.stringify(b)}`, () => {
          for (const location of LOCATIONS) {
            const input = [p(t('a', [a, b]), t(' after'))];
            const markup = generate(input, location);
            const reparsed = parse(markup, location);

            // Both marks survive (a second symbol would be dropped - not in this sweep)
            const node = (reparsed[0]?.content ?? [])[0];
            expect(typesOf(node?.marks), `marks of ${markup}`).toEqual(typesOf([a, b]));
            // The attrs survive too
            const expectedMarks = comparable([a, b]) as TextMark[];
            for (const em of expectedMarks) {
              expect(comparable(node?.marks), `attrs in ${markup}`).toContainEqual(em);
            }
            // No leaked text, idempotent
            expectRepresentable(input, {}, location);
          }
        });
      }
    }
  });
});
