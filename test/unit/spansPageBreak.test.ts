import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { BitmarkVersion, type BitWrapperJson } from '../../src/index.ts';

describe('spansPageBreak property', () => {
  test('Parse bitmark with @spansPageBreak:true', () => {
    const bpg = new BitmarkParserGenerator();

    const json = bpg.convert('[.article]\n[@spansPageBreak:true]\n\nContent', {
      bitmarkVersion: BitmarkVersion.v2,
    }) as BitWrapperJson[];

    expect(json[0].bit.spansPageBreak).toBe(true);
  });

  test('Parse bitmark with @spansPageBreak:false', () => {
    const bpg = new BitmarkParserGenerator();

    const json = bpg.convert('[.article]\n[@spansPageBreak:false]\n\nContent', {
      bitmarkVersion: BitmarkVersion.v2,
    }) as BitWrapperJson[];

    expect(json[0].bit.spansPageBreak).toBe(false);
  });

  test('Parse bitmark without @spansPageBreak (default should be false)', () => {
    const bpg = new BitmarkParserGenerator();

    const json = bpg.convert('[.article]\n\nContent', {
      bitmarkVersion: BitmarkVersion.v2,
    }) as BitWrapperJson[];

    // When not specified, the property should not be present (undefined) or false
    expect(json[0].bit.spansPageBreak).toBeUndefined();
  });

  test('Round-trip: bitmark => JSON => bitmark with @spansPageBreak', () => {
    const bpg = new BitmarkParserGenerator();

    const originalBitmark = '[.article]\n[@spansPageBreak:true]\n\nContent that spans a page break';

    // Convert to JSON
    const json = bpg.convert(originalBitmark, {
      bitmarkVersion: BitmarkVersion.v2,
    }) as BitWrapperJson[];

    expect(json[0].bit.spansPageBreak).toBe(true);

    // Convert back to bitmark
    const regeneratedBitmark = bpg.convert(json, {
      bitmarkVersion: BitmarkVersion.v2,
    }) as string;

    // The regenerated bitmark should contain the property
    expect(regeneratedBitmark).toContain('@spansPageBreak');
    expect(regeneratedBitmark).toContain('true');
  });
});
