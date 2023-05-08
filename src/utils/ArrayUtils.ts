class ArrayUtils {
  /**
   * Convert a value to an array, unless it is already an array.
   *
   * This function is useful for handling parameters that can be a single value or an array of values.
   *
   * @param val input value
   * @returns the input value if it is an array, otherwise a new array containing the input value
   */
  asArray<T>(val: T | T[] | undefined): T[] | undefined {
    if (val == null) return undefined;
    if (Array.isArray(val)) return val;
    return [val];
  }
}

const instance = new ArrayUtils();

export { instance as ArrayUtils };
