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
  isExample: boolean;
  example: ExampleJson;
}

export interface GapJson extends BaseBodyBitJson {
  type: 'gap'; // body bit type
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
  solutions: string[];
}

export interface SelectJson extends BaseBodyBitJson {
  type: 'select'; // body bit type
  prefix: string;
  postfix: string;
  isExample: boolean;
  options: SelectOptionJson[];
}

export interface SelectOptionJson {
  text: string;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
}

export interface HighlightJson extends BaseBodyBitJson {
  type: 'highlight'; // body bit type
  prefix: string;
  postfix: string;
  texts: HighlightTextJson[];
}

export interface HighlightTextJson {
  text: string;
  isHighlighted: boolean;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
}
