import { ParserError } from '../parser/ParserError';

import { ResourceJson } from './ResourceJson';

export interface ParserJson {
  excessResources?: ResourceJson[];
  errors?: ParserError[];
}
