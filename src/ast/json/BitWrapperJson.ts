import { BitJson } from './BitJson';
import { ParserJson } from './ParserJson';

export interface BitWrapperJson {
  bitmark?: string;
  bit: BitJson;
  parser?: ParserJson;
}
