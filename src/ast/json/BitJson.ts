import { BodyBitsJson } from './BodyBitJson';
import { AudioResourceJson, ImageResourceJson, ResourceJson } from './ResourceJson';

export interface BitJson {
  type: string; // bit type
  format: string; // bit format

  // Properties
  id: string | string[];
  externalId: string | string[];
  ageRange: number | number[];
  language: string | string[];
  computerLanguage: string | string[];
  coverImage: string | string[];
  publisher: string | string[];
  publications: string | string[];
  author: string | string[];
  date: string | string[];
  location: string | string[];
  theme: string | string[];
  kind: string | string[];
  action: string | string[];
  thumbImage: string | string[];
  duration: string | string[];
  deeplink: string | string[];
  externalLink: string;
  externalLinkText: string;
  videoCallLink: string | string[];
  bot: string | string[];
  list: string | string[];
  labelTrue: string;
  labelFalse: string;
  quotedPerson: string;

  book: string;

  title: string;
  subtitle: string;
  level: number;
  toc: boolean;
  progress: boolean;
  anchor: string;
  reference: string | string[]; // Has 2 meanings, depending on bit (anchor/reference, or @reference)
  referenceEnd: string;

  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  elements: ElementBitJson[];
  statement: string;
  isCorrect: boolean;
  resource: ResourceJson;
  body: string;

  statements: StatementBitJson[];
  responses: ResponseBitJson[];
  quizzes: QuizBitJson[];
  heading: HeadingJson;
  pairs: PairBitJson[];
  matrix: MatrixBitJson[];
  choices: ChoiceBitJson[];
  questions: QuestionJson[];
  footer: string;
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
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  choices: ChoiceBitJson[];
  responses: ResponseBitJson[];
}

export interface HeadingJson {
  forKeys: string;
  forValues: string | string[];
}

export interface PairBitJson {
  key: string;
  keyAudio: AudioResourceJson;
  keyImage: ImageResourceJson;
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

export interface MatrixBitJson {
  key: string;
  cells: MatrixCellJson[];
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  isCaseSensitive: boolean;
  isLongAnswer: boolean;
}

export interface MatrixCellJson {
  values: MatrixValuesBitJson[];
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
}

export type MatrixValuesBitJson = string;

export interface QuestionJson {
  question: string;
  partialAnswer: string;
  sampleSolution: string;
  item: string;
  lead: string;
  hint: string;
  instruction: string;
  isExample: boolean;
  example: string;
  isCaseSensitive: boolean;
  isShortAnswer: boolean;
}
