import { ParserError } from '../parser/ParserError';

import { ResourceJson } from './ResourceJson';

export interface ParserJson {
  version?: string;
  bitmarkVersion?: string;
  commentedBitType?: string;
  comments?: string[]; // [@interalComment]
  excessResources?: ResourceJson[];
  warnings?: ParserError[];
  errors?: ParserError[];
}
