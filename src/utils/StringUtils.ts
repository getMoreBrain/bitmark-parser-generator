class StringUtils {
  /**
   * Check if an object is a string.
   *
   * @param obj - The object to check.
   * @returns true if the object is a string, otherwise false.
   */
  isString(obj: unknown): boolean {
    return typeof obj === 'string' || obj instanceof String;
  }

  /**
   * Pass any value and convert it to a string.
   *
   * @param str the value to convert to a string
   * @returns the string or an empty string if the value is undefined
   */
  string(str: unknown | undefined): string {
    return str ? `${str}` : '';
  }

  /**
   * Pass any value and convert it to a trimmed string.
   *
   * @param str the value to convert to a trimmed string
   * @returns the trimmed string or an empty string if the value is undefined
   */
  trimmedString(str: unknown | undefined): string {
    return this.string(str).trim();
  }

  /**
   * Count the occurrences of a substring in a string.
   *
   * @param str the string to search
   * @param subStr the substring to search for
   * @returns the number of occurrences of the substring in the string
   */
  countOccurrences(str: string, subStr: string): number {
    return str.split(subStr).length - 1;
  }

  /**
   * Count the occurrences of a substring at the start of a string.
   *
   * @param str the string to search
   * @param subStr the substring to search for
   * @returns the number of occurrences of the substring at the start of the string
   */
  countOccurrencesAtStart(str: string, subStr: string): number {
    let count = 0;
    while (str.startsWith(subStr)) {
      count++;
      str = str.substring(subStr.length);
    }

    return count;
  }

  /**
   * Count the occurrences of a substring at the end of a string.
   *
   * @param str the string to search
   * @param subStr the substring to search for
   * @returns the number of occurrences of the substring at the end of the string
   */
  countOccurrencesAtEnd(str: string, subStr: string): number {
    let count = 0;
    while (str.endsWith(subStr)) {
      count++;
      str = str.substring(0, str.length - subStr.length);
    }

    return count;
  }

  /**
   * Split a string using a set of placeholders, returning an array of strings and placeholders.
   *
   * e.g.
   * str = "This {0} a {1} with lots {2} placeholders"
   * placeholders = ["{0}", "{1}", "{2}"]
   *
   * return = ["This ", "{0}", " a ", "{1}", " with lots ", "{2}", " placeholders"]
   *
   * @param str
   * @param placeholders
   */
  splitPlaceholders(str: string, placeholders: string[]): string[] {
    let res: string[] = [str];

    // Split all texts in texts (with key) and return new text array with key inserted at the split points
    const splitTexts = (texts: string[], key: string): string[] => {
      const newTexts: string[] = [];
      for (const text of texts) {
        const tParts = text.split(key);
        for (let i = 0, len = tParts.length; i < len; i++) {
          const tPart = tParts[i];
          const lastIndex = i === len - 1;
          newTexts.push(tPart);
          if (!lastIndex) {
            newTexts.push(key);
          }
        }
      }
      return newTexts;
    };

    for (const p of placeholders) {
      res = splitTexts(res, p);
    }

    return res;
  }

  /**
   * Return the first line of text to a specified maximum width.
   * @argument str The string to be truncated.
   * @argument width The maximum width of the wrapped text in characters.
   * @returns A string containing the first line, possibly truncated.
   */
  firstLine(str: string, width?: number): string {
    const result: string = str;

    if (width == null) width = str.length;
    if (width < 1 || str == null || str.length <= width) return result;

    const strs = str.split(`\n`);
    if (strs.length > 0) {
      return strs[0].substring(0, width);
    }

    return result;
  }

  /**
   * Wraps the provided string input to a specified maximum width.
   * @argument str The string to be wrapped.
   * @argument width The maximum width of the wrapped text in characters.
   * @returns A string array containing all lines.
   */
  wordWrap(str: string, width: number): string[] {
    const result: string[] = [];

    if (width < 1 || str == null || str.length <= width) return result;

    const len = str.length;
    const rangeMax = len - width; // we don't need to split after this position
    let rangeStart = 0;
    let subString: string;
    while (rangeStart < rangeMax) {
      let subLength: number;
      const rangeEnd = rangeStart + width;
      // First test for newlines in this range. If so, don't split on word break but on the newline.
      const ixNewLine = str.indexOf('\n', rangeStart);
      if (ixNewLine > -1 && ixNewLine > rangeStart && ixNewLine < rangeEnd) {
        subLength = ixNewLine - rangeStart;
        subString = str.substr(rangeStart, subLength);
        rangeStart = rangeStart + subLength + 1;
        result.push(subString);
        continue;
      }
      // No newlines. Find the last wordbreak in the range.
      const ix = str.lastIndexOf(' ', rangeEnd); // find the last word break
      let rangeStartNext = 0;
      if (ix > -1 && ix != rangeStart - 1) {
        subLength = ix - rangeStart;
        if (subLength > 0) {
          rangeStartNext = rangeStart + subLength + 1; // +1 to skip the whitespace
        }
        //else { // not needed anymore because of the maxPos check
        //    sub = str.substr(pos);
        //    newPos = len + 1;
        //}
      } else {
        // The range has no whitespace.
        subLength = width;
        rangeStartNext = rangeStart + width;
      }
      subString = str.slice(rangeStart, rangeStart + subLength);
      rangeStart = rangeStartNext;
      result.push(subString.trim());
    }
    // Add the remainder
    if (rangeStart < len) {
      subString = str.slice(rangeStart);
      result.push(subString);
    }

    return result;
  }

  /**
   * Convert a kebab-case string to camelCase.
   *
   * @param str the string to convert
   * @returns the camelCase version of the string
   */
  kebabToCamel(str: string): string {
    if (!str) return str;
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}

const stringUtils = new StringUtils();

export { stringUtils as StringUtils };
