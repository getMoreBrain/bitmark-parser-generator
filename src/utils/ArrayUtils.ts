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

  /**
   * Removes all duplicate items, keeping the first duplicate only.
   * The input array is modified in place.
   *
   * @param arr array in which to make items unique
   * @param keyFunc function(item) to return the key to check for equality. - optional
   * @returns the input array with all duplicate items removed
   */
  public removeDuplicates<T>(arr: T[], keyFunc?: (item: T) => unknown): T[] {
    const seen: Set<unknown> = new Set();
    for (const item of arr) {
      const k = keyFunc ? keyFunc(item) : item;
      if (seen.has(k)) {
        const index = arr.lastIndexOf(item);
        if (index !== -1) arr.splice(index, 1);
      }
      seen.add(k);
    }

    return arr;
  }
}

const instance = new ArrayUtils();

export { instance as ArrayUtils };
