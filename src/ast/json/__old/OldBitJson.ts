import { AttachmentTypeType } from '../types/AttachmentType';
import { BitTypeType } from '../types/BitType';

export interface OldBitJson {
  type: string;
  format: string;
}

export interface RecurringBitJson extends OldBitJson {
  _type: BitTypeType;
  _key: string;
  _value?: string | boolean;
  _attachmentType?: AttachmentTypeType;
  body: string;
  item: string;
  lead: string;
  hint: string;
  isExample: boolean;
  example: string;
  isCorrect: boolean;
  // quiz: string;
  quizzes: RecurringBitJson[];
  statement: string;
  statements: RecurringBitJson[];
  choice: string;
  choices: RecurringBitJson[];
  response: string;
  responses: RecurringBitJson[];
  resource: RecurringBitJson;
  id: PropertyJson;
  ageRange: PropertyJson;
  language: PropertyJson;
  labelTrue: PropertyJson;
  labelFalse: PropertyJson;
  instruction: string;
  isTracked: boolean;
  isInfoOnly: boolean;
  partialAnswer: string;
  url: string;
  title: string;
  description: string;
  solution: string;
  solutions: string[] | null;
  text: string;
  options: RecurringBitJson[];
  isCaseSensitive: boolean;
  isLongAnswer: boolean;
  key: string;
  keyImage: {
    width: number | null;
    height: number | null;
    src: string;
  }; // Delete when not needed
  keyAudio: {
    format: string;
    src: string;
  }; // Delete when not needed
  values: [];
  heading: {
    forKeys: string; // heading key.
    forValues: []; // heading values.(of???)
  };
  pairs: []; // here Match_pair(s) comes in (of???)
  matrix: []; // array of MatchMatrix_matrixelem (of???)
  cells: []; // (of???)
  placeholders: PlaceholdersJson;
}

export interface PlaceholdersJson {
  [keyof: string]: RecurringBitJson;
}

export type PropertyJson =
  | string
  | number
  | boolean
  | null
  | undefined
  | (string | number | boolean | null | undefined)[];

export interface ValidPropertiesJson {
  id: PropertyJson;
  ageRange: PropertyJson;
  language: PropertyJson;
  labelTrue: PropertyJson;
  labelFalse: PropertyJson;
}

// Rest TODO - see bit-template.js
