import { Text } from '../ast/TextNodes';

import { BodyBitsJson } from './BodyBitJson';
import { AudioResourceJson, ImageResourceJson, ResourceJson } from './ResourceJson';

export interface BitJson {
  type: string; // bit type
  format: string; // bit format

  // Properties
  id: string | string[];
  externalId: string | string[];
  spaceId: string | string[];
  padletId: string | string[];
  AIGenerated: boolean;
  releaseVersion: string | string[];
  ageRange: number | number[];
  language: string | string[];
  computerLanguage: string;
  target: string | string[];
  tag: string | string[];
  icon: string;
  iconTag: string;
  colorTag: string | string[];
  subtype: string | string[];
  coverImage: string | string[];
  publisher: string | string[];
  publications: string | string[];
  author: string | string[];
  subject: string | string[];
  date: string;
  location: string;
  theme: string | string[];
  kind: string;
  action: string;
  thumbImage: string;
  focusX: number;
  focusY: number;
  duration: string;
  deeplink: string | string[];
  externalLink: string;
  externalLinkText: string;
  videoCallLink: string | string[];
  bot: string | string[];
  list: string | string[];
  textReference: string;
  isTracked: boolean; // only .learningPathExternalLink?
  isInfoOnly: boolean; // only .learningPathExternalLink?
  labelTrue: string;
  labelFalse: string;
  quotedPerson: string;

  book: string;

  title: Text;
  subtitle: Text;
  level: number;
  toc: boolean;
  progress: boolean;
  anchor: string;
  reference: string | string[]; // Has 2 meanings, depending on bit (anchor/reference, or @reference)
  referenceEnd: string;

  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;

  isExample: boolean;
  example: ExampleJson;

  partner: PartnerJson;

  marks: MarkConfigJson[];

  // NEW property - not in the ANTLR parser
  extraProperties: {
    [key: string]: unknown | unknown[];
  };
  resource: ResourceJson;
  body: Text;

  sampleSolution: string;
  partialAnswer: string;
  elements: string[];
  statement: string;
  isCorrect: boolean;
  cards: FlashcardJson[];
  statements: StatementJson[];
  responses: ResponseJson[] | BotResponseJson[];
  quizzes: QuizJson[];
  heading: HeadingJson;
  pairs: PairJson[];
  matrix: MatrixJson[];
  choices: ChoiceJson[];
  questions: QuestionJson[];
  footer: Text;
  placeholders: BodyBitsJson;
}

export interface PartnerJson {
  name: string;
  avatarImage: ImageResourceJson;
}

export interface MarkConfigJson {
  mark: string;
  color: string;
  emphasis: string;
}

export interface FlashcardJson {
  question: string;
  answer: string;
  alternativeAnswers: string[];
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: ExampleJson;
}

export interface StatementJson {
  statement: string;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
}

export interface ChoiceJson {
  choice: string;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
}

export interface ResponseJson {
  response: string;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
}

export interface QuizJson {
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  choices: ChoiceJson[];
  responses: ResponseJson[];
}

export interface HeadingJson {
  forKeys: string;
  forValues: string | string[];
}

export interface PairJson {
  key: string;
  keyAudio: AudioResourceJson;
  keyImage: ImageResourceJson;
  values: string[];
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isCaseSensitive: boolean;
  isLongAnswer: boolean;
  isExample: boolean;
  example: ExampleJson;
}

export interface MatrixJson {
  key: string;
  cells: MatrixCellJson[];
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isCaseSensitive: boolean;
  isLongAnswer: boolean;
  isExample: boolean;
  example: ExampleJson;
}

export interface MatrixCellJson {
  values: string[];
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: ExampleJson;
}

export interface QuestionJson {
  question: string;
  partialAnswer: string;
  sampleSolution: string;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isCaseSensitive: boolean;
  isShortAnswer: boolean;
  isExample: boolean;
  example: ExampleJson;
}

export interface BotResponseJson {
  response: string;
  reaction: string;
  feedback: string;
  item: Text;
  lead: Text;
  hint: Text;
}

export type ExampleJson = Text | boolean | null;
