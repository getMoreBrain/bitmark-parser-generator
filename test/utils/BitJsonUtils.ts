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
          // Clean bit

          // // Item, Lead, Hint, Instruction
          // if (!bit.item) delete bit.item;
          // if (!bit.lead) delete bit.lead;
          // if (!bit.hint) delete bit.hint;
          // if (!bit.instruction) delete bit.instruction;

          // // Example
          // if (!bit.example) delete bit.example;
          // if (!bit.isExample) delete bit.isExample;

          // Clean bit resource
          if (bit.resource) {
            delete bit.resource.private;

            // Delete the defaults - ignored for testing
            for (const key of Object.keys(bit.resource)) {
              const resource = bit.resource[key];
              if (!resource.license) delete resource.license;
              if (!resource.copyright) delete resource.copyright;
              if (!resource.provider) delete resource.provider;
              if (!resource.showInIndex) delete resource.showInIndex;
              if (!resource.caption) delete resource.caption;
              if (!resource.duration) delete resource.duration;

              // Ignore provider and format because they are generated (sometimes incorrectly by ANTLR parser)
              delete resource.provider;
              delete resource.format;
            }
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
