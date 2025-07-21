/* eslint-disable @typescript-eslint/no-explicit-any */

class JsonCleanupUtils {
  cleanupBitJson(
    obj: any,
    options?: {
      removeMarkup?: boolean;
      removeParser?: boolean;
      removeErrors?: boolean;
      removeTemporaryProperties?: boolean;
    },
  ): void {
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
        if (options.removeErrors) {
          // Mark bits with errors for removal
          if (bw.parser?.errors) {
            bitsToRemove.push(bw);
          }
        }

        if (options.removeMarkup) delete bw.bitmark;
        if (options.removeParser) delete bw.parser;
      }

      // Remove bits with errors - they are not useful for testing
      for (const bw of bitsToRemove) {
        const idx = bitWrappers.indexOf(bw);
        if (idx >= 0) bitWrappers.splice(idx, 1);
      }

      if (options.removeTemporaryProperties) {
        for (const bw of bitWrappers) {
          this.removeTemporaryProperties(bw);
        }
      }
    }
  }

  cleanupBitmarkPlusPlusJson(obj: any, options?: { removeErrors?: boolean }): void {
    const _options = Object.assign({}, options);

    if (obj) {
      let blocks: any[] = [];
      if (!Array.isArray(obj)) {
        blocks = [obj];
      } else {
        blocks = obj;
      }

      const blocksToRemove: any[] = [];

      for (const block of blocks) {
        if (block.type === 'error') {
          // Mark error blocks for removal
          blocksToRemove.push(block);
        }
      }

      // Remove error blocks - they are not useful for testing
      for (const block of blocksToRemove) {
        const idx = blocks.indexOf(block);
        if (idx >= 0) blocks.splice(idx, 1);
      }
    }
  }

  /**
   * Remove any property with a key starting with an underscore.
   *
   * @param json
   */
  protected removeTemporaryProperties(json: Record<string, unknown> | unknown[]): void {
    const obj = json as Record<string, unknown>;
    for (const key in obj) {
      if (key.startsWith('_')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        this.removeTemporaryProperties(obj[key] as Record<string, unknown>);
      }
    }
  }
}

const instance = new JsonCleanupUtils();

export { instance as JsonCleanupUtils };
