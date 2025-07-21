import { describe, expect, it } from 'vitest';

import { Breakscape } from '../../src/breakscaping/BreakscapeRegex.ts';
import { BodyTextFormat, type BodyTextFormatType } from '../../src/model/enum/BodyTextFormat.ts';
import { TextLocation, type TextLocationType } from '../../src/model/enum/TextLocation.ts';

type Case = {
  from: string;
  to: {
    bitmarkPlusPlus_body: string;
    bitmarkPlusPlus_tag: string;
    text_body: string;
    text_tag: string;
  };
};

// ---------------------------------------------------------------------------
// 1.  Spec rows   (verbatim from comment table)
// ---------------------------------------------------------------------------
const CASES: Case[] = [
  // ───── HATS ─────
  {
    from: '^',
    to: {
      bitmarkPlusPlus_body: '^^',
      bitmarkPlusPlus_tag: '^^',
      text_body: '^',
      text_tag: '^^',
    },
  },
  {
    from: '^^',
    to: {
      bitmarkPlusPlus_body: '^^^',
      bitmarkPlusPlus_tag: '^^^',
      text_body: '^^',
      text_tag: '^^^',
    },
  },
  {
    from: '^^^^',
    to: {
      bitmarkPlusPlus_body: '^^^^^',
      bitmarkPlusPlus_tag: '^^^^^',
      text_body: '^^^^',
      text_tag: '^^^^^',
    },
  },
  {
    from: '*^*^*',
    to: {
      bitmarkPlusPlus_body: '*^^*^^*',
      bitmarkPlusPlus_tag: '*^^*^^*',
      text_body: '*^*^*',
      text_tag: '*^^*^^*',
    },
  },
  {
    from: '|^|^|',
    to: {
      bitmarkPlusPlus_body: '|^^|^^|',
      bitmarkPlusPlus_tag: '|^^|^^|',
      text_body: '|^|^|',
      text_tag: '|^^|^^|',
    },
  },
  {
    from: '_^_^_',
    to: {
      bitmarkPlusPlus_body: '_^^_^^_',
      bitmarkPlusPlus_tag: '_^^_^^_',
      text_body: '_^_^_',
      text_tag: '_^^_^^_',
    },
  },
  {
    from: '_^^^_^^^_',
    to: {
      bitmarkPlusPlus_body: '_^^^^_^^^^_',
      bitmarkPlusPlus_tag: '_^^^^_^^^^_',
      text_body: '_^^^_^^^_',
      text_tag: '_^^^^_^^^^_',
    },
  },

  // ───── INLINE DOUBLES (body) ─────
  {
    from: '==',
    to: {
      bitmarkPlusPlus_body: '=^=',
      bitmarkPlusPlus_tag: '=^=',
      text_body: '==',
      text_tag: '==',
    },
  },
  {
    from: 'before==after',
    to: {
      bitmarkPlusPlus_body: 'before=^=after',
      bitmarkPlusPlus_tag: 'before=^=after',
      text_body: 'before==after',
      text_tag: 'before==after',
    },
  },
  {
    from: '===',
    to: {
      bitmarkPlusPlus_body: '=^=^=',
      bitmarkPlusPlus_tag: '=^=^=',
      text_body: '===',
      text_tag: '===',
    },
  },
  {
    from: '====',
    to: {
      bitmarkPlusPlus_body: '=^=^=^=',
      bitmarkPlusPlus_tag: '=^=^=^=',
      text_body: '====',
      text_tag: '====',
    },
  },
  {
    from: '**',
    to: {
      bitmarkPlusPlus_body: '*^*',
      bitmarkPlusPlus_tag: '*^*',
      text_body: '**',
      text_tag: '**',
    },
  },
  {
    from: '***',
    to: {
      bitmarkPlusPlus_body: '*^*^*',
      bitmarkPlusPlus_tag: '*^*^*',
      text_body: '***',
      text_tag: '***',
    },
  },
  {
    from: '****',
    to: {
      bitmarkPlusPlus_body: '*^*^*^*',
      bitmarkPlusPlus_tag: '*^*^*^*',
      text_body: '****',
      text_tag: '****',
    },
  },
  {
    from: 'before**after',
    to: {
      bitmarkPlusPlus_body: 'before*^*after',
      bitmarkPlusPlus_tag: 'before*^*after',
      text_body: 'before**after',
      text_tag: 'before**after',
    },
  },
  {
    from: '``',
    to: {
      bitmarkPlusPlus_body: '`^`',
      bitmarkPlusPlus_tag: '`^`',
      text_body: '``',
      text_tag: '``',
    },
  },
  {
    from: '```',
    to: {
      bitmarkPlusPlus_body: '`^`^`',
      bitmarkPlusPlus_tag: '`^`^`',
      text_body: '```',
      text_tag: '```',
    },
  },
  {
    from: '````',
    to: {
      bitmarkPlusPlus_body: '`^`^`^`',
      bitmarkPlusPlus_tag: '`^`^`^`',
      text_body: '````',
      text_tag: '````',
    },
  },
  {
    from: 'before``after',
    to: {
      bitmarkPlusPlus_body: 'before`^`after',
      bitmarkPlusPlus_tag: 'before`^`after',
      text_body: 'before``after',
      text_tag: 'before``after',
    },
  },
  {
    from: '__',
    to: {
      bitmarkPlusPlus_body: '_^_',
      bitmarkPlusPlus_tag: '_^_',
      text_body: '__',
      text_tag: '__',
    },
  },
  {
    from: '___',
    to: {
      bitmarkPlusPlus_body: '_^_^_',
      bitmarkPlusPlus_tag: '_^_^_',
      text_body: '___',
      text_tag: '___',
    },
  },
  {
    from: '____',
    to: {
      bitmarkPlusPlus_body: '_^_^_^_',
      bitmarkPlusPlus_tag: '_^_^_^_',
      text_body: '____',
      text_tag: '____',
    },
  },
  {
    from: 'before__after',
    to: {
      bitmarkPlusPlus_body: 'before_^_after',
      bitmarkPlusPlus_tag: 'before_^_after',
      text_body: 'before__after',
      text_tag: 'before__after',
    },
  },
  {
    from: '!!',
    to: {
      bitmarkPlusPlus_body: '!^!',
      bitmarkPlusPlus_tag: '!^!',
      text_body: '!!',
      text_tag: '!!',
    },
  },
  {
    from: '!!!',
    to: {
      bitmarkPlusPlus_body: '!^!^!',
      bitmarkPlusPlus_tag: '!^!^!',
      text_body: '!!!',
      text_tag: '!!!',
    },
  },
  {
    from: '!!!!',
    to: {
      bitmarkPlusPlus_body: '!^!^!^!',
      bitmarkPlusPlus_tag: '!^!^!^!',
      text_body: '!!!!',
      text_tag: '!!!!',
    },
  },
  {
    from: 'before!!after',
    to: {
      bitmarkPlusPlus_body: 'before!^!after',
      bitmarkPlusPlus_tag: 'before!^!after',
      text_body: 'before!!after',
      text_tag: 'before!!after',
    },
  },

  // ───── BLOCK / LIST  (at SOL) ─────
  {
    from: '### ',
    to: {
      bitmarkPlusPlus_body: '###^ ',
      bitmarkPlusPlus_tag: '### ',
      text_body: '### ',
      text_tag: '### ',
    },
  },
  {
    from: '|',
    to: {
      bitmarkPlusPlus_body: '|^',
      bitmarkPlusPlus_tag: '|',
      text_body: '|',
      text_tag: '|',
    },
  },
  {
    from: '|code',
    to: {
      bitmarkPlusPlus_body: '|^code',
      bitmarkPlusPlus_tag: '|code',
      text_body: '|code',
      text_tag: '|code',
    },
  },
  {
    from: '|image:http',
    to: {
      bitmarkPlusPlus_body: '|^image:http',
      bitmarkPlusPlus_tag: '|image:http',
      text_body: '|image:http',
      text_tag: '|image:http',
    },
  },
  {
    from: '• ',
    to: {
      bitmarkPlusPlus_body: '•^ ',
      bitmarkPlusPlus_tag: '• ',
      text_body: '• ',
      text_tag: '• ',
    },
  },
  {
    from: '•_ ',
    to: {
      bitmarkPlusPlus_body: '•^_ ',
      bitmarkPlusPlus_tag: '•_ ',
      text_body: '•_ ',
      text_tag: '•_ ',
    },
  },
  {
    from: '•12 ',
    to: {
      bitmarkPlusPlus_body: '•^12 ',
      bitmarkPlusPlus_tag: '•12 ',
      text_body: '•12 ',
      text_tag: '•12 ',
    },
  },
  {
    from: '•12i ',
    to: {
      bitmarkPlusPlus_body: '•^12i ',
      bitmarkPlusPlus_tag: '•12i ',
      text_body: '•12i ',
      text_tag: '•12i ',
    },
  },
  {
    from: '•12I ',
    to: {
      bitmarkPlusPlus_body: '•^12I ',
      bitmarkPlusPlus_tag: '•12I ',
      text_body: '•12I ',
      text_tag: '•12I ',
    },
  },
  {
    from: '•a ',
    to: {
      bitmarkPlusPlus_body: '•^a ',
      bitmarkPlusPlus_tag: '•a ',
      text_body: '•a ',
      text_tag: '•a ',
    },
  },
  {
    from: '•+ ',
    to: {
      bitmarkPlusPlus_body: '•^+ ',
      bitmarkPlusPlus_tag: '•+ ',
      text_body: '•+ ',
      text_tag: '•+ ',
    },
  },
  {
    from: '•- ',
    to: {
      bitmarkPlusPlus_body: '•^- ',
      bitmarkPlusPlus_tag: '•- ',
      text_body: '•- ',
      text_tag: '•- ',
    },
  },

  // ───── LIST  (with space) ─────
  {
    from: ' • ',
    to: {
      bitmarkPlusPlus_body: ' • ',
      bitmarkPlusPlus_tag: ' • ',
      text_body: ' • ',
      text_tag: ' • ',
    },
  },
  {
    from: ' •_ ',
    to: {
      bitmarkPlusPlus_body: ' •_ ',
      bitmarkPlusPlus_tag: ' •_ ',
      text_body: ' •_ ',
      text_tag: ' •_ ',
    },
  },
  {
    from: ' •12 ',
    to: {
      bitmarkPlusPlus_body: ' •12 ',
      bitmarkPlusPlus_tag: ' •12 ',
      text_body: ' •12 ',
      text_tag: ' •12 ',
    },
  },
  {
    from: ' •12i ',
    to: {
      bitmarkPlusPlus_body: ' •12i ',
      bitmarkPlusPlus_tag: ' •12i ',
      text_body: ' •12i ',
      text_tag: ' •12i ',
    },
  },
  {
    from: ' •12I ',
    to: {
      bitmarkPlusPlus_body: ' •12I ',
      bitmarkPlusPlus_tag: ' •12I ',
      text_body: ' •12I ',
      text_tag: ' •12I ',
    },
  },
  {
    from: ' •a ',
    to: {
      bitmarkPlusPlus_body: ' •a ',
      bitmarkPlusPlus_tag: ' •a ',
      text_body: ' •a ',
      text_tag: ' •a ',
    },
  },
  {
    from: ' •+ ',
    to: {
      bitmarkPlusPlus_body: ' •+ ',
      bitmarkPlusPlus_tag: ' •+ ',
      text_body: ' •+ ',
      text_tag: ' •+ ',
    },
  },
  {
    from: ' •- ',
    to: {
      bitmarkPlusPlus_body: ' •- ',
      bitmarkPlusPlus_tag: ' •- ',
      text_body: ' •- ',
      text_tag: ' •- ',
    },
  },

  // ───── START-OF-TAG inside body ([@ etc.) ─────
  {
    from: '[.',
    to: {
      bitmarkPlusPlus_body: '[^.',
      bitmarkPlusPlus_tag: '[.',
      text_body: '[^.',
      text_tag: '[.',
    },
  },
  {
    from: ' [.',
    to: {
      bitmarkPlusPlus_body: ' [^.',
      bitmarkPlusPlus_tag: ' [.',
      text_body: ' [.',
      text_tag: ' [.',
    },
  },
  {
    from: '[^.',
    to: {
      bitmarkPlusPlus_body: '[^^.',
      bitmarkPlusPlus_tag: '[^^.',
      text_body: '[^^.',
      text_tag: '[^^.',
    },
  },
  {
    from: '[^^.',
    to: {
      bitmarkPlusPlus_body: '[^^^.',
      bitmarkPlusPlus_tag: '[^^^.',
      text_body: '[^^^.',
      text_tag: '[^^^.',
    },
  },
  {
    from: '[@',
    to: {
      bitmarkPlusPlus_body: '[^@',
      bitmarkPlusPlus_tag: '[@',
      text_body: '[@',
      text_tag: '[@',
    },
  },
  {
    from: ' [@',
    to: {
      bitmarkPlusPlus_body: ' [^@',
      bitmarkPlusPlus_tag: ' [@',
      text_body: ' [@',
      text_tag: ' [@',
    },
  },
  {
    from: '[#',
    to: {
      bitmarkPlusPlus_body: '[^#',
      bitmarkPlusPlus_tag: '[#',
      text_body: '[#',
      text_tag: '[#',
    },
  },
  {
    from: ' [#',
    to: {
      bitmarkPlusPlus_body: ' [^#',
      bitmarkPlusPlus_tag: ' [#',
      text_body: ' [#',
      text_tag: ' [#',
    },
  },
  {
    from: '[▼',
    to: {
      bitmarkPlusPlus_body: '[^▼',
      bitmarkPlusPlus_tag: '[▼',
      text_body: '[▼',
      text_tag: '[▼',
    },
  },
  {
    from: ' [▼',
    to: {
      bitmarkPlusPlus_body: ' [^▼',
      bitmarkPlusPlus_tag: ' [▼',
      text_body: ' [▼',
      text_tag: ' [▼',
    },
  },
  {
    from: '[►',
    to: {
      bitmarkPlusPlus_body: '[^►',
      bitmarkPlusPlus_tag: '[►',
      text_body: '[►',
      text_tag: '[►',
    },
  },
  {
    from: ' [►',
    to: {
      bitmarkPlusPlus_body: ' [^►',
      bitmarkPlusPlus_tag: ' [►',
      text_body: ' [►',
      text_tag: ' [►',
    },
  },
  {
    from: '[%',
    to: {
      bitmarkPlusPlus_body: '[^%',
      bitmarkPlusPlus_tag: '[%',
      text_body: '[%',
      text_tag: '[%',
    },
  },
  {
    from: ' [%',
    to: {
      bitmarkPlusPlus_body: ' [^%',
      bitmarkPlusPlus_tag: ' [%',
      text_body: ' [%',
      text_tag: ' [%',
    },
  },
  {
    from: '[!',
    to: {
      bitmarkPlusPlus_body: '[^!',
      bitmarkPlusPlus_tag: '[!',
      text_body: '[!',
      text_tag: '[!',
    },
  },
  {
    from: ' [!',
    to: {
      bitmarkPlusPlus_body: ' [^!',
      bitmarkPlusPlus_tag: ' [!',
      text_body: ' [!',
      text_tag: ' [!',
    },
  },
  {
    from: '[?',
    to: {
      bitmarkPlusPlus_body: '[^?',
      bitmarkPlusPlus_tag: '[?',
      text_body: '[?',
      text_tag: '[?',
    },
  },
  {
    from: ' [?',
    to: {
      bitmarkPlusPlus_body: ' [^?',
      bitmarkPlusPlus_tag: ' [?',
      text_body: ' [?',
      text_tag: ' [?',
    },
  },
  {
    from: '[+',
    to: {
      bitmarkPlusPlus_body: '[^+',
      bitmarkPlusPlus_tag: '[+',
      text_body: '[+',
      text_tag: '[+',
    },
  },
  {
    from: ' [+',
    to: {
      bitmarkPlusPlus_body: ' [^+',
      bitmarkPlusPlus_tag: ' [+',
      text_body: ' [+',
      text_tag: ' [+',
    },
  },
  {
    from: ' [-',
    to: {
      bitmarkPlusPlus_body: ' [^-',
      bitmarkPlusPlus_tag: ' [-',
      text_body: ' [-',
      text_tag: ' [-',
    },
  },
  {
    from: ' [-',
    to: {
      bitmarkPlusPlus_body: ' [^-',
      bitmarkPlusPlus_tag: ' [-',
      text_body: ' [-',
      text_tag: ' [-',
    },
  },
  {
    from: '[$',
    to: {
      bitmarkPlusPlus_body: '[^$',
      bitmarkPlusPlus_tag: '[$',
      text_body: '[$',
      text_tag: '[$',
    },
  },
  {
    from: ' [$',
    to: {
      bitmarkPlusPlus_body: ' [^$',
      bitmarkPlusPlus_tag: ' [$',
      text_body: ' [$',
      text_tag: ' [$',
    },
  },
  {
    from: '[_',
    to: {
      bitmarkPlusPlus_body: '[^_',
      bitmarkPlusPlus_tag: '[_',
      text_body: '[_',
      text_tag: '[_',
    },
  },
  {
    from: ' [_',
    to: {
      bitmarkPlusPlus_body: ' [^_',
      bitmarkPlusPlus_tag: ' [_',
      text_body: ' [_',
      text_tag: ' [_',
    },
  },
  {
    from: '[=',
    to: {
      bitmarkPlusPlus_body: '[^=',
      bitmarkPlusPlus_tag: '[=',
      text_body: '[=',
      text_tag: '[=',
    },
  },
  {
    from: ' [=',
    to: {
      bitmarkPlusPlus_body: ' [^=',
      bitmarkPlusPlus_tag: ' [=',
      text_body: ' [=',
      text_tag: ' [=',
    },
  },
  {
    from: '[&',
    to: {
      bitmarkPlusPlus_body: '[^&',
      bitmarkPlusPlus_tag: '[&',
      text_body: '[&',
      text_tag: '[&',
    },
  },
  {
    from: ' [&',
    to: {
      bitmarkPlusPlus_body: ' [^&',
      bitmarkPlusPlus_tag: ' [&',
      text_body: ' [&',
      text_tag: ' [&',
    },
  },

  // ───── end-of-tag  ] ─────
  {
    from: ']',
    to: {
      bitmarkPlusPlus_body: ']',
      bitmarkPlusPlus_tag: '^]',
      text_body: ']',
      text_tag: '^]',
    },
  },
  {
    from: ' ]',
    to: {
      bitmarkPlusPlus_body: ' ]',
      bitmarkPlusPlus_tag: ' ^]',
      text_body: ' ]',
      text_tag: ' ^]',
    },
  },

  // ───── complex ─────
  {
    from: ':5__5:32]**fg^[.article]e!!--``test]^',
    to: {
      bitmarkPlusPlus_body: ':5_^_5:32]*^*fg^^[^.article]e!^!--`^`test]^^',
      bitmarkPlusPlus_tag: ':5_^_5:32^]*^*fg^^[.article^]e!^!--`^`test^]^^',
      text_body: ':5__5:32]**fg^[.article]e!!--``test]^',
      text_tag: ':5__5:32^]**fg^^[.article^]e!!--``test^]^^',
    },
  },
  {
    from: '^]^[.article]^^]^',
    to: {
      bitmarkPlusPlus_body: '^^]^^[^.article]^^^]^^',
      bitmarkPlusPlus_tag: '^^]^^[.article^]^^^]^^',
      text_body: '^]^[.article]^^]^',
      text_tag: '^^]^^[.article^]^^^]^^',
    },
  },

  // ───── intentionally wrong ─────
  {
    from: true as unknown as string, // intentionally wrong type
    to: {
      bitmarkPlusPlus_body: true as unknown as string, // intentionally wrong type
      bitmarkPlusPlus_tag: true as unknown as string, // intentionally wrong type
      text_body: true as unknown as string, // intentionally wrong type
      text_tag: true as unknown as string, // intentionally wrong type
    },
  },
  {
    from: false as unknown as string, // intentionally wrong type
    to: {
      bitmarkPlusPlus_body: false as unknown as string, // intentionally wrong type
      bitmarkPlusPlus_tag: false as unknown as string, // intentionally wrong type
      text_body: false as unknown as string, // intentionally wrong type
      text_tag: false as unknown as string, // intentionally wrong type
    },
  },
  {
    from: 0 as unknown as string, // intentionally wrong type
    to: {
      bitmarkPlusPlus_body: 0 as unknown as string, // intentionally wrong type
      bitmarkPlusPlus_tag: 0 as unknown as string, // intentionally wrong type
      text_body: 0 as unknown as string, // intentionally wrong type
      text_tag: 0 as unknown as string, // intentionally wrong type
    },
  },
  {
    from: 1 as unknown as string, // intentionally wrong type
    to: {
      bitmarkPlusPlus_body: 1 as unknown as string, // intentionally wrong type
      bitmarkPlusPlus_tag: 1 as unknown as string, // intentionally wrong type
      text_body: 1 as unknown as string, // intentionally wrong type
      text_tag: 1 as unknown as string, // intentionally wrong type
    },
  },
];

// ---------------------------------------------------------------------------
// 2.  Parametrised Vitest tests
// ---------------------------------------------------------------------------
describe(`Breakscape`, () => {
  const bs = new Breakscape();

  const types = ['bitmarkPlusPlus_body', 'bitmarkPlusPlus_tag', 'text_body', 'text_tag'] as const;
  type TypeKey = (typeof types)[number];

  types.forEach((type: TypeKey) => {
    const textFormat = BodyTextFormat.fromKey(type.split('_')[0]) as BodyTextFormatType;
    const textLocation = TextLocation.fromKey(type.split('_')[1]) as TextLocationType;

    // Standard tests
    describe(`[${textFormat}, ${textLocation}]`, () => {
      CASES.forEach(({ from, to: _to }) => {
        const to = _to[type];

        it(`${from} → breakscape → ${to}`, () => {
          const res = bs.breakscape(from, {
            format: textFormat,
            location: textLocation,
          });
          expect(res).toBe(to);
        });
        it(`${to} → unbreakscape → ${from}`, () => {
          const res = bs.unbreakscape(to, {
            format: textFormat,
            location: textLocation,
          });
          expect(res).toBe(from);
        });
      });
    });
  });

  // Array tests
  let textFormat: BodyTextFormatType = BodyTextFormat.bitmarkPlusPlus;
  let textLocation: TextLocationType = TextLocation.body;
  const from = ['^'];
  const to = ['^^'];

  describe(`[${textFormat}, ${textLocation}] (array)`, () => {
    it(`${from} → breakscape → ${to}`, () => {
      const res = bs.breakscape(from, {
        format: textFormat,
        location: textLocation,
      });
      expect(res).toEqual(to);
    });
    it(`${to} → unbreakscape → ${from}`, () => {
      const res = bs.unbreakscape(to, {
        format: textFormat,
        location: textLocation,
      });
      expect(res).toEqual(from);
    });
  });

  // Other type tests
  textFormat = 'notBitmark++' as BodyTextFormatType;
  textLocation = TextLocation.tag;

  describe(`[notBitmark++, ${textLocation}] (array)`, () => {
    it(`${from} → breakscape → ${to}`, () => {
      const res = bs.breakscape(from, {
        format: textFormat,
        location: textLocation,
      });
      expect(res).toEqual(to);
    });
    it(`${to} → unbreakscape → ${from}`, () => {
      const res = bs.unbreakscape(to, {
        format: textFormat,
        location: textLocation,
      });
      expect(res).toEqual(from);
    });
  });
});
