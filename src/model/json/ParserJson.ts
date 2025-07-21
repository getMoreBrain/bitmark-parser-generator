import { type ParserError } from '../parser/ParserError.ts';
import { type ResourceJson } from './ResourceJson.ts';

export interface ParserJson {
  version?: string;
  bitmarkVersion?: string;
  commentedBitType?: string;
  internalComments?: string[]; // [@interalComment]
  excessResources?: ResourceJson[];
  warnings?: ParserError[];
  errors?: ParserError[];
}
