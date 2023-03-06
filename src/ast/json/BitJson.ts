import { BitTypeType } from '../types/BitType';
import { PlaceholderTypeType } from '../types/PlaceholderType';
import { TextFormatType } from '../types/TextFormat';

export interface BitJson {
  type: BitTypeType;
  format: TextFormatType;
  body: string;
  item: string;
  hint: string;
  isExample: boolean;
  example: string;
  id: string | number | (string | number)[];
  instruction: string;
  isTracked: boolean;
  isInfoOnly: boolean;
  partialAnswer: string;
  url: string;
  title: string;
  description: string;
  solutions: []; // of???
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
  [keyof: string]: PlaceholderJson;
}

export interface PlaceholderJson {
  type: PlaceholderTypeType;
  item: string;
  solutions: string[] | null; // Can there be no solutions?
  hint: string;
  instruction: string;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: string;
}

// Rest TODO - see bit-template.js
