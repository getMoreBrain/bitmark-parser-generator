/**
 * BitmarPegParserTypes.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnumType, superenum } from '@ncoderz/superenum';

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
} from '../../../model/ast/Nodes';

const CARD_DIVIDER_V2 = '===';
const CARD_SIDE_DIVIDER_V2 = '---';
const CARD_VARIANT_DIVIDER_V2 = '~~~';

const CARD_DIVIDER_V1 = '===';
const CARD_SIDE_DIVIDER_V1 = '==';
const CARD_VARIANT_DIVIDER_V1 = '--';

export interface ParseOptions {
  filename?: string;
  startRule?: string;
  tracer?: any;
  [key: string]: any;
}
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
  cardSet?: TypeValue[];
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
  reference?: string;
  sampleSolution?: string;
  isShortAnswer?: boolean;
  isCaseSensitive?: boolean;
  reaction?: string;
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

export interface TypeValue extends ParserData {
  type: string;
  value?: unknown;
}

export interface TypeKeyValue extends ParserData {
  type: string;
  key: string;
  value?: unknown;
}

export interface TypeKeyResource extends ParserData {
  type: string;
  key: string;
  url: string;
}

const TypeKey = superenum({
  TextFormat: 'TextFormat',
  ResourceType: 'ResourceType',
  Resource: 'Resource',
  ResourceProperty: 'ResourceProperty',
  Title: 'Title',
  Anchor: 'Anchor',
  Reference: 'Reference',
  Property: 'Property',
  ItemLead: 'ItemLead',
  Instruction: 'Instruction',
  Hint: 'Hint',
  True: 'True',
  False: 'False',
  PartnerChain: 'PartnerChain',
  GapChain: 'GapChain',
  TrueFalseChain: 'TrueFalseChain',
  Cloze: 'Cloze',
  SampleSolution: 'SampleSolution',
  BodyChar: 'BodyChar',
  BodyText: 'BodyText',
  CardSet: 'CardSet',
  Card: 'Card',
  CardChar: 'CardChar',
  CardText: 'CardText',
  Comment: 'Comment',
});

export type TypeKeyType = EnumType<typeof TypeKey>;

const BitContentLevel = superenum({
  Bit: 'Bit',
  Statement: 'Statement',
  Choice: 'Choice',
  Response: 'Response',
  PartnerChain: 'PartnerChain',
  GapChain: 'GapChain',
  HighlightChain: 'HighlightChain',
  SelectChain: 'SelectChain',
  CardElement: 'CardElement',
  CardStatements: 'CardStatements',
  CardQuiz: 'CardQuiz',
  CardQuestion: 'CardQuestion',
  CardMatch: 'CardMatch',
  CardMatrix: 'CardMatrix',
  CardBotResponse: 'CardBotResponse',
});

export type BitContentLevelType = EnumType<typeof BitContentLevel>;

export interface BitmarkPegParserContext {
  DEBUG_BIT_RAW: boolean;
  DEBUG_BIT_CONTENT_RAW: boolean;
  DEBUG_BIT_CONTENT: boolean;
  DEBUG_BIT_TAGS: boolean;
  DEBUG_BODY: boolean;
  DEBUG_FOOTER: boolean;
  DEBUG_PARTNER_CONTENT: boolean;
  DEBUG_PARTNER_TAGS: boolean;
  DEBUG_GAP_CONTENT: boolean;
  DEBUG_GAP_TAGS: boolean;
  DEBUG_SELECT_CONTENT: boolean;
  DEBUG_SELECT_TAGS: boolean;
  DEBUG_HIGHLIGHT_CONTENT: boolean;
  DEBUG_HIGHLIGHT_TAGS: boolean;
  DEBUG_TRUE_FALSE_V1_CONTENT: boolean;
  DEBUG_TRUE_FALSE_V1_TAGS: boolean;
  DEBUG_CHOICE_RESPONSE_V1_CONTENT: boolean;
  DEBUG_CHOICE_RESPONSE_V1_TAGS: boolean;
  DEBUG_CARD_SET_CONTENT: boolean;
  DEBUG_CARD_SET: boolean;
  DEBUG_CARD_PARSED: boolean;
  DEBUG_CARD_TAGS: boolean;

  parser: ParserInfo;

  parse: ParseFunction;
  bitContentProcessor(
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
    validTypes: TypeKeyType[],
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
