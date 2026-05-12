import { BitmarkParserGenerator, Output } from '../BitmarkParserGenerator.ts';
import { type BitJson } from '../model/json/BitJson.ts';
import { type BitWrapperJson } from '../model/json/BitWrapperJson.ts';

/** Axis-aligned bounding box: `[x0, y0, x1, y1]` (top-left + bottom-right). */
type Bbox = [number, number, number, number];

interface BoundingBoxEntry {
  bit: BitJson;
  wrapper: BitWrapperJson;
  /** Normalized list of boxes parsed from `bit.sourceBB` (always at least one). */
  boxes: Bbox[];
}

interface FromBitsOptions {
  /**
   * If provided, only include bits whose `bit.sourceRL` exactly equals this
   * value. Bits with no `sourceRL` are excluded.
   */
  sourceRL?: string;
}

function toBbox(arr: unknown): Bbox | null {
  if (!Array.isArray(arr) || arr.length !== 4) return null;
  if (!arr.every(Number.isFinite)) return null;
  return [arr[0], arr[1], arr[2], arr[3]];
}

function parseSourceBB(sourceBB: BitJson['sourceBB']): Bbox[] {
  if (sourceBB == null) return [];
  if (!Array.isArray(sourceBB) || sourceBB.length === 0) return [];

  // Use some() rather than sourceBB[0] so an undefined/invalid first element
  // doesn't mask valid nested tuples that follow it (mirrors Builder.normaliseSourceBB).
  const isNested = (sourceBB as unknown[]).some(Array.isArray);

  const candidates = isNested ? (sourceBB as unknown[]) : [sourceBB];
  const out: Bbox[] = [];
  for (const candidate of candidates) {
    const box = toBbox(candidate);
    if (box) out.push(box);
  }
  return out;
}

function boundingBoxIntersects(a: Bbox, b: Bbox): boolean {
  return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
}

function boundingBoxUnion(boxes: Bbox[]): Bbox | null {
  if (boxes.length === 0) return null;
  let [x0, y0, x1, y1] = boxes[0];
  for (let i = 1; i < boxes.length; i++) {
    const b = boxes[i];
    if (b[0] < x0) x0 = b[0];
    if (b[1] < y0) y0 = b[1];
    if (b[2] > x1) x1 = b[2];
    if (b[3] > y1) y1 = b[3];
  }
  return [x0, y0, x1, y1];
}

/**
 * Index over a list of bits with `@sourceBB` tags, designed for live region
 * selection in a browser (e.g. the user drags a box and the preview updates
 * as they go). Each bit's `sourceBB` is parsed once at construction so that
 * intersection queries are pure bounding-box scans on the hot path.
 */
class BoundingBoxIndex {
  private readonly _entries: BoundingBoxEntry[];
  private readonly bitmarkParser = new BitmarkParserGenerator();

  private constructor(entries: BoundingBoxEntry[]) {
    this._entries = entries;
  }

  /**
   * Build an index from already-parsed bits. Bits without a parseable
   * `sourceBB` are dropped. Order of the input is preserved.
   *
   * Pass `options.sourceRL` to scope the index to a single source page —
   * bits whose `sourceRL` doesn't match (or is absent) are excluded.
   */
  static fromBits(wrappers: BitWrapperJson[], options?: FromBitsOptions): BoundingBoxIndex {
    const filterSourceRL = options?.sourceRL;
    const entries: BoundingBoxEntry[] = [];
    for (const wrapper of wrappers) {
      if (!wrapper?.bit) continue;
      if (filterSourceRL !== undefined && wrapper.bit.sourceRL !== filterSourceRL) {
        continue;
      }
      const boxes = parseSourceBB(wrapper.bit.sourceBB);
      if (boxes.length === 0) continue;
      entries.push({ bit: wrapper.bit, wrapper, boxes });
    }
    return new BoundingBoxIndex(entries);
  }

  /** All bits with at least one valid `sourceBB`, in input order. */
  get entries(): ReadonlyArray<BoundingBoxEntry> {
    return this._entries;
  }

  /**
   * Bits whose ANY `sourceBB` box intersects `query` (strict overlap —
   * touching-only edges do NOT count as an intersection).
   */
  intersecting(query: Bbox): BoundingBoxEntry[] {
    const matches: BoundingBoxEntry[] = [];
    for (const entry of this._entries) {
      if (entry.boxes.some((box) => boundingBoxIntersects(query, box))) {
        matches.push(entry);
      }
    }
    return matches;
  }

  /**
   * Flat list of every individual `sourceBB` box that intersects `query`.
   * For a multi-box bit, only the boxes that themselves intersected are
   * returned.
   */
  intersectingBoxes(query: Bbox): Bbox[] {
    const matches: Bbox[] = [];
    for (const entry of this._entries) {
      for (const box of entry.boxes) {
        if (boundingBoxIntersects(query, box)) matches.push(box);
      }
    }
    return matches;
  }

  /**
   * Smallest axis-aligned box that fully encloses every individual `sourceBB`
   * box that intersected the query. For a multi-box bit, only the boxes that
   * themselves intersected contribute to the union — non-intersecting boxes
   * from the same bit are ignored. Returns `null` if no box matches.
   */
  enclosingBoundingBox(query: Bbox): Bbox | null {
    return boundingBoxUnion(this.intersectingBoxes(query));
  }

  /** Render selected bits back to bitmark text. Empty input returns `''`. */
  toBitmark(entries: BoundingBoxEntry[]): string {
    if (entries.length === 0) return '';
    const wrappers = entries.map((e) => e.wrapper);
    return this.bitmarkParser.convert(wrappers, {
      outputFormat: Output.bitmark,
      bitmarkOptions: { prettifyJson: true },
    }) as string;
  }
}

export { BoundingBoxIndex };
export type { Bbox, BoundingBoxEntry, FromBitsOptions };
