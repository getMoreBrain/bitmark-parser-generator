export interface BodyBitsJson {
  [key: string]: BodyBitJson;
}

export interface BaseBodyBitJson {
  type: string; // body bit type
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
}

export interface GapBitJson extends BaseBodyBitJson {
  type: 'gap'; // body bit type
  solutions: string[];
  isCaseSensitive: boolean;
}

export interface SelectBitJson extends BaseBodyBitJson {
  type: 'select'; // body bit type
  // solutions: string[];
}

export type BodyBitJson = GapBitJson | SelectBitJson;
