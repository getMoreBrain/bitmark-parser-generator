/**
 * PLAN-022 T1 (nodes and contexts): the text generator only writes nodes the text grammar parses
 * back, in the container the grammar produces them in.
 */
import { describe, expect, it } from 'vitest';

import { TextLocation } from '../../../src/model/enum/TextLocation.ts';
import {
  expectRepresentable as body,
  expectRepresentableEverywhere as every,
  generate,
  hb,
  li,
  list,
  m,
  node,
  p,
  t,
} from './textRoundTrip.ts';

const IMG = 'https://a/i.png';
const image = (attrs: Record<string, unknown>) => node('image', attrs);
const imageInline = (attrs: Record<string, unknown>) => node('imageInline', attrs);
const heading = (level: unknown, ...content: unknown[]) =>
  node('heading', level === undefined ? {} : { level }, content as never);
const codeBlock = (language: unknown, ...content: unknown[]) =>
  node('codeBlock', language === undefined ? undefined : { language }, content as never);

describe('TextGenerator representable nodes', () => {
  describe('image (src: UrlHttp mandatory, chain items optional)', () => {
    it('valid image with chain items', () => {
      const attrs = { src: IMG, width: 928, height: 10, alt: 'a', title: 'c', comment: 'k' };
      body([image(attrs)], {
        markup: `|image:${IMG}|alt:a|caption:c|width:928|height:10|#k|`,
        ast: [image(attrs)],
      });
    });
    it.each([['img.png'], ['https://a/i .png'], [''], [undefined]])(
      'src %j is not a UrlHttp → node omitted',
      (src) => {
        body([image({ src, alt: 'a' })], { markup: '', ast: [] });
      },
    );
    it('invalid chain values are omitted, the image kept', () => {
      body(
        [
          image({
            src: IMG,
            width: 'abc',
            height: -5,
            alignment: 'bad',
            textAlign: 'bad',
            alt: 'a\nb',
            zoomDisabled: 'yes',
          }),
        ],
        { markup: `|image:${IMG}|`, ast: [image({ src: IMG })] },
      );
      body([image({ src: IMG, width: 1.5 })], { markup: `|image:${IMG}|` });
    });
    it('keys the grammar has no rule for are never written', () => {
      body(
        [
          image({
            src: IMG,
            class: 'left',
            '': 'v',
            error: 'Found unknown property or invalid value: foo',
            foo: 'bar',
            type: 'error',
          }),
        ],
        { markup: `|image:${IMG}|` },
      );
    });
    it('parser defaults are suppressed, non-defaults written', () => {
      body([image({ src: IMG, alignment: 'center', textAlign: 'left', zoomDisabled: true })], {
        markup: `|image:${IMG}|`,
      });
      body([image({ src: IMG, alignment: 'right', textAlign: 'right', zoomDisabled: false })], {
        markup: `|image:${IMG}|alignment:right|captionAlign:right|zoomDisabled:false|`,
        ast: [image({ src: IMG, alignment: 'right', textAlign: 'right', zoomDisabled: false })],
      });
      body([image({ src: IMG, width: '300', zoomDisabled: 'false' })], {
        markup: `|image:${IMG}|zoomDisabled:false|width:300|`,
      });
    });
  });

  describe('imageInline (src: Url and ==alt== mandatory)', () => {
    it('valid inline image', () => {
      every([p(t('a '), imageInline({ src: IMG, alt: 'x', width: 40 }), t(' b'))], {
        markup: `a ==x==|imageInline:${IMG}|width:40| b`,
        ast: [p(t('a '), imageInline({ src: IMG, alt: 'x', width: 40 }), t(' b'))],
      });
      every([p(imageInline({ src: 'mailto:x@y.z', alt: 'x' }))], {
        markup: '==x==|imageInline:mailto:x@y.z|',
      });
    });
    it.each([['img.png'], ['https://a/i|.png'], [undefined]])('src %j → node omitted', (src) => {
      every([p(t('a'), imageInline({ src, alt: 'x' }), t('b'))], { markup: 'ab' });
    });
    it.each([['a==b'], [''], [undefined], ['=a'], ['a=']])(
      'alt %j has no ==alt== form → node omitted',
      (alt) => {
        every([p(t('a'), imageInline({ src: IMG, alt }), t('b'))], { markup: 'ab' });
      },
    );
    it('alt may contain a single = and a pipe', () => {
      every([p(imageInline({ src: IMG, alt: 'a=b|c' }))], {
        markup: `==a=b|c==|imageInline:${IMG}|`,
        ast: [p(imageInline({ src: IMG, alt: 'a=b|c' }))],
      });
    });
    it('invalid, unknown and default chain items are omitted', () => {
      every(
        [
          p(
            imageInline({
              src: IMG,
              alt: 'x',
              width: 'abc',
              alignmentVertical: 'bad',
              size: 'bad',
              foo: 'bar',
              type: 'error',
              msg: 'width must be a positive integer.',
              found: 'abc',
              zoomDisabled: true,
              title: null,
            }),
          ),
        ],
        { markup: `==x==|imageInline:${IMG}|`, ast: [p(imageInline({ src: IMG, alt: 'x' }))] },
      );
      every(
        [p(imageInline({ src: IMG, alt: 'x', alignmentVertical: 'top', size: 'line-height' }))],
        {
          markup: `==x==|imageInline:${IMG}|`,
        },
      );
      every(
        [
          p(
            imageInline({
              src: IMG,
              alt: 'x',
              alignmentVertical: 'bottom',
              size: 'super',
              srcAlt: 'https://b',
              comment: 'c',
            }),
          ),
        ],
        {
          markup: `==x==|imageInline:${IMG}|srcAlt:https://b|alignmentVertical:bottom|size:super|#c|`,
        },
      );
    });
  });

  describe('latex', () => {
    it('formula is breakscaped; missing formula → node omitted', () => {
      every([p(node('latex', { formula: 'a==b|c' }))], { markup: '==a=^=b|c==|latex|' });
      every([p(t('a'), node('latex', {}), t('b'))], { markup: 'ab' });
    });
  });

  describe('heading (TitleTags mandatory)', () => {
    it('levels 1..3', () => {
      for (const level of [1, 2, 3]) {
        body([heading(level, t('H'))], {
          markup: `${'#'.repeat(level)} H`,
          ast: [heading(level, t('H'))],
        });
      }
    });
    it.each([[4], [0], ['2'], ['x'], [1.5]])('level %j → paragraph', (level) => {
      body([heading(level, t('H'))], { markup: 'H', ast: [p(t('H'))] });
    });
    it('missing level → level 1', () => {
      body([heading(undefined, t('H'))], { markup: '# H', ast: [heading(1, t('H'))] });
    });
    it('empty content → omitted', () => {
      body([heading(1), p(t('a'))], { markup: 'a' });
      body([heading(1, t(' '))], { markup: '' });
    });
    it('hardBreak → space (single line); marks kept', () => {
      body([heading(1, t('H'), hb(), t('I'))], { markup: '# H I', ast: [heading(1, t('H I'))] });
      body([heading(2, t('H', [m('bold'), m('italic')]))], { markup: '## ==H==|bold|italic|' });
    });
    it('block children are flattened into the heading text', () => {
      body([heading(1, t('H'), list('bulletList', li(p(t('a')))))], { markup: '# H a' });
    });
  });

  describe('codeBlock', () => {
    it('language written lower-cased; missing / empty / invalid → |code header', () => {
      body([codeBlock('JS', t('x'))], { markup: '|code:js\nx', ast: [codeBlock('js', t('x'))] });
      body([codeBlock(undefined, t('x'))], { markup: '|code\nx' });
      body([codeBlock('', t('x'))], { markup: '|code\nx' });
      body([codeBlock('js\nx', t('y'))], { markup: '|code\ny' });
      // The parser's own output for '|code' has a top-level language, not attrs
      body([{ type: 'codeBlock', language: '', content: [t('x')] } as never], {
        markup: '|code\nx',
      });
    });
    it('content is plain text: marks dropped, hardBreaks are newlines', () => {
      body([codeBlock('js', t('x', [m('bold')]), hb(), t('y'))], {
        markup: '|code:js\nx\ny',
        ast: [codeBlock('js', t('x\ny'))],
      });
    });
  });

  describe('lists', () => {
    it('ordered list start must be a non-negative integer', () => {
      body([list('orderedList', li(p(t('a'))))], { markup: '•1 a' });
      body([node('orderedList', { start: 3 }, [li(p(t('a')))])], { markup: '•3 a' });
      body([node('orderedList', { start: '0' }, [li(p(t('a')))])], { markup: '•0 a' });
    });
    it.each([['x'], [-1], [1.5]])('start %j → items become paragraphs', (start) => {
      body([node('orderedList', { start }, [li(p(t('a'))), li(p(t('b')))])], {
        markup: 'a\n|\nb',
        ast: [p(t('a')), p(t('b'))],
      });
    });
    it('taskItem checked: only true is checked', () => {
      body([list('taskList', node('taskItem', { checked: true }, [p(t('a'))]))], {
        markup: '•+ a',
      });
      body([list('taskList', node('taskItem', { checked: 'yes' }, [p(t('a'))]))], {
        markup: '•- a',
      });
    });
    it('an empty item is omitted; an empty list is omitted', () => {
      body([list('bulletList', li(p(t('a'))), li(), li(p()))], { markup: '• a' });
      body([list('bulletList'), p(t('x'))], { markup: 'x' });
    });
    it('an item holds one paragraph: further paragraphs join it with hardBreaks', () => {
      body([list('bulletList', li(p(t('a')), p(t('b'))))], {
        markup: '• a\nb',
        ast: [list('bulletList', li(p(t('a'), hb(), t('b'))))],
      });
    });
    it('blocks inside an item are flattened into its paragraph; images dropped', () => {
      body(
        [
          list(
            'bulletList',
            li(heading(1, t('H')), codeBlock('js', t('c')), image({ src: IMG }), p(t('a'))),
          ),
        ],
        {
          markup: '• H\nc\na',
          ast: [list('bulletList', li(p(t('H'), hb(), t('c'), hb(), t('a'))))],
        },
      );
    });
    it('a sublist without a leading paragraph gets an empty paragraph line', () => {
      body([list('bulletList', li(list('bulletList', li(p(t('a'))))))], {
        markup: '• \n\t• a',
        ast: [list('bulletList', li(p(), list('bulletList', li(p(t('a'))))))],
      });
      body([list('bulletList', list('bulletList', li(p(t('a')))))], { markup: '• \n\t• a' });
    });
    it('a second sublist becomes a new item (keeps its type)', () => {
      body(
        [
          list(
            'bulletList',
            li(p(t('a')), list('bulletList', li(p(t('b')))), list('orderedList', li(p(t('c'))))),
          ),
        ],
        {
          markup: '• a\n\t• b\n• \n\t•1 c',
          ast: [
            list(
              'bulletList',
              li(p(t('a')), list('bulletList', li(p(t('b'))))),
              li(p(), list('orderedList', li(p(t('c'))))),
            ),
          ],
        },
      );
    });
    it('leading tabs on continuation lines are stripped', () => {
      body([list('bulletList', li(p(t('a'), hb(), t('\tb'))))], {
        markup: '• a\nb',
        ast: [list('bulletList', li(p(t('a'), hb(), t('b'))))],
      });
    });
  });

  describe('paragraph / block placement', () => {
    it('section has no grammar form → paragraph of its content', () => {
      body([node('section', undefined, [t('a')]) as never], { markup: 'a', ast: [p(t('a'))] });
      body([{ type: 'section', section: 'foo', content: [t('a')] } as never], { markup: 'a' });
    });
    it('a block image inside a paragraph is dropped', () => {
      every([p(t('a'), image({ src: IMG }), t('b'))], { markup: 'ab' });
    });
    it('paragraph inside paragraph is flattened', () => {
      every([p(t('a'), p(t('b')))], { markup: 'a\nb' });
    });
    it('marks: [] and all-dropped marks → plain text, no wrapper', () => {
      every([p(t('a'), t('b', []))], { markup: 'ab', ast: [p(t('ab'))] });
      body([heading(1, t('H', []))], { markup: '# H' });
    });
  });

  describe('tag location (bitmarkPlus has no blocks)', () => {
    const tag = (input: unknown, markup: string, ast?: unknown) =>
      body(input, { markup, ast }, TextLocation.tag);
    it('heading → its text', () => tag([heading(2, t('H'))], 'H', [p(t('H'))]));
    it('list → one line per item', () =>
      tag([list('bulletList', li(p(t('a'))), li(p(t('b'))))], 'a\nb', [p(t('a'), hb(), t('b'))]));
    it('codeBlock → its text', () => tag([codeBlock('js', t('x'))], 'x'));
    it('image → nothing; inline image kept', () =>
      tag(
        [image({ src: IMG }), p(imageInline({ src: IMG, alt: 'x' }))],
        `==x==|imageInline:${IMG}|`,
      ));
    it('paragraphs are separated by hardBreaks', () => tag([p(t('a')), p(), p(t('b'))], 'a\n\nb'));
  });

  describe('adjacency', () => {
    it('text after an inline chain that could continue the chain is sealed with ^', () => {
      every([p(t('a', [m('italic')]), t('bold|'))], {
        markup: '==a==|italic|^bold|',
        ast: [p(t('a', [m('italic')]), t('bold|'))],
      });
      every([p(t('a', [m('italic')]), t('color:red|'))], { markup: '==a==|italic|^color:red|' });
      every([p(t('a', [m('italic')]), t('|x'))], { markup: '==a==|italic|^|x' });
      every([p(t('a', [m('italic')]), t('x|'), hb(), t('y'))], { markup: '==a==|italic|^x|\ny' });
      // no '|' on the first line: no seal needed
      every([p(t('a', [m('italic')]), t('x'), hb(), t('bold|'))], {
        markup: '==a==|italic|x\nbold|',
      });
    });
    it('bare-URL link short form only when the following text cannot extend the URL', () => {
      const link = (text: string, href: string) => t(text, [m('link', { href })]);
      every([p(t('see '), link('a.com', 'https://a.com'), t(' now'))], {
        markup: 'see https://a.com now',
      });
      every([p(link('a.com', 'https://a.com'))], { markup: 'https://a.com' });
      every([p(link('a.com', 'https://a.com'), hb(), t('x'))], { markup: 'https://a.com\nx' });
      every([p(link('a.com', 'https://a.com'), t('.'))], {
        markup: '==a.com==|link:https://a.com|.',
        ast: [p(link('a.com', 'https://a.com'), t('.'))],
      });
      every([p(link('a.com', 'https://a.com'), t('b', [m('bold')]))], {
        markup: '==a.com==|link:https://a.com|==b==|bold|',
      });
      every([p(link('a.com', 'https://a.com'), imageInline({ src: IMG, alt: 'x' }))], {
        markup: `==a.com==|link:https://a.com|==x==|imageInline:${IMG}|`,
      });
      // href with a character outside UrlChars is not a Url: chain form
      every([p(link('a.com/x y', 'https://a.com/x y'))], {
        markup: '==a.com/x y==|link:https://a.com/x y|',
      });
    });
  });

  it('the reported #10567 body', () => {
    const item = (s: string) =>
      node('taskItem', { checked: false }, [p(t(s, [m('textStyle', { color: '' })]))]);
    const input = [
      list(
        'taskList',
        item('Du entwickelst ein eigenes Kaffeegetränk.'),
        item('Du setzt deine Rezeptur um.'),
      ),
    ];
    const markup = generate(input);
    expect(markup).not.toContain('|color:|');
    body(input, {
      markup: '•- Du entwickelst ein eigenes Kaffeegetränk.\n•- Du setzt deine Rezeptur um.',
      ast: [
        list(
          'taskList',
          node('taskItem', { checked: false }, [p(t('Du entwickelst ein eigenes Kaffeegetränk.'))]),
          node('taskItem', { checked: false }, [p(t('Du setzt deine Rezeptur um.'))]),
        ),
      ],
    });
  });
});
