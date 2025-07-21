import { type BitJson } from './BitJson.ts';
import { type ParserJson } from './ParserJson.ts';

export interface BitWrapperJson {
  bitmark?: string;
  bit: BitJson;
  parser?: ParserJson;
}
