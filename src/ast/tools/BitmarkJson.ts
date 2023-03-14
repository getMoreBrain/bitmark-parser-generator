import { BitJson, ChoiceBitJson, PairBitJson, QuizBitJson, ResponseBitJson, StatementBitJson } from '../json/BitJson';
import { BitWrapperJson } from '../json/BitWrapperJson';
import { GapBitJson, BodyBitJson, BodyBitsJson, SelectBitJson, SelectOptionBitJson } from '../json/BodyBitJson';
import { BitNode } from '../nodes/bit/BitNode';
import { BitmarkNode } from '../nodes/bitmark/BitmarkNode';
import { BodyNode, BodyNodeTypes } from '../nodes/body/BodyNode';
import { BodyTextNode } from '../nodes/body/BodyTextNode';
import { ChoiceNode } from '../nodes/choice/ChoiceNode';
import { GapNode } from '../nodes/gap/GapNode';
import { PairNode } from '../nodes/pair/PairNode';
import { QuizNode } from '../nodes/quiz/QuizNode';
import { ResponseNode } from '../nodes/response/ResponseNode';
import { SelectNode } from '../nodes/select/SelectNode';
import { SelectOptionNode } from '../nodes/select/SelectOptionNode';
import { StatementNode } from '../nodes/statement/StatementNode';
import { AttachmentTypeType } from '../types/AttachmentType';
import { BitType, BitTypeType } from '../types/BitType';
import { BodyBitType } from '../types/BodyBitType';
import { TextFormatType } from '../types/TextFormat';

import { Builder } from './Builder';
import { stringUtils } from './StringUtils';

// const BODY_SPLIT_REGEX = new RegExp('{[0-9]+}', 'g');

/**
 * Bitmark JSON handing
 *
 * NOTES:
 * - Need to store JSON properties from bitmark in a sub-variable, otherwise it is not possible to distinguish
 *   them from other things in the JSON without a complex process (plus there can be clashes right now)
 */
class BitmarkJson {
  toAst(json: unknown): BitmarkNode {
    const bitWrappers = this.preprocessJson(json);
    const bitsNodes: BitNode[] = [];

    for (const bitWrapper of bitWrappers) {
      const { bit /*, bitmark*/ } = bitWrapper;

      // console.log(`${bitmark ?? ''}`);
      // console.log('\n\n');

      // Transform to AST
      const bitsNode = this.bitToAst(bit);
      bitsNodes.push(bitsNode);
    }

    const bitmarkNode = Builder.bitmark(bitsNodes);

    return bitmarkNode;
  }

  //   // @property
  //   const properties: ValidPropertiesJson = {} as ValidPropertiesJson;
  //   if (id) properties.id = id;
  //   if (ageRange) properties.ageRange = ageRange;
  //   if (language) properties.language = language;
  //   if (labelTrue) properties.labelTrue = labelTrue;
  //   if (labelFalse) properties.labelFalse = labelFalse;

  //   for (const [k, v] of Object.entries(properties)) {
  //     let vArray = v;
  //     if (!Array.isArray(vArray)) {
  //       vArray = [v as string];
  //     }
  //     for (const val of vArray) {
  //       const child = this.bitToAstRecursive({
  //         _type: BitType.property,
  //         _key: k,
  //         _value: val,
  //       } as RecurringBitJson);
  //       propertyNodes.push(child);
  //     }
  //   }

  //   // +-statement
  //   if (statement) {
  //     const node = this.bitToAstRecursive({
  //       _type: isCorrect ? BitType.statementTrue : BitType.statementFalse,
  //       _key: statement,
  //     } as RecurringBitJson);
  //     statementNodes.push(node);
  //   }
  //   if (Array.isArray(statements)) {
  //     for (const s of statements) {
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       const { _type, _key, isCorrect, statement, ...rest } = s;
  //       const node = this.bitToAstRecursive({
  //         _type: isCorrect ? BitType.statementTrue : BitType.statementFalse,
  //         _key: statement,
  //         ...rest,
  //       } as RecurringBitJson);
  //       statementNodes.push(node);
  //     }
  //   }

  //   // &resource
  //   // if (resource) {
  //   //   resourceNode = this.bitToAstRecursive({
  //   //     _type: BitType.example,
  //   //     _key: 'example',
  //   //     _value: example || true,
  //   //   } as RecurringBitJson);
  //   // }

  preprocessJson(json: string | unknown): BitWrapperJson[] {
    const bitWrappers: BitWrapperJson[] = [];

    if (stringUtils.isString(json)) {
      const str = json as string;
      try {
        json = JSON.parse(str);
      } catch (e) {
        // Failed to parse JSON, return empty array
        return [];
      }
    }

    // Helper function to push an item that is either a BitWrapper or a Bit to the BitWrapper array as a BitWrapper
    const pushItemAsBitWrapper = (item: unknown): void => {
      if (this.isBitWrapper(item)) {
        const w = item as BitWrapperJson;
        bitWrappers.push(w);
      } else if (this.isBit(item)) {
        const b = item as BitJson;
        bitWrappers.push(this.bitToBitWrapper(b));
      }
    };

    // See if we have an array of bits, or a single bit, or any other known format, and convert that into
    // an array of bits
    if (Array.isArray(json)) {
      for (const item of json) {
        pushItemAsBitWrapper(item);
      }
    } else {
      pushItemAsBitWrapper(json);
    }

    return bitWrappers;
  }

  isBitWrapper(bitWrapper: unknown): boolean {
    if (Object.prototype.hasOwnProperty.call(bitWrapper, 'bit')) {
      const w = bitWrapper as BitWrapperJson;
      return this.isBit(w.bit);
    }
    return false;
  }

  isBit(bit: unknown): boolean {
    if (Object.prototype.hasOwnProperty.call(bit, 'type')) {
      const b = bit as BitJson;
      return !!BitType.fromValue(b.type);
    }
    return false;
  }

  bitToBitWrapper(bit: BitJson): BitWrapperJson {
    return {
      bit,
    };
  }

  private bitToAst(bit: BitJson): BitNode {
    const {
      type,
      format,
      item,
      lead,
      hint,
      instruction,
      isExample,
      example,
      elements,
      statement,
      isCorrect,
      statements,
      choices,
      responses,
      quizzes,
      pairs,
      body,
      id,
      ageRange,
      language,
      resource,
      placeholders,
    } = bit;

    // Attachment type (TODO, not in JSON? ... or should it be derived from resource?)
    const attachmentType = undefined;

    //+-statement
    const statementNodes = this.statementBitsToAst(statement, isCorrect, statements);

    //+-choice
    const choiceNodes = this.choiceBitsToAst(choices);

    //+-response
    const responseNodes = this.responseBitsToAst(responses);

    // quizzes
    const quizNodes = this.quizBitsToAst(quizzes);

    // pairs
    const pairsNodes = this.pairBitsToAst(pairs);

    // body & placeholders
    const bodyNode = this.bodyToAst(body, placeholders);

    // Build bit
    const bitNode = Builder.bit(
      type as BitTypeType,
      format as TextFormatType | undefined,
      attachmentType as AttachmentTypeType | undefined,
      id,
      ageRange,
      language,
      undefined, // properties
      item,
      lead,
      hint,
      instruction,
      example || isExample,
      elements,
      statementNodes,
      choiceNodes,
      responseNodes,
      quizNodes,
      pairsNodes,
      resource,
      bodyNode,
    );

    return bitNode;
  }

  private statementBitsToAst(
    statement?: string,
    isCorrect?: boolean,
    statements?: StatementBitJson[],
  ): StatementNode[] {
    const nodes: StatementNode[] = [];

    if (statement) {
      const node = Builder.statement(statement, isCorrect ?? false);
      nodes.push(node);
    }

    if (Array.isArray(statements)) {
      for (const s of statements) {
        const { statement, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = s;
        const node = Builder.statement(
          statement,
          isCorrect,
          item,
          lead,
          hint,
          instruction,
          example || isExample,
          isCaseSensitive,
        );
        nodes.push(node);
      }
    }

    return nodes;
  }

  private choiceBitsToAst(choices?: ChoiceBitJson[]): ChoiceNode[] {
    const nodes: ChoiceNode[] = [];
    if (Array.isArray(choices)) {
      for (const c of choices) {
        const { choice, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = c;
        const node = Builder.choice(
          choice,
          isCorrect,
          item,
          lead,
          hint,
          instruction,
          example || isExample,
          isCaseSensitive,
        );
        nodes.push(node);
      }
    }

    return nodes;
  }

  private responseBitsToAst(responses?: ResponseBitJson[]): ResponseNode[] {
    const nodes: ResponseNode[] = [];
    if (Array.isArray(responses)) {
      for (const r of responses) {
        const { response, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = r;
        const node = Builder.response(
          response,
          isCorrect,
          item,
          lead,
          hint,
          instruction,
          example || isExample,
          isCaseSensitive,
        );
        nodes.push(node);
      }
    }

    return nodes;
  }

  private selectOptionBitsToAst(options?: SelectOptionBitJson[]): SelectOptionNode[] {
    const nodes: SelectOptionNode[] = [];
    if (Array.isArray(options)) {
      for (const o of options) {
        const { text, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = o;
        const node = Builder.selectOption(
          text,
          isCorrect,
          item,
          lead,
          hint,
          instruction,
          example || isExample,
          isCaseSensitive,
        );
        nodes.push(node);
      }
    }

    return nodes;
  }

  private quizBitsToAst(quizzes?: QuizBitJson[]): QuizNode[] {
    const nodes: QuizNode[] = [];
    if (Array.isArray(quizzes)) {
      for (const q of quizzes) {
        const { choices, responses, item, lead, hint, instruction, isExample, example } = q;
        const choiceNodes = this.choiceBitsToAst(choices);
        const responseNodes = this.responseBitsToAst(responses);
        const node = Builder.quiz(choiceNodes, responseNodes, item, lead, hint, instruction, example || isExample);
        nodes.push(node);
      }
    }

    return nodes;
  }

  private pairBitsToAst(pairs?: PairBitJson[]): PairNode[] {
    const nodes: PairNode[] = [];
    if (Array.isArray(pairs)) {
      for (const p of pairs) {
        const { key, values, item, lead, hint, instruction, isExample, example, isCaseSensitive, isLongAnswer } = p;
        const node = Builder.pair(
          key,
          values,
          item,
          lead,
          hint,
          instruction,
          example || isExample,
          isCaseSensitive,
          isLongAnswer,
        );
        nodes.push(node);
      }
    }

    return nodes;
  }

  private bodyToAst(body: string, placeholders: BodyBitsJson): BodyNode | undefined {
    let node: BodyNode | undefined;

    const placeholderNodes: {
      [keyof: string]: GapNode | SelectNode | BodyTextNode;
    } = {};

    // Placeholders
    if (placeholders) {
      for (const [key, val] of Object.entries(placeholders)) {
        const bit = this.bodyBitToAst(val);
        placeholderNodes[key] = bit;
      }
    }

    // Body (with insterted placeholders)
    if (body) {
      // TODO - this split will need escaping, but actually we shouldn't need it anyway once bitmark JSON is actually
      // all JSON

      const bodyPartNodes: BodyNodeTypes[] = [];
      const bodyParts: string[] = stringUtils.splitPlaceholders(body, Object.keys(placeholderNodes));

      for (let i = 0, len = bodyParts.length; i < len; i++) {
        const bodyPart = bodyParts[i];

        if (placeholderNodes[bodyPart]) {
          // Replace the placeholder
          bodyPartNodes.push(placeholderNodes[bodyPart]);
        } else {
          // Treat as text
          const bodyTextNode = this.bodyTextToAst(bodyPart);
          bodyPartNodes.push(bodyTextNode);
        }
      }

      node = Builder.body(bodyPartNodes);
    }

    return node;
  }

  private bodyTextToAst(bodyText: string): BodyTextNode {
    // TODO => Will be more complicated one the body text is JSON
    return Builder.bodyText(bodyText);
  }

  private bodyBitToAst(bit: BodyBitJson): GapNode | SelectNode | BodyTextNode {
    switch (bit.type) {
      case BodyBitType.gap:
        return this.gapBitToAst(bit);
        break;
      case BodyBitType.select:
        return this.selectBitToAst(bit);
        break;
    }
    return BodyTextNode.create('');
  }

  private gapBitToAst(bit: GapBitJson): GapNode {
    const { item, lead, hint, instruction, isExample, example, isCaseSensitive, solutions } = bit;

    // Build bit
    const bitNode = Builder.gap(solutions, item, lead, hint, instruction, example || isExample, isCaseSensitive);

    return bitNode;
  }

  private selectBitToAst(bit: SelectBitJson): SelectNode {
    const { options, prefix, postfix, item, lead, hint, instruction, isExample, example } = bit;

    // Build options bits
    const selectOptionNodes = this.selectOptionBitsToAst(options);

    // Build bit
    const node = Builder.select(
      selectOptionNodes,
      prefix,
      postfix,
      item,
      lead,
      hint,
      instruction,
      example || isExample,
      true,
    );

    return node;
  }
}

const bitmarkJson = new BitmarkJson();

export { bitmarkJson as BitmarkJson };
