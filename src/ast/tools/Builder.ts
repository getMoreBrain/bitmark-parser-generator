import { BitTypeType } from '../types/BitType';
import { Property } from '../types/Property';
import { TextFormat, TextFormatType } from '../types/TextFormat';
import { Resource } from '../types/resources/Resource';

import {
  Bit,
  Bitmark,
  Body,
  BodyPart,
  BodyText,
  Choice,
  Gap,
  ItemLead,
  Pair,
  Quiz,
  Response,
  Select,
  SelectOption,
  Statement,
} from '../nodes/BitmarkNodes';

class Builder {
  bitmark(bits: Bit[]): Bitmark {
    const node: Bitmark = {
      bits: bits,
    };

    return node;
  }

  bit(
    bitType: BitTypeType,
    textFormat?: TextFormatType,
    ids?: string | string[],
    ageRanges?: number | number[],
    languages?: string | string[],
    properties?: Property[], // unused
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    elements?: string[],
    statements?: Statement[],
    choices?: Choice[],
    responses?: Response[],
    quizzes?: Quiz[],
    pairs?: Pair[],
    resource?: Resource,
    body?: Body,
  ): Bit {
    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType,
      textFormat: TextFormat.fromValue(textFormat) ?? TextFormat.bitmarkMinusMinus,
      ids: this.asArray(ids),
      ageRanges: this.asArray(ageRanges),
      languages: this.asArray(languages),
      resource,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      elements,
      statements,
      choices,
      responses,
      quizzes,
      pairs,
      body,
    };

    // Remove Optionals
    if (!node.ids) delete node.ids;
    if (!node.ageRanges) delete node.ageRanges;
    if (!node.languages) delete node.languages;
    if (!node.resource) delete node.resource;
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.elements) delete node.elements;
    if (!node.statements) delete node.statements;
    if (!node.choices) delete node.choices;
    if (!node.responses) delete node.responses;
    if (!node.quizzes) delete node.quizzes;
    if (!node.pairs) delete node.pairs;
    if (!node.body) delete node.body;

    return node;
  }

  choice(
    text: string,
    isCorrect: boolean,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): Choice {
    // NOTE: Node order is important and is defined here
    const node: Choice = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;

    return node;
  }

  response(
    text: string,
    isCorrect: boolean,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): Response {
    // NOTE: Node order is important and is defined here
    const node: Response = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;

    return node;
  }

  quiz(
    choices?: Choice[],
    responses?: Response[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
  ): Quiz {
    // NOTE: Node order is important and is defined here
    const node: Quiz = {
      choices,
      responses,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
    };

    // Remove Optionals
    if (!node.choices) delete node.choices;
    if (!node.responses) delete node.responses;
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;

    return node;
  }

  pair(
    key: string,
    values: string[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
    isLongAnswer?: boolean,
  ): Pair {
    // NOTE: Node order is important and is defined here
    const node: Pair = {
      key,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
      isLongAnswer,
      values,
    };

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;
    if (!node.isLongAnswer) delete node.isLongAnswer;

    return node;
  }

  body(bodyParts: BodyPart[]): Body {
    const node: Body = bodyParts;
    return node;
  }

  bodyText(text: string): BodyText {
    // NOTE: Node order is important and is defined here
    const node: BodyText = {
      bodyText: text,
    };
    return node;
  }

  gap(
    solutions: string[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): Gap {
    // NOTE: Node order is important and is defined here
    const node: Gap = {
      gap: {
        solutions,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        example,
        isCaseSensitive,
      },
    };

    // Remove Optionals
    if (!node.gap.itemLead) delete node.gap.itemLead;
    if (!node.gap.hint) delete node.gap.hint;
    if (!node.gap.instruction) delete node.gap.instruction;
    if (!node.gap.example) delete node.gap.example;
    if (!node.gap.isCaseSensitive) delete node.gap.isCaseSensitive;

    return node;
  }

  select(
    options: SelectOption[],
    prefix?: string,
    postfix?: string,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): Select {
    // NOTE: Node order is important and is defined here
    const node: Select = {
      select: {
        prefix,
        options,
        postfix,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        example,
        isCaseSensitive,
      },
    };

    // Remove Optionals
    if (!node.select.itemLead) delete node.select.itemLead;
    if (!node.select.hint) delete node.select.hint;
    if (!node.select.instruction) delete node.select.instruction;
    if (!node.select.example) delete node.select.example;
    if (!node.select.isCaseSensitive) delete node.select.isCaseSensitive;

    return node;
  }

  selectOption(
    text: string,
    isCorrect: boolean,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): SelectOption {
    // NOTE: Node order is important and is defined here
    const node: SelectOption = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;

    return node;
  }

  statement(
    text: string,
    isCorrect: boolean,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): Statement {
    // NOTE: Node order is important and is defined here
    const node: Statement = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;

    return node;
  }

  private itemLead(item?: string, lead?: string): ItemLead | undefined {
    let node: ItemLead | undefined;

    // NOTE: Node order is important and is defined here
    if (item || lead) {
      node = {
        item,
        lead,
      };
    }

    return node;
  }

  private asArray<T>(val: T | T[] | undefined): T[] | undefined {
    if (val == null) return undefined;
    if (Array.isArray(val)) return val;
    return [val];
  }
}

const builder = new Builder();

export { builder as Builder };
