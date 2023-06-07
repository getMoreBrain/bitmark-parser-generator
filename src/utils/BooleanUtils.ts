class BooleanUtils {
  /**
   * Check if an object is a boolean.
   *
   * @param val input value
   * @returns the input value if it is an array, otherwise a new array containing the input value
   */
  isBoolean(val: unknown | undefined): boolean {
    if (val === true) return true;
    if (val === false) return true;
    return false;
  }

  /**
   * Check if an object is a boolean, or a boolean string.
   *
   * @param val input value
   * @returns the input value if it is an array, otherwise a new array containing the input value
   */
  isBooleanString(val: unknown | undefined): boolean {
    if (this.isBoolean(val)) return true;
    if (val === 'true') return true;
    if (val === 'false') return true;
    return false;
  }

  /**
   * Convert a value to a boolean.
   *
   * By default, the return will be false unless the value is truthy (true, "true").
   * Setting defaultVal to true will return true unless the value is falsy (false, "false").
   *
   * @param val input value
   * @param defaultVal default value to return if val does not match a boolean or 'true' / 'false'
   * @returns val, converted to a boolean
   */
  toBoolean(val: unknown | undefined, defaultVal?: boolean): boolean {
    if (defaultVal) {
      if (val === false) return false;
      if (val === 'false') return false;
      return true;
    } else {
      if (val === true) return true;
      if (val === 'true') return true;
      return false;
    }
  }
}

const instance = new BooleanUtils();

export { instance as BooleanUtils };
