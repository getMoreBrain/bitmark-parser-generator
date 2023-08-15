import { BitType } from '../enum/BitType';
import { BodyBitTypeType } from '../enum/BodyBitType';
import { ResourceTypeType } from '../enum/ResourceType';
import { TextFormatType } from '../enum/TextFormat';
import { ParserError } from '../parser/ParserError';
import { ParserInfo } from '../parser/ParserInfo';

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
  bitType: BitType;
  textFormat: TextFormatType;
  resourceType?: ResourceTypeType;
  id?: Property;
  externalId?: Property;
  spaceId?: Property;
  padletId?: Property;
  aiGenerated?: Property;
  releaseVersion?: Property;
  ageRange?: Property;
  language?: Property;
  computerLanguage?: Property;
  target?: Property;
  tag?: Property;
  icon?: Property;
  iconTag?: Property;
  colorTag?: Property;
  subtype?: Property;
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
  markConfig?: MarkConfig[];
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
  isExample?: boolean;
  isDefaultExample: boolean;
  example?: Example;
  partner?: Partner;
  resource?: Resource;
  body?: Body;
  sampleSolution?: string[];
  statement?: Statement;
  choices?: Choice[];
  responses?: Response[];
  cardNode?: CardNode;
  footer?: FooterText;

  markup?: string; // Called 'bitmark' in the JSON
  parser?: ParserInfo;
}

export interface Comment {
  text: string;
  location?: {
    start: {
      offset: number;
      line: number;
      column: number;
    };
    end: {
      offset: number;
      line: number;
      column: number;
    };
  };
}

export interface ItemLead {
  item?: string;
  lead?: string;
}

export type Example = string | boolean;

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

export interface MarkConfig {
  mark: string;
  color?: string;
  emphasis?: string;
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

export interface Decision {
  text: string;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  isCaseSensitive?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Flashcard

export interface Flashcard {
  question: string;
  answer?: string;
  alternativeAnswers?: string[];
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
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
  isExample?: boolean;
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
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

export interface Matrix {
  key: string;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
  isExample: boolean;
  cells: MatrixCell[];
}

export interface MatrixCell {
  values?: string[];
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  isExample: boolean;
  isDefaultExample: boolean;
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
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Body

export interface Body {
  bodyParts: BodyPart[];
}

export interface BodyText extends BodyPart {
  type: 'text';
  data: {
    bodyText: string;
  };
}

export interface BodyPart {
  type: BodyBitTypeType;
  data: unknown;
}

export interface BodyBit extends BodyPart {
  type: 'gap' | 'mark' | 'select' | 'highlight';
}

// Gap

export interface Gap extends BodyBit {
  type: 'gap';
  data: {
    solutions: string[];
    itemLead?: ItemLead;
    hint?: string;
    instruction?: string;
    isCaseSensitive?: boolean;
    isExample: boolean;
    isDefaultExample: boolean;
    example?: Example;
  };
}

export interface Mark extends BodyBit {
  type: 'mark';
  data: {
    solution: string;
    mark?: string;
    itemLead?: ItemLead;
    hint?: string;
    instruction?: string;
    isExample: boolean;
    isDefaultExample: boolean;
    example?: Example;
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
    hint?: string;
    instruction?: string;
    isCaseSensitive?: boolean;
    isExample?: boolean;
  };
}

export interface SelectOption {
  text: string;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  isCaseSensitive?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Highlight

export interface Highlight extends BodyBit {
  type: 'highlight';
  data: {
    prefix?: string;
    texts: HighlightText[];
    postfix?: string;
    itemLead?: ItemLead;
    hint?: string;
    instruction?: string;
    isCaseSensitive?: boolean;
    isExample?: boolean;
  };
}

export interface HighlightText {
  text: string;
  isCorrect: boolean;
  isHighlighted: boolean;
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
  isCaseSensitive?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Card Node
export interface CardNode {
  questions?: Question[];
  elements?: string[];
  flashcards?: Flashcard[];
  statement?: Statement;
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
  quizzes?: Quiz[];
  heading?: Heading;
  pairs?: Pair[];
  matrix?: Matrix[];
  botResponses?: BotResponse[];
}

// Footer

export interface FooterText {
  footerText: string;
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
