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
  choices: ChoiceBitJson[];
  body: string;
  resource: ResourceBitJson;
  placeholders: BodyBitsJson;

  // isCorrect: boolean;
  // quiz: string;
  // quizzes: BitJson[];
  // statement: string;
  // statements: BitJson[];
  // choice: string;
  // choices: BitJson[];
  // response: string;
  // responses: BitJson[];

  // ageRange: BitJson;
  // language: BitJson;
  // labelTrue: BitJson;
  // labelFalse: BitJson;

  // isTracked: boolean;
  // isInfoOnly: boolean;
  // partialAnswer: string;
  // url: string;
  // title: string;
  // description: string;
  // solution: string;
  // solutions: string[] | null;
  // text: string;
  // options: BitJson[];
  // isCaseSensitive: boolean;
  // isLongAnswer: boolean;
  // key: string;
  // keyImage: {
  //   width: number | null;
  //   height: number | null;
  //   src: string;
  // }; // Delete when not needed
  // keyAudio: {
  //   format: string;
  //   src: string;
  // }; // Delete when not needed
  // values: [];
  // heading: {
  //   forKeys: string; // heading key.
  //   forValues: []; // heading values.(of???)
  // };
  // pairs: []; // here Match_pair(s) comes in (of???)
  // matrix: []; // array of MatchMatrix_matrixelem (of???)
  // cells: []; // (of???)
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
