import { BitTypeType } from '../enum/BitType';
import { BodyBitTypeType } from '../enum/BodyBitType';
import { ResourceTagType } from '../enum/ResourceTag';
import { TextFormatType } from '../enum/TextFormat';
import { ImageResourceWrapperJson, ResourceJson } from '../json/ResourceJson';
import { ParserError } from '../parser/ParserError';
import { ParserInfo } from '../parser/ParserInfo';

import { JsonText, TextAst } from './TextNodes';

import {
  BotResponseJson,
  CaptionDefinitionListJson,
  ChoiceJson,
  DescriptionListItemJson,
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
  book?: string;
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
  isDefaultExample: boolean;
  example?: ExampleJson;
  _defaultExample?: ExampleJson;
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
}

export type Example = JsonText | string | boolean; // BitmarkTextNode | string | boolean;

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

// // (image-on-device) ImageSource
// export interface ImageSource {
//   url: string;
//   mockupId: string;
//   size?: number;
//   format?: string;
//   trim?: boolean;
// }

// // (chat) Partner
// export interface Person {
//   name: string;
//   title?: string;
//   avatarImage?: ImageResourceWrapperJson;
// }

// export interface MarkConfig {
//   mark: string;
//   color?: string;
//   emphasis?: string;
// }

// // Table
// export interface Table {
//   columns: string[];
//   rows: string[][];
// }

// Question

// export interface Question {
//   question: string;
//   partialAnswer?: string;
//   sampleSolution?: string;
//   additionalSolutions?: string[];
//   itemLead?: ItemLead;
//   hint?: BitmarkTextNode;
//   instruction?: BitmarkTextNode;
//   reasonableNumOfChars?: number;
//   isExample: boolean;
//   isDefaultExample: boolean;
//   example?: Example;
// }

// // Professional Name
// export interface TechnicalTerm {
//   technicalTerm: string;
//   lang?: string;
// }

// // Servings
// export interface Servings {
//   servings: number;
//   unit?: string;
//   unitAbbr?: string;
//   decimalPlaces?: number;
//   disableCalculation?: boolean;
//   hint?: string;
// }

// // Ingredient

// export interface Ingredient {
//   title?: string;
//   checked?: boolean;
//   item?: string; // BitmarkTextNode?;
//   quantity?: number;
//   unit?: string;
//   unitAbbr?: string;
//   decimalPlaces?: number;
//   disableCalculation?: boolean;
// }

// // RatingLevelStartEnd
// export interface RatingLevelStartEnd {
//   level: number;
//   label?: TextAst; // BitmarkTextNode
// }

// // CaptionDefinition

// export interface CaptionDefinition {
//   term: string;
//   description: string;
// }

// // CaptionDefinitionList

// export interface CaptionDefinitionList {
//   columns: string[];
//   definitions: CaptionDefinition[];
// }

// Body

export interface Body {
  body?: JsonText;
  bodyBits?: BodyBit[];
  bodyString?: string;
  bodyJson?: unknown;
}

export interface BodyPart {
  type: BodyBitTypeType;
  // data: unknown;
}

export interface BodyBit extends BodyPart {
  type: 'gap' | 'mark' | 'select' | 'highlight';
}

export interface CardBit {
  item: TextAst;
  lead: TextAst;
  hint?: TextAst;
  instruction?: TextAst;
  isExample?: boolean;
  isDefaultExample: boolean;
  example?: ExampleJson;
  extraProperties?: ExtraProperties;
  body?: Body;
}

// Card Node
export interface CardNode {
  questions?: QuestionJson[];
  elements?: string[];
  flashcards?: FlashcardJson[];
  descriptions?: DescriptionListItemJson[];
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
