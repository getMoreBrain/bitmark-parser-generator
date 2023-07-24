import { Text } from '../ast/TextNodes';

export interface ClasstimeBodyBitsJson {
  [key: string]: ClasstimeBodyBitJson;
}

export type ClasstimeBodyBitJson = ClasstimeClozeJson | GapJson | SelectJson | HighlightJson;

export interface BaseBodyBitJson {
  type: string; // body bit type
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
}

export interface GapJson extends BaseBodyBitJson {
  type: 'gap'; // body bit type
  solutions: string[];
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  isCaseSensitive: boolean;
}

export interface ClasstimeCategoryJson {
  id: string;
  content: {
    entity_map: {};
    blocks: CategoryBlockJson[];
  };
}

export interface CategoryBlockJson {
  inline_style_ranges: [];
  text: string;
  depth: 0;
  key: string;
  type: string;
  data: {};
  entity_ranges: [];
}

export interface ClasstimeClozeJson {
  id: string;
  choices: ClozeContentJson[];
  prefix: string;
  postfix: string;
}

export interface ClozeContentJson {
  id: string;
  content: string;
  is_correct: boolean;
}

export interface ClasstimeChoiceJson {
  id: string;
  content: {
    entity_map: {};
    blocks: ChoiceBlockJson[];
  };
  is_correct: boolean;
  order: string;
  image: null;
}

export interface ChoiceBlockJson {
  inline_style_ranges: [];
  text: string;
  depth: 0;
  key: string;
  type: string;
  data: {};
  entity_ranges: [];
}

export interface ClasstimeItemJson {
  id: string;
  content: {
    entity_map: {};
    blocks: ItemBlockJson[];
  };
  categories: string[];
}

export interface ItemBlockJson {
  inline_style_ranges: [];
  text: string;
  depth: 0;
  key: string;
  type: string;
  data: {};
  entity_ranges: [];
}

export interface SelectJson extends BaseBodyBitJson {
  type: 'select'; // body bit type
  options: SelectOptionJson[];
  prefix: string;
  postfix: string;
}

export interface SelectOptionJson {
  text: string;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  isCaseSensitive: boolean;
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
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  isCaseSensitive: boolean;
}
