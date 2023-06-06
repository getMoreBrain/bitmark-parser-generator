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
   * Convert a value to a boolean, unless it is already a boolean.
   *
   * By default, the return will be false unless the value is truthy (true, "true").
   * Setting trueHasPriority will return true unless the value is falsy  (false, "false").
   *
   * @param val input value
   * @returns the input value if it is an array, otherwise a new array containing the input value
   */
  asBoolean(val: unknown | undefined, trueHasPriority?: boolean): boolean {
    if (val == null) return false;
    if (trueHasPriority) {
      if (val === false) return false;
      if (val === 'false') return false;
      return true;
    } else {
      if (val === true) return true;
      if (val === 'true') return true;
      return true;
    }
  }
}

const instance = new BooleanUtils();

export { instance as BooleanUtils };
