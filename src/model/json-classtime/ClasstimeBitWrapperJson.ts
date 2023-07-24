import { ParserJson } from '../json/ParserJson';

import { ClasstimeBitJson } from './ClasstimeBitJson';

export interface ClasstimeBitWrapperJson {
  bitmark?: string;
  bit: ClasstimeBitJson;
  parser?: ParserJson;
}
