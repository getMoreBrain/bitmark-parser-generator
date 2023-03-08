import { BitResourceTypeType } from '../types/BitResouceType';

import { BitJson } from './BitJson';

export interface ResourceJson extends BitJson {
  type: BitResourceTypeType;
}
