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
  asNumber<T extends number | undefined>(val: unknown | undefined, defaultVal?: T): number | T {
    if (val == null) return (defaultVal ?? undefined) as T;
    const number = +val;
    if (Number.isNaN(number) || !isFinite(number)) return (defaultVal ?? undefined) as T;

    return number;
  }

  /**
   * Return true if the input value IS or CAN BE converted to a number.
   *
   * e.g.
   * 123 -> true
   * 123.45 -> true
   * '123' -> true
   * '123.45' -> true
   * '-123.45' -> true
   * '+123.45' -> true
   * '0xAc1' -> true
   * '0xAc1' -> true
   * '0b101' -> true
   * '0o701' -> true
   * '1e4' -> true
   * '1e-4' -> true
   * '++1e-4' -> false
   * '7^2' -> false
   * '0xFFG' -> false
   * '0b121' -> false
   * '0o781' -> false
   * '1x10e4' -> false
   * '123abc' -> false
   * 'abc' -> false
   * null -> false
   *
   * @param val input value
   *
   * @returns true if the input value can be converted to a number.
   */
  isNumeric(val: unknown): boolean {
    if (val == null) return false;

    const number = +val;
    return !Number.isNaN(number) && isFinite(number);
  }
}

const instance = new NumberUtils();

export { instance as NumberUtils };
