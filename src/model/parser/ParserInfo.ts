import { ParserError } from './ParserError';

export interface ParserInfo {
  version?: string;
  bitmarkVersion?: string;
  excessResources?: unknown[]; // Resource, but don't want to import and create circular dependency
  warnings?: ParserError[];
  errors?: ParserError[];
}
