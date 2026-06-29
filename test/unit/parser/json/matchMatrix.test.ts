import { describe, expect, it } from 'vitest';

import { BitmarkParserGenerator } from '../../../../src/BitmarkParserGenerator.ts';

describe('JSON match-matrix parser', () => {
  it('ignores null matrix cells and unknown properties', () => {
    const input = [
      {
        bit: {
          type: 'match-matrix',
          format: 'bitmark++',
          bitLevel: 1,
          instruction: [
            {
              type: 'paragraph',
              content: [
                {
                  text: 'Q',
                  type: 'text',
                },
              ],
            },
          ],
          heading: {
            forValues: ['A', 'B'],
          },
          matrix: [
            {
              key: 'row',
              item: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      text: '1.',
                      type: 'text',
                    },
                  ],
                },
              ],
              cells: [
                null,
                {
                  values: ['x'],
                  isCaseSensitive: true,
                },
              ],
              unknownMatrixProperty: 'ignored',
            },
          ],
          unknownBitProperty: 'ignored',
        },
        parser: {
          version: '6.1.3',
          bitmarkVersion: '3',
        },
        bitmark:
          '[.match-matrix]\n[!Q]\n====\n--\n[#A]\n--\n[#B]\n====\n[%1.] row\n--\n--\nx\n====',
        unknownWrapperProperty: 'ignored',
      },
    ];

    const bitmark = new BitmarkParserGenerator().convert(input);

    expect(bitmark).toContain('[.match-matrix]');
    expect(bitmark).toContain('x');
  });
});
