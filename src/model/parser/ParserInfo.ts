import { Resource } from '../ast/Nodes';

import { ParserError } from './ParserError';

export interface ParserInfo {
  version?: string;
  bitmarkVersion?: string;
  excessResources?: Resource[];
  warnings?: ParserError[];
  errors?: ParserError[];
}
