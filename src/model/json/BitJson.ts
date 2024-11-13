import { JsonText, TextAst } from '../ast/TextNodes';

import { BodyBitsJson } from './BodyBitJson';
import { AudioResourceJson, ImageResourceJson, ImageResourceWrapperJson, ResourceJson } from './ResourceJson';

export interface BitJson {
  type: string; // bit type
  originalType: string; // commented bit type
  bitLevel: number;
  format: string; // bit format

  // Properties
  id: string | string[];
  internalComment: string | string[];
  externalId: string | string[];
  spaceId: string | string[];
  padletId: string;
  jupyterId: string;
  jupyterExecutionCount: number;
  isPublic: boolean;
  aiGenerated: boolean;
  machineTranslated: string;
  analyticsTag: string | string[];
  feedbackEngine: string;
  feedbackType: string;
  disableFeedback: boolean;
  releaseVersion: string;
  releaseKind: string;
  releaseDate: string;
  ageRange: number | number[];
  lang: string;
  language: string | string[];
  computerLanguage: string;
  target: string | string[];
  slug: string;
  tag: string | string[];
  reductionTag: string | string[];
  bubbleTag: string | string[];
  levelCEFRp: string;
  levelCEFR: string;
  levelILR: string;
  levelACTFL: string;
  icon: string;
  iconTag: string;
  colorTag: string | string[];
  flashcardSet: string | string[];
  subtype: string;
  bookAlias: string | string[];
  coverImage: string | string[];
  coverColor: string;
  publisher: string | string[];
  publisherName: string;
  publications: string | string[];
  author: string | string[];
  subject: string | string[];
  date: string;
  dateEnd: string;
  location: string;
  theme: string | string[];
  kind: string;
  hasMarkAsDone: boolean;
  processHandIn: boolean;
  action: string;
  showInIndex: boolean;
  blockId: string;
  pageNo: number;
  x: number;
  y: number;
  width: string;
  height: string;
  index: number;
  classification: string;
  availableClassifications: string | string[];
  allowedBit: string | string[];
  tableFixedHeader: boolean;
  tableSearch: boolean;
  tableSort: boolean;
  tablePagination: boolean;
  tablePaginationLimit: number;
  tableHeight: number;
  tableWhitespaceNoWrap: boolean;
  tableAutoWidth: boolean;
  tableResizableColumns: boolean;
  quizCountItems: boolean;
  quizStrikethroughSolutions: boolean;
  codeLineNumbers: boolean;
  codeMinimap: boolean;
  stripePricingTableId: string;
  stripePublishableKey: string;
  thumbImage: string;
  scormSource: string;
  posterImage: string;
  focusX: number;
  focusY: number;
  pointerLeft: string;
  pointerTop: string;
  listItemIndent: number;
  backgroundWallpaper: string;
  hasBookNavigation: boolean;
  duration: string;
  deeplink: string | string[];
  externalLink: string;
  externalLinkText: string;
  videoCallLink: string;
  vendorUrl: string;
  search: string;
  bot: string | string[];
  list: string | string[];
  textReference: string;
  isTracked: boolean; // only .learningPathExternalLink?
  isInfoOnly: boolean; // only .learningPathExternalLink?
  imageFirst: boolean;
  activityType: string;
  labelTrue: string;
  labelFalse: string;
  content2Buy: string;
  mailingList: string;
  buttonCaption: string;
  callToActionUrl: string;
  caption: JsonText;
  quotedPerson: string;
  reasonableNumOfChars: number;
  resolved: boolean;
  resolvedDate: string;
  resolvedBy: string;
  maxCreatedBits: number;
  maxDisplayLevel: number;
  page: string;
  productId: string | string[];
  product: string;
  productVideo: string;
  productFolder: string;
  technicalTerm: TechnicalTermJson;
  servings: ServingsJson;
  ratingLevelStart: RatingLevelStartEndJson;
  ratingLevelEnd: RatingLevelStartEndJson;
  ratingLevelSelected: number;

  book: string;

  title: JsonText;
  subtitle: JsonText;
  level: number;
  toc: boolean;
  progress: boolean;
  anchor: string;
  reference: string | string[]; // Has 2 meanings, depending on bit (anchor/reference, or @reference)
  referenceEnd: string;

  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;

  isExample: boolean;
  example: ExampleJson;

  imageSource: ImageSourceJson;
  person: PersonJson;
  partner: PersonJson; // Deprecated, replaced by person

  marks: MarkConfigJson[];

  extraProperties: {
    [key: string]: unknown | unknown[];
  };

  imagePlaceholder: ImageResourceWrapperJson;
  resource: ResourceJson;
  logos: ImageResourceWrapperJson[];
  images: ImageResourceWrapperJson[];

  body: JsonText | unknown; // unknown is for JSON body

  sampleSolution: string;
  additionalSolutions: string[];
  partialAnswer: string;
  elements: string[];
  statement: string;
  isCorrect: boolean;
  cards: FlashcardJson[];
  descriptions: DescriptionListItemJson[];
  statements: StatementJson[];
  responses: ResponseJson[] | BotResponseJson[];
  quizzes: QuizJson[];
  heading: HeadingJson;
  pairs: PairJson[];
  matrix: MatrixJson[];
  table: TableJson;
  captionDefinitionList: CaptionDefinitionListJson;
  choices: ChoiceJson[];
  questions: QuestionJson[];
  ingredients: IngredientJson[];
  listItems: ListItemJson[];
  sections: ListItemJson[]; // sections is just a pseudonym for listItems

  footer: JsonText;

  placeholders: BodyBitsJson;
}

export interface ImageSourceJson {
  url: string;
  mockupId: string;
  size?: number;
  format?: string;
  trim?: boolean;
}

export interface PersonJson {
  name: string;
  title: string;
  avatarImage: ImageResourceJson;
}

export interface MarkConfigJson {
  mark: string;
  color: string;
  emphasis: string;
}

export interface FlashcardJson {
  question: JsonText;
  answer: JsonText;
  alternativeAnswers: JsonText[];
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  _isDefaultExample?: boolean;
  _defaultExample?: ExampleJson;
}

export interface DescriptionListItemJson {
  term: JsonText;
  description: JsonText;
  alternativeDescriptions: JsonText[];
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  _isDefaultExample?: boolean;
  _defaultExample?: ExampleJson;
}

export interface StatementJson {
  statement: string;
  isCorrect: boolean;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  _isDefaultExample?: boolean;
  _defaultExample?: ExampleJson;
}

export interface ChoiceJson {
  choice: string;
  isCorrect: boolean;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  _isDefaultExample?: boolean;
  _defaultExample?: ExampleJson;
}

export interface ResponseJson {
  response: string;
  isCorrect: boolean;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  _isDefaultExample?: boolean;
  _defaultExample?: ExampleJson;
}

export interface QuizJson {
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  choices: ChoiceJson[];
  responses: ResponseJson[];
  _isDefaultExample?: boolean;
  _defaultExample?: ExampleJson;
}

export interface HeadingJson {
  forKeys: string;
  forValues: string | string[];
  _forValuesDefault?: string | string[];
}

export interface PairJson {
  key: string;
  keyAudio: AudioResourceJson;
  keyImage: ImageResourceJson;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
  values: string[];
  _valuesAst?: TextAst[];
  _isDefaultExample?: boolean;
  _defaultExample?: ExampleJson;
}

export interface MatrixJson {
  key: string;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  // example: ExampleJson;
  cells: MatrixCellJson[];
  _isDefaultExample?: boolean;
}

export interface MatrixCellJson {
  values: string[];
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
  _valuesAst?: TextAst[];
  _isDefaultExample?: boolean;
  _defaultExample?: ExampleJson;
}

export interface TableJson {
  columns: string[];
  data: string[][];
}

export interface QuestionJson {
  question: string;
  partialAnswer: string;
  sampleSolution: string;
  additionalSolutions: string[];
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  reasonableNumOfChars: number;
  isExample: boolean;
  example: ExampleJson;
  _sampleSolutionAst?: TextAst;
  _isDefaultExample?: boolean;
  _defaultExample?: ExampleJson;
}

export interface BotResponseJson {
  response: string;
  reaction: string;
  feedback: string;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
}

export interface TechnicalTermJson {
  technicalTerm: string;
  lang: string;
}

export interface ServingsJson {
  servings: number;
  unit: string;
  unitAbbr: string;
  decimalPlaces: number;
  disableCalculation: boolean;
  hint: string;
}

export interface IngredientJson {
  title: string;
  checked: boolean;
  item: string;
  quantity: number;
  unit: string;
  unitAbbr: string;
  decimalPlaces: number;
  disableCalculation: boolean;
}

export interface RatingLevelStartEndJson {
  level: number;
  label?: JsonText;
}

// CaptionDefinition

export interface CaptionDefinitionJson {
  term: string;
  description: string;
}

// CaptionDefinitionList

export interface CaptionDefinitionListJson {
  columns: string[];
  definitions: CaptionDefinitionJson[];
}

export interface ListItemJson {
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  body: JsonText;
}

export type ExampleJson = JsonText | boolean | null;
