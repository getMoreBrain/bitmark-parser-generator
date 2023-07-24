export interface GetFilenamesSyncOptions {
  match?: RegExp;
  recursive?: boolean;
  maxDepth?: number;
}

interface RemoveUnwantedPropertiesOptions {
  ignoreUndefined?: string[];
  ignoreFalse?: string[];
  ignoreEmptyString?: string[];
  ignoreEmptyArrays?: string[];
  ignoreEmptyObjects?: string[];
}

class ObjectUtils {
  /**
   * Check if a variable is a function
   *
   * @param val
   * @returns true if a function
   */
  isFunction(val: unknown) {
    return Object.prototype.toString.call(val) === '[object Function]';
  }

  /**
   * Check if a variable is an array
   *
   * @param val
   * @returns true if a array
   */
  isArray(val: unknown) {
    return Array.isArray(val); // Object.prototype.toString.call(val) === '[object Array]';
  }

  /**
   * Check if a variable is a date
   *
   * @param val
   * @returns true if a date
   */
  isDate(val: unknown) {
    return Object.prototype.toString.call(val) === '[object Date]';
  }

  /**
   * Check if a variable is a object
   *
   * @param val
   * @returns true if an object
   */
  isObject(val: unknown) {
    return Object.prototype.toString.call(val) === '[object Object]';
  }

  /**
   * Check if a variable is a value (i.e. a number)
   *
   * @param val
   * @returns true if a value
   */
  isValue(val: unknown) {
    return !this.isObject(val) && !this.isArray(val);
  }

  /**
   * Order the properties of a plain JS object.
   * The original properties are removed, and re-added in the new order.
   * Any non-specified properties are dropped.
   *
   * NOTE: The JS spec does not specifiy an order for property iteration, but all major JS engines including V8 which
   * is used by NodeJS and Chrome do have a specific iteration order which is defined by the order properties are
   * added to an object. Many applications rely on this iteration order.
   *
   * @param obj - object with properties to re-order
   * @param order - array of property keys in the desired order.
   */
  orderProperties<T>(obj: T, order: string[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objAsAny = obj as any;
    const props = Object.assign({}, objAsAny);
    for (const k of Object.keys(objAsAny)) {
      delete objAsAny[k];
    }
    for (const k of order) {
      if (Object.prototype.hasOwnProperty.call(props, k)) {
        objAsAny[k] = props[k];
      }
    }
  }

  /**
   * Remove any keys whose value is 'undefined' from a plain JS object
   *
   * @param obj plain JS object
   * @param excludeKeys keys to be excluded from removal
   */
  removeUndefinedProperties(obj: unknown, excludeKeys?: string[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objAsAny = obj as any;

    for (const [k, v] of Object.entries(objAsAny)) {
      if (excludeKeys && excludeKeys.indexOf(k) >= 0) continue;

      if (v == undefined) {
        delete objAsAny[k];
      }
    }
  }

  /**
   * Remove any keys whose value is 'false' from a plain JS object
   *
   * @param obj plain JS object
   * @param excludeKeys keys to be excluded from removal
   */
  removeFalseProperties(obj: unknown, excludeKeys?: string[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objAsAny = obj as any;

    for (const [k, v] of Object.entries(objAsAny)) {
      if (excludeKeys && excludeKeys.indexOf(k) >= 0) continue;

      if (v === false) {
        delete objAsAny[k];
      }
    }
  }

  /**
   * Remove any keys whose value is '' from a plain JS object
   *
   * @param obj plain JS object
   * @param excludeKeys keys to be excluded from removal
   */
  removeEmptyStringProperties(obj: unknown, excludeKeys?: string[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objAsAny = obj as any;

    for (const [k, v] of Object.entries(objAsAny)) {
      if (excludeKeys && excludeKeys.indexOf(k) >= 0) continue;

      if (v === '') {
        delete objAsAny[k];
      }
    }
  }

  /**
   * Remove any keys whose value is '[]' from a plain JS object
   *
   * @param obj plain JS object
   * @param excludeKeys keys to be excluded from removal
   */
  removeEmptyArrayProperties(obj: unknown, excludeKeys?: string[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objAsAny = obj as any;

    for (const [k, v] of Object.entries(objAsAny)) {
      if (excludeKeys && excludeKeys.indexOf(k) >= 0) continue;

      if (Array.isArray(v) && v.length === 0) {
        delete objAsAny[k];
      }
    }
  }

  /**
   * Remove any keys whose value is '{}' from a plain JS object
   *
   * @param obj plain JS object
   * @param excludeKeys keys to be excluded from removal
   */
  removeEmptyObjectProperties(obj: unknown, excludeKeys?: string[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objAsAny = obj as any;

    for (const [k, v] of Object.entries(objAsAny)) {
      if (excludeKeys && excludeKeys.indexOf(k) >= 0) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (this.isObject(v) && Object.keys(v as any).length === 0) {
        delete objAsAny[k];
      }
    }
  }

  /**
   * Remove any unwanted properties from a plain JS object
   *
   * @param obj plain JS object
   * @param excludeKeys keys to be excluded from removal
   */
  removeUnwantedProperties(obj: unknown, options?: RemoveUnwantedPropertiesOptions): void {
    options = Object.assign({}, options);

    this.removeUndefinedProperties(obj, options.ignoreUndefined);
    this.removeFalseProperties(obj, options.ignoreFalse);
    this.removeEmptyStringProperties(obj, options.ignoreEmptyString);
    this.removeEmptyArrayProperties(obj, options.ignoreEmptyArrays);
    this.removeEmptyObjectProperties(obj, options.ignoreEmptyObjects);
  }

  /**
   * Extract a single value from a plain JS object
   *
   * If the item at the key is not an array, the item is returned.
   * If the object at the key is an array, the last item in the array is returned.
   *
   * @param obj
   * @param key
   * @returns a non-array value, or undefined if the key does not exist
   */
  extractSingleValue(obj: unknown, key: string): unknown | undefined {
    if (!obj) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objAsAny = obj as any;

    if (objAsAny[key] == undefined) return undefined;

    let value = objAsAny[key];
    if (Array.isArray(value)) {
      if (value.length === 0) return undefined;
      value = value[value.length - 1];
    }

    return value;
  }

  /**
   * Return a random alpha numberic key of the specified length
   *
   * NOT SECURE
   *
   * @param length
   * @returns
   */
  alphanumericKey(length: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}

const objectUtils = new ObjectUtils();

export { objectUtils as ObjectUtils };
