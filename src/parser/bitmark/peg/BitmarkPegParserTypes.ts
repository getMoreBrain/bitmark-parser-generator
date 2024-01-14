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
  FooterText,
  BotResponse,
  Partner,
  ExtraProperties,
  ImageResource,
  MarkConfig,
  Flashcard,
  ImageSource,
  CardBit,
} from '../../../model/ast/Nodes';

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
}

export interface TrueFalseValue {
  text: BreakscapedString;
  isCorrect: boolean;
  isDefaultExample: boolean;
  example?: BreakscapedString;
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
  cardBodyStr?: BreakscapedString;
  body?: Body;
  footer?: FooterText;
  imageSource?: ImageSource;
  partner?: Partner;
  trueFalse?: TrueFalseValue[];
  isDefaultExample?: boolean;
  example?: BreakscapedString;
  isCorrect?: boolean;
  markConfig?: MarkConfig[];
  solutions?: BreakscapedString[];
  statement?: Statement;
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
  solution?: BreakscapedString;
  mark?: BreakscapedString[];
  title?: BreakscapedString[];
  subtitle?: BreakscapedString;
  resources?: Resource[];
  itemLead?: BreakscapedString[];
  item?: BreakscapedString;
  lead?: BreakscapedString;
  pageNumber?: BreakscapedString;
  marginNumber?: BreakscapedString;
  instruction?: BreakscapedString;
  hint?: BreakscapedString;
  anchor?: BreakscapedString;
  book?: BreakscapedString;
  reference?: BreakscapedString;
  referenceEnd?: BreakscapedString;
  sampleSolution?: BreakscapedString;
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

  extraProperties?: ExtraProperties;
  internalComments?: BreakscapedString[];
}

export interface BitSpecificTitles {
  title?: BreakscapedString;
  subtitle?: BreakscapedString;
  level?: number;
}

export interface StatementsOrChoicesOrResponses {
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
}

export interface BitSpecificCards {
  sampleSolution?: BreakscapedString;
  elements?: BreakscapedString[];
  flashcards?: Flashcard[];
  statements?: Statement[];
  responses?: Response[];
  quizzes?: Quiz[];
  heading?: Heading;
  pairs?: Pair[];
  matrix?: Matrix[];
  choices?: Choice[];
  questions?: Question[];
  botResponses?: BotResponse[];
  cardBits?: CardBit[];
  internalComments?: BreakscapedString[];
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
  Title: Tag.title,
  Anchor: Tag.anchor,
  Reference: Tag.reference,
  ItemLead: Tag.itemLead,
  Instruction: Tag.instruction,
  Hint: Tag.hint,
  True: Tag.true,
  False: Tag.false,
  Gap: Tag.gap,
  Mark: Tag.mark,
  SampleSolution: Tag.sampleSolution,

  // Generic Tags (converted to specific tags by the BitTagValidator)
  Property: 'Property',
  Resource: 'Resource',
  TagChain: 'TagChain',

  // Text
  BodyChar: 'BodyChar',
  BodyText: 'BodyText',

  // Card Set
  CardSet: 'CardSet',
  Card: 'Card',
  CardChar: 'CardChar',
  CardText: 'CardText',

  // Chains
  GapChain: 'GapChain',
  TrueFalseChain: 'TrueFalseChain',
});

export type TypeKeyType = EnumType<typeof TypeKey>;

const BitContentLevel = superenum({
  Bit: 'Bit',
  Card: 'Card',
  Chain: 'Chain',
});

export type BitContentLevelType = EnumType<typeof BitContentLevel>;

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
    bitType: BitTypeType,
    textFormat: TextFormatType,
    bitLevel: BitContentLevelType,
    tagsConfig: TagsConfig | undefined,
    data: BitContent[] | undefined,
  ): BitContentProcessorResult;
  splitBitContent(bitContent: BitContent[], types: TypeKeyType[]): BitContent[][];
  addWarning(message: string, parserData?: ParserData, parserDataOriginal?: ParserData): void;
  addError(message: string, parserData?: ParserData, parserDataOriginal?: ParserData): void;
  debugPrint(header: string, data: unknown): void;

  // Parser global parse state
  state: {
    //
  };
}

export {
  TypeKey,
  BitContentLevel,
  CARD_DIVIDER_V2,
  CARD_SIDE_DIVIDER_V2,
  CARD_VARIANT_DIVIDER_V2,
  CARD_DIVIDER_V1,
  CARD_SIDE_DIVIDER_V1,
  CARD_VARIANT_DIVIDER_V1,
};
