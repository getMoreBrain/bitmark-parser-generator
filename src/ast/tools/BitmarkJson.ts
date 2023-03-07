import { BitJson, RecurringBitJson, ValidPropertiesJson } from '../json/BitJson';
import { BitWrapperJson } from '../json/BitWrapperJson';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { BitsNode } from '../nodes/BitsNode';
import { BitBitType } from '../types/BitBitType';
import { BitType } from '../types/BitType';
import { TextFormat } from '../types/TextFormat';

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
    const bitsNodes: BitsNode[] = [];

    for (const bitWrapper of bitWrappers) {
      const { bit, bitmark } = bitWrapper;

      console.log(`${bitmark ?? ''}`);
      console.log('\n\n');

      // Transform to AST
      const bitsNode = this.bitToAst(bit);
      bitsNodes.push(bitsNode);
    }

    const bitmarkNode = Builder.bitmark(bitsNodes);

    return bitmarkNode;
  }

  private bitToAst(bit: BitJson): BitsNode {
    const { type, format } = bit;

    // Check type
    const bitBitType = BitBitType.fromValue(type);
    if (!bitBitType) {
      throw new Error(`Invalid bit bit type: ${type}`);
    }

    // Get format
    const textFormat = TextFormat.fromValue(format) ?? TextFormat.bitmarkMinusMinus;

    // Get attachment type (TODO)
    const attachmentType = undefined;

    // Build bits
    const bitsNode = this.bitToAstRecursive({
      _type: BitType.bit,
      _key: bitBitType,
      _value: textFormat,
      _attachmentType: attachmentType,
      ...bit,
    } as RecurringBitJson);

    return bitsNode;
  }

  private bitToAstRecursive(bit: RecurringBitJson): BitsNode {
    const {
      // Master bit
      _type,
      _key,
      _value,
      _attachmentType,
      // Properties
      id,
      ageRange,
      language,
      //
      item,
      lead,
      statement,
      isCorrect,
      statements,
      solutions,
      hint,
      instruction,
      isExample,
      example,
      body,
      placeholders,
    } = bit;

    const propertyNodes: BitsNode[] = [];
    let itemNode: BitsNode | undefined;
    let leadNode: BitsNode | undefined;
    const statementNodes: BitsNode[] = [];
    const solutionNodes: BitsNode[] = [];
    let hintNode: BitsNode | undefined;
    let instructionNode: BitsNode | undefined;
    let exampleNode: BitsNode | undefined;
    const placeholderNodes: {
      [keyof: string]: BitsNode;
    } = {};
    let bodyNode: BitsNode | undefined;

    // TODO - validation checks on _type, _key, _value, _attachmentType, etc dependent on type

    // @property
    const properties: ValidPropertiesJson = {} as ValidPropertiesJson;
    if (id) properties.id = id;
    if (ageRange) properties.ageRange = ageRange;
    if (language) properties.language = language;

    for (const [k, v] of Object.entries(properties)) {
      let vArray = v;
      if (!Array.isArray(vArray)) {
        vArray = [v as string];
      }
      for (const val of vArray) {
        const child = this.bitToAstRecursive({
          _type: BitType.property,
          _key: k,
          _value: val,
        } as RecurringBitJson);
        propertyNodes.push(child);
      }
    }

    // %item
    if (item) {
      itemNode = this.bitToAstRecursive({
        _type: BitType.item,
        _key: item,
      } as RecurringBitJson);
    }

    // %lead
    if (lead) {
      leadNode = this.bitToAstRecursive({
        _type: BitType.lead,
        _key: lead,
      } as RecurringBitJson);
    }

    // +-statement
    if (statement) {
      const statementNode = this.bitToAstRecursive({
        _type: isCorrect ? BitType.statementTrue : BitType.statementFalse,
        _key: statement,
      } as RecurringBitJson);
      statementNodes.push(statementNode);
    }
    if (Array.isArray(statements)) {
      for (const s of statements) {
        const { isCorrect, statement, ...rest } = s;
        const statementNode = this.bitToAstRecursive({
          _type: isCorrect ? BitType.statementTrue : BitType.statementFalse,
          _key: statement,
          ...rest,
        } as RecurringBitJson);
        statementNodes.push(statementNode);
      }
    }

    // ?hint
    if (hint) {
      hintNode = this.bitToAstRecursive({
        _type: BitType.hint,
        _key: hint,
      } as RecurringBitJson);
    }

    // !instruction
    if (instruction) {
      instructionNode = this.bitToAstRecursive({
        _type: BitType.instruction,
        _key: instruction,
      } as RecurringBitJson);
    }

    // @example
    if (isExample) {
      exampleNode = this.bitToAstRecursive({
        _type: BitType.example,
        _key: 'example',
        _value: example || true,
      } as RecurringBitJson);
    }

    // // Solutions
    if (Array.isArray(solutions)) {
      for (const s of solutions) {
        const solutionNode = this.bitToAstRecursive({
          _type: _type,
          _key: s,
        } as unknown as RecurringBitJson);
        solutionNodes.push(solutionNode);
      }
    }

    // Placeholders
    if (placeholders) {
      for (const [key, val] of Object.entries(placeholders)) {
        const { solutions, ...rest } = val;

        if (solutions && solutions.length > 0) {
          const ss = solutions.slice(1);
          placeholderNodes[key] = this.bitToAstRecursive({
            _type: val.type,
            _key: solutions[0],
            solutions: ss,
            ...rest,
          } as unknown as RecurringBitJson);
        }
      }
    }

    // Body (with insterted placeholders)
    if (body) {
      // TODO - this split will need escaping, but actually we shouldn't need it anyway once bitmark JSON is actually
      // all JSON

      const bodyPartNodes: BitsNode[] = [];
      const bodyParts: string[] = stringUtils.splitPlaceholders(body, Object.keys(placeholderNodes));

      for (let i = 0, len = bodyParts.length; i < len; i++) {
        const bodyPart = bodyParts[i];

        if (placeholderNodes[bodyPart] instanceof BitsNode) {
          bodyPartNodes.push(placeholderNodes[bodyPart]);
        } else {
          bodyPartNodes.push(Builder.text2(bodyPart));
        }
      }

      bodyNode = Builder.body(bodyPartNodes);
    }

    // Build childBits
    const childBits: BitsNode[] = [];
    Array.prototype.push.apply(childBits, propertyNodes);
    if (itemNode) childBits.push(itemNode);
    if (leadNode) childBits.push(leadNode);
    Array.prototype.push.apply(childBits, statementNodes);
    Array.prototype.push.apply(childBits, solutionNodes);
    if (hintNode) childBits.push(hintNode);
    if (instructionNode) childBits.push(instructionNode);
    if (exampleNode) childBits.push(exampleNode);
    if (bodyNode) childBits.push(bodyNode);

    // Build bit
    const bitNode = Builder.bits(
      Builder.bit(
        Builder.bitType(_type),
        Builder.bitKey(_key),
        _value != null ? Builder.bitValue(_value) : undefined,
        _attachmentType ? Builder.bitAttachmentType(_attachmentType) : undefined,
      ),
      childBits,
    );

    return bitNode;
  }

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
      return !!BitBitType.fromValue(b.type);
    }
    return false;
  }

  bitToBitWrapper(bit: BitJson): BitWrapperJson {
    return {
      bit,
    };
  }
}

const bitmarkJson = new BitmarkJson();

export { bitmarkJson as BitmarkJson };
