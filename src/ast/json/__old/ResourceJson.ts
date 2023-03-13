import { ResourceTypeType } from '../types/ResouceType';

import { BitJson } from './BitJson';

export interface ResourceJson extends BitJson {
  type: ResourceTypeType;
}
