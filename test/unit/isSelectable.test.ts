import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { BitmarkVersion, type BitWrapperJson } from '../../src/index.ts';

const bpg = new BitmarkParserGenerator();

const toJson = (bitmark: string): BitWrapperJson[] =>
  bpg.convert(bitmark, { bitmarkVersion: BitmarkVersion.v2 }) as BitWrapperJson[];

describe('isSelectable and selected properties', () => {
  test('every bit emits both properties as false by default', () => {
    const json = toJson('[.article]\n\nContent\n\n[.note]\n\nMore content');

    expect(json.map(({ bit }) => [bit.isSelectable, bit.selected])).toEqual([
      [false, false],
      [false, false],
    ]);
  });

  test('preserves explicit values when building a bit from JSON', () => {
    const json = bpg.convert(
      JSON.stringify([
        {
          bit: {
            type: 'article',
            format: 'bitmark++',
            bitLevel: 1,
            isSelectable: true,
            selected: true,
            body: [],
          },
        },
      ]),
      { outputFormat: 'json' },
    ) as BitWrapperJson[];

    expect(json[0].bit.isSelectable).toBe(true);
    expect(json[0].bit.selected).toBe(true);
  });
});
