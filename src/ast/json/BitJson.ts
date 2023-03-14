import { BodyBitsJson } from './BodyBitJson';
import { ResourceBitJson } from './ResourceJson';

export interface BitJson {
  type: string; // bit type
  format: string; // bit format
  id: string | string[];
  ageRange: number | number[];
  language: string | string[];
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  elements: ElementBitJson[];
  statement: string;
  isCorrect: boolean;
  statements: StatementBitJson[];
  choices: ChoiceBitJson[];
  responses: ResponseBitJson[];
  quizzes: QuizBitJson[];
  pairs: PairBitJson[];
  body: string;
  resource: ResourceBitJson;
  placeholders: BodyBitsJson;
}

export type ElementBitJson = string;

export interface StatementBitJson {
  statement: string;
  isCorrect: boolean;
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  isCaseSensitive: boolean;
}

export interface ChoiceBitJson {
  choice: string;
  isCorrect: boolean;
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  isCaseSensitive: boolean;
}

export interface ResponseBitJson {
  response: string;
  isCorrect: boolean;
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  isCaseSensitive: boolean;
}

export interface QuizBitJson {
  choices: ChoiceBitJson[];
  responses: ResponseBitJson[];
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
}

export interface PairBitJson {
  key: string;
  values: PairValuesBitJson[];
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  isCaseSensitive: boolean;
  isLongAnswer: boolean;
}

export type PairValuesBitJson = string;
