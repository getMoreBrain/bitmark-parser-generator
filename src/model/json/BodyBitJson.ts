import { type JsonText, type TextAst, type TextNode } from '../ast/TextNodes.ts';
import { type ExampleJson } from './BitJson.ts';

export interface BodyBitsJson {
  [key: string]: BodyBitJson;
}

export type BodyBitJson = TextNode | GapJson | MarkJson | SelectJson | HighlightJson;

export interface BaseBodyBitJson {
  type: string; // body bit type
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  __defaultExample?: ExampleJson;

  // NOTE: Internally, the body bit is stored as it appears in bitmark v2, but in v3 all the properties
  // are stored in the `attrs` property. The properies are only moved to 'attrs' for the JSON output
  attrs: Record<string, unknown>;
}

export interface GapJson extends BaseBodyBitJson {
  type: 'gap'; // body bit type
  solutions: string[];
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
  __solutionsAst?: TextAst[];
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface MarkJson extends BaseBodyBitJson {
  type: 'mark'; // body bit type
  solution: string;
  mark: string;
  isExample: boolean;
  example: ExampleJson;
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface SelectJson extends BaseBodyBitJson {
  type: 'select'; // body bit type
  options: SelectOptionJson[];
  prefix: string;
  postfix: string;
  isExample: boolean;
  __hintString?: string;
  __instructionString?: string;
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
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
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
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}
