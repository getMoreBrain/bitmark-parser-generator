import { type JsonText, type TextAst } from '../ast/TextNodes.ts';
import { type BodyBitsJson } from './BodyBitJson.ts';
import {
  type AudioResourceWrapperJson,
  type ImageResourceWrapperJson,
  type ResourceJson,
  type VideoResourceWrapperJson,
} from './ResourceJson.ts';

export interface BitJson {
  type: string; // bit type
  originalType: string; // commented bit type
  bitLevel: number;
  format: string; // bit format

  // Properties
  id: string | string[];
  internalComment: string | string[];
  customerId: string;
  customerExternalId: string | string[];
  externalId: string | string[];
  spaceId: string | string[];
  padletId: string;
  jupyterId: string;
  jupyterExecutionCount: number;
  sourceRL: string;
  isPublic: boolean;
  isTemplate: boolean;
  isTemplateStripTheme: boolean;
  isEditable: boolean;
  aiGenerated: boolean;
  machineTranslated: string;
  translationOf: string;
  spansPageBreak: boolean;
  searchIndex: string | string[];
  analyticsTag: string | string[];
  categoryTag: string | string[];
  topicTag: string | string[];
  reportTag: string | string[];
  altLangTag: string;
  feedbackEngine: string;
  feedbackType: string;
  disableFeedback: boolean;
  diffOp: string;
  diffRef: string;
  diffContext: string;
  diffTime: number;
  path: string;
  releaseVersion: string;
  releaseKind: string;
  releaseDate: string;
  iframeSrc: string;
  iframeName: string;
  ageRange: number | number[];
  lang: string;
  language: string | string[];
  computerLanguage: string;
  target: string | string[];
  slug: string;
  tag: string | string[];
  groupTag: GroupTagJson[];
  reductionTag: string | string[];
  bubbleTag: string | string[];
  extractorTag: string | string[];
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
  bookDiff: string;
  coverImage: string | string[];
  coverColor: string;
  publisher: string | string[];
  publisherName: string;
  publications: string | string[];
  relatedBook: string | string[];
  author: string | string[];
  subject: string | string[];
  date: string;
  dateEnd: string;
  location: string;
  theme: string | string[];
  kind: string;
  hasMarkAsDone: boolean;
  processHandIn: boolean;
  processHandInLocation: string;
  chatWithBook: boolean;
  chatWithBookBrainKey: string;
  currency: string;
  bookIsbn: string;
  bookAuthor: string;
  bookType: string;
  bookBindingType: string;
  bookNumberOfPages: string;
  bookRating: string;
  bookSeriesTitle: string;
  bookSeriesId: string;
  bookSeriesNumber: string;
  bookLanguage: string;
  bookPublishingDate: string;
  bookPublisher: string;
  bookTranslator: string;
  bookOriginalTitle: string;
  gmbExternalShop: string;
  gmbExternalShopItems: string | string[];
  action: string;
  showInIndex: boolean;
  refAuthor: string | string[];
  refBookTitle: string;
  refPublisher: string | string[];
  refPublicationYear: string;
  citationStyle: string;
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
  authorFullName: string;
  authorPseudonym: string;
  authorTitle: string;
  authorJobTitle: string;
  tableFixedHeader: boolean;
  tableHeaderWhitespaceNoWrap: boolean;
  tableSearch: boolean;
  tableSort: boolean;
  tablePagination: boolean;
  tablePaginationLimit: number;
  tableHeight: number;
  tableWhitespaceNoWrap: boolean;
  tableAutoWidth: boolean;
  tableResizableColumns: boolean;
  tableColumnMinWidth: number;
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
  backgroundWallpaper: ImageResourceWrapperJson;
  hasBookNavigation: boolean;
  duration: string;
  deeplink: string | string[];
  externalLink: string;
  externalLinkText: string;
  videoCallLink: string;
  vendorDashboardId: string;
  vendorSurveyId: string;
  vendorUrl: string;
  search: string;
  bot: string | string[];
  list: string | string[];
  layer: string | string[];
  layerRole: string | string[];
  textReference: string;
  isTracked: boolean; // only .learningPathExternalLink?
  isInfoOnly: boolean; // only .learningPathExternalLink?
  imageFirst: boolean;
  activityType: string;
  labelTrue: string;
  labelFalse: string;
  content2Buy: string;
  listPrice: string;
  customerProductId: string;
  customerProductShopLink: string;
  mailingList: string;
  buttonCaption: string;
  callToActionUrl: string;
  advertisingClickUrl: string;
  brandColor: string;
  brandColorName: string;
  caption: JsonText;
  quotedPerson: string;
  reasonableNumOfChars: number;
  resolved: boolean;
  resolvedDate: string;
  resolvedBy: string;
  handInAcceptFileType: string | string[];
  handInRequirement: string | string[];
  handInInstruction: string;
  maxCreatedBits: number;
  maxDisplayLevel: number;
  maxTocChapterLevel: number;
  sourceDocument: string;
  internalPrintPdf: string;
  hasPrintRestriction: boolean;
  enforceUpdateOverUserInput: boolean;
  tocResource: string | string[];
  tocContent: string | string[];
  page: string;
  platformBrandTarget: string;
  platformName: string;
  platformIcon: ImageResourceWrapperJson;
  platformLogo: ImageResourceWrapperJson;
  platformPrimaryColor: string;
  platformSecondaryColor: string;
  platformBackgroundColor: string;
  platformScrollbarColor: string;
  platformSelectionColor: string;
  platformSeparatorColor: string;
  platformPlaceholderColor: string;
  platformTextSelectionColor: string;
  platformButtonPrimaryColor: string;
  platformButtonBackgroundColor: string;
  platformMessageBackgroundColor: string;
  platformBackgroundImage: ImageResourceWrapperJson;
  platformBorderColor: string;
  platformSelectionTextColor: string;
  platformBaseLayerColor: string;
  platformMargin: number;
  platformBorderRadius: number;
  platformSelectionBorderRadius: number;
  platformNeedsShadow: boolean;
  productId: string | string[];
  product: string;
  productVideo: string;
  productFolder: string;
  technicalTerm: TechnicalTermJson;
  servings: ServingsJson;
  ratingLevelStart: RatingLevelStartEndJson;
  ratingLevelEnd: RatingLevelStartEndJson;
  ratingLevelSelected: number;

  book: string | BookJson[];

  title: JsonText;
  subtitle: JsonText;
  level: number;
  toc: boolean;
  progress: boolean;
  anchor: string;
  reference: string | string[]; // Has 2 meanings, depending on bit (anchor/reference, or @reference)
  referenceEnd: string;

  // All quizzes
  revealSolutions: boolean;

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
  previewImage: ImageResourceWrapperJson[];
  previewVideo: VideoResourceWrapperJson[];

  resource: ResourceJson;
  logos: ImageResourceWrapperJson[];
  images: ImageResourceWrapperJson[];

  body: JsonText | unknown; // unknown is for JSON body

  sampleSolution: string;
  additionalSolutions: string[];
  partialAnswer: string;
  elements: string[];
  statement: JsonText;
  isCorrect: boolean;
  cards: FlashcardJson[];
  definitions: DefinitionListItemJson[];
  descriptions: DefinitionListItemJson[];
  statements: StatementJson[];
  responses: ResponseJson[] | BotResponseJson[];
  feedbacks: FeedbackJson[];
  quizzes: QuizJson[];
  heading: HeadingJson;
  pairs: PairJson[];
  matrix: MatrixJson[];
  table: TableJson;
  tableExtended: TableExtendedJson;
  // DEPRECATED - REMOVE IN THE FUTURE
  // captionDefinitionList: CaptionDefinitionListJson;
  choices: ChoiceJson[];
  questions: QuestionJson[];
  ingredients: IngredientJson[];
  listItems: ListItemJson[];
  sections: ListItemJson[]; // sections is just a pseudonym for listItems
  bookReferences: BookReferenceJson[];

  footer: JsonText;

  placeholders: BodyBitsJson;
}

export interface BookJson {
  book: string;
  reference: string;
  referenceEnd: string;
}

export interface GroupTagJson {
  name: string;
  tags: string[];
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
  avatarImage: ImageResourceWrapperJson;
}

export interface MarkConfigJson {
  mark: string;
  color: string;
  emphasis: string;
}

export interface FlashcardJson {
  question: TextAndIconJson;
  answer: TextAndIconJson;
  alternativeAnswers: TextAndIconJson[];
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface DefinitionListItemJson {
  term: TextAndIconJson;
  definition: TextAndIconJson;
  alternativeDefinitions: TextAndIconJson[];
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface TextAndIconJson {
  text: JsonText;
  icon: ImageResourceWrapperJson;
}

export interface StatementJson {
  statement: JsonText;
  isCorrect: boolean;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface FeedbackChoiceJson {
  choice: string;
  requireReason: boolean;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  example: ExampleJson;
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface FeedbackReasonJson {
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  text: string;
  reasonableNumOfChars: number;
  isExample: boolean;
  example: ExampleJson;
  __textAst?: TextAst;
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
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
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
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
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface FeedbackJson {
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  // isExample: boolean;
  choices: FeedbackChoiceJson[];
  reason: FeedbackReasonJson;
  // __isDefaultExample?: boolean;
  // __defaultExample?: ExampleJson;
}

export interface QuizJson {
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isExample: boolean;
  choices: ChoiceJson[];
  responses: ResponseJson[];
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface HeadingJson {
  forKeys: string;
  forValues: string | string[];
  __forValuesDefault?: string | string[];
}

export interface PairJson {
  key: string;
  keyAudio: AudioResourceWrapperJson;
  keyImage: ImageResourceWrapperJson;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: ExampleJson;
  values: string[];
  __valuesAst?: TextAst[];
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
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
  __isDefaultExample?: boolean;
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
  __valuesAst?: TextAst[];
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface PronunciationTableCellJson {
  title: JsonText;
  body: JsonText;
  audio: AudioResourceWrapperJson;
}

export interface PronunciationTableJson {
  data: PronunciationTableCellJson[][];
}

export interface TableJson {
  columns: JsonText[];
  data: JsonText[][];
}

export interface TableExtendedJson {
  header?: TableSectionJson;
  body?: TableSectionJson;
  footer?: TableSectionJson;
}

export interface TableSectionJson {
  rows: TableRowJson[];
}

export interface TableRowJson {
  cells: TableCellJson[];
}

export interface TableCellJson {
  content: JsonText;
  title?: boolean;
  rowspan?: number;
  colspan?: number;
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup';
}

export interface QuestionJson {
  question: JsonText;
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
  __sampleSolutionAst?: TextAst;
  __isDefaultExample?: boolean;
  __defaultExample?: ExampleJson;
}

export interface BotResponseJson {
  response: string;
  reaction: string;
  feedback: string;
  item: string;
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
  ingredient: string;
  quantity: number;
  unit: string;
  unitAbbr: string;
  decimalPlaces: number;
  disableCalculation: boolean;
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
}

export interface RatingLevelStartEndJson {
  level: number;
  label?: JsonText;
}

// DEPRECATED - REMOVE IN THE FUTURE
// // CaptionDefinition

// export interface CaptionDefinitionJson {
//   term: string;
//   definition: string;
// }

// // CaptionDefinitionList (a.k.a Legend)

// export interface CaptionDefinitionListJson {
//   heading: string[];
//   definitions: CaptionDefinitionJson[];
// }

export interface ListItemJson {
  item: JsonText;
  lead: JsonText;
  hint: JsonText;
  instruction: JsonText;
  body: JsonText | unknown; // unknown is for JSON body
}

export interface BookReferenceJson {
  lang: string;
  refAuthor: string;
  refBookTitle: string[];
  refPublisher: string;
}

export type ExampleJson = JsonText | boolean | null;
