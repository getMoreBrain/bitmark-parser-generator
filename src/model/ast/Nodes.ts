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
  id?: Property;
  externalId?: Property;
  padletId?: Property;
  releaseVersion?: Property;
  ageRange?: Property;
  language?: Property;
  computerLanguage?: Property;
  coverImage?: Property;
  publisher?: Property;
  publications?: Property;
  author?: Property;
  subject?: Property;
  date?: Property;
  location?: Property;
  theme?: Property;
  kind?: Property;
  action?: Property;
  thumbImage?: Property;
  focusX?: Property;
  focusY?: Property;
  duration?: Property;
  deeplink?: Property;
  externalLink?: Property;
  externalLinkText?: Property;
  videoCallLink?: Property;
  bot?: Property;
  referenceProperty?: Property;
  list?: Property;
  labelTrue?: Property;
  labelFalse?: Property;
  quotedPerson?: Property;
  partialAnswer?: Property;
  extraProperties?: ExtraProperties;
  book?: string;
  title?: string;
  subtitle?: string;
  levelProperty?: Property; // 'level' can be a property [@level:2] - string
  level?: number; // 'level' can either the subtitle level [##subtitle]
  toc?: Property;
  progress?: Property;
  anchor?: string;
  reference?: string;
  referenceEnd?: string;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Property;
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
  botResponses?: BotResponse[];
  footer?: FooterText;

  bitmark?: string;
  parser?: ParserInfo;
}

// Extra Properties

export interface ExtraProperties {
  [key: string]: Property;
}

export type Property = string[] | number[] | boolean[] | unknown[];

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

// Bot Response
export interface BotResponse {
  response: string;
  reaction: string;
  feedback: string;
  itemLead?: ItemLead;
  hint?: string;
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
  values?: string[];
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
}

export interface Matrix {
  key: string;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
  cells: MatrixCell[];
}

export interface MatrixCell {
  values?: string[];
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  example?: Example;
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
  value?: string; // url / src / body / etc
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
