import { ParserError } from './ParserError';

export interface ParserInfo {
  version?: string;
  bitmarkVersion?: string;
  comments?: unknown[]; // Comment, but don't want to import and create circular dependency
  excessResources?: unknown[]; // Resource, but don't want to import and create circular dependency
  warnings?: ParserError[];
  errors?: ParserError[];
}
