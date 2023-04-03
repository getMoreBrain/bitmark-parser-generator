export interface GetFilenamesSyncOptions {
  match?: RegExp;
  recursive?: boolean;
  maxDepth?: number;
}

class ObjectUtils {
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
}

const objectUtils = new ObjectUtils();

export { objectUtils as ObjectUtils };