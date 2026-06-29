import { describe, expect, it } from 'vitest';

import { BitmarkParserGenerator, Output } from '../../../../src/BitmarkParserGenerator.ts';

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

    const json = new BitmarkParserGenerator().convert(input, {
      outputFormat: Output.json,
    }) as Array<{
      bit: {
        matrix?: Array<{
          cells?: unknown[];
        }>;
      };
    }>;

    expect(json[0]).not.toHaveProperty('unknownWrapperProperty');
    expect(json[0].bit).not.toHaveProperty('unknownBitProperty');
    expect(json[0].bit.matrix?.[0]).not.toHaveProperty('unknownMatrixProperty');
    expect(json[0].bit.matrix?.[0].cells).toHaveLength(1);
    expect(json[0].bit.matrix?.[0].cells?.[0]).toMatchObject({
      values: ['x'],
      isCaseSensitive: true,
    });
  });
});
