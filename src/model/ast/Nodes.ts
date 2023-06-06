import { BitTypeType } from '../enum/BitType';
import { BodyBitTypeType } from '../enum/BodyBitType';
import { ResourceTypeType } from '../enum/ResourceType';
import { TextFormatType } from '../enum/TextFormat';
import { ParserError } from '../parser/ParserError';
import { ParserInfo } from '../parser/ParserInfo';

import { TextNode } from './TextNodes';

// Node

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Node = any;

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
  textReference?: Property;
  isTracked?: Property;
  isInfoOnly?: Property;
  labelTrue?: Property;
  labelFalse?: Property;
  quotedPerson?: Property;
  partialAnswer?: Property;
  extraProperties?: ExtraProperties;
  book?: string;
  title?: TextNode;
  subtitle?: TextNode;
  levelProperty?: Property; // 'level' can be a property [@level:2] - string
  level?: number; // 'level' can either the subtitle level [##subtitle]
  toc?: Property;
  progress?: Property;
  anchor?: string;
  reference?: string;
  referenceEnd?: string;
  itemLead?: ItemLead;
  hint?: TextNode;
  instruction?: TextNode;
  example?: Example;
  partner?: Partner;
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

// (chat) Partner
export interface Partner {
  name: string;
  avatarImage?: ImageResource;
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

// Bot Response
export interface BotResponse {
  response: string;
  reaction: string;
  feedback: string;
  itemLead?: ItemLead;
  hint?: TextNode;
}

// Quiz

export interface Quiz {
  itemLead?: ItemLead;
  hint?: TextNode;
  instruction?: TextNode;
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
  hint?: TextNode;
  instruction?: TextNode;
  example?: Example;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
}

export interface Matrix {
  key: string;
  itemLead?: ItemLead;
  hint?: TextNode;
  instruction?: TextNode;
  example?: Example;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
  cells: MatrixCell[];
}

export interface MatrixCell {
  values?: string[];
  itemLead?: ItemLead;
  hint?: TextNode;
  instruction?: TextNode;
  example?: Example;
}

// Question

export interface Question {
  question: string;
  partialAnswer?: string;
  sampleSolution?: string;
  itemLead?: ItemLead;
  hint?: TextNode;
  instruction?: TextNode;
  example?: Example;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
}

// Body

export interface Body {
  bodyParts: BodyPart[];
  bodyText: TextNode;
}

export type BodyPart = BodyPartText | BodyBit;

export interface BodyPartText {
  bodyPartText: string;
}

// Footer

export interface FooterText {
  footerText: TextNode;
}

// BodyBits

export interface BodyBit {
  type: BodyBitTypeType;
  placeholderIndex: number;
  data: unknown;
}

// Gap

export interface Gap extends BodyBit {
  type: 'gap';
  data: {
    solutions: string[];
    itemLead?: ItemLead;
    hint?: TextNode;
    instruction?: TextNode;
    example?: Example;
    isCaseSensitive?: boolean;
  };
}

// Select

export interface Select extends BodyBit {
  type: 'select';
  data: {
    prefix?: string;
    options: SelectOption[];
    postfix?: string;
    itemLead?: ItemLead;
    hint?: TextNode;
    instruction?: TextNode;
    example?: Example;
    isCaseSensitive?: boolean;
  };
}

export interface SelectOption {
  text: string;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: TextNode;
  instruction?: TextNode;
  example?: Example;
  isCaseSensitive?: boolean;
}

// Highlight

export interface Highlight extends BodyBit {
  type: 'highlight';
  data: {
    prefix?: string;
    texts: HighlightText[];
    postfix?: string;
    itemLead?: ItemLead;
    hint?: TextNode;
    instruction?: TextNode;
    example?: Example;
    isCaseSensitive?: boolean;
  };
}

export interface HighlightText {
  text: string;
  isCorrect: boolean;
  isHighlighted: boolean;
  itemLead?: ItemLead;
  hint?: TextNode;
  instruction?: TextNode;
  example?: Example;
  isCaseSensitive?: boolean;
}

// Generic

export interface ItemLead {
  item?: TextNode;
  lead?: TextNode;
}

export type Example = TextNode | boolean;

export interface Decision {
  text: string;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: TextNode;
  instruction?: TextNode;
  example?: Example;
  isCaseSensitive?: boolean;
}

//
// Resource
//

export interface Resource {
  type: ResourceTypeType;
  format?: string;
  value?: string; // url / src / body / etc
  license?: string;
  copyright?: string;
  provider?: string;
  showInIndex?: boolean;
  caption?: TextNode;
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
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
}

export interface AudioEmbedResource extends Resource {
  type: 'audio-embed';
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
}

export interface AudioLinkResource extends Resource {
  type: 'audio-link';
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
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
