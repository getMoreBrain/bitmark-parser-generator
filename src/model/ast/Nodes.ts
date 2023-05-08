import { BitTypeType } from '../enum/BitType';
import { ResourceTypeType } from '../enum/ResourceType';
import { TextFormatType } from '../enum/TextFormat';
import { ParserError } from '../parser/ParserError';
import { ParserInfo } from '../parser/ParserInfo';

// Node

export type Node =
  | BitmarkAst
  | Bit
  | Statement
  | Choice
  | Response
  | Quiz
  | Pair
  | Resource
  | Body
  | BodyPart
  | BodyText
  | Gap
  | Select
  | SelectOption
  | BodyText
  | ItemLead
  | Example
  | string
  | number
  | boolean;

// Bitmark

export interface BitmarkAst {
  bits?: Bit[];
  errors?: ParserError[];
}

// Bit

export interface Bit {
  bitType: BitTypeType;
  textFormat: TextFormatType;
  resourceType?: ResourceTypeType;
  id?: string[];
  externalId?: string[];
  ageRange?: number[];
  language?: string[];
  computerLanguage?: string[];
  coverImage?: string[];
  publisher?: string[];
  publications?: string[];
  author?: string[];
  subject?: string[];
  date?: string[];
  location?: string[];
  theme?: string[];
  kind?: string[];
  action?: string[];
  thumbImage?: string[];
  duration?: string[];
  deeplink?: string[];
  externalLink?: string[];
  externalLinkText?: string[];
  videoCallLink?: string[];
  bot?: string[];
  referenceProperty?: string[];
  list?: string[];
  labelTrue?: string[];
  labelFalse?: string[];
  quotedPerson?: string[];
  extraProperties?: ExtraProperties;
  book?: string;
  title?: string;
  subtitle?: string;
  levelProperty?: string[]; // 'level' can be a property [@level:2] - string
  level?: number | string; // 'level' can either the subtitle level [##subtitle]
  toc?: boolean;
  progress?: boolean;
  anchor?: string;
  reference?: string;
  referenceEnd?: string;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  resource?: Resource;
  body?: Body;
  sampleSolution?: string[];
  elements?: string[];
  statement?: Statement;
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
  quizzes?: Quiz[];
  heading?: Heading;
  pairs?: Pair[];
  matrix?: Matrix[];
  questions?: Question[];
  footer?: FooterText;

  bitmark?: string;
  parser?: ParserInfo;
}

// Extra Properties

export interface ExtraProperties {
  [key: string]: unknown[];
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
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  choices?: Choice[];
  responses?: Response[];
}

// Heading

export interface Heading {
  forKeys: string;
  forValues: string[];
}

// Pair

export interface Pair {
  key?: string;
  keyAudio?: AudioResource;
  keyImage?: ImageResource;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  isCaseSensitive?: boolean;
  isLongAnswer?: boolean;
  values?: string[];
}

export interface Matrix {
  key: string;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  isCaseSensitive?: boolean;
  isLongAnswer?: boolean;
  cells: MatrixCell[];
}

export interface MatrixCell {
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  values?: string[];
}

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
  caption?: string;
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
  type: 'article' | 'article-link' | 'document' | 'document-link' | 'document-download';
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

export interface DocumentDownloadResource extends ArticleLikeResource {
  type: 'document-download';
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
export type BodyPart = BodyText | Gap | Select | Highlight;

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
    solutions: string[];
    itemLead?: ItemLead;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  };
}

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

// Highlight

export interface Highlight {
  highlight: {
    prefix?: string;
    texts: HighlightText[];
    postfix?: string;
    itemLead?: ItemLead;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  };
}

export interface HighlightText {
  text: string;
  isCorrect: boolean;
  isHighlighted: boolean;
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
