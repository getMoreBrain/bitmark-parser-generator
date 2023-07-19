export interface TagData {
  minCount?: number; // Default: 0
  maxCount?: number; // Default: 1
  chain?: TagDataMap; // Default: undefined
  isProperty?: boolean; // Default: false
  isResource?: boolean; // Default: false
  _key?: string; // Internal use only
}

export interface TagDataMap {
  [key: string | number]: TagData;
}

const INFINITE_COUNT = -1;

export { INFINITE_COUNT };
