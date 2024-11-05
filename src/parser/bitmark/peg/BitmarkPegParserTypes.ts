/**
 * BitmarPegParserTypes.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */

import { EnumType, superenum } from '@ncoderz/superenum';

import { BreakscapedString } from '../../../model/ast/BreakscapedString';
import { JsonText, TextAst } from '../../../model/ast/TextNodes';
import { TagsConfig } from '../../../model/config/TagsConfig';
import { BitTypeType } from '../../../model/enum/BitType';
import { ResourceTagType } from '../../../model/enum/ResourceTag';
import { Tag } from '../../../model/enum/Tag';
import { TextFormatType } from '../../../model/enum/TextFormat';
import { ParserData } from '../../../model/parser/ParserData';
import { ParserError } from '../../../model/parser/ParserError';
import { ParserInfo } from '../../../model/parser/ParserInfo';

import { PeggyGrammarLocation } from './PeggyGrammarLocation';

import {
  Body,
  Statement,
  Response,
  Quiz,
  Heading,
  Pair,
  Matrix,
  Choice,
  Question,
  Resource,
  BotResponse,
  Person,
  ExtraProperties,
  ImageResource,
  MarkConfig,
  Flashcard,
  ImageSource,
  CardBit,
  Ingredient,
  TechnicalTerm,
  Table,
  Servings,
  RatingLevelStartEnd,
  CaptionDefinitionList,
  DescriptionListItem,
  Footer,
} from '../../../model/ast/Nodes';
import {
  ChoiceJson,
  DescriptionListItemJson,
  ExampleJson,
  FlashcardJson,
  HeadingJson,
  PairJson,
  QuestionJson,
  QuizJson,
  ResponseJson,
  StatementJson,
} from '../../../model/json/BitJson';

const CARD_DIVIDER_V2 = '====';
const CARD_SIDE_DIVIDER_V2 = '--';
const CARD_VARIANT_DIVIDER_V2 = '++';

const CARD_DIVIDER_V1 = '===';
const CARD_SIDE_DIVIDER_V1 = '==';
const CARD_VARIANT_DIVIDER_V1 = '--';

export interface ParseOptions {
  startRule?: string;
  grammarSource?: PeggyGrammarLocation | unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tracer?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParseFunction = (input: string, options?: ParseOptions) => any;

export interface ParserHelperOptions {
  parse: ParseFunction;
  parserText: () => ParserError['text'];
  parserLocation: () => ParserError['location'];
}

export interface SubParserResult<T> {
  value?: T;
  errors?: ParserError[];
}

export interface RawTextAndResourceType {
  textFormat?: string;
  resourceType?: string;
}

export interface BitHeader {
  bitType: BitTypeType;
  textFormat: TextFormatType;
  resourceType?: ResourceTagType;
  bitLevel: number;
  isCommented?: boolean;
}

export interface TrueFalseValue {
  text: BreakscapedString;
  isCorrect: boolean;
  isDefaultExample: boolean;
  example?: ExampleJson;
}

export interface CardData {
  cardIndex: number;
  cardSideIndex: number;
  cardVariantIndex: number;
  value: string;
}

export interface BitContentProcessorResult {
  cardSet?: ParsedCardSet;
  cardBody?: Body;
  cardBodyStr?: string;
  body?: Body;
  footer?: Footer;
  imageSource?: ImageSource;
  technicalTerm?: TechnicalTerm;
  servings?: Servings;
  ratingLevelStart?: RatingLevelStartEnd;
  ratingLevelEnd?: RatingLevelStartEnd;
  label?: TextAst;
  person?: Person;
  propertyTitle?: BreakscapedString;
  trueFalse?: TrueFalseValue[];
  isDefaultExample?: boolean;
  lang?: BreakscapedString;
  example?: ExampleJson;
  isCorrect?: boolean;
  markConfig?: MarkConfig[];
  solutions?: string[];
  _solutionsAst?: TextAst[];
  statement?: StatementJson;
  statements?: StatementJson[];
  choices?: ChoiceJson[];
  responses?: ResponseJson[];
  solution?: BreakscapedString;
  mark?: BreakscapedString[];
  title?: BreakscapedString[];
  subtitle?: BreakscapedString;
  propertyStyleResources?: { [key: string]: Resource };
  resources?: Resource[];
  itemLead?: TextAst[];
  item?: TextAst;
  itemString?: string;
  lead?: TextAst;
  pageNumber?: TextAst;
  marginNumber?: TextAst;
  instruction?: TextAst;
  _instructionString?: string;
  hint?: TextAst;
  _hintString?: string;
  anchor?: string;
  book?: BreakscapedString;
  reference?: string;
  referenceEnd?: string;
  sampleSolution?: string;
  _sampleSolutionAst?: TextAst;
  additionalSolutions?: string[];
  isCaseSensitive?: boolean;
  reaction?: BreakscapedString;
  license?: BreakscapedString;
  copyright?: BreakscapedString;
  showInIndex?: boolean;
  caption?: BreakscapedString;
  src1x?: BreakscapedString;
  src2x?: BreakscapedString;
  src3x?: BreakscapedString;
  src4x?: BreakscapedString;
  width?: string;
  height?: string;
  alt?: BreakscapedString;
  // duration?: BreakscapedString | BreakscapedString[]; // number? - there is a collision between duration at bit level, and duration in resource.
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  posterImage?: ImageResource | BreakscapedString;
  siteName?: BreakscapedString;
  imageSourceUrl?: BreakscapedString;
  mockupId?: BreakscapedString;
  size?: number;
  format?: BreakscapedString;
  unit?: BreakscapedString;
  unitAbbr?: BreakscapedString;
  decimalPlaces?: number;
  disableCalculation?: boolean;

  extraProperties?: ExtraProperties;
  internalComments?: BreakscapedString[];
}

export interface BitSpecificTitles {
  title?: TextAst;
  subtitle?: TextAst;
  level?: number;
}

export interface StatementsOrChoicesOrResponses {
  statements?: StatementJson[];
  choices?: ChoiceJson[];
  responses?: ResponseJson[];
}

export interface BitSpecificCards {
  sampleSolution?: string; // ??
  elements?: string[];
  flashcards?: FlashcardJson[];
  descriptions?: DescriptionListItemJson[];
  statements?: StatementJson[];
  responses?: ResponseJson[];
  quizzes?: QuizJson[];
  heading?: HeadingJson;
  pairs?: PairJson[];
  matrix?: Matrix[];
  choices?: ChoiceJson[];
  questions?: QuestionJson[];
  table?: Table;
  botResponses?: BotResponse[];
  ingredients?: Ingredient[];
  captionDefinitionList?: CaptionDefinitionList;
  cardBits?: CardBit[];
  internalComments?: string[]; // ??
}

export type BitContent = TypeValue | TypeKeyValue;

export interface TypeValue<T = unknown> extends ParserData {
  type: string;
  value?: T;
  chain?: BitContent[];
}

export interface TypeKeyValue<T = unknown> extends ParserData {
  type: string;
  key: string;
  value?: T;
  chain?: BitContent[];
}

const TypeKey = superenum({
  // Bit header
  TextFormat: 'TextFormat',
  ResourceType: 'ResourceType',

  // Tags (NOTE: ALL TAGS MUST USE THEIR CORRECT BITMARK REPRESENTATION HERE so they work with the rest of the code)
  Title: Tag.tag_title,
  Anchor: Tag.tag_anchor,
  Reference: Tag.tag_reference,
  ItemLead: Tag.tag_itemLead,
  Instruction: Tag.tag_instruction,
  Hint: Tag.tag_hint,
  True: Tag.tag_true,
  False: Tag.tag_false,
  Gap: Tag.tag_gap,
  Mark: Tag.tag_mark,
  SampleSolution: Tag.tag_sampleSolution,

  // Generic Tags (converted to specific tags by the BitTagValidator)
  Property: 'Property',
  Resource: 'Resource',
  TagChain: 'TagChain',

  // Text
  BodyChar: 'BodyChar',
  BodyText: 'BodyText',
  BodyTextPlain: 'BodyTextPlain',

  // Card Set
  CardSet: 'CardSet',
  Card: 'Card',
  CardChar: 'CardChar',
  CardText: 'CardText',

  // Chains
  GapChain: 'GapChain',
  TrueFalseChain: 'TrueFalseChain',

  // Dividers
  PlainTextDivider: 'PlainTextDivider',
  FooterDivider: 'FooterDivider',
});

export type TypeKeyType = EnumType<typeof TypeKey>;

const ContentDepth = superenum({
  Bit: 'Bit',
  Card: 'Card',
  Chain: 'Chain',
});

export type ContentDepthType = EnumType<typeof ContentDepth>;

// Card Set

export interface UnparsedCardSet {
  cards: UnparsedCard[];
}

export interface UnparsedCard {
  sides: UnparsedCardSide[];
}

export interface UnparsedCardSide {
  variants: UnparsedCardContent[];
}

interface UnparsedCardContent extends ParserData {
  value: string;
}

export interface ParsedCardSet {
  cards: ParsedCard[];
}

export interface ParsedCard {
  sides: ParsedCardSide[];
}

export interface ParsedCardSide {
  variants: ParsedCardContent[];
}

interface ParsedCardContent extends ParserData {
  content: BitContent[];
}

export interface ProcessedCardSet {
  cards: ProcessedCard[];
  internalComments: BreakscapedString[];
}

export interface ProcessedCard {
  no: number;
  sides: ProcessedCardSide[];
}

export interface ProcessedCardSide {
  no: number;
  variants: ProcessedCardVariant[];
}

export interface ProcessedCardVariant extends ParserData {
  no: number;
  data: BitContentProcessorResult;
}

// Context

export interface BitmarkPegParserContext {
  DEBUG_BIT_RAW: boolean;
  DEBUG_BIT_CONTENT_RAW: boolean;
  DEBUG_BIT_CONTENT: boolean;
  DEBUG_BIT_TAGS: boolean;
  DEBUG_BODY: boolean;
  DEBUG_FOOTER: boolean;
  DEBUG_CHAIN_CONTENT: boolean;
  DEBUG_CHAIN_TAGS: boolean;
  DEBUG_CARD_SET_CONTENT: boolean;
  DEBUG_CARD_SET: boolean;
  DEBUG_CARD_TAGS: boolean;

  parser: ParserInfo;

  parse: ParseFunction;
  bitContentProcessor(
    contentDepth: ContentDepthType,
    bitType: BitTypeType,
    textFormat: TextFormatType,
    tagsConfig: TagsConfig | undefined,
    data: BitContent[] | undefined,
  ): BitContentProcessorResult;
  splitBitContent(bitContent: BitContent[], types: TypeKeyType[]): BitContent[][];
  addWarning(message: string, parserData?: ParserData, parserDataOriginal?: ParserData): void;
  addError(message: string, parserData?: ParserData, parserDataOriginal?: ParserData): void;
  debugPrint(header: string, data: unknown): void;

  // Parser global parse state
  state: object;
}

export {
  TypeKey,
  ContentDepth as BitContentLevel,
  CARD_DIVIDER_V2,
  CARD_SIDE_DIVIDER_V2,
  CARD_VARIANT_DIVIDER_V2,
  CARD_DIVIDER_V1,
  CARD_SIDE_DIVIDER_V1,
  CARD_VARIANT_DIVIDER_V1,
};
