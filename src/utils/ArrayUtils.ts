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

  /**
   * Convert an array or value to a value, unless it is already a value.
   * The first item in the array will be selected
   *
   * This function is useful for handling parameters that can be a single value or an array of values.
   *
   * @param val input value
   * @param last if true, the last item in the array will be selected, rather than the first
   * @returns the input value if it is not an array, otherwise the first item in the array
   */
  asSingle<T>(val: T | T[] | undefined, last?: boolean): T | undefined {
    if (val == null) return undefined;
    if (Array.isArray(val)) {
      if (val.length > 0) return last ? val[val.length - 1] : val[0];
      return undefined;
    }
    return val;
  }
}

const instance = new ArrayUtils();

export { instance as ArrayUtils };
