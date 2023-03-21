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
  | BodyText
  | ItemLead
  | Example
  | string
  | number
  | boolean;

// Bitmark

export interface Bitmark {
  bits?: Bit[];
}

// Bit

export interface Bit {
  bitType: BitTypeType;
  textFormat: TextFormatType;
  ids?: string[];
  externalIds?: string[];
  ageRanges?: number[];
  languages?: string[];
  computerLanguages?: string[];
  coverImages?: string[];
  publishers?: string[];
  publications?: string[];
  authors?: string[];
  dates?: string[];
  locations?: string[];
  themes?: string[];
  kinds?: string[];
  actions?: string[];
  durations?: string[];
  deepLinks?: string[];
  videoCallLinks?: string[];
  bots?: string[];
  referenceProperties?: string[];
  lists?: string[];
  labelTrue?: string;
  labelFalse?: string;
  resource?: Resource;
  book?: string;
  title?: string;
  subtitle?: string;
  level?: number;
  toc?: boolean;
  progress?: boolean;
  anchor?: string;
  reference?: string;
  referenceEnd?: string;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  elements?: string[];
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
  quizzes?: Quiz[];
  heading?: Heading;
  pairs?: Pair[];
  body?: Body;
  questions?: Question[];
  footer?: FooterText;
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
  hint?: string;
  instruction?: string;
  example?: Example;
}

// Heading

export interface Heading {
  forKeys: string;
  forValues: string[];
}

// Pair

export interface Pair {
  key?: PairKey;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  isCaseSensitive?: boolean;
  isLongAnswer?: boolean;
  values?: PairValue[];
}

export type PairKey = string;
export type PairValue = string;

// Question

export interface Question {
  question: string;
  partialAnswer?: string;
  sampleSolution?: string;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
}

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
  caption?: string;
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

// Footer

export interface FooterText {
  footerText: string;
}

// Gap

export interface Gap {
  gap: {
    solutions: Solution[];
    itemLead?: ItemLead;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  };
}

export type Solution = string;

// Select

export interface Select {
  select: {
    prefix?: string;
    options: SelectOption[];
    postfix?: string;
    itemLead?: ItemLead;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  };
}

export interface SelectOption {
  text: string;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  isCaseSensitive?: boolean;
}

// Generic

export interface ItemLead {
  item?: string;
  lead?: string;
}

export type Example = string | boolean;

export interface Decision {
  text: string;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  isCaseSensitive?: boolean;
}

// protected validate(): void {
//   Validator.isRequired(this.text, 'text');
//   Validator.isRequired(this.isCorrect, 'isCorrect');
// }
