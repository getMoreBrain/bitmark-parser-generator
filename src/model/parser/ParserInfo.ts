import { type ParserError } from './ParserError.ts';

export interface ParserInfo {
  version?: string;
  bitmarkVersion?: string;
  textParserVersion?: string;
  warnings?: ParserError[];
  errors?: ParserError[];
}
