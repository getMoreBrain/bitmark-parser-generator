import { type ParserError } from '../parser/ParserError.ts';

export interface ParserJson {
  version?: string;
  bitmarkVersion?: string;
  commentedBitType?: string;
  internalComments?: string[]; // [@interalComment]
  warnings?: ParserError[];
  errors?: ParserError[];
}
