import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { BitmarkVersion, type BitWrapperJson } from '../../src/index.ts';

const bpg = new BitmarkParserGenerator();

const toJson = (bitmark: string): BitWrapperJson[] =>
  bpg.convert(bitmark, { bitmarkVersion: BitmarkVersion.v2 }) as BitWrapperJson[];

const fromJson = (bit: Record<string, unknown>): BitWrapperJson[] =>
  bpg.convert(
    JSON.stringify([{ bit: { type: 'article', format: 'bitmark++', bitLevel: 1, ...bit } }]),
    {
      outputFormat: 'json',
    },
  ) as BitWrapperJson[];

const PROPERTIES = ['collapsed', 'isSelectable', 'selected'] as const;

describe.each(PROPERTIES)('%s property (default false, not emitted unless set)', (key) => {
  test('absent => key not emitted', () => {
    const bit = toJson('[.article]\n\nContent')[0].bit;
    expect(key in bit).toBe(false);
  });

  test(`@${key}:true => emitted as true`, () => {
    expect(toJson(`[.article]\n[@${key}:true]\n\nContent`)[0].bit[key]).toBe(true);
  });

  test(`@${key}:false => emitted as false`, () => {
    expect(toJson(`[.article]\n[@${key}:false]\n\nContent`)[0].bit[key]).toBe(false);
  });

  test('available on any bit', () => {
    expect(toJson(`[.note]\n[@${key}:true]\n\nContent`)[0].bit[key]).toBe(true);
    expect(toJson(`[.image]\n[@${key}:true]`)[0].bit[key]).toBe(true);
  });

  test('JSON input: absent => key not emitted', () => {
    expect(key in fromJson({ body: [] })[0].bit).toBe(false);
  });

  test('JSON input: explicit value is preserved', () => {
    expect(fromJson({ [key]: true, body: [] })[0].bit[key]).toBe(true);
    expect(fromJson({ [key]: false, body: [] })[0].bit[key]).toBe(false);
  });

  test('round-trip: bitmark => JSON => bitmark', () => {
    const original = `[.article]\n[@${key}:true]\n\nContent`;
    const json = bpg.convert(original, { bitmarkVersion: BitmarkVersion.v2 });
    const bitmark = bpg.convert(json, { bitmarkVersion: BitmarkVersion.v2 }) as string;
    expect(bitmark).toMatch(new RegExp(`\\[@${key}:\\s*true\\s*\\]`));
  });
});

describe('bit-level selected does not interfere with resource-level selected', () => {
  test('resource @selected stays on the resource', () => {
    const bit = toJson('[.image]\n[&image:https://example.com/a.png][@selected:true]')[0].bit;
    expect('selected' in bit).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((bit.resource as any).image.selected).toBe(true);
  });

  test('bit-level @selected stays on the bit', () => {
    const bit = toJson('[.image]\n[@selected:true]\n[&image:https://example.com/a.png]')[0].bit;
    expect(bit.selected).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((bit.resource as any).image.selected).toBe(false);
  });
});
