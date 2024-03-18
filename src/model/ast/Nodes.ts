import { BitTypeType } from '../enum/BitType';
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
  resourceType?: ResourceTagType;
  isCommented?: boolean;
  id?: Property;
  internalComment?: Property;
  externalId?: Property;
  spaceId?: Property;
  padletId?: Property;
  jupyterId?: Property;
  jupyterExecutionCount?: Property;
  aiGenerated?: Property;
  releaseVersion?: Property;
  releaseKind?: Property;
  releaseDate?: Property;
  ageRange?: Property;
  lang?: Property;
  language?: Property;
  publisher?: Property;
  publisherName?: Property;
  theme?: Property;
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
  coverColor?: Property;
  publications?: Property;
  author?: Property;
  subject?: Property;
  date?: Property;
  location?: Property;
  kind?: Property;
  action?: Property;
  blockId?: Property;
  pageNo?: Property;
  x?: Property;
  y?: Property;
  width?: Property;
  height?: Property;
  index?: Property;
  classification?: Property;
  availableClassifications?: Property;
  tableFixedHeader?: Property;
  tableSearch?: Property;
  tableSort?: Property;
  tablePagination?: Property;
  tablePaginationLimit?: Property;
  tableHeight?: Property;
  tableWhitespaceNoWrap?: Property;
  tableAutoWidth?: Property;
  tableResizableColumns?: Property;
  quizCountItems?: Property;
  quizStrikethroughSolutions?: Property;
  codeLineNumbers?: Property;
  codeMinimap?: Property;
  thumbImage?: Property;
  scormSource?: Property;
  posterImage?: Property;
  focusX?: Property;
  focusY?: Property;
  pointerLeft?: Property;
  pointerTop?: Property;
  backgroundWallpaper?: Property;
  duration?: Property;
  deeplink?: Property;
  externalLink?: Property;
  externalLinkText?: Property;
  videoCallLink?: Property;
  vendorUrl?: Property;
  search?: Property;
  bot?: Property;
  referenceProperty?: Property;
  list?: Property;
  textReference?: Property;
  isTracked?: Property;
  isInfoOnly?: Property;
  labelTrue?: Property;
  labelFalse?: Property;
  content2Buy?: Property;
  mailingList?: Property;
  buttonCaption?: Property;
  caption?: BreakscapedString; // TextAst
  quotedPerson?: Property;
  partialAnswer?: Property;
  reasonableNumOfChars?: Property;
  resolved?: Property;
  resolvedDate?: Property;
  resolvedBy?: Property;
  maxCreatedBits?: Property;
  maxDisplayLevel?: Property;
  product?: Property;
  productList?: Property;
  productVideo?: Property;
  productVideoList?: Property;
  productFolder?: Property;
  technicalTerm?: TechnicalTerm;
  servings?: Servings;
  markConfig?: MarkConfig[];
  extraProperties?: ExtraProperties;
  book?: BreakscapedString;
  title?: BreakscapedString; // TextAst;
  subtitle?: BreakscapedString; // TextAst;
  level?: number; // 'level' can either the subtitle level [##subtitle]
  toc?: Property;
  progress?: Property;
  anchor?: BreakscapedString;
  reference?: BreakscapedString;
  referenceEnd?: BreakscapedString;
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isExample?: boolean;
  isDefaultExample: boolean;
  example?: Example;
  imageSource?: ImageSource;
  person?: Person;
  resources?: Resource[];
  body?: Body;
  sampleSolution?: BreakscapedString;
  statement?: Statement;
  choices?: Choice[];
  responses?: Response[];
  cardNode?: CardNode;
  footer?: FooterText;

  markup?: string; // Called 'bitmark' in the JSON
  parser?: ParserInfo;
}

export interface ItemLead {
  item?: BreakscapedString; // TextAst;
  lead?: BreakscapedString; // TextAst;
  pageNumber?: BreakscapedString; // TextAst;
  marginNumber?: BreakscapedString; // TextAst;
}

export type Example = BreakscapedString | boolean; // TextAst | boolean;

export interface WithExample {
  isDefaultExample: boolean;
  isExample: boolean;
  example?: Example;
}

// Extra Properties

export interface ExtraProperties {
  [key: string]: Property;
}

export type Property = BreakscapedString[] | number[] | boolean[] | unknown[];

// (image-on-device) ImageSource
export interface ImageSource {
  url: BreakscapedString;
  mockupId: BreakscapedString;
  size?: number;
  format?: BreakscapedString;
  trim?: boolean;
}

// (chat) Partner
export interface Person {
  name: BreakscapedString;
  title?: BreakscapedString;
  avatarImage?: ImageResource;
}

export interface MarkConfig {
  mark: BreakscapedString;
  color?: BreakscapedString;
  emphasis?: BreakscapedString;
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
  text: BreakscapedString;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Flashcard

export interface Flashcard {
  question: BreakscapedString;
  answer?: BreakscapedString;
  alternativeAnswers?: BreakscapedString[];
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Bot Response
export interface BotResponse {
  response: BreakscapedString;
  reaction: BreakscapedString;
  feedback: BreakscapedString;
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
}

// Quiz

export interface Quiz {
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isExample?: boolean;
  choices?: Choice[];
  responses?: Response[];
}

// Heading

export interface Heading {
  forKeys: BreakscapedString;
  forValues: BreakscapedString[];
}

// Pair

export interface Pair {
  key?: BreakscapedString;
  keyAudio?: AudioResource;
  keyImage?: ImageResource;
  values?: BreakscapedString[];
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isCaseSensitive?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

export interface Matrix {
  key: BreakscapedString;
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isExample: boolean;
  cells: MatrixCell[];
}

export interface MatrixCell {
  values?: BreakscapedString[];
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isCaseSensitive?: boolean;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Table
export interface Table {
  columns: BreakscapedString[];
  rows: BreakscapedString[][];
}

// Question

export interface Question {
  question: BreakscapedString;
  partialAnswer?: BreakscapedString;
  sampleSolution?: BreakscapedString;
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  reasonableNumOfChars?: number;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Professional Name
export interface TechnicalTerm {
  technicalTerm: BreakscapedString;
  lang?: BreakscapedString;
}

// Servings
export interface Servings {
  servings: number;
  unit?: BreakscapedString;
  unitAbbr?: BreakscapedString;
  decimalPlaces?: number;
  disableCalculation?: boolean;
}

// Ingredient

export interface Ingredient {
  title?: BreakscapedString;
  checked?: boolean;
  item?: BreakscapedString; // TextAst;
  quantity?: number;
  unit?: BreakscapedString;
  unitAbbr?: BreakscapedString;
  decimalPlaces?: number;
  disableCalculation?: boolean;
}

// Body

// TODO - we cannot store the body like this. we have to store it as an already processed v3 body.
export interface Body {
  bodyParts: BodyPart[];
}

export interface BodyText extends BodyPart {
  type: 'text';
  data: {
    bodyText: BreakscapedString;
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
    solutions: BreakscapedString[];
    itemLead?: ItemLead;
    hint?: BreakscapedString; // TextAst;
    instruction?: BreakscapedString; // TextAst;
    isCaseSensitive?: boolean;
    isExample: boolean;
    isDefaultExample: boolean;
    example?: Example;
  };
}

export interface Mark extends BodyBit {
  type: 'mark';
  data: {
    solution: BreakscapedString;
    mark?: BreakscapedString;
    itemLead?: ItemLead;
    hint?: BreakscapedString; // TextAst;
    instruction?: BreakscapedString; // TextAst;
    isExample: boolean;
    isDefaultExample: boolean;
    example?: Example;
  };
}

// Select

export interface Select extends BodyBit {
  type: 'select';
  data: {
    prefix?: BreakscapedString;
    options: SelectOption[];
    postfix?: BreakscapedString;
    itemLead?: ItemLead;
    hint?: BreakscapedString; // TextAst;
    instruction?: BreakscapedString; // TextAst;
    isExample?: boolean;
  };
}

export interface SelectOption {
  text: BreakscapedString;
  isCorrect: boolean;
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

// Highlight

export interface Highlight extends BodyBit {
  type: 'highlight';
  data: {
    prefix?: BreakscapedString;
    texts: HighlightText[];
    postfix?: BreakscapedString;
    itemLead?: ItemLead;
    hint?: BreakscapedString; // TextAst;
    instruction?: BreakscapedString; // TextAst;
    isExample?: boolean;
  };
}

export interface HighlightText {
  text: BreakscapedString;
  isCorrect: boolean;
  isHighlighted: boolean;
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isExample: boolean;
  isDefaultExample: boolean;
  example?: Example;
}

export interface CardBit {
  itemLead?: ItemLead;
  hint?: BreakscapedString; // TextAst;
  instruction?: BreakscapedString; // TextAst;
  isExample?: boolean;
  isDefaultExample: boolean;
  example?: Example;
  extraProperties?: ExtraProperties;
  body?: Body;
}

// Card Node
export interface CardNode {
  questions?: Question[];
  elements?: BreakscapedString[];
  flashcards?: Flashcard[];
  statement?: Statement;
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
  quizzes?: Quiz[];
  heading?: Heading;
  pairs?: Pair[];
  matrix?: Matrix[];
  table?: Table;
  botResponses?: BotResponse[];
  cardBits?: CardBit[];
  ingredients?: Ingredient[];
}

// Footer

export interface FooterText {
  footerText: BreakscapedString;
}

//
// Resource
//

export interface Resource {
  type: ResourceTagType;
  typeAlias: ResourceTagType;
  format?: BreakscapedString;
  value?: BreakscapedString; // url / src / body / etc
  license?: BreakscapedString;
  copyright?: BreakscapedString;
  provider?: BreakscapedString;
  showInIndex?: boolean;
  caption?: BreakscapedString; // TextAst;
}

export interface ImageResource extends Resource {
  type: 'image';
  src1x?: BreakscapedString;
  src2x?: BreakscapedString;
  src3x?: BreakscapedString;
  src4x?: BreakscapedString;
  width?: string;
  height?: string;
  alt?: BreakscapedString;
  zoomDisabled?: boolean;
}

// export interface ImageResponsiveResource extends Resource {
//   type: 'image-responsive';
//   imagePortrait: ImageResource;
//   imageLandscape: ImageResource;
// }

export interface ImageLinkResource extends Resource {
  type: 'image-link';
  src1x?: BreakscapedString;
  src2x?: BreakscapedString;
  src3x?: BreakscapedString;
  src4x?: BreakscapedString;
  width?: string;
  height?: string;
  alt?: BreakscapedString;
  zoomDisabled?: boolean;
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
  width?: string;
  height?: string;
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  alt?: BreakscapedString;
  posterImage?: ImageResource;
  thumbnails?: ImageResource[];
}

export interface VideoEmbedResource extends Resource {
  type: 'video-embed';
  width?: string;
  height?: string;
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  alt?: BreakscapedString;
  posterImage?: ImageResource;
  thumbnails?: ImageResource[];
}

export interface VideoLinkResource extends Resource {
  type: 'video-link';
  width?: string;
  height?: string;
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  alt?: BreakscapedString;
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
  width?: string;
  height?: string;
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  alt?: BreakscapedString;
  posterImage?: ImageResource;
  thumbnails?: ImageResource[];
}

export interface StillImageFilmLinkResource extends Resource {
  type: 'still-image-film-link';
  width?: string;
  height?: string;
  duration?: number; // string?
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  alt?: BreakscapedString;
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
  siteName?: BreakscapedString;
}
