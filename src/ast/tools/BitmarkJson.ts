import { BitJson } from '../json/BitJson';
import { BitWrapperJson } from '../json/BitWrapperJson';
import { BitElementNode } from '../nodes/BitElementNode';
import { BitNode } from '../nodes/BitNode';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { InstructionNode } from '../nodes/InstructionNode';
import { ItemNode } from '../nodes/ItemNode';
import { PropertyNode } from '../nodes/PropertyNode';
import { TextNode } from '../nodes/TextNode';
import { BitType } from '../types/BitType';
import { TextFormat } from '../types/TextFormat';

import { Builder } from './Builder';
import { stringUtils } from './StringUtils';

class BitmarkJson {
  toAst(json: unknown): BitmarkNode {
    const bitWrappers = this.preprocessJson(json);
    const bitNodes: BitNode[] = [];

    for (const bitWrapper of bitWrappers) {
      const { bit, bitmark } = bitWrapper;

      console.log(`${bitmark ?? ''}`);
      console.log('\n\n');

      // Transform to AST
      const bitNode = this.bitToAst(bit);
      bitNodes.push(bitNode);
    }

    const bitmarkNode = Builder.bitmark(bitNodes);

    return bitmarkNode;
  }

  private bitToAst(bit: BitJson): BitNode {
    const propertyNodes: PropertyNode[] = [];
    let itemNode: ItemNode | undefined;
    let instructionNode: InstructionNode | undefined;
    let bodyNode: TextNode | undefined;
    const { type, body, format, id, item, instruction } = bit;

    // Check type
    const bitType = BitType.fromValue(type);
    if (!bitType) {
      throw new Error(`Invalid bit type: ${type}`);
    }

    // Get format
    const textFormat = TextFormat.fromValue(format) ?? TextFormat.bitmarkMinusMinus;

    // @Id
    if (id) {
      let idArray = id;
      if (!Array.isArray(idArray)) {
        idArray = [id as string];
      }
      for (const i of idArray) {
        propertyNodes.push(Builder.property(Builder.key('id'), Builder.value(`${i}`)));
      }
    }

    // %item
    if (item) {
      itemNode = Builder.item(item);
    }

    // !instruction
    if (instruction) {
      instructionNode = Builder.instruction(instruction);
    }

    // Body
    if (body) {
      bodyNode = Builder.text(body);
    }

    // Build bitElementNodes
    const bitElementNodes: BitElementNode[] = [];
    Array.prototype.push.apply(bitElementNodes, propertyNodes);
    if (itemNode) {
      bitElementNodes.push(itemNode);
    }
    if (instructionNode) {
      bitElementNodes.push(instructionNode);
    }
    if (bodyNode) {
      bitElementNodes.push(bodyNode);
    }

    // Build bit
    const bitNode = Builder.bit(
      Builder.bitHeader(Builder.bitType(bitType), Builder.textFormat(textFormat)),
      Builder.bitElementArray(bitElementNodes),
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
      return !!BitType.fromValue(b.type);
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
