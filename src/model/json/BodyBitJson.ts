import { JsonText } from '../ast/TextNodes';

import { ExampleJson } from './BitJson';

export interface BodyBitsJson {
  [key: string]: BodyBitJson;
}

export type BodyBitJson = GapJson | MarkJson | SelectJson | HighlightJson;

export interface BaseBodyBitJson {
  type: string; // body bit type
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
}

export interface GapJson extends BaseBodyBitJson {
  type: 'gap'; // body bit type
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
  solutions: string[];
}

export interface MarkJson extends BaseBodyBitJson {
  type: 'mark'; // body bit type
  solution: string;
  mark: string;
  // item: Text;
  // lead: Text;
  // hint: Text;
  // instruction: Text;
  isExample: boolean;
  example: ExampleJson;
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
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
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
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
}
