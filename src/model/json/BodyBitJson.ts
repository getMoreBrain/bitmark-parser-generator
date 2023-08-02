import { Text } from '../ast/TextNodes';

import { ExampleJson } from './BitJson';

export interface BodyBitsJson {
  [key: string]: BodyBitJson;
}

export type BodyBitJson = GapJson | SelectJson | HighlightJson;

export interface BaseBodyBitJson {
  type: string; // body bit type
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  // isExample: boolean;
  example: ExampleJson;
}

export interface GapJson extends BaseBodyBitJson {
  type: 'gap'; // body bit type
  solutions: string[];
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  // isExample: boolean;
  example: ExampleJson;
  isCaseSensitive: boolean;
}

export interface SelectJson extends BaseBodyBitJson {
  type: 'select'; // body bit type
  options: SelectOptionJson[];
  prefix: string;
  postfix: string;
}

export interface SelectOptionJson {
  text: string;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  // isExample: boolean;
  example: ExampleJson;
  isCaseSensitive: boolean;
}

export interface HighlightJson extends BaseBodyBitJson {
  type: 'highlight'; // body bit type
  texts: HighlightTextJson[];
  prefix: string;
  postfix: string;
}

export interface HighlightTextJson {
  text: string;
  isHighlighted: boolean;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  // isExample: boolean;
  example: ExampleJson;
  isCaseSensitive: boolean;
}
