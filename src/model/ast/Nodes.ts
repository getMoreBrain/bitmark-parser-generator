import { BitType } from '../enum/BitType';
import { BodyBitTypeType } from '../enum/BodyBitType';
import { ResourceTagType } from '../enum/ResourceTag';
import { TextFormatType } from '../enum/TextFormat';
import { ParserError } from '../parser/ParserError';
import { ParserInfo } from '../parser/ParserInfo';

// TODO:
// Store all data in the AST as SandardString (NOT Breakscaped).
// This means that strings from the bitmark parser must be unbreakscaped before being stored in the AST via Builder.
// It also means that the bitmark++/bitmark-- string must be converted before being passed to the Builder.
// It also means that the body will need to be stored in the v3 format in the AST rather than in bodyParts.
// But it means that breakscaping is kept to where it is needed - i.e. in the bitmark markup, and not anywhere else.

import { BreakscapedString } from './BreakscapedString';
import { StandardString } from './StardardString';
import { TextAst } from './TextNodes';

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
  resourceType?: ResourceTagType;
  id?: Property;
  externalId?: Property;
  spaceId?: Property;
  padletId?: Property;
  jupyterId?: Property;
  jupyterExecutionCount?: Property;
  aiGenerated?: Property;
  releaseVersion?: Property;
  ageRange?: Property;
  lang?: Property;
  language?: Property;
  computerLanguage?: Property;
  target?: Property;
  tag?: Property;
  icon?: Property;
  iconTag?: Property;
  colorTag?: Property;
  flashcardSet?: Property;
  subtype?: Property;
  bookAlias?: Property;
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
  content2Buy?: Property;
  quotedPerson?: Property;
  partialAnswer?: Property;
  reasonableNumOfChars?: Property;
  maxCreatedBits?: Property;
  markConfig?: MarkConfig[];
  extraProperties?: ExtraProperties;
  book?: StandardString;
  title?: TextAst;
  subtitle?: TextAst;
  level?: number; // 'level' can either the subtitle level [##subtitle]
  toc?: Property;
  progress?: Property;
  anchor?: StandardString;
  reference?: StandardString;
  referenceEnd?: StandardString;
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isExample?: boolean;
  isDefaultExample: boolean;
  example?: Example;
  imageSource?: ImageSource;
  partner?: Partner;
  resources?: Resource[];
  body?: Body;
  sampleSolution?: StandardString;
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
  item?: TextAst;
  lead?: TextAst;
}

export type Example = TextAst | boolean;

export interface WithExample {
  isDefaultExample: boolean;
  isExample: boolean;
  example?: Example;
}

// Extra Properties

export interface ExtraProperties {
  [key: string]: Property;
}

export type Property = string[] | number[] | boolean[] | unknown[];

// (image-on-device) ImageSource
export interface ImageSource {
  url: StandardString;
  mockupId: StandardString;
  size?: number;
  format?: StandardString;
  trim?: boolean;
}

// (chat) Partner
export interface Partner {
  name: StandardString;
  avatarImage?: ImageResource;
}

export interface MarkConfig {
  mark: StandardString;
  color?: StandardString;
  emphasis?: StandardString;
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
  text: StandardString;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isCaseSensitive?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Flashcard

export interface Flashcard {
  question: StandardString;
  answer?: StandardString;
  alternativeAnswers?: StandardString[];
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Bot Response
export interface BotResponse {
  response: StandardString;
  reaction: StandardString;
  feedback: StandardString;
  itemLead?: ItemLead;
  hint?: TextAst;
}

// Quiz

export interface Quiz {
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isExample?: boolean;
  choices?: Choice[];
  responses?: Response[];
}

// Heading

export interface Heading {
  forKeys: StandardString;
  forValues: StandardString[];
}

// Pair

export interface Pair {
  key?: StandardString;
  keyAudio?: AudioResource;
  keyImage?: ImageResource;
  values?: StandardString[];
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

export interface Matrix {
  key: StandardString;
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
  isExample: boolean;
  cells: MatrixCell[];
}

export interface MatrixCell {
  values?: StandardString[];
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Question

export interface Question {
  question: StandardString;
  partialAnswer?: StandardString;
  sampleSolution?: StandardString;
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isCaseSensitive?: boolean;
  isShortAnswer?: boolean;
  reasonableNumOfChars?: number;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Body

// TODO - we cannot store the body like this. we have to store it as an already processed v3 body.
export interface Body {
  bodyParts: BodyPart[];
}

export interface BodyText extends BodyPart {
  type: 'text';
  data: {
    bodyText: StandardString;
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
    solutions: StandardString[];
    itemLead?: ItemLead;
    hint?: TextAst;
    instruction?: TextAst;
    isCaseSensitive?: boolean;
    isExample: boolean;
    isDefaultExample: boolean;
    example?: Example;
  };
}

export interface Mark extends BodyBit {
  type: 'mark';
  data: {
    solution: StandardString;
    mark?: StandardString;
    itemLead?: ItemLead;
    hint?: TextAst;
    instruction?: TextAst;
    isExample: boolean;
    isDefaultExample: boolean;
    example?: Example;
  };
}

// Select

export interface Select extends BodyBit {
  type: 'select';
  data: {
    prefix?: StandardString;
    options: SelectOption[];
    postfix?: StandardString;
    itemLead?: ItemLead;
    hint?: TextAst;
    instruction?: TextAst;
    isCaseSensitive?: boolean;
    isExample?: boolean;
  };
}

export interface SelectOption {
  text: StandardString;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isCaseSensitive?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Highlight

export interface Highlight extends BodyBit {
  type: 'highlight';
  data: {
    prefix?: StandardString;
    texts: HighlightText[];
    postfix?: StandardString;
    itemLead?: ItemLead;
    hint?: TextAst;
    instruction?: TextAst;
    isCaseSensitive?: boolean;
    isExample?: boolean;
  };
}

export interface HighlightText {
  text: StandardString;
  isCorrect: boolean;
  isHighlighted: boolean;
  itemLead?: ItemLead;
  hint?: TextAst;
  instruction?: TextAst;
  isCaseSensitive?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Card Node
export interface CardNode {
  questions?: Question[];
  elements?: StandardString[];
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
  footerText: StandardString;
}

//
// Resource
//

export interface Resource {
  type: ResourceTagType;
  typeAlias: ResourceTagType;
  format?: StandardString;
  value?: StandardString; // url / src / body / etc
  license?: StandardString;
  copyright?: StandardString;
  provider?: StandardString;
  showInIndex?: boolean;
  caption?: TextAst;
}

export interface ImageResource extends Resource {
  type: 'image';
  src1x?: StandardString;
  src2x?: StandardString;
  src3x?: StandardString;
  src4x?: StandardString;
  width?: number;
  height?: number;
  alt?: StandardString;
}

// export interface ImageResponsiveResource extends Resource {
//   type: 'image-responsive';
//   imagePortrait: ImageResource;
//   imageLandscape: ImageResource;
// }

export interface ImageLinkResource extends Resource {
  type: 'image-link';
  src1x?: StandardString;
  src2x?: StandardString;
  src3x?: StandardString;
  src4x?: StandardString;
  width?: number;
  height?: number;
  alt?: StandardString;
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
  alt?: StandardString;
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
  alt?: StandardString;
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
  alt?: StandardString;
  posterImage?: ImageResource;
  thumbnails?: ImageResource[];
}

// export interface StillImageFilmResource extends Resource {
//   type: 'still-image-film';
//   image: ImageResource;
//   audio: AudioResource;
// }

export interface StillImageFilmEmbedResource extends Resource {
  type: 'still-image-film-embed';
  width?: number;
  height?: number;
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  alt?: StandardString;
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
  alt?: StandardString;
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
  siteName?: StandardString;
}
