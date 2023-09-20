import { TagsConfig } from '../config/TagsConfig';
import { CountType } from '../enum/Count';

export interface TagValidationData {
  minCount: CountType; // Default: 0
  maxCount: CountType; // Default: 1
  chain?: TagsConfig; // Default: undefined
  isTag?: boolean; // Default: false
  isProperty?: boolean; // Default: false
  isResource?: boolean; // Default: false
  _key?: string; // Internal use only
}

// export interface TagDataMap {
//   [key: string | number]: TagValidationData;
// }

// const INFINITE_COUNT = -1;

// export { INFINITE_COUNT };
