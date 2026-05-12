import { describe, expect, it } from 'vitest';

import type { BitWrapperJson } from '../../src/model/json/BitWrapperJson.ts';
import { type Bbox, BoundingBoxIndex } from '../../src/utils/BoundingBox.ts';

function bit(
  type: string,
  sourceBB?: number[] | number[][],
  bodyText?: string,
  sourceRL?: string,
): BitWrapperJson {
  const wrapper: Record<string, unknown> = {
    bit: {
      type,
      format: 'bitmark++',
      bitLevel: 1,
      ...(sourceBB ? { sourceBB } : {}),
      ...(sourceRL !== undefined ? { sourceRL } : {}),
      ...(bodyText
        ? {
            body: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: bodyText }],
                attrs: {},
              },
            ],
          }
        : { body: [] }),
    },
  };
  return wrapper as unknown as BitWrapperJson;
}

const SAMPLE: BitWrapperJson[] = [
  bit('article', [200, 260, 2000, 320] as number[], 'Header'),
  bit('article', [200, 420, 2000, 480] as number[], 'Introduction'),
  bit(
    'article',
    [
      [200, 500, 2000, 560],
      [200, 1500, 2000, 1560],
    ] as number[][],
    'Multi-box article',
  ),
  bit('article', undefined, 'No bbox'),
];

describe('BoundingBoxIndex', () => {
  describe('fromBits', () => {
    it('keeps only bits with a parseable sourceBB, normalizes single and array forms', () => {
      const idx = BoundingBoxIndex.fromBits(SAMPLE);
      expect(idx.entries.map((e) => e.wrapper.bit.type)).toEqual(['article', 'article', 'article']);
      expect(idx.entries[0].boxes).toEqual([[200, 260, 2000, 320]]);
      expect(idx.entries[2].boxes).toEqual([
        [200, 500, 2000, 560],
        [200, 1500, 2000, 1560],
      ]);
    });

    it('with options.sourceRL, only keeps bits whose sourceRL matches', () => {
      const bits: BitWrapperJson[] = [
        bit('article', [200, 260, 2000, 320] as number[], 'page-1-a', '1'),
        bit('article', [200, 420, 2000, 480] as number[], 'page-2', '2'),
        bit('article', [200, 500, 2000, 560] as number[], 'page-1-b', '1'),
      ];
      const idx = BoundingBoxIndex.fromBits(bits, { sourceRL: '1' });
      expect(idx.entries.map((e) => e.bit.sourceRL)).toEqual(['1', '1']);
    });

    it('with options.sourceRL, excludes bits that have no sourceRL', () => {
      const bits: BitWrapperJson[] = [
        bit('article', [200, 260, 2000, 320] as number[], 'paged', '1'),
        bit('article', [200, 420, 2000, 480] as number[], 'unpaged'),
      ];
      const idx = BoundingBoxIndex.fromBits(bits, { sourceRL: '1' });
      expect(idx.entries).toHaveLength(1);
      expect(idx.entries[0].bit.sourceRL).toBe('1');
    });

    it('skips bits whose sourceBB is malformed', () => {
      const malformed: BitWrapperJson[] = [
        bit('article', [1, 2, 3] as number[], 'too-short'),
        bit('article', [1, 2, 3, NaN] as number[], 'NaN'),
        bit('article', [200, 260, 2000, 320] as number[], 'good'),
      ];
      const idx = BoundingBoxIndex.fromBits(malformed);
      expect(idx.entries).toHaveLength(1);
      expect(idx.entries[0].boxes).toEqual([[200, 260, 2000, 320]]);
    });
  });

  describe('intersecting', () => {
    it('returns only bits whose any box overlaps the query', () => {
      const idx = BoundingBoxIndex.fromBits(SAMPLE);
      const matches = idx.intersecting([100, 400, 2100, 700]);
      // Header (260..320) is outside; Introduction (420..480) and the multi-box bit's first box (500..560) hit.
      expect(matches.map((e) => e.boxes)).toEqual([
        [[200, 420, 2000, 480]],
        [
          [200, 500, 2000, 560],
          [200, 1500, 2000, 1560],
        ],
      ]);
    });

    it('excludes touching-only edges (exclusive overlap)', () => {
      const idx = BoundingBoxIndex.fromBits([bit('article', [100, 100, 200, 200] as number[])]);
      expect(idx.intersecting([200, 100, 300, 200] as Bbox)).toEqual([]);
    });
  });

  describe('intersectingBoxes', () => {
    it('returns only the individual boxes that intersected, flattened across bits', () => {
      const idx = BoundingBoxIndex.fromBits(SAMPLE);
      // Query covers the multi-box bit's first box only — its second box is far below.
      const boxes = idx.intersectingBoxes([100, 480, 2100, 600]);
      expect(boxes).toEqual([[200, 500, 2000, 560]]);
    });
  });

  describe('enclosingBoundingBox', () => {
    it('unions only the boxes that themselves intersected (multi-box bit)', () => {
      const idx = BoundingBoxIndex.fromBits(SAMPLE);
      // Query overlaps Introduction (420..480) and the multi-box's first box (500..560)
      // but NOT its second box (1500..1560). The non-intersecting box must NOT inflate the union.
      const enclosing = idx.enclosingBoundingBox([100, 400, 2100, 700]);
      expect(enclosing).toEqual([200, 420, 2000, 560]);
    });

    it('returns null when nothing intersects', () => {
      const idx = BoundingBoxIndex.fromBits(SAMPLE);
      expect(idx.enclosingBoundingBox([0, 0, 10, 10])).toBeNull();
    });
  });

  describe('toBitmark', () => {
    it('renders selected bits as bitmark text', () => {
      const idx = BoundingBoxIndex.fromBits(SAMPLE);
      const matches = idx.intersecting([100, 400, 2100, 700]);
      const bitmark = idx.toBitmark(matches);
      expect(bitmark).toContain('[.article]');
      expect(bitmark).toContain('Introduction');
      expect(bitmark).toContain('Multi-box article');
      expect(bitmark).not.toContain('Header');
    });

    it('returns empty string for empty input', () => {
      const idx = BoundingBoxIndex.fromBits(SAMPLE);
      expect(idx.toBitmark([])).toBe('');
    });
  });
});
