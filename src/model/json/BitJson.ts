import { JsonText } from '../ast/TextNodes';

import { BodyBitsJson } from './BodyBitJson';
import { AudioResourceJson, ImageResourceJson, ImageResourceWrapperJson, ResourceJson } from './ResourceJson';

export interface BitJson {
  type: string; // bit type
  format: string; // bit format

  // Properties
  id: string | string[];
  internalComment: string | string[];
  externalId: string | string[];
  spaceId: string | string[];
  padletId: string;
  jupyterId: string;
  jupyterExecutionCount: number;
  AIGenerated: boolean;
  releaseVersion: string;
  ageRange: number | number[];
  lang: string;
  language: string | string[];
  computerLanguage: string;
  target: string | string[];
  tag: string | string[];
  icon: string;
  iconTag: string;
  colorTag: string | string[];
  flashcardSet: string | string[];
  subtype: string;
  bookAlias: string | string[];
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
  width: string;
  height: string;
  thumbImage: string;
  scormSource: string;
  posterImage: string;
  focusX: number;
  focusY: number;
  pointerLeft: string;
  pointerTop: string;
  backgroundWallpaper: string;
  duration: string;
  deeplink: string | string[];
  externalLink: string;
  externalLinkText: string;
  videoCallLink: string;
  bot: string | string[];
  list: string | string[];
  textReference: string;
  isTracked: boolean; // only .learningPathExternalLink?
  isInfoOnly: boolean; // only .learningPathExternalLink?
  labelTrue: string;
  labelFalse: string;
  content2Buy: string;
  buttonCaption: string;
  quotedPerson: string;
  reasonableNumOfChars: number;
  resolved: boolean;
  resolvedDate: string;
  resolvedBy: string;
  maxCreatedBits: number;
  maxDisplayLevel: number;
  product: string;
  productVideo: string;
  productFolder: string;

  book: string;

  title: JsonText;
  subtitle: JsonText;
  level: number;
  toc: boolean;
  progress: boolean;
  anchor: string;
  reference: string | string[]; // Has 2 meanings, depending on bit (anchor/reference, or @reference)
  referenceEnd: string;

  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;

  isExample: boolean;
  example: ExampleJson;

  imageSource: ImageSourceJson;
  partner: PartnerJson;

  marks: MarkConfigJson[];

  extraProperties: {
    [key: string]: unknown | unknown[];
  };

  resource: ResourceJson;
  logos: ImageResourceWrapperJson[];

  body: JsonText;

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
  listItems: ListItemJson[];
  sections: ListItemJson[]; // sections is just a pseudonym for listItems

  footer: JsonText;

  placeholders: BodyBitsJson;
}

export interface ImageSourceJson {
  url: string;
  mockupId: string;
  size?: number;
  format?: string;
  trim?: boolean;
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
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
}

export interface StatementJson {
  statement: string;
  isCorrect: boolean;
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
}

export interface ChoiceJson {
  choice: string;
  isCorrect: boolean;
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
}

export interface ResponseJson {
  response: string;
  isCorrect: boolean;
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
}

export interface QuizJson {
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  instruction: JsonText;
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
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
}

export interface MatrixJson {
  key: string;
  cells: MatrixCellJson[];
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
}

export interface MatrixCellJson {
  values: string[];
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
}

export interface QuestionJson {
  question: string;
  partialAnswer: string;
  sampleSolution: string;
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  reasonableNumOfChars: number;
  isExample: boolean;
  example: ExampleJson;
}

export interface BotResponseJson {
  response: string;
  reaction: string;
  feedback: string;
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
}

export interface ListItemJson {
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
  body: JsonText;
}

export type ExampleJson = JsonText | boolean | null;
