import { BitTypeType } from '../enum/BitType';
import { BodyBitTypeType } from '../enum/BodyBitType';
import { ResourceTagType } from '../enum/ResourceTag';
import { TextFormatType } from '../enum/TextFormat';
import { BodyBitJson, BodyBitsJson } from '../json/BodyBitJson';
import { ImageResourceWrapperJson, ResourceJson } from '../json/ResourceJson';
import { ParserError } from '../parser/ParserError';
import { ParserInfo } from '../parser/ParserInfo';

import { JsonText, TextAst } from './TextNodes';

import {
  BookJson,
  BotResponseJson,
  CaptionDefinitionListJson,
  ChoiceJson,
  DefinitionListItemJson,
  ExampleJson,
  FlashcardJson,
  HeadingJson,
  ImageSourceJson,
  IngredientJson,
  MarkConfigJson,
  MatrixJson,
  PairJson,
  PersonJson,
  QuestionJson,
  QuizJson,
  RatingLevelStartEndJson,
  ResponseJson,
  ServingsJson,
  StatementJson,
  TableJson,
  TechnicalTermJson,
} from '../json/BitJson';

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
  bitLevel: number;
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
  isPublic?: Property;
  aiGenerated?: Property;
  machineTranslated?: Property;
  analyticsTag?: Property;
  feedbackEngine?: Property;
  feedbackType?: Property;
  disableFeedback?: Property;
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
  slug?: Property;
  tag?: Property;
  reductionTag?: Property;
  bubbleTag?: Property;
  levelCEFRp?: Property;
  levelCEFR?: Property;
  levelILR?: Property;
  levelACTFL?: Property;
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
  dateEnd?: Property;
  location?: Property;
  kind?: Property;
  hasMarkAsDone?: Property;
  processHandIn?: Property;
  action?: Property;
  showInIndex?: Property;
  refAuthor?: Property;
  refBookTitle?: Property;
  refPublisher?: Property;
  blockId?: Property;
  pageNo?: Property;
  x?: Property;
  y?: Property;
  width?: Property;
  height?: Property;
  index?: Property;
  classification?: Property;
  availableClassifications?: Property;
  allowedBit?: Property;
  tableFixedHeader?: Property;
  tableSearch?: Property;
  tableSort?: Property;
  tablePagination?: Property;
  tablePaginationLimit?: Property;
  tableHeight?: Property;
  tableWhitespaceNoWrap?: Property;
  tableAutoWidth?: Property;
  tableResizableColumns?: Property;
  tableColumnMinWidth?: Property;
  quizCountItems?: Property;
  quizStrikethroughSolutions?: Property;
  codeLineNumbers?: Property;
  codeMinimap?: Property;
  stripePricingTableId?: Property;
  stripePublishableKey?: Property;
  thumbImage?: Property;
  scormSource?: Property;
  posterImage?: Property;
  focusX?: Property;
  focusY?: Property;
  pointerLeft?: Property;
  pointerTop?: Property;
  listItemIndent?: Property;
  backgroundWallpaper?: Property;
  hasBookNavigation?: Property;
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
  imageFirst?: Property;
  activityType?: Property;
  labelTrue?: Property;
  labelFalse?: Property;
  content2Buy?: Property;
  mailingList?: Property;
  buttonCaption?: Property;
  callToActionUrl?: Property;
  caption?: TextAst;
  quotedPerson?: Property;
  partialAnswer?: Property;
  reasonableNumOfChars?: Property;
  resolved?: Property;
  resolvedDate?: Property;
  resolvedBy?: Property;
  maxCreatedBits?: Property;
  maxDisplayLevel?: Property;
  maxTocChapterLevel?: Property;
  page?: Property;
  productId?: Property;
  product?: Property;
  productList?: Property;
  productVideo?: Property;
  productVideoList?: Property;
  productFolder?: Property;
  technicalTerm?: TechnicalTermJson;
  servings?: ServingsJson;
  ratingLevelStart?: RatingLevelStartEndJson;
  ratingLevelEnd?: RatingLevelStartEndJson;
  ratingLevelSelected?: Property;
  markConfig?: MarkConfigJson[];
  extraProperties?: ExtraProperties;
  book?: string | BookJson[];
  title?: TextAst;
  subtitle?: TextAst;
  level?: number; // 'level' can either the subtitle level [##subtitle]
  toc?: Property;
  progress?: Property;
  anchor?: string;
  reference?: string;
  referenceEnd?: string;
  item?: TextAst;
  lead?: TextAst;
  pageNumber?: TextAst;
  marginNumber?: TextAst;
  hint?: TextAst;
  instruction?: TextAst;
  isExample?: boolean;
  example?: ExampleJson;
  imageSource?: ImageSourceJson;
  person?: PersonJson;
  imagePlaceholder?: ImageResourceWrapperJson;
  resources?: ResourceJson[];
  body?: Body;
  sampleSolution?: Property;
  additionalSolutions?: Property;
  statement?: StatementJson;
  choices?: ChoiceJson[];
  responses?: ResponseJson[];
  cardNode?: CardNode;
  footer?: Footer;

  markup?: string; // Called 'bitmark' in the JSON
  parser?: ParserInfo;

  // Private properties
  __isDefaultExample: boolean;
  __defaultExample?: ExampleJson;
}

export type Example = JsonText | string | boolean; // BitmarkTextNode | string | boolean;

export interface WithExample {
  __isDefaultExample: boolean;
  isExample: boolean;
  example?: Example;
}

// Extra Properties

export interface ExtraProperties {
  [key: string]: Property;
}

export type Property = string[] | number[] | boolean[] | unknown[];

// Body

export interface Body {
  body?: JsonText | unknown;
  bodyBits?: BodyBitJson[];
  placeholders?: BodyBitsJson;
  bodyString?: string;
}

export interface BodyPart {
  type: BodyBitTypeType;
  data?: unknown;
}

export interface CardBit {
  item: JsonText;
  lead: JsonText;
  hint?: JsonText;
  instruction?: JsonText;
  isExample?: boolean;
  example?: ExampleJson;
  extraProperties?: ExtraProperties;
  body?: Body;
  __isDefaultExample: boolean;
}

// Card Node
export interface CardNode {
  questions?: QuestionJson[];
  elements?: string[];
  flashcards?: FlashcardJson[];
  definitions?: DefinitionListItemJson[];
  statement?: StatementJson;
  statements?: StatementJson[];
  choices?: ChoiceJson[];
  responses?: ResponseJson[];
  quizzes?: QuizJson[];
  heading?: HeadingJson;
  pairs?: PairJson[];
  matrix?: MatrixJson[];
  table?: TableJson;
  botResponses?: BotResponseJson[];
  cardBits?: CardBit[];
  ingredients?: IngredientJson[];
  captionDefinitionList?: CaptionDefinitionListJson;
}

// Footer

export interface Footer {
  footer?: JsonText;
}
