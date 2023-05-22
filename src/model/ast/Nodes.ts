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

export interface ImageResource extends Resource {
  type: 'image';
  src1x?: string;
  src2x?: string;
  src3x?: string;
  src4x?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface ImageLinkResource extends Resource {
  type: 'image-link';
  src1x?: string;
  src2x?: string;
  src3x?: string;
  src4x?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface AudioResource extends Resource {
  type: 'audio';
}

export interface AudioEmbedResource extends Resource {
  type: 'audio-embed';
}

export interface AudioLinkResource extends Resource {
  type: 'audio-link';
}

export interface VideoResource extends Resource {
  type: 'video';
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

export interface VideoEmbedResource extends Resource {
  type: 'video-embed';
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

export interface VideoLinkResource extends Resource {
  type: 'video-link';
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

export interface StillImageFilmResource extends Resource {
  type: 'still-image-film';
  image: ImageResource;
  audio: AudioResource;
}

export interface StillImageFilmEmbedResource extends Resource {
  type: 'still-image-film-embed';
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

export interface StillImageFilmLinkResource extends Resource {
  type: 'still-image-film-link';
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

export interface ArticleResource extends Resource {
  type: 'article';
}

export interface DocumentResource extends Resource {
  type: 'document';
}

export interface DocumentEmbedResource extends Resource {
  type: 'document-embed';
}

export interface DocumentLinkResource extends Resource {
  type: 'document-link';
}

export interface DocumentDownloadResource extends Resource {
  type: 'document-download';
}

export interface AppLinkResource extends Resource {
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
