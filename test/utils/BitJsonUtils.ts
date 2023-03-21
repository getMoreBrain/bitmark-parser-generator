/* eslint-disable @typescript-eslint/no-explicit-any */

class BitJsonUtils {
  cleanupJson(obj: any, options?: { removeMarkup?: boolean; removeParser?: boolean; removeErrors?: boolean }): void {
    options = Object.assign({}, options);

    if (obj) {
      let bitWrappers: any[] = [];
      if (!Array.isArray(obj)) {
        bitWrappers = [obj];
      } else {
        bitWrappers = obj;
      }

      const bitsToRemove: any[] = [];

      for (const bw of bitWrappers) {
        if (options.removeMarkup) delete bw.bitmark;
        if (options.removeParser) delete bw.parser;
        const bit = bw.bit;
        if (bit) {
          if (bit.resource) {
            delete bit.resource.private;
          }
        }

        if (options.removeErrors) {
          // Mark bits with errors for removal
          if (bw.errors) {
            bitsToRemove.push(bw);
          }
        }
      }

      // Remove bits with errors - they are not useful for testing
      for (const bw of bitsToRemove) {
        const idx = bitWrappers.indexOf(bw);
        if (idx >= 0) bitWrappers.splice(idx, 1);
      }
    }
  }
}

const bju = new BitJsonUtils();

export { bju as BitJsonUtils };
