/**
 * BitmarPegParserTypes.ts
 * v0.0.1
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
} from '../../../model/ast/Nodes';

const CARD_DIVIDER = '===';
const CARD_SIDE_DIVIDER = '==';
const CARD_VARIANT_DIVIDER = '--';

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

export interface TypeKeyParseResult {
  cardSet?: TypeValue[];
  cardBody?: string;
  body?: Body;
  footer?: FooterText;
  trueFalse?: TrueFalseValue[];
  example?: string;
  isCorrect: boolean;
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
  extraProperties?: any;
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

export { TypeKey, CARD_DIVIDER, CARD_SIDE_DIVIDER, CARD_VARIANT_DIVIDER };
