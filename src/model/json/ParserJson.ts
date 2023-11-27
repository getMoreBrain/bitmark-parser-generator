import { ParserError } from '../parser/ParserError';

import { ResourceJson } from './ResourceJson';

export interface ParserJson {
  version?: string;
  bitmarkVersion?: string;
  commentedBitType?: string;
  internalComments?: string[]; // [@interalComment]
  excessResources?: ResourceJson[];
  warnings?: ParserError[];
  errors?: ParserError[];
}
