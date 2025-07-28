import { type BitTypeType } from '../enum/BitType.ts';
import { type BodyBitTypeType } from '../enum/BodyBitType.ts';
import type { ResourceTypeType } from '../enum/ResourceType.ts';
import { type TextFormatType } from '../enum/TextFormat.ts';
import {
  type BookJson,
  type BotResponseJson,
  type ChoiceJson,
  type DefinitionListItemJson,
  type ExampleJson,
  type FeedbackJson,
  type FlashcardJson,
  type GroupTagJson,
  type HeadingJson,
  type ImageSourceJson,
  type IngredientJson,
  type MarkConfigJson,
  type MatrixJson,
  type PairJson,
  type PersonJson,
  type PronunciationTableJson,
  type QuestionJson,
  type QuizJson,
  type RatingLevelStartEndJson,
  type ResponseJson,
  type ServingsJson,
  type StatementJson,
  type TableJson,
  type TechnicalTermJson,
} from '../json/BitJson.ts';
import { type BodyBitJson, type BodyBitsJson } from '../json/BodyBitJson.ts';
import { type ImageResourceWrapperJson, type ResourceJson } from '../json/ResourceJson.ts';
import { type ParserError } from '../parser/ParserError.ts';
import { type ParserInfo } from '../parser/ParserInfo.ts';
import { type JsonText, type TextAst } from './TextNodes.ts';

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
  resourceType?: ResourceTypeType;
  isCommented?: boolean;
  id?: Property;
  internalComment?: Property;
  customerId?: Property;
  customerExternalId?: Property;
  externalId?: Property;
  spaceId?: Property;
  padletId?: Property;
  jupyterId?: Property;
  jupyterExecutionCount?: Property;
  isPublic?: Property;
  isTemplate?: Property;
  isTemplateStripTheme?: Property;
  aiGenerated?: Property;
  machineTranslated?: Property;
  searchIndex?: Property;
  analyticsTag?: Property;
  categoryTag?: Property;
  topicTag?: Property;
  reportTag?: Property;
  altLangTag?: Property;
  feedbackEngine?: Property;
  feedbackType?: Property;
  disableFeedback?: Property;
  diffTo?: Property;
  diffOp?: Property;
  diffRef?: Property;
  diffContext?: Property;
  diffTime?: Property;
  path?: Property;
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
  groupTag?: GroupTagJson[];
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
  bookDiff?: Property;
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
  processHandInLocation?: Property;
  chatWithBook?: Property;
  chatWithBookBrainKey?: Property;
  action?: Property;
  showInIndex?: Property;
  refAuthor?: Property;
  refBookTitle?: Property;
  refPublisher?: Property;
  refPublicationYear?: Property;
  citationStyle?: Property;
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
  tableHeaderWhitespaceNoWrap?: Property;
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
  backgroundWallpaper?: ImageResourceWrapperJson;
  hasBookNavigation?: Property;
  duration?: Property;
  deeplink?: Property;
  externalLink?: Property;
  externalLinkText?: Property;
  videoCallLink?: Property;
  vendorDashboardId?: Property;
  vendorSurveyId?: Property;
  vendorUrl?: Property;
  search?: Property;
  bot?: Property;
  referenceProperty?: Property;
  list?: Property;
  layer?: Property;
  layerRole?: Property;
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
  handInAcceptFileType?: Property;
  handInRequirement?: Property;
  handInInstruction?: Property;
  maxCreatedBits?: Property;
  maxDisplayLevel?: Property;
  maxTocChapterLevel?: Property;
  tocResource?: Property;
  tocContent?: Property;
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
  revealSolutions?: Property;
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

// Extra Properties

export interface ExtraProperties {
  [key: string]: Property;
}

export type Property = string[] | number[] | boolean[] | string | number | boolean;

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

export interface CardBit extends Bit {
  //
}

// export interface CardBit {
//   item: JsonText;
//   lead: JsonText;
//   hint?: JsonText;
//   instruction?: JsonText;
//   isExample?: boolean;
//   example?: ExampleJson;
//   extraProperties?: ExtraProperties;
//   body?: Body;
//   __isDefaultExample: boolean;
// }

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
  feedbacks?: FeedbackJson[];
  quizzes?: QuizJson[];
  heading?: HeadingJson;
  pairs?: PairJson[];
  matrix?: MatrixJson[];
  pronunciationTable?: PronunciationTableJson;
  table?: TableJson;
  botResponses?: BotResponseJson[];
  cardBits?: Bit[];
  ingredients?: IngredientJson[];
  // DEPRECATED - TO BE REMOVED IN THE FUTURE
  // captionDefinitionList?: CaptionDefinitionListJson;
}

// Footer

export interface Footer {
  footer?: JsonText;
}
