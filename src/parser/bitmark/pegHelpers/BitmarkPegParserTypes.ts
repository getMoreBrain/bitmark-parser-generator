/**
 * BitmarPegParserTypes.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */

import { EnumType, superenum } from '@ncoderz/superenum';

import { CardSet } from '../../../model/ast/CardSet';
import { BitTypeType } from '../../../model/enum/BitType';
import { ResourceTypeType } from '../../../model/enum/ResourceType';
import { TextFormatType } from '../../../model/enum/TextFormat';
import { ParserData } from '../../../model/parser/ParserData';
import { ParserError } from '../../../model/parser/ParserError';
import { ParserInfo } from '../../../model/parser/ParserInfo';

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
} from '../../../model/ast/Nodes';

const CARD_DIVIDER_V2 = '====';
const CARD_SIDE_DIVIDER_V2 = '--';
const CARD_VARIANT_DIVIDER_V2 = '~~';

const CARD_DIVIDER_V1 = '===';
const CARD_SIDE_DIVIDER_V1 = '==';
const CARD_VARIANT_DIVIDER_V1 = '--';

export interface ParseOptions {
  filename?: string;
  startRule?: string;
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

export interface BitHeader {
  bitType?: BitTypeType;
  textFormat?: TextFormatType;
  resourceType?: ResourceTypeType;
}

export interface TrueFalseValue {
  text: string;
  isCorrect: boolean;
}

export interface CardData {
  cardIndex: number;
  cardSideIndex: number;
  cardVariantIndex: number;
  value: string;
}

export interface BitContentProcessorResult {
  cardSet?: CardSet;
  cardBody?: string;
  body?: Body;
  footer?: FooterText;
  partner?: Partner;
  trueFalse?: TrueFalseValue[];
  example?: string;
  isCorrect?: boolean;
  solutions?: string[];
  statement?: Statement;
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
  title?: string[];
  subtitle?: string;
  resources?: Resource[];
  item?: string;
  lead?: string;
  instruction?: string;
  hint?: string;
  anchor?: string;
  book?: string;
  reference?: string;
  referenceEnd?: string;
  sampleSolution?: string;
  isShortAnswer?: boolean;
  isCaseSensitive?: boolean;
  reaction?: string;
  license?: string;
  copyright?: string;
  showInIndex?: boolean;
  caption?: string;
  src1x?: string;
  src2x?: string;
  src3x?: string;
  src4x?: string;
  width?: number;
  height?: number;
  alt?: string;
  // duration?: string | string[]; // number? - there is a collision between duration at bit level, and duration in resource.
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  posterImage?: ImageResource;
  siteName?: string;

  extraProperties?: ExtraProperties;
}

export interface BitSpecificTitles {
  title?: string;
  subtitle?: string;
  level?: number;
}

export interface StatementsOrChoicesOrResponses {
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
}

export interface BitSpecificCards {
  sampleSolution?: string | string[];
  elements?: string[];
  statements?: Statement[];
  responses?: Response[];
  quizzes?: Quiz[];
  heading?: Heading;
  pairs?: Pair[];
  matrix?: Matrix[];
  choices?: Choice[];
  questions?: Question[];
  botResponses?: BotResponse[];
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

  // Tags
  Title: 'Title',
  Anchor: 'Anchor',
  Reference: 'Reference',
  ItemLead: 'ItemLead',
  Instruction: 'Instruction',
  Hint: 'Hint',
  True: 'True',
  False: 'False',
  Gap: 'Gap',
  SampleSolution: 'SampleSolution',
  Comment: 'Comment',

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
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[] | undefined,
    /*validTypes: TypeKeyType[],*/
  ): BitContentProcessorResult;
  splitBitContent(bitContent: BitContent[], types: TypeKeyType[]): BitContent[][];
  addWarning(message: string, parserData?: ParserData, parserDataOriginal?: ParserData): void;
  addError(message: string, parserData?: ParserData, parserDataOriginal?: ParserData): void;
  debugPrint(header: string, data: unknown): void;
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
