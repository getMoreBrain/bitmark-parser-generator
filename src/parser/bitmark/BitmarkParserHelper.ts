/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnumType, superenum } from '@ncoderz/superenum';

import { Builder } from '../../ast/Builder';
import { Card, CardSet, CardSide } from '../../model/ast/CardSet';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { PropertyKey } from '../../model/enum/PropertyKey';
import { ResourceType, ResourceTypeType } from '../../model/enum/ResourceType';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { ParserError } from '../../model/parser/ParserError';
import { StringUtils } from '../../utils/StringUtils';

import {
  Bit,
  BitmarkAst,
  BodyPart,
  Body,
  Gap,
  Select,
  SelectOption,
  Statement,
  Response,
  Quiz,
  Heading,
  Pair,
  Matrix,
  Choice,
  Question,
} from '../../model/ast/Nodes';

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

interface BitHeader {
  bitType?: BitTypeType;
  textFormat?: TextFormatType;
  resourceType?: ResourceTypeType;
}

interface CardData {
  cardIndex: number;
  cardSideIndex: number;
  cardVariantIndex: number;
  value: string;
}

export interface TypeKeyParseResult {
  cardSet?: TypeValue[];
  body?: string;
  // solutions?: string[];
  trueFalse?: {
    text: string;
    isCorrect: boolean;
  }[];
  isCorrect: boolean;
  responses?: Response[];
  choices?: Choice[];
}

export interface BitSpecificCards {
  sampleSolutions?: string | string[];
  elements?: string[];
  statements?: Statement[];
  responses?: Response[];
  quizzes?: Quiz[];
  heading?: Heading;
  pairs?: Pair[];
  matrix?: Matrix[];
  choices?: Choice[];
  questions?: Question[];
}

type BitContent = string | TypeValue | TypeKeyValue;

interface TypeValue {
  type: string;
  value?: unknown;
}

interface TypeKeyValue {
  type: string;
  key: string;
  value?: unknown;
}

const TypeKey = superenum({
  TextFormat: 'TextFormat',
  ResourceType: 'ResourceType',
  Property: 'Property',
  ItemLead: 'ItemLead',
  Instruction: 'Instruction',
  Hint: 'Hint',
  True: 'True',
  False: 'False',
  BodyLine: 'BodyLine',
  BodyChar: 'BodyChar',
  CardSet: 'CardSet',
  Card: 'Card',
  Gap: 'Gap',
  Cloze: 'Cloze',
  Select: 'Select',
  SampleSolution: 'SampleSolution',
});

export type TypeKeyType = EnumType<typeof TypeKey>;

const builder = new Builder();

class BitmarkParserHelper {
  private nonFatalErrors: ParserError[] = [];
  private cardIndex = 0;
  private cardSideIndex = 0;
  private cardVariantIndex = 0;
  private cardSectionLineCount = 0;
  private parse: ParseFunction;
  private parserText: () => ParserError['text'];
  private parserLocation: () => ParserError['location'];

  constructor(options: ParserHelperOptions) {
    this.parse = options.parse;
    this.parserText = options.parserText;
    this.parserLocation = options.parserLocation;
  }

  // Build bits
  buildBits(bits: (Bit | undefined)[]): BitmarkAst {
    const res = builder.bitmark({
      bits: bits.filter((bit) => !!bit) as Bit[],
      errors: this.nonFatalErrors.length > 0 ? this.nonFatalErrors : undefined,
    });

    return res;
  }

  // Build bit
  buildBit(bitHeader: BitHeader, bitContent: BitContent[]): Bit | undefined {
    const { bitType, textFormat, resourceType } = bitHeader;

    // Bit type was invalid, so ignore the bit
    if (!bitType) return undefined;

    // Parse the bit content into a an object with the appropriate keys
    const {
      cardSet,
      body: unparsedBody,
      ...tags
    } = this.typeKeyDataParser(bitContent, [
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
      TypeKey.BodyLine,
      TypeKey.CardSet,
    ]);

    console.log(`==== tags ====`);
    console.log(tags);
    console.log(`==== END: tags ====`);

    console.log(`==== unparsedBody ====`);
    console.log(unparsedBody);
    console.log(`==== END: unparsedBody ====`);

    // Parse the body
    const parsedBody = this.parse(unparsedBody ?? '', {
      startRule: 'body',
    });
    // console.log(`==== parsedBody ====`);
    // console.log(JSON.stringify(parsedBody, null, 2));
    // console.log(`==== END: parsedBody ====`);

    const bitSpecificCards = cardSet ? this.buildCards(bitType, cardSet) : {};

    // Build the body (parts and placeholders)
    const body = this.buildBody(parsedBody);
    // console.log(`==== body ====`);
    // console.log(JSON.stringify(body, null, 2));
    // console.log(`==== END: body ====`);

    // const bit: Bit = {
    //   bitType,
    //   textFormat,
    //   resourceType,
    //   ...mappedBitContent,
    //   content: bitContent,
    // } as Bit;

    // Build the final bit
    const bit = builder.bit({
      bitType,
      textFormat,
      // resourceType,
      ...tags,
      ...bitSpecificCards,
      body,
    });

    // (bit as any).bitSpecificCards = bitSpecificCards;
    // (bit as any).cardSet = cardSet;
    (bit as any).resourceType = resourceType;

    return bit;
  }

  // Build bit header
  buildBitHeader(bitType: string, textFormatAndResourceType: Partial<BitHeader>): BitHeader {
    // Get / check bit type
    const validBitType = BitType.fromValue(bitType);
    if (!validBitType) {
      this.addError(`Invalid bit type: ${bitType}`);
    }

    return {
      bitType: validBitType,
      ...textFormatAndResourceType,
    };
  }

  // Build text and resource type
  buildTextAndResourceType(value1: TypeValue | undefined, value2: TypeValue | undefined): Partial<BitHeader> {
    const res: Partial<BitHeader> = { textFormat: TextFormat.bitmarkMinusMinus };
    const processValue = (value: TypeValue | undefined) => {
      if (value) {
        if (value.type === TypeKey.TextFormat) {
          // Parse text format, adding default if not set / invalid
          res.textFormat = TextFormat.fromValue(value.value);
          if (value.value && !res.textFormat) {
            this.addError(`Invalid text format '${value.value}', defaulting to '${TextFormat.bitmarkMinusMinus}'`);
          }
          res.textFormat = res.textFormat ?? TextFormat.bitmarkMinusMinus;
        } else {
          // Parse resource type, adding error if invalid
          res.resourceType = ResourceType.fromValue(value.value);
          if (value.value && !res.resourceType) {
            this.addError(
              `Invalid resource type '${value.value}', Resource type will be implied automatically if a resource is present`,
            );
          }
        }
      }
    };
    processValue(value1);
    processValue(value2);

    return res;
  }

  buildBody(bodyContent: BitContent[]): Body {
    const bodyParts: BodyPart[] = [];
    let bodyPart = '';

    const buildBodyText = () => {
      if (bodyPart) {
        const bodyText = builder.bodyText({
          text: bodyPart,
        });
        bodyPart = '';
        bodyParts.push(bodyText);
      }
    };

    for (const content of bodyContent) {
      const { type, value } = content as TypeValue;
      if (type === TypeKey.BodyChar) {
        bodyPart += value;
      } else if (type === TypeKey.Gap) {
        buildBodyText();
        const gap = this.buildGap(value as BitContent[]);
        if (gap) bodyParts.push(gap);
      } else if (type === TypeKey.Select) {
        buildBodyText();
        const select = this.buildSelect(value as BitContent[]);
        if (select) bodyParts.push(select);
      }
    }

    // Build the last body text part
    buildBodyText();

    return builder.body({ bodyParts });
  }

  buildGap(gapContent: BitContent[]): Gap | undefined {
    // const solutions: string[] = [];
    // const seenItem = false;

    const tags = this.typeKeyDataParser(gapContent, [
      TypeKey.Cloze,
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
    ]);

    const gap = builder.gap({
      solutions: [],
      ...tags,
    });

    return gap;
  }

  buildSelect(selectContent: BitContent[]): Select | undefined {
    // const options: SelectOption[] = [];
    // let seenItem = false;

    const tags = this.typeKeyDataParser(selectContent, [
      TypeKey.True,
      TypeKey.False,
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
    ]);

    const select = builder.select({
      options: [],
      ...tags,
    });

    return select;
  }

  buildCards(bitType: BitTypeType, cardSetContent: TypeValue[]): BitSpecificCards {
    const cardSet: CardSet = {
      cards: [],
    };

    // Build card set
    for (const content of cardSetContent) {
      if (!content) continue;
      const { type, value: cardData } = content as TypeValue;
      if (!type || type !== TypeKey.Card) continue;
      const { cardIndex, cardSideIndex, cardVariantIndex: cardContentIndex, value } = cardData as CardData;

      // Get or create card
      let card = cardSet.cards[cardIndex];
      if (!card) {
        card = {
          sides: [],
        };
        cardSet.cards[cardIndex] = card;
      }

      // Get or create side
      let side = card.sides[cardSideIndex];
      if (!side) {
        side = {
          variants: [],
        };
        card.sides[cardSideIndex] = side;
      }

      // Set variant value
      const variant = side.variants[cardContentIndex];
      if (!variant) {
        side.variants[cardContentIndex] = value;
      } else {
        side.variants[cardContentIndex] += value;
      }
    }

    // Parse the card contents
    switch (bitType) {
      case BitType.sequence:
        return this.parseElements(cardSet);

      case BitType.trueFalse:
        return this.parseStatements(cardSet);

      case BitType.multipleResponse:
        return this.parseQuiz(cardSet, true, false);

      case BitType.interview:
        return this.parseQuestions(cardSet);

      default:
      // Return default empty object
    }

    return {};
  }

  parseElements(cardSet: CardSet): BitSpecificCards {
    const elements: string[] = [];

    for (const card of cardSet.cards) {
      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          const content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          const tags = this.typeKeyDataParser(content, [TypeKey.BodyChar]);

          elements.push(tags.body ?? '');
        }
      }
    }

    return {
      elements: elements.length > 0 ? elements : undefined,
    };
  }

  parseStatements(cardSet: CardSet): BitSpecificCards {
    const statements: Statement[] = [];

    for (const card of cardSet.cards) {
      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          const content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          const tags = this.typeKeyDataParser(content, [
            TypeKey.True,
            TypeKey.False,
            TypeKey.Property,
            TypeKey.ItemLead,
            TypeKey.Instruction,
            TypeKey.Hint,
          ]);

          const trueFalse =
            tags.trueFalse && tags.trueFalse.length > 0
              ? tags.trueFalse[0]
              : {
                  text: '',
                  isCorrect: false,
                };

          const statement = builder.statement({
            text: trueFalse.text ?? '',
            ...tags,
            isCorrect: trueFalse.isCorrect ?? false,
          });
          statements.push(statement);
        }
      }
    }

    return {
      statements: statements.length > 0 ? statements : undefined,
    };
  }

  parseQuiz(cardSet: CardSet, insertResponses: boolean, insertChoices: boolean): BitSpecificCards {
    const quizzes: Quiz[] = [];
    const responses: Statement[] = [];

    for (const card of cardSet.cards) {
      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          const content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          const tags = this.typeKeyDataParser(content, [
            TypeKey.True,
            TypeKey.False,
            TypeKey.Property,
            TypeKey.ItemLead,
            TypeKey.Instruction,
            TypeKey.Hint,
          ]);

          if (insertResponses) {
            if (tags.trueFalse && tags.trueFalse.length > 0) {
              tags.responses = [];
              for (const tf of tags.trueFalse) {
                const response = builder.response(tf);
                tags.responses.push(response);
              }
            }
          }
          if (insertChoices) {
            if (tags.trueFalse && tags.trueFalse.length > 0) {
              tags.choices = [];
              for (const tf of tags.trueFalse) {
                const response = builder.response(tf);
                tags.choices.push(response);
              }
            }
          }

          const quiz = builder.quiz({
            ...tags,
          });
          quizzes.push(quiz);
        }
      }
    }

    return {
      quizzes: quizzes.length > 0 ? quizzes : undefined,
    };
  }

  parseQuestions(cardSet: CardSet): BitSpecificCards {
    const questions: Question[] = [];

    for (const card of cardSet.cards) {
      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          const content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          const tags = this.typeKeyDataParser(content, [
            TypeKey.BodyChar,
            TypeKey.Property,
            TypeKey.ItemLead,
            TypeKey.Instruction,
            TypeKey.Hint,
            TypeKey.SampleSolution,
          ]);

          const q = builder.question({
            question: tags.body ?? '',
            ...tags,
          });

          questions.push(q);
        }
      }
    }

    return {
      questions: questions.length > 0 ? questions : undefined,
    };
  }

  //     sampleSolutions: this.asArray(sampleSolutions), ??
  //     elements DONE
  //     statements,  DONE
  //     responses,
  //     quizzes,
  //     heading,
  //     pairs,
  //     matrix,
  //     choices,
  //     questions,
  //     footer,

  typeKeyDataParser(data: BitContent[], validTypes: TypeKeyType[]): TypeKeyParseResult {
    let seenItem = false;
    let body = '';
    const solutions: string[] = [];
    const extraProperties: any = {};

    const res = data.reduce((acc, content, _index) => {
      const { type, key, value } = content as TypeKeyValue;

      // Only parse valid types
      if (validTypes.indexOf(type as TypeKeyType) === -1) return acc;

      switch (type) {
        case TypeKey.Property: {
          if (PropertyKey.fromValue(key)) {
            // Known property
            if (key === PropertyKey.shortAnswer) {
              acc.isShortAnswer = value;
            } else if (key === PropertyKey.caseSensitive) {
              acc.isCaseSensitive = value;
            } else {
              acc[key] = value;
            }
          } else {
            // Unknown (extra) property
            extraProperties[key] = value;
          }
          break;
        }

        case TypeKey.ItemLead: {
          if (!seenItem) {
            acc.item = value;
          } else {
            acc.lead = value;
          }
          seenItem = true;
          break;
        }

        case TypeKey.Instruction: {
          acc.instruction = value;
          break;
        }

        case TypeKey.Hint: {
          acc.hint = value;
          break;
        }

        case TypeKey.BodyLine:
        case TypeKey.BodyChar: {
          body += value;
          break;
        }

        case TypeKey.Cloze: {
          if (StringUtils.isString(value)) {
            solutions.push(value as string);
          }
          break;
        }

        case TypeKey.SampleSolution: {
          acc.sampleSolution = value;
          break;
        }

        case TypeKey.True:
        case TypeKey.False: {
          if (!Array.isArray(acc.trueFalse)) acc.trueFalse = [];
          acc.trueFalse.push({
            text: value,
            isCorrect: type === TypeKey.True,
          });
          break;
        }

        case TypeKey.CardSet: {
          acc.cardSet = value;
          break;
        }

        default:
        // Unknown tag
      }

      return acc;
    }, {} as any);

    if (Object.keys(extraProperties).length > 0) {
      res.extraProperties = extraProperties;
    }

    res.body = body.trim();

    if (solutions.length > 0) res.solutions = solutions;

    return res;
  }

  processCardSetStart() {
    this.cardIndex = 0;
    this.cardSideIndex = 0;
    this.cardVariantIndex = 0;
    this.cardSectionLineCount = 0;
    // console.log('CardSetStart');
  }

  processCardSetEnd() {
    this.cardIndex = 0;
    this.cardSideIndex = 0;
    this.cardVariantIndex = 0;
    this.cardSectionLineCount = 0;
    // console.log('CardSetEnd');
  }

  processCard() {
    this.cardIndex++;
    this.cardSideIndex = 0;
    this.cardVariantIndex = 0;
    this.cardSectionLineCount = 0;
    // console.log('processCard');
  }

  processPossibleCardLine(value: unknown) {
    let isSideDivider = false;
    let isVariantDivider = false;

    if (Array.isArray(value) && value.length === 2) {
      value = value[0];
      isSideDivider = value === '==';
      isVariantDivider = value === '--';
    }

    // This card section has no lines, so it's a special case blank
    const emptyCardOrSideOrVariant = this.cardSectionLineCount === 0;
    const currentSideIndex = this.cardSideIndex;
    const currentVariantIndex = this.cardVariantIndex;

    if (isSideDivider) {
      this.cardSideIndex++;
      this.cardVariantIndex = 0;
      this.cardSectionLineCount = 0;
      // console.log(`Card ${this.cardIndex} Side: ${value}`);
    } else if (isVariantDivider) {
      this.cardVariantIndex++;
      this.cardSectionLineCount = 0;
      // console.log(`Card ${this.cardIndex}, Side ${this.cardSideIndex}, Variant: ${this.cardVariantIndex}`);
    }

    if (emptyCardOrSideOrVariant) {
      // This card section has no lines, so it's a special case blank
      return {
        type: TypeKey.Card,
        value: {
          cardIndex: this.cardIndex,
          cardSideIndex: currentSideIndex,
          cardVariantIndex: currentVariantIndex,
          value: '',
        } as CardData,
      };
    }

    if (this.isType(value, TypeKey.Card)) return value;

    return undefined;
  }

  processCardLine(value: unknown) {
    this.cardSectionLineCount++;
    console.log(
      `CardLine (Card ${this.cardIndex}, Side ${this.cardSideIndex}, Variant: ${this.cardVariantIndex}): ${value}`,
    );
    return {
      type: TypeKey.Card,
      value: {
        cardIndex: this.cardIndex,
        cardSideIndex: this.cardSideIndex,
        cardVariantIndex: this.cardVariantIndex,
        value,
      } as CardData,
    };
  }

  // Reduce the bit content to type objects
  reduceToArrayOfTypes(data: unknown, validTypes: TypeKeyType[]): BitContent[] {
    if (!Array.isArray(data)) return [];

    const res = data.reduce((acc, content, _index) => {
      if (content == null) return acc;
      const { type, value } = content as TypeValue;

      if (Array.isArray(content)) {
        // Not a TypeKeyValue - recurse
        const subValues = this.reduceToArrayOfTypes(content, validTypes);
        acc.push(...subValues);
      } else {
        if (!this.isType(content, validTypes)) return acc;

        if (Array.isArray(value)) {
          // Not a TypeKeyValue - recurse
          const subValues = this.reduceToArrayOfTypes(value, validTypes);
          acc.push(...subValues);
        } else if (type) {
          acc.push(content);
        }
      }

      return acc;
    }, [] as BitContent[]);

    return res;
  }

  /**
   * Returns true if a value is a TypeKeyValue or TypeKey type with a type in the given types
   *
   * @param value The value to check
   * @param validType The type or types to check
   * @returns True if the value is a TypeKeyValue or TypeKey type with a type in the given types, otherwise False.
   */
  isType(value: unknown, validType: TypeKeyType | TypeKeyType[]): boolean {
    if (!value) return false;
    const { type } = value as TypeValue;

    if (Array.isArray(validType)) {
      return validType.indexOf(type as TypeKeyType) >= 0;
    }

    return validType === type;
  }

  /**
   * Add an error to the list of non-fatal errors
   * @param message The error message
   */
  addError(message: string) {
    const error: ParserError = {
      message,
      text: this.parserText(),
      location: this.parserLocation(),
    };
    this.nonFatalErrors.push(error);
  }
}

export { BitmarkParserHelper, TypeKey };
