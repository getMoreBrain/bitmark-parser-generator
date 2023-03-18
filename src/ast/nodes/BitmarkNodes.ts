import { BitTypeType } from '../types/BitType';
import { TextFormatType } from '../types/TextFormat';
import { ResourceTypeType } from '../types/resources/ResouceType';

// Node

export type Node =
  | Bitmark
  | Bit
  | Statement
  | Choice
  | Response
  | Quiz
  | Pair
  | PairKey
  | PairValue
  | Resource
  | Body
  | BodyPart
  | BodyText
  | Gap
  | Solution
  | Select
  | SelectOption
  | Prefix
  | Postfix
  | Id
  | Age
  | Language
  | BodyText
  | ItemLead
  | Item
  | Lead
  | Instruction
  | Example
  | Element
  | Text
  | IsCorrect
  | IsCaseSensitive
  | IsLongAnswer;

// Bitmark

export interface Bitmark {
  bits?: Bit[];
}

// Bit

export interface Bit {
  bitType: BitTypeType;
  textFormat: TextFormatType;
  ids?: Id[];
  ageRanges?: Age[];
  languages?: Language[];
  resource?: Resource;
  // properties?: PropertiesNode;
  itemLead?: ItemLead;
  hint?: Hint;
  instruction?: Instruction;
  example?: Example;
  elements?: Element[];
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
  quizzes?: Quiz[];
  pairs?: Pair[];
  body?: Body;
}

// Statement

export interface Statement extends Decision {
  //
}

// Choice

export interface Choice extends Decision {
  //
}

// Response

export interface Response extends Decision {
  //
}

// Quiz

export interface Quiz {
  choices?: Choice[];
  responses?: Response[];
  itemLead?: ItemLead;
  hint?: Hint;
  instruction?: Instruction;
  example?: Example;
}

// Pair

export interface Pair {
  key?: PairKey;
  itemLead?: ItemLead;
  hint?: Hint;
  instruction?: Instruction;
  example?: Example;
  isCaseSensitive?: IsCaseSensitive;
  isLongAnswer?: IsLongAnswer;
  values?: PairValue[];
}

export type PairKey = string;
export type PairValue = string;

// Resource

export interface Resource {
  type: ResourceTypeType;
  // TODO
}

// Body

export type Body = BodyPart[];
export type BodyPart = BodyText | Gap | Select;

export interface BodyText {
  bodyText: string;
}
// Gap

export interface Gap {
  gap: {
    solutions: Solution[];
    itemLead?: ItemLead;
    hint?: Hint;
    instruction?: Instruction;
    example?: Example;
    isCaseSensitive?: IsCaseSensitive;
  };
}

export type Solution = string;

// Select

export interface Select {
  select: {
    prefix?: Prefix;
    options: SelectOption[];
    postfix?: Postfix;
    itemLead?: ItemLead;
    hint?: Hint;
    instruction?: Instruction;
    example?: Example;
    isCaseSensitive?: IsCaseSensitive;
  };
}

export interface SelectOption {
  text: Text;
  isCorrect: IsCorrect;
  itemLead?: ItemLead;
  hint?: Hint;
  instruction?: Instruction;
  example?: Example;
  isCaseSensitive?: IsCaseSensitive;
}

export type Prefix = string;
export type Postfix = string;

// Generic

export type Id = string;
export type Age = number;
export type Language = string;

export interface ItemLead {
  item?: Item;
  lead?: Lead;
}

export type Item = string;
export type Lead = string;
export type Hint = string;
export type Instruction = string;
export type Example = string | boolean;
export type Element = string;
export type Text = string;
export type IsCorrect = boolean;
export type IsCaseSensitive = boolean;
export type IsLongAnswer = boolean;

export interface Decision {
  text: Text;
  isCorrect: IsCorrect;
  itemLead?: ItemLead;
  hint?: Hint;
  instruction?: Instruction;
  example?: Example;
  isCaseSensitive?: IsCaseSensitive;
}

// protected validate(): void {
//   Validator.isRequired(this.text, 'text');
//   Validator.isRequired(this.isCorrect, 'isCorrect');
// }
