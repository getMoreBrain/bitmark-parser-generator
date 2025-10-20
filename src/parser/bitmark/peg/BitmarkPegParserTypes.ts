/**
 * BitmarPegParserTypes.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */

import { type EnumType, superenum } from '@ncoderz/superenum';

import { type BreakscapedString } from '../../../model/ast/BreakscapedString.ts';
import {
  type Body,
  type CardBit,
  type ExtraProperties,
  type Footer,
} from '../../../model/ast/Nodes.ts';
import { type JsonText, type TextAst } from '../../../model/ast/TextNodes.ts';
import { BitConfig } from '../../../model/config/BitConfig.ts';
import { type TagsConfig } from '../../../model/config/TagsConfig.ts';
import { type BitTypeType } from '../../../model/enum/BitType.ts';
import type { ResourceTypeType } from '../../../model/enum/ResourceType.ts';
import { Tag } from '../../../model/enum/Tag.ts';
import { type TextFormatType } from '../../../model/enum/TextFormat.ts';
import {
  type BookJson,
  type BotResponseJson,
  type ChoiceJson,
  type DefinitionListItemJson,
  type ExampleJson,
  type FeedbackChoiceJson,
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
} from '../../../model/json/BitJson.ts';
import { type ImageResourceJson, type ResourceJson } from '../../../model/json/ResourceJson.ts';
import { type ParserData } from '../../../model/parser/ParserData.ts';
import { type ParserError } from '../../../model/parser/ParserError.ts';
import { type ParserInfo } from '../../../model/parser/ParserInfo.ts';
import { PeggyGrammarLocation } from './PeggyGrammarLocation.ts';

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
  resourceType?: ResourceTypeType;
  bitLevel: number;
  isCommented?: boolean;
}

export interface TrueFalseValue {
  text: string;
  isCorrect: boolean;
  example?: ExampleJson;
  __isDefaultExample: boolean;
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
  groupTag?: Partial<GroupTagJson>[];
  tag?: string[];
  imageSource?: Partial<ImageSourceJson>;
  technicalTerm?: Partial<TechnicalTermJson>;
  servings?: Partial<ServingsJson>;
  ratingLevelStart?: Partial<RatingLevelStartEndJson>;
  ratingLevelEnd?: Partial<RatingLevelStartEndJson>;
  label?: TextAst;
  person?: Partial<PersonJson>;
  propertyTitle?: BreakscapedString;
  trueFalse?: TrueFalseValue[];
  lang?: BreakscapedString;
  example?: ExampleJson;
  isCorrect?: boolean;
  markConfig?: Partial<MarkConfigJson>[];
  solutions?: string[];
  __solutionsAst?: TextAst[];
  statement?: Partial<StatementJson>;
  statements?: Partial<StatementJson>[];
  feedbackChoices?: Partial<FeedbackChoiceJson>[];
  choices?: Partial<ChoiceJson>[];
  responses?: Partial<ResponseJson>[];
  solution?: BreakscapedString;
  mark?: BreakscapedString[];
  title?: { titleAst: TextAst; titleString: string }[];
  // title?: TextAst[];
  // subtitle?: BreakscapedString;
  propertyStyleResources?: { [key: string]: ResourceJson };
  resources?: ResourceJson[];
  itemLead?: TextAst[];
  item?: JsonText;
  itemString?: string;
  lead?: TextAst;
  pageNumber?: TextAst;
  marginNumber?: TextAst;
  instruction?: TextAst;
  __instructionString?: string;
  hint?: TextAst;
  __hintString?: string;
  anchor?: string;
  book?: string | BookJson[];
  reference?: string;
  referenceEnd?: string;
  sampleSolution?: string;
  __sampleSolutionAst?: TextAst;
  additionalSolutions?: string[];
  isCaseSensitive?: boolean;
  reaction?: BreakscapedString;
  license?: string;
  copyright?: string;
  showInIndex?: boolean;
  caption?: TextAst;
  src1x?: string;
  src2x?: string;
  src3x?: string;
  src4x?: string;
  width?: string;
  height?: string;
  alt?: string;
  // duration?: BreakscapedString | BreakscapedString[]; // number? - there is a collision between duration at bit level, and duration in resource.
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  posterImage?: /*ImageResourceJson |*/ string;
  siteName?: string;
  imageSourceUrl?: string;
  image?: Partial<ImageResourceJson>;
  mockupId?: BreakscapedString;
  size?: number;
  format?: BreakscapedString;
  unit?: BreakscapedString;
  unitAbbr?: BreakscapedString;
  decimalPlaces?: number;
  disableCalculation?: boolean;

  extraProperties?: ExtraProperties;
  internalComments?: BreakscapedString[];

  __isDefaultExample?: boolean;
}

export interface BitSpecificTitles {
  title?: TextAst;
  titleString?: string;
  subtitle?: TextAst;
  subtitleString?: string;
  level?: number;
}

export interface StatementsOrChoicesOrResponses {
  statements?: Partial<StatementJson>[];
  choices?: Partial<ChoiceJson>[];
  responses?: Partial<ResponseJson>[];
}

export interface BitSpecificCards {
  sampleSolution?: string; // ??
  elements?: string[];
  flashcards?: Partial<FlashcardJson>[];
  definitions?: Partial<DefinitionListItemJson>[];
  statements?: Partial<StatementJson>[];
  responses?: Partial<ResponseJson>[];
  feedbacks?: Partial<FeedbackJson>[];
  quizzes?: Partial<QuizJson>[];
  heading?: Partial<HeadingJson>;
  pairs?: Partial<PairJson>[];
  matrix?: Partial<MatrixJson>[];
  choices?: Partial<ChoiceJson>[];
  questions?: Partial<QuestionJson>[];
  pronunciationTable?: Partial<PronunciationTableJson>;
  table?: Partial<TableJson>;
  botResponses?: Partial<BotResponseJson>[];
  ingredients?: Partial<IngredientJson>[];
  // DEPRECATED - TO BE REMOVED IN THE FUTURE
  // captionDefinitionList?: Partial<CaptionDefinitionListJson>;
  cardBits?: Partial<CardBit>[];
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
  ItemLead: Tag.tag_item,
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
  bitConfig: BitConfig;
  bitType: BitTypeType;
  textFormat: TextFormatType;
  resourceType?: ResourceTypeType;

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
  ContentDepth as BitContentLevel,
  CARD_DIVIDER_V1,
  CARD_DIVIDER_V2,
  CARD_SIDE_DIVIDER_V1,
  CARD_SIDE_DIVIDER_V2,
  CARD_VARIANT_DIVIDER_V1,
  CARD_VARIANT_DIVIDER_V2,
  TypeKey,
};
