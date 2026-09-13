import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { BitmarkVersion, type BitWrapperJson } from '../../src/index.ts';

/**
 * PLAN-023: lightweight bits carry the whole [%...] chain
 * (item / lead / pageNumber / marginNumber) so they can be cited by page and
 * margin number. `item` and `lead` are positional placeholders on every
 * lightweight bit except `.h`, which keeps a valued item.
 *
 * These cover the cases the standard fixtures cannot: the JSON input path, the
 * JSON -> bitmark -> JSON round trip, and short chains.
 */

const bpg = new BitmarkParserGenerator();

const toJson = (bitmark: string): BitWrapperJson[] =>
  bpg.convert(bitmark, {
    bitmarkVersion: BitmarkVersion.v2,
    jsonOptions: { enableWarnings: true },
  }) as BitWrapperJson[];

const warnings = (w: BitWrapperJson): string[] =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((w as any).parser?.warnings ?? []).map((x: { message: string }) => x.message);

/**
 * The text of a tag value, or '' when empty/absent.
 * Handles both shapes: a plain string (bitmark v2 / textAsPlainText) and a
 * TextAst array (v3).
 */
const text = (v: unknown): string => {
  if (typeof v === 'string') return v;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (v as any)?.[0]?.content?.[0]?.text;
  return typeof t === 'string' ? t : '';
};

const fromJson = (bit: Record<string, unknown>): BitWrapperJson[] =>
  bpg.convert(JSON.stringify([{ bit: { format: 'bitmark++', bitLevel: 1, body: [], ...bit } }]), {
    outputFormat: 'json',
  }) as BitWrapperJson[];

const toBitmark = (bit: Record<string, unknown>): string =>
  bpg.convert(JSON.stringify([{ bit: { format: 'bitmark++', bitLevel: 1, body: [], ...bit } }]), {
    outputFormat: 'bitmark',
  }) as string;

// Lightweight bits whose item is a placeholder: the paragraph bits and the list
// CONTAINERS. Their list-ITEM cousins keep a valued item (see below).
const PLACEHOLDER_ITEM_BITS = [
  'p',
  'p-alt',
  'smart-standard-p',
  'list',
  'list-alt',
  'standard-list',
  'smart-standard-list',
];

// Lightweight bits that keep a valued item. A list item carries a label
// ('a)', 'iii.'), so the whole list-item family is exempt, as is `.h`.
// All four inherit the exemption from `list-item`.
const VALUED_ITEM_BITS = [
  'list-item',
  'standard-list-item',
  'smart-standard-list-item',
  'smart-standard-list-item-collapsible',
];

describe('PLAN-023 lightweight bit item chain', () => {
  describe.each(PLACEHOLDER_ITEM_BITS)('%s (item and lead are placeholders)', (bitType) => {
    test('page and margin number parse from a full chain, with no warning', () => {
      const w = toJson(`[.${bitType}]\n[%][%][%12][%m3]\nBody`)[0];
      expect([text(w.bit.pageNumber), text(w.bit.marginNumber)]).toEqual(['12', 'm3']);
      expect([text(w.bit.item), text(w.bit.lead)]).toEqual(['', '']);
      expect(warnings(w)).toEqual([]);
    });

    test('a page number alone needs a chain of three', () => {
      const w = toJson(`[.${bitType}]\n[%][%][%12]\nBody`)[0];
      expect(text(w.bit.pageNumber)).toBe('12');
      expect(warnings(w)).toEqual([]);
    });

    test('an item value is dropped with one warning', () => {
      const w = toJson(`[.${bitType}]\n[%4.1]\nBody`)[0];
      expect(text(w.bit.item)).toBe('');
      expect(warnings(w)).toEqual([
        `[%] 'item' does not take a value on bit '${bitType}'. It will be ignored.`,
      ]);
    });

    test('item and lead values are dropped with one warning each', () => {
      const w = toJson(`[.${bitType}]\n[%a][%b][%12]\nBody`)[0];
      expect([text(w.bit.item), text(w.bit.lead)]).toEqual(['', '']);
      expect(text(w.bit.pageNumber)).toBe('12');
      expect(warnings(w)).toEqual([
        `[%] 'item' does not take a value on bit '${bitType}'. It will be ignored.`,
        `[%] 'lead' does not take a value on bit '${bitType}'. It will be ignored.`,
      ]);
    });
  });

  describe.each(VALUED_ITEM_BITS)('%s keeps a valued item', (bitType) => {
    test('an item value is preserved with no warning', () => {
      const w = toJson(`[.${bitType}]\n[%a)]\nBody`)[0];
      expect(text(w.bit.item)).toBe('a)');
      expect(warnings(w)).toEqual([]);
    });

    test('item, page and margin number together', () => {
      const w = toJson(`[.${bitType}]\n[%a)][%][%12][%m3]\nBody`)[0];
      expect([text(w.bit.item), text(w.bit.pageNumber), text(w.bit.marginNumber)]).toEqual([
        'a)',
        '12',
        'm3',
      ]);
      expect(warnings(w)).toEqual([]);
    });

    test('a lead value is still dropped with a warning', () => {
      const w = toJson(`[.${bitType}]\n[%a)][%lead][%12]\nBody`)[0];
      expect([text(w.bit.item), text(w.bit.lead)]).toEqual(['a)', '']);
      expect(warnings(w)).toContain(
        `[%] 'lead' does not take a value on bit '${bitType}'. It will be ignored.`,
      );
    });
  });

  describe('h keeps a valued item', () => {
    test('an item value is preserved with no warning', () => {
      const w = toJson('[.h]\n[#Title]\n[%4.1]')[0];
      expect(text(w.bit.item)).toBe('4.1');
      expect(warnings(w)).toEqual([]);
    });

    test('item, page and margin number together', () => {
      const w = toJson('[.h]\n[#Title]\n[%4.1][%][%12][%m3]')[0];
      expect([text(w.bit.item), text(w.bit.pageNumber), text(w.bit.marginNumber)]).toEqual([
        '4.1',
        '12',
        'm3',
      ]);
      expect(warnings(w)).toEqual([]);
    });

    test('a lead value is still dropped with a warning', () => {
      const w = toJson('[.h]\n[#Title]\n[%4.1][%lead][%12]')[0];
      expect([text(w.bit.item), text(w.bit.lead), text(w.bit.pageNumber)]).toEqual([
        '4.1',
        '',
        '12',
      ]);
      expect(warnings(w)).toEqual([
        "[%] 'lead' does not take a value on bit 'h'. It will be ignored.",
      ]);
    });
  });

  describe('short chains are tolerated', () => {
    test.each(['[%]', '[%][%]'])('%s produces nothing and no warning', (chain) => {
      const w = toJson(`[.p]\n${chain}\nBody`)[0];
      expect([
        text(w.bit.item),
        text(w.bit.lead),
        text(w.bit.pageNumber),
        text(w.bit.marginNumber),
      ]).toEqual(['', '', '', '']);
      expect(warnings(w)).toEqual([]);
    });

    test('an empty chain regenerates as no [%] at all', () => {
      const json = toJson('[.p]\n[%][%]\nBody');
      expect(bpg.convert(json, { bitmarkVersion: BitmarkVersion.v2 })).toBe('[.p]\nBody\n\n');
    });
  });

  describe('JSON -> bitmark -> JSON round trip preserves page and margin number', () => {
    test.each(['p', 'h', 'smart-standard-list-item'])('%s', (bitType) => {
      const bit = { type: bitType, pageNumber: '12', marginNumber: 'm3' };

      // The generator writes the placeholders so the chain positions survive
      const bitmark = toBitmark(bit);
      expect(bitmark).toContain('[%][%][% 12 ][% m3 ]');

      const back = toJson(bitmark)[0];
      expect([text(back.bit.pageNumber), text(back.bit.marginNumber)]).toEqual(['12', 'm3']);
      expect(warnings(back)).toEqual([]);
    });
  });

  describe('JSON input path is not policed (D2)', () => {
    test('a non-empty item on .p is kept, with no warning', () => {
      const w = fromJson({ type: 'p', item: '4.1' })[0];
      expect(text(w.bit.item)).toBe('4.1');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((w as any).parser?.warnings).toBeUndefined();
    });
  });

  describe('bits with the full valued chain are unaffected', () => {
    test('article keeps valued item and lead', () => {
      const w = toJson('[.article]\n[%i][%l][%12][%m3]\nBody')[0];
      expect([
        text(w.bit.item),
        text(w.bit.lead),
        text(w.bit.pageNumber),
        text(w.bit.marginNumber),
      ]).toEqual(['i', 'l', '12', 'm3']);
      expect(warnings(w)).toEqual([]);
    });

    test('article with empty placeholders still reads the page number', () => {
      const w = toJson('[.article]\n[%][%][%12][%m3]\nBody')[0];
      expect([text(w.bit.pageNumber), text(w.bit.marginNumber)]).toEqual(['12', 'm3']);
      expect(warnings(w)).toEqual([]);
    });
  });
});
