/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnumType, superenum } from '@ncoderz/superenum';

import { Builder } from '../../ast/Builder';
import { CardSet } from '../../model/ast/CardSet';
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
  Resource,
  AudioResource,
  ImageResource,
  MatrixCell,
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
  example?: string;
  isCorrect: boolean;
  responses?: Response[];
  choices?: Choice[];
  title?: string[];
  subtitle?: string;
  resource?: Resource;
}

interface BitSpecificTitles {
  title?: string;
  subtitle?: string;
  level?: number;
}

interface BitSpecificCards {
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

interface TypeKeyResource {
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
  BodyLine: 'BodyLine',
  BodyChar: 'BodyChar',
  CardSet: 'CardSet',
  Card: 'Card',
  Gap: 'Gap',
  Cloze: 'Cloze',
  Select: 'Select',
  SampleSolution: 'SampleSolution',
  Comment: 'Comment',
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

    console.log(`==== bitContent ====`);
    console.log(JSON.stringify(bitContent, null, 2));
    console.log(`==== END: bitContent ====`);

    // Parse the bit content into a an object with the appropriate keys
    const {
      cardSet,
      body: unparsedBody,
      title,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // heading, // Remove so types match
      ...tags
    } = this.typeKeyDataParser(bitContent, [
      TypeKey.Title,
      TypeKey.Anchor,
      TypeKey.Reference,
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
      TypeKey.Resource,
      TypeKey.BodyLine,
      TypeKey.CardSet,
    ]);

    // console.log(`==== tags ====`);
    // console.log(tags);
    // console.log(`==== END: tags ====`);

    console.log(`==== unparsedBody ====`);
    console.log(unparsedBody);
    console.log(`==== END: unparsedBody ====`);

    // Parse the body
    const parsedBody = this.parse(unparsedBody ?? '', {
      startRule: 'body',
    });
    console.log(`==== parsedBody ====`);
    console.log(JSON.stringify(parsedBody, null, 2));
    console.log(`==== END: parsedBody ====`);

    // Build the titles for the specific bit type
    const titles = this.buildTitles(bitType, title ?? []);

    // Build the card data for the specific bit type
    const bitSpecificCards = cardSet ? this.buildCards(bitType, cardSet) : {};

    // Build the body (parts and placeholders)
    const body = this.buildBody(parsedBody);
    // console.log(`==== body ====`);
    // console.log(JSON.stringify(body, null, 2));
    // console.log(`==== END: body ====`);

    // Build the errors
    const errors = this.buildErrors();

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
      ...titles,
      ...tags,
      ...bitSpecificCards,
      body,
      errors,
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
      isCaseSensitive: true,
    });

    return gap;
  }

  buildSelect(selectContent: BitContent[]): Select | undefined {
    // const options: SelectOption[] = [];
    // let seenItem = false;
    console.log(`==== selectContent ====`, selectContent);

    const { trueFalse, ...tags } = this.typeKeyDataParser(selectContent, [
      TypeKey.True,
      TypeKey.False,
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
    ]);

    console.log(`==== selectContent TAGS ====`, trueFalse);

    const options: SelectOption[] = [];
    if (trueFalse) {
      for (const tf of trueFalse) {
        options.push(builder.selectOption(tf));
      }
    }

    const select = builder.select({
      options,
      ...tags,
    });

    return select;
  }

  buildTitles(bitType: BitTypeType, title: string[]): BitSpecificTitles {
    switch (bitType) {
      case BitType.chapter: {
        let t: string | undefined;
        if (title.length > 0) t = title[title.length - 1];

        return {
          title: t,
          level: title.length > 0 ? title.length - 1 : undefined,
        };
      }

      case BitType.book:
      default: {
        return {
          title: title[1] ?? undefined,
          subtitle: title[2] ?? undefined,
        };
      }
    }
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

      case BitType.multipleChoice:
        return this.parseQuiz(cardSet, false, true);

      case BitType.multipleResponse:
        return this.parseQuiz(cardSet, true, false);

      case BitType.interview:
        return this.parseQuestions(cardSet);

      case BitType.match:
      case BitType.matchSolutionGrouped:
      case BitType.matchReverse:
      case BitType.matchAudio:
      case BitType.matchPicture:
        // ==> heading / pairs
        return this.parseMatchPairs(cardSet);

      case BitType.matchMatrix:
        // ==> heading / matrix
        return this.parseMatchMatrix(cardSet);

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

  parseMatchPairs(cardSet: CardSet): BitSpecificCards {
    let sideIdx = 0;
    let heading: Heading | undefined;
    const pairs: Pair[] = [];
    let forKeys: string | undefined = undefined;
    const forValues: string[] = [];
    let pairKey: string | undefined = undefined;
    let pairValues: string[] = [];
    let keyAudio: AudioResource | undefined = undefined;
    let keyImage: ImageResource | undefined = undefined;
    let example: string | boolean | undefined = undefined;

    for (const card of cardSet.cards) {
      forKeys = undefined;
      pairKey = undefined;
      pairValues = [];
      keyAudio = undefined;
      keyImage = undefined;
      sideIdx = 0;
      example = undefined;

      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          const content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          const tags = this.typeKeyDataParser(content, [
            TypeKey.BodyChar,
            TypeKey.Title,
            TypeKey.Property,
            // TypeKey.ItemLead,
            // TypeKey.Instruction,
            // TypeKey.Hint,
            TypeKey.Resource,
          ]);

          // Get the 'heading' which is the [#title] at level 1
          const heading = tags.title && tags.title[1];

          if (sideIdx === 0) {
            // First side
            if (heading != null) {
              forKeys = heading;
            } else if (tags.resource) {
              console.log('WARNING: Match card has resource on first side', tags.resource);
              if (tags.resource.type === ResourceType.audio) {
                keyAudio = tags.resource as AudioResource;
              } else if (tags.resource.type === ResourceType.image) {
                keyImage = tags.resource as ImageResource;
              }
            } else {
              // If not a heading or resource, it is a pair
              pairKey = tags.body;
            }
          } else {
            // Subsequent sides
            if (heading != null) {
              forValues.push(heading);
            } else if (tags.title == null) {
              // If not a heading, it is a pair
              pairValues.push(tags.body ?? '');
            }
          }

          // Example tag
          if (tags.example) {
            example = tags.example ?? true;
          }
        }
        sideIdx++;
      }

      if (forKeys != null) {
        heading = builder.heading({
          forKeys,
          forValues,
        });
      } else {
        const pair = builder.pair({
          key: pairKey ?? '',
          keyAudio,
          keyImage,
          values: pairValues,
          example,
          isCaseSensitive: true,
        });
        pairs.push(pair);
      }
    }

    return {
      heading,
      pairs: pairs.length > 0 ? pairs : undefined,
    };
  }

  parseMatchMatrix(cardSet: CardSet): BitSpecificCards {
    let sideIdx = 0;
    let heading: Heading | undefined;
    let forKeys: string | undefined = undefined;
    const forValues: string[] = [];
    let matrixKey: string | undefined = undefined;
    const matrix: Matrix[] = [];
    let matrixCells: MatrixCell[] = [];
    let matrixCellValues: string[] = [];
    // let keyAudio: AudioResource | undefined = undefined;
    // let keyImage: ImageResource | undefined = undefined;

    for (const card of cardSet.cards) {
      forKeys = undefined;
      matrixKey = undefined;
      // keyAudio = undefined;
      // keyImage = undefined;
      matrixCells = [];
      matrixCellValues = [];
      sideIdx = 0;

      for (const side of card.sides) {
        matrixCellValues = [];

        for (const rawContent of side.variants) {
          const content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          const tags = this.typeKeyDataParser(content, [
            TypeKey.BodyChar,
            TypeKey.Title,
            // TypeKey.Property,
            // TypeKey.ItemLead,
            // TypeKey.Instruction,
            // TypeKey.Hint,
            TypeKey.Resource,
          ]);

          // Get the 'heading' which is the [#title] at level 1
          const heading = tags.title && tags.title[1];

          if (sideIdx === 0) {
            // First side
            if (heading != null) {
              forKeys = heading;
              // } else if (tags.resource) {
              //   console.log('WARNING: Match card has resource on first side', tags.resource);
              //   if (tags.resource.type === ResourceType.audio) {
              //     keyAudio = tags.resource as AudioResource;
              //   } else if (tags.resource.type === ResourceType.image) {
              //     keyImage = tags.resource as ImageResource;
              //   }
            } else {
              // If not a heading or resource, it is a matrix
              matrixKey = tags.body;
            }
          } else {
            // Subsequent sides
            if (heading != null) {
              forValues.push(heading);
            } else if (tags.title == null) {
              // If not a heading, it is a  matrix
              matrixCellValues.push(tags.body ?? '');
            }
          }
        }

        // Finished looping variants, create matrix cell
        if (sideIdx > 0) {
          const matrixCell = builder.matrixCell({
            values: matrixCellValues,
          });
          matrixCells.push(matrixCell);
        }

        sideIdx++;
      }

      if (forKeys != null) {
        heading = builder.heading({
          forKeys,
          forValues,
        });
      } else {
        const m = builder.matrix({
          key: matrixKey ?? '',
          // keyAudio,
          // keyImage,
          cells: matrixCells,
          isCaseSensitive: true,
        });
        matrix.push(m);
      }
    }

    return {
      heading,
      matrix: matrix.length > 0 ? matrix : undefined,
    };
  }

  //     sampleSolutions: this.asArray(sampleSolutions), ??
  //     elements DONE
  //     statements, - OPEN when not in quiz
  //     responses, - OPEN when not in quiz
  //     quizzes, DONE ???
  //     heading,
  //     pairs,
  //     matrix,
  //     choices, - OPEN when not in quiz
  //     questions, - DONE ???
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

      const trimmedStringValue = StringUtils.trimmedString(value);

      switch (type) {
        case TypeKey.Title: {
          // Parse the title and its level
          if (!acc.title) acc.title = [];
          const titleValue: { title: string; level: string[] } = value as any;
          console.log(titleValue);
          const title = StringUtils.trimmedString(titleValue.title);
          const level = titleValue.level.length;
          acc.title[level] = title;
          break;
        }

        case TypeKey.Anchor: {
          acc.anchor = trimmedStringValue;
          break;
        }

        case TypeKey.Reference: {
          acc.reference = trimmedStringValue;
          break;
        }

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
            acc.item = trimmedStringValue;
          } else {
            acc.lead = trimmedStringValue;
          }
          seenItem = true;
          break;
        }

        case TypeKey.Instruction: {
          acc.instruction = trimmedStringValue;
          break;
        }

        case TypeKey.Hint: {
          acc.hint = trimmedStringValue;
          break;
        }

        case TypeKey.BodyLine:
        case TypeKey.BodyChar: {
          body += value;
          break;
        }

        case TypeKey.Cloze: {
          if (StringUtils.isString(value)) {
            solutions.push(trimmedStringValue);
          }
          break;
        }

        case TypeKey.SampleSolution: {
          acc.sampleSolution = trimmedStringValue;
          break;
        }

        case TypeKey.True:
        case TypeKey.False: {
          if (!Array.isArray(acc.trueFalse)) acc.trueFalse = [];
          acc.trueFalse.push({
            text: trimmedStringValue,
            isCorrect: type === TypeKey.True,
          });
          break;
        }

        case TypeKey.CardSet: {
          acc.cardSet = value;
          break;
        }

        case TypeKey.Resource: {
          const resource = content as TypeKeyResource;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { type: ignoreType, key: ignoreKey, ...resourceData } = resource;
          const type = ResourceType.fromValue(key);
          if (type) {
            acc.resource = builder.resource({
              type,
              ...resourceData,
            });
          }
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

  buildErrors(): ParserError[] | undefined {
    let errors: ParserError[] | undefined;
    if (this.nonFatalErrors.length > 0) {
      errors = this.nonFatalErrors;
      this.nonFatalErrors = [];
    }
    return errors;
  }

  //
  // Resource parsing
  //

  processResourceTags(resourceValue: any, extraProps: any[]) {
    const invalidResourceExtraProperties = ['type', 'key', 'value'];

    // Merge extra properties into the resource type (TODO = check if valid??)
    for (const p of extraProps) {
      if (!invalidResourceExtraProperties.includes(p.key)) {
        resourceValue[p.key] = p.value;
      }
    }

    return resourceValue;
  }

  //
  // Card parsing
  //

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
