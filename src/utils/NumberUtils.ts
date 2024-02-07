class NumberUtils {
  /**
   * Convert a value to a number, unless it is already a number.
   *
   * The value returned if conversion cannot be performed defaults to undefined but can be configured
   * via defaultVal.
   *
   * @param val input value
   * @param defaultVal value to return if conversion cannot be performed
   * @returns the input value if it is an array, otherwise a new array containing the input value
   */
  asNumber(val: unknown | undefined, defaultVal?: number | undefined): number | undefined {
    if (val == null) return defaultVal ?? undefined;
    const number = +val;
    if (Number.isNaN(number)) return defaultVal ?? undefined;

    return number;
  }
}

const instance = new NumberUtils();

export { instance as NumberUtils };
