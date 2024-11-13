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
  // pageNumber: JsonText;
  // marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  _defaultExample?: ExampleJson;
}

export interface GapJson extends BaseBodyBitJson {
  type: 'gap'; // body bit type
  solutions: string[];
  item: JsonText;
  lead: JsonText;
  // pageNumber: JsonText;
  // marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
  _defaultExample?: ExampleJson;
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
  _defaultExample?: ExampleJson;
}

export interface SelectJson extends BaseBodyBitJson {
  type: 'select'; // body bit type
  options: SelectOptionJson[];
  prefix: string;
  postfix: string;
  isExample: boolean;
  _hintString: string;
  _instructionString: string;
}

export interface SelectOptionJson {
  text: string;
  isCorrect: boolean;
  item: JsonText;
  lead: JsonText;
  // pageNumber: JsonText;
  // marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  _defaultExample?: ExampleJson;
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
  item: JsonText;
  lead: JsonText;
  // pageNumber: JsonText;
  // marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  _defaultExample?: ExampleJson;
}
