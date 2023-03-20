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
  computerLanguages?: ComputerLanguage[];
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
  format?: string;
  url?: string;
  license?: string;
  copyright?: string;
  provider?: string;
  showInIndex?: boolean;
}

export interface ImageLikeResource extends Resource {
  type: 'image' | 'image-link';
  src1x?: string;
  src2x?: string;
  src3x?: string;
  src4x?: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
}

export interface AudioLikeResource extends Resource {
  type: 'audio' | 'audio-link';
}

export interface VideoLikeResource extends Resource {
  type: 'video' | 'video-link' | 'still-image-film' | 'still-image-film-link';
  width?: number;
  height?: number;
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  alt?: string;
  posterImage?: ImageResource;
  thumbnails?: ImageResource[];
}

export interface ArticleLikeResource extends Resource {
  type: 'article' | 'article-link' | 'document' | 'document-link';
  body?: string;
}

export interface AppLikeResource extends Resource {
  type: 'app' | 'app-link';
}

export interface ImageResource extends ImageLikeResource {
  type: 'image';
}

export interface ImageLinkResource extends ImageLikeResource {
  type: 'image-link';
}

export interface AudioResource extends AudioLikeResource {
  type: 'audio';
}

export interface AudioLinkResource extends AudioLikeResource {
  type: 'audio-link';
}

export interface VideoResource extends Resource, VideoLikeResource {
  type: 'video';
}

export interface VideoLinkResource extends VideoLikeResource {
  type: 'video-link';
}

export interface StillImageFilmResource extends VideoLikeResource {
  type: 'still-image-film';
}

export interface StillImageFilmLinkResource extends VideoLikeResource {
  type: 'still-image-film-link';
}

export interface ArticleResource extends ArticleLikeResource {
  type: 'article';
}

export interface ArticleLinkResource extends ArticleLikeResource {
  type: 'article-link';
}

export interface DocumentResource extends ArticleLikeResource {
  type: 'document';
}

export interface DocumentLinkResource extends ArticleLikeResource {
  type: 'document-link';
}

export interface AppResource extends AppLikeResource {
  type: 'app';
}

export interface AppLinkResource extends AppLikeResource {
  type: 'app-link';
}

export interface WebsiteLinkResource extends Resource {
  type: 'website-link';
  siteName?: string;
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
export type ComputerLanguage = string;

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
