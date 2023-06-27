/* eslint-disable @typescript-eslint/no-explicit-any */

class JsonCleanupUtils {
  cleanupBitJson(obj: any, options?: { removeMarkup?: boolean; removeParser?: boolean; removeErrors?: boolean }): void {
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
        delete bw.example;

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

          // Clean bit resource(s)
          const resourcesToClean: any[] = [];
          if (bit.resource) {
            resourcesToClean.push(...Object.keys(bit.resource).map((key) => bit.resource[key]));
            if (bit.resource?.video?.posterImage) resourcesToClean.push(bit.resource.video.posterImage);

            delete bit.resource.private;
          }
          if (bit.partner?.avatarImage) resourcesToClean.push(bit.partner.avatarImage);

          // Delete the defaults - ignored for testing
          for (const resource of resourcesToClean) {
            if (!resource.width) delete resource.width;
            if (!resource.height) delete resource.height;

            if (!resource.license) delete resource.license;
            if (!resource.copyright) delete resource.copyright;
            if (!resource.provider) delete resource.provider;
            if (!resource.showInIndex) delete resource.showInIndex;
            if (!resource.caption) delete resource.caption;
            if (!resource.duration) delete resource.duration;

            if (!resource.allowSubtitles) delete resource.allowSubtitles;
            if (!resource.showSubtitles) delete resource.showSubtitles;
            if (!resource.autoplay) delete resource.autoplay;
            if (!resource.mute) delete resource.mute;
            if (!resource.alt) delete resource.alt;

            if (!resource.href) delete resource.href;
            if (!resource.siteName) delete resource.siteName;

            // Ignore provider and format because they are generated (sometimes incorrectly by ANTLR parser)
            delete resource.provider;
            delete resource.format;
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

  cleanupBitmarkPlusPlusJson(obj: any, options?: { removeErrors?: boolean }): void {
    options = Object.assign({}, options);

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
}

const instance = new JsonCleanupUtils();

export { instance as JsonCleanupUtils };
