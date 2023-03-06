import { BitType } from '../ast/json/bitType';
import { BitWrapper } from '../ast/json/bitWrapper';
import { Bit } from '../ast/json/bit';

import { stringUtils } from './stringUtils';

class BitmarkUtils {
  preprocessJson(json: string | unknown): BitWrapper[] {
    const bitWrappers: BitWrapper[] = [];

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
        const w = item as BitWrapper;
        bitWrappers.push(w);
      } else if (this.isBit(item)) {
        const b = item as Bit;
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
      const w = bitWrapper as BitWrapper;
      return this.isBit(w.bit);
    }
    return false;
  }

  isBit(bit: unknown): boolean {
    if (Object.prototype.hasOwnProperty.call(bit, 'type')) {
      const b = bit as Bit;
      return !!BitType.fromValue(b.type);
    }
    return false;
  }

  bitToBitWrapper(bit: Bit): BitWrapper {
    return {
      bit,
    };
  }
}

const bitmarkUtils = new BitmarkUtils();

export { bitmarkUtils };
