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
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  isCaseSensitive: boolean;
}

export interface SelectBitJson extends BaseBodyBitJson {
  type: 'select'; // body bit type
  options: SelectOptionBitJson[];
  prefix: string;
  postfix: string;
}

export interface SelectOptionBitJson {
  text: string;
  isCorrect: boolean;
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  isCaseSensitive: boolean;
}

export interface HighlightBitJson extends BaseBodyBitJson {
  type: 'highlight'; // body bit type
  texts: HighlightTextBitJson[];
  prefix: string;
  postfix: string;
}

export interface HighlightTextBitJson {
  text: string;
  isHighlighted: boolean;
  isCorrect: boolean;
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  isCaseSensitive: boolean;
}

export type BodyBitJson = GapBitJson | SelectBitJson | HighlightBitJson;
