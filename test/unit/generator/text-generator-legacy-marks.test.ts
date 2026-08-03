import { describe, expect, it } from 'vitest';

import { TextGenerator } from '../../../src/generator/text/TextGenerator.ts';
import {
  type TextAst,
  type TextMark,
  type TextMarkAttibutes,
} from '../../../src/model/ast/TextNodes.ts';
import { TextFormat } from '../../../src/model/enum/TextFormat.ts';
import { TextLocation } from '../../../src/model/enum/TextLocation.ts';
import { TextParser } from '../../../src/parser/text/TextParser.ts';

const textGenerator = new TextGenerator();
const textParser = new TextParser();

function mark(type: string, attrs?: Record<string, unknown>): TextMark {
  return {
    type,
    ...(attrs ? { attrs: attrs as TextMarkAttibutes } : {}),
  } as TextMark;
}

function ast(marks: TextMark[]): TextAst {
  return [
    {
      type: 'paragraph',
      content: [{ text: 'text', type: 'text', marks }],
      attrs: {},
    },
  ] as unknown as TextAst;
}

function generate(marks: TextMark[]): string {
  return textGenerator.generateSync(ast(marks), TextFormat.bitmarkText, TextLocation.body).trim();
}

/** Parse generated text back and return the marks of the first text node */
function reparseMarks(markup: string): TextMark[] | undefined {
  const parsed = textParser.toAst(markup, {
    format: TextFormat.bitmarkText,
    location: TextLocation.body,
  }) as unknown as { content?: { marks?: TextMark[] }[] }[];
  return parsed[0]?.content?.[0]?.marks;
}

describe('TextGenerator legacy mark normalization (JSON => bitmark text)', () => {
  describe('legacy color mark (pre-8.41.1, now textStyle)', () => {
    it('writes a legacy color mark as color: (same as textStyle)', () => {
      expect(generate([mark('color', { color: 'aqua' })])).toBe('==text==|color:aqua|');
    });

    it('writes a textStyle mark as color:', () => {
      const markup = generate([mark('textStyle', { color: 'aqua' })]);
      expect(markup).toBe('==text==|color:aqua|');
      // Output re-parses to the current format
      expect(reparseMarks(markup)).toEqual([mark('textStyle', { color: 'aqua' })]);
    });
  });

  describe('legacy timer / duration marks (pre-8.41.1)', () => {
    it('merges a legacy timer + duration mark pair into a timer|duration: chain', () => {
      const markup = generate([
        mark('timer', { name: 'my timer' }),
        mark('duration', { duration: 'P1DT6H' }),
      ]);
      expect(markup).toBe('==text==|timer:my timer|duration:P1DT6H|');
      expect(reparseMarks(markup)).toEqual([
        mark('timer', { name: 'my timer', duration: 'P1DT6H' }),
      ]);
    });

    it('merges an unnamed legacy timer + duration mark pair', () => {
      const markup = generate([
        mark('timer', { name: '' }),
        mark('duration', { duration: 'P23DT23H' }),
      ]);
      expect(markup).toBe('==text==|timer|duration:P23DT23H|');
    });

    it('writes a current-format timer mark (duration in attrs)', () => {
      expect(generate([mark('timer', { name: 'n', duration: 'P1D' })])).toBe(
        '==text==|timer:n|duration:P1D|',
      );
    });

    it('drops a standalone legacy duration mark, keeping the text', () => {
      expect(generate([mark('duration', { duration: 'P1D' })])).toBe('text');
    });

    it('drops a legacy timer mark that has no duration, keeping the text', () => {
      expect(generate([mark('timer', { name: 'my timer' })])).toBe('text');
    });
  });

  describe('highlight / userHighlight color compounds (8.41.1)', () => {
    it('writes a highlight mark with color using the inline chain form', () => {
      const markup = generate([mark('highlight', { color: 'orange' })]);
      expect(markup).toBe('==text==|highlight|color:orange|');
      expect(reparseMarks(markup)).toEqual([mark('highlight', { color: 'orange' })]);
    });

    it('writes a userHighlight mark with color using the inline chain form', () => {
      const markup = generate([mark('userHighlight', { color: 'pink' })]);
      expect(markup).toBe('==text==|userHighlight|color:pink|');
      expect(reparseMarks(markup)).toEqual([mark('userHighlight', { color: 'pink' })]);
    });

    it('keeps [highlight, textStyle(non-highlight color)] order - re-parses identically', () => {
      const markup = generate([mark('highlight'), mark('textStyle', { color: 'red' })]);
      expect(markup).toBe('==text==|highlight|color:red|');
      expect(reparseMarks(markup)).toEqual([
        mark('highlight'),
        mark('textStyle', { color: 'red' }),
      ]);
    });

    it('reorders [highlight, textStyle(valid highlight color)] so the output does not re-parse as a compound', () => {
      const markup = generate([mark('highlight'), mark('textStyle', { color: 'yellow' })]);
      expect(markup).toBe('==text==|color:yellow|highlight|');
      // Yellow TEXT color + default highlight is preserved (not a yellow highlight)
      expect(reparseMarks(markup)).toEqual([
        mark('textStyle', { color: 'yellow' }),
        mark('highlight'),
      ]);
    });
  });
});
