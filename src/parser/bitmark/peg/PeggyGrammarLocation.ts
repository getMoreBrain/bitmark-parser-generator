import { type ParserLocation } from '../../../model/parser/ParserLocation.ts';
import { type ParserLocationRange } from '../../../model/parser/ParserLocationRange.ts';

/**
 * Sourced from: https://github.com/peggyjs/peggy/blob/cdf878e4ee59ab9d3e5199abb87ef34a8d7ce642/lib/grammar-location.js
 *
 * Included here to avoid having to import peggy as a dependency, as adding peggy as a dependency significantly
 * increases the size of the browser bundle (by 40kB or nearly double).
 *
 * When used as a grammarSource, allows grammars embedded in larger files to
 * specify their offset.  The start location is the first character in the
 * grammar.  The first line is often moved to the right by some number of
 * columns, but subsequent lines all start at the first column.
 */
class PeggyGrammarLocation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public source: any;
  public start: ParserLocation;

  /**
   * Create an instance.
   *
   * @param {any} source The original grammarSource.  Should be a string or
   *   have a toString() method.
   * @param {import("./peg").Location} start The starting offset for the
   *   grammar in the larger file.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(source: any, start: ParserLocation) {
    this.source = source;
    this.start = start;
  }

  /**
   * Coerce to a string.
   *
   * @returns {string} The source, stringified.
   */
  toString(): string {
    return String(this.source);
  }

  /**
   * Return a new Location offset from the given location by the start of the
   * grammar.
   *
   * loc The location as if the start of the
   *   grammar was the start of the file.
   *  The offset location.
   */
  offset(loc: ParserLocation): ParserLocation {
    return {
      line: loc.line + this.start.line - 1,
      column: loc.line === 1 ? loc.column + this.start.column - 1 : loc.column,
      offset: loc.offset + this.start.offset,
    };
  }

  /**
   * If the range has a grammarSource that is a GrammarLocation, offset the
   * start of that range by the GrammarLocation.
   *
   * @param range The range to extract from.
   * @returns The offset start if possible, or the
   *   original start.
   */
  static offsetStart(range: ParserLocationRange): ParserLocation {
    if (range.source && typeof range.source.offset === 'function') {
      return range.source.offset(range.start);
    }
    return range.start;
  }

  /**
   * If the range has a grammarSource that is a GrammarLocation, offset the
   * end of that range by the GrammarLocation.
   *
   * @param range The range to extract from.
   * @returns The offset end if possible, or the
   *   original end.
   */
  static offsetEnd(range: ParserLocationRange): ParserLocation {
    if (range.source && typeof range.source.offset === 'function') {
      return range.source.offset(range.end);
    }
    return range.end;
  }
}

export { PeggyGrammarLocation };
