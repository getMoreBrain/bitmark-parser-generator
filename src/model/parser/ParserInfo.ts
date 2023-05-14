import { Resource } from '../ast/Nodes';

import { ParserError } from './ParserError';

export interface ParserInfo {
  excessResources?: Resource[];
  warnings?: ParserError[];
  errors?: ParserError[];
}
