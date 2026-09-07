/**
 * PLAN-022 T1 (marks): the text generator only writes marks the text grammar parses back.
 *
 * Rows follow the mark table: for every mark, valid / empty / missing / wrong-enum / wrong-case /
 * whitespace / '|' / newline / wrong-type values where the value class makes them meaningful.
 */
import { describe, it } from 'vitest';

import {
  expectRepresentable,
  expectRepresentableEverywhere as every,
  hb,
  m,
  p,
  t,
} from './textRoundTrip.ts';

const text = (marks: unknown, s = 'text') => [p(t(s, marks))];
const plain = { markup: 'text', ast: [p(t('text'))] };

describe('TextGenerator representable marks', () => {
  describe('textStyle / legacy color (color: Color, mandatory)', () => {
    it('valid colour', () => {
      every(text([m('textStyle', { color: 'aqua' })]), {
        markup: '==text==|color:aqua|',
        ast: [p(t('text', [m('textStyle', { color: 'aqua' })]))],
      });
    });
    it('legacy color mark is written as textStyle', () => {
      every(text([m('color', { color: 'red' })]), {
        markup: '==text==|color:red|',
        ast: [p(t('text', [m('textStyle', { color: 'red' })]))],
      });
    });
    it.each([
      ['empty (#10567)', ''],
      ['not a Color', 'bad'],
      ['wrong case', 'RED'],
      ['whitespace', 'red '],
      ['number', 5],
      ['missing', undefined],
    ])('%s colour → mark dropped, text kept', (_name, color) => {
      const attrs = color === undefined ? undefined : { color };
      every(text([m('textStyle', attrs)]), plain);
      every(text([m('color', attrs)]), plain);
    });
    it('is dropped from a chain, other marks kept', () => {
      every(text([m('bold'), m('textStyle', { color: '' })]), {
        markup: '==text==|bold|',
        ast: [p(t('text', [m('bold')]))],
      });
      every(text([m('textStyle', { color: '' }), m('italic'), m('textStyle', { color: 'red' })]), {
        markup: '==text==|italic|color:red|',
        ast: [p(t('text', [m('italic'), m('textStyle', { color: 'red' })]))],
      });
    });
  });

  describe('highlight / userHighlight (color: HighlightColor, optional)', () => {
    it('valid highlight colour', () => {
      every(text([m('highlight', { color: 'yellow' })]), {
        markup: '==text==|highlight|color:yellow|',
        ast: [p(t('text', [m('highlight', { color: 'yellow' })]))],
      });
      every(text([m('userHighlight', { color: 'pink' })]), {
        markup: '==text==|userHighlight|color:pink|',
      });
    });
    it.each([
      ['empty', ''],
      ['Color but not HighlightColor', 'red'],
      ['bad', 'bad'],
    ])('%s colour → bare highlight', (_name, color) => {
      every(text([m('highlight', { color })]), {
        markup: '==text==|highlight|',
        ast: [p(t('text', [m('highlight')]))],
      });
      every(text([m('userHighlight', { color })]), {
        markup: '==text==|userHighlight|',
        ast: [p(t('text', [m('userHighlight')]))],
      });
    });
  });

  describe('style marks (no attributes in the grammar)', () => {
    it('attrs on standard marks are ignored, the mark is written', () => {
      every(text([m('bold', { color: 'red' })]), {
        markup: '==text==|bold|',
        ast: [p(t('text', [m('bold')]))],
      });
      every(text([m('italic', { foo: 1 })]), { markup: '==text==|italic|' });
      every(text([m('highlightYellow', { color: 'red' })]), {
        markup: '==text==|highlightYellow|',
      });
    });
    it('every AlternativeStyleTag round-trips', () => {
      for (const type of ['strike', 'smallcaps', 'notranslate', 'languageEmRed', 'userCircle']) {
        every(text([m(type)]), { markup: `==text==|${type}|`, ast: [p(t('text', [m(type)]))] });
      }
    });
  });

  describe('chain values (chainString)', () => {
    const cases: [string, Record<string, unknown>, string][] = [
      ['link', { href: 'https://a.com/x' }, '==text==|link:https://a.com/x|'],
      ['ref', { reference: 'r' }, '==text==|►r|'],
      ['xref', { xref: 'x', reference: 'r' }, '==text==|xref:x|►r|'],
      [
        'extref',
        { extref: 'e', references: ['a', 'b'], provider: 'p' },
        '==text==|extref:e|►a|►b|provider:p|',
      ],
      ['var', { name: 'n' }, '==text==|var:n|'],
      ['code', { language: 'js' }, '==text==|code:js|'],
      ['timer', { name: 'n', duration: 'P1D' }, '==text==|timer:n|duration:P1D|'],
      ['colorPicker', { propertyRef: 'r' }, '==text==|colorPicker:r|'],
      ['symbol', { src: 's' }, '==text==|symbol:s|'],
    ];
    it.each(cases)('%s: valid values', (type, attrs, markup) => {
      every(text([m(type, attrs)]), { markup, ast: [p(t('text', [m(type, attrs)]))] });
    });
    it.each(cases)('%s: values are trimmed like the parser does', (type, attrs, markup) => {
      const padded = Object.fromEntries(
        Object.entries(attrs).map(([k, v]) => [k, typeof v === 'string' ? ` ${v} ` : v]),
      );
      every(text([m(type, padded)]), { markup });
    });

    it('missing free-string values are written empty (the parser produces that form)', () => {
      every(text([m('link')]), {
        markup: '==text==|link:|',
        ast: [p(t('text', [m('link', { href: '' })]))],
      });
      every(text([m('var')]), { markup: '==text==|var:|' });
      every(text([m('ref')]), { markup: '==text==|►|' });
      every(text([m('xref')]), { markup: '==text==|xref:|' });
      every(text([m('extref')]), { markup: '==text==|extref:|provider:|' });
      every(text([m('colorPicker')]), { markup: '==text==|colorPicker:|' });
      every(text([m('symbol')]), { markup: '==text==|symbol:|' });
      every(text([m('footnote')]), { markup: '==text==|footnote:|' });
      every(text([{ type: 'comment' }]), { markup: '==text==|#|' });
      every(text([m('code')]), { markup: '==text==|code|', ast: [p(t('text', [m('code')]))] });
      every(text([m('code', { language: '' })]), { markup: '==text==|code:|' });
    });

    it.each([
      ['a|b', 'pipe'],
      ['a\nb', 'newline'],
    ])('mandatory segment with %s → mark dropped', (bad) => {
      every(text([m('link', { href: bad })]), plain);
      every(text([m('ref', { reference: bad })]), plain);
      every(text([m('xref', { xref: bad })]), plain);
      every(text([m('extref', { extref: bad, provider: 'p' })]), plain);
      every(text([m('extref', { extref: 'e', provider: bad })]), plain);
      every(text([m('var', { name: bad })]), plain);
      every(text([m('colorPicker', { propertyRef: bad })]), plain);
      every(text([m('symbol', { src: bad })]), plain);
      every(text([{ type: 'comment', comment: bad }]), plain);
      every(text([m('timer', { name: 'n', duration: `P${bad}` })]), plain);
    });

    it('optional segment with a pipe → written without that segment', () => {
      every(text([m('xref', { xref: 'x', reference: 'a|b' })]), { markup: '==text==|xref:x|' });
      every(text([m('timer', { name: 'a|b', duration: 'P1D' })]), {
        markup: '==text==|timer|duration:P1D|',
        ast: [p(t('text', [m('timer', { name: '', duration: 'P1D' })]))],
      });
      every(text([m('code', { language: 'a|b' })]), { markup: '==text==|code|' });
      every(text([m('extref', { extref: 'e', references: ['ok', 'a|b'], provider: 'p' })]), {
        markup: '==text==|extref:e|►ok|provider:p|',
      });
    });

    it('code language is lower-cased like the parser does', () => {
      every(text([m('code', { language: 'JavaScript' })]), {
        markup: '==text==|code:javascript|',
        ast: [p(t('text', [m('code', { language: 'javascript' })]))],
      });
    });

    it('timer duration must start with P', () => {
      every(text([m('timer', { name: 'n', duration: '123' })]), plain);
      every(text([m('timer', { name: 'n', duration: '' })]), plain);
      every(text([m('timer', { name: 'n' })]), plain);
    });

    it('wrong types are treated as invalid values', () => {
      every(text([m('link', { href: 5 })]), plain);
      every(text([m('extref', { extref: 'e', references: 'x', provider: 'p' })]), {
        markup: '==text==|extref:e|provider:p|',
      });
      every(text([m('footnote', { content: 'hello' })]), { markup: '==text==|footnote:|' });
    });
  });

  describe('symbol media chain', () => {
    it('valid chain items', () => {
      every(text([m('symbol', { src: 's', width: 928, height: 10, comment: 'c' })]), {
        markup: '==text==|symbol:s|width:928|height:10|#c|',
        ast: [p(t('text', [m('symbol', { src: 's', width: 928, height: 10, comment: 'c' })]))],
      });
    });
    it('invalid or unknown chain items are omitted', () => {
      every(
        text([
          m('symbol', {
            src: 's',
            width: 'abc',
            height: -1,
            alignment: 'bad',
            foo: 'bar',
            error: 'Found unknown property',
            comment: 'a|b',
          }),
        ]),
        { markup: '==text==|symbol:s|', ast: [p(t('text', [m('symbol', { src: 's' })]))] },
      );
    });
    it('both spellings of a chain tag write one segment', () => {
      every(
        text([
          m('symbol', {
            src: 's',
            title: 't',
            caption: 'c',
            textAlign: 'left',
            captionAlign: 'right',
          }),
        ]),
        {
          markup: '==text==|symbol:s|caption:c|captionAlign:right|',
          ast: [p(t('text', [m('symbol', { src: 's', caption: 'c', captionAlign: 'right' })]))],
        },
      );
      every(text([m('symbol', { src: 's', title: 't', textAlign: 'right' })]), {
        markup: '==text==|symbol:s|caption:t|captionAlign:right|',
      });
    });
    it('numeric strings are integers', () => {
      every(text([m('symbol', { src: 's', width: '300' })]), {
        markup: '==text==|symbol:s|width:300|',
      });
    });
  });

  describe('footnote content (chain value context)', () => {
    it('plain text and single short-form marks survive', () => {
      every(text([m('footnote', { content: [t('a '), t('b', [m('bold')]), t(' c')] })]), {
        markup: '==text==|footnote:a **b** c|',
      });
    });
    it('chain-form marks inside the content are dropped', () => {
      every(text([m('footnote', { content: [t('x', [m('bold'), m('italic')])] })]), {
        markup: '==text==|footnote:x|',
        ast: [p(t('text', [m('footnote', { content: [t('x')] })]))],
      });
      every(text([m('footnote', { content: [t('x', [m('textStyle', { color: 'red' })])] })]), {
        markup: '==text==|footnote:x|',
      });
      every(text([m('footnote*', { content: [t('x', [m('footnote', { content: [t('y')] })])] })]), {
        markup: '==text==|footnote*:x|',
      });
    });
    it('a hardBreak becomes a space', () => {
      every(text([m('footnote', { content: [t('a'), { type: 'hardBreak' }, t('b')] })]), {
        markup: '==text==|footnote:a b|',
      });
    });
    it('a pipe in the content text → footnote dropped', () => {
      every(text([m('footnote', { content: [t('a|b')] })]), plain);
    });
    it('a bare URL inside the content survives as a simple link', () => {
      every(
        text([
          m('footnote', {
            content: [t('see '), t('a.com', [m('link', { href: 'https://a.com' })])],
          }),
        ]),
        { markup: '==text==|footnote:see https://a.com|' },
      );
    });
  });

  describe('mark order', () => {
    it('ref before an xref with an empty reference', () => {
      every(text([m('xref', { xref: 'a', reference: '' }), m('ref', { reference: 'b' })]), {
        markup: '==text==|►b|xref:a|',
        ast: [p(t('text', [m('ref', { reference: 'b' }), m('xref', { xref: 'a' })]))],
      });
    });
    it('symbol last; a second symbol is dropped', () => {
      every(text([m('symbol', { src: 's' }), m('bold')]), {
        markup: '==text==|bold|symbol:s|',
        ast: [p(t('text', [m('bold'), m('symbol', { src: 's' })]))],
      });
      every(text([m('symbol', { src: 's' }), { type: 'comment', comment: 'c' }]), {
        markup: '==text==|#c|symbol:s|',
      });
      every(text([m('symbol', { src: 's' }), m('symbol', { src: 'u' })]), {
        markup: '==text==|symbol:s|',
      });
    });
    it('symbol is dropped when the rest of its line contains a pipe (its chain would swallow it)', () => {
      every([p(t('a', [m('symbol', { src: 's' }), m('bold')]), t(' x|y'))], {
        markup: '==a==|bold|^ x|y',
        ast: [p(t('a', [m('bold')]), t(' x|y'))],
      });
      every([p(t('a', [m('symbol', { src: 's' })]), t(' x'), hb(), t('y|z'))], {
        markup: '==a==|symbol:s| x\ny|z',
      });
    });
    it('highlight / textStyle(HighlightColor) swapped so it is not read as a compound', () => {
      every(text([m('userHighlight'), m('textStyle', { color: 'yellow' })]), {
        markup: '==text==|color:yellow|userHighlight|',
        ast: [p(t('text', [m('textStyle', { color: 'yellow' }), m('userHighlight')]))],
      });
    });
  });

  describe('robustness', () => {
    it('never throws on malformed shapes', () => {
      every([p(t('text', 'bold'))], plain);
      every([p(t('text', [null, 5, 'x', {}, { attrs: { color: 'red' } }]))], plain);
      every([p(t('text', [m('Bold')]))], plain);
      every([p(t('text', [m('foo')]))], plain);
      every([p(t('text', []))], plain);
      every([p({ type: 'text', text: 5 } as never)], {});
    });
    it('unknown marks are dropped, known ones kept', () => {
      every(text([m('foo'), m('bold')]), { markup: '==text==|bold|' });
    });
    it('an empty text node is not written', () => {
      expectRepresentable([p(t('a'), t('', [m('bold')]), t('b'))], { markup: 'ab' });
    });
  });
});
