import { ParserLocation } from './ParserLocation';

export interface ParserLocationRange {
  /** Any object that was supplied to the `parse()` call as the `grammarSource` option. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
  /** Position at the beginning of the expression. */
  start: ParserLocation;
  /** Position after the end of the expression. */
  end: ParserLocation;
}
