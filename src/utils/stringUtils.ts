class StringUtils {
  isString(obj: unknown): boolean {
    return typeof obj === 'string' || obj instanceof String;
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
      subString = str.substr(rangeStart, subLength);
      rangeStart = rangeStartNext;
      result.push(subString.trim());
    }
    // Add the remainder
    if (rangeStart < len) {
      subString = str.substr(rangeStart);
      result.push(subString);
    }

    return result;
  }
}

const stringUtils = new StringUtils();

export { stringUtils };
