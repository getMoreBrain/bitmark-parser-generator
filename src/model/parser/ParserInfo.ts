import { type ParserError } from './ParserError.ts';

export interface ParserInfo {
  version?: string;
  bitmarkVersion?: string;
  textParserVersion?: string;
  excessResources?: unknown[]; // Resource, but don't want to import and create circular dependency
  warnings?: ParserError[];
  errors?: ParserError[];
}
