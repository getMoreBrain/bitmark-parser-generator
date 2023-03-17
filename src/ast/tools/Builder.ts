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
    type: BitTypeType,
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
    const node: Bit = {
      type,
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
    const node: Choice = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

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
    const node: Response = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

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
    const node: Quiz = {
      choices,
      responses,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
    };

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
    const node: Pair = {
      key,
      values,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
      isLongAnswer,
    };

    return node;
  }

  body(bodyParts: BodyPart[]): Body {
    const node: Body = bodyParts;
    return node;
  }

  bodyText(text: string): BodyText {
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
    const node: Gap = {
      solutions,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

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
    const node: Select = {
      options,
      prefix,
      postfix,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

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
    const node: SelectOption = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

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
    const node: Statement = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
    };

    return node;
  }

  private itemLead(item?: string, lead?: string): ItemLead | undefined {
    let node: ItemLead | undefined;

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
