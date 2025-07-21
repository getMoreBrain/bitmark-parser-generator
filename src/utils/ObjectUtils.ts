export interface GetFilenamesSyncOptions {
  match?: RegExp;
  recursive?: boolean;
  maxDepth?: number;
}

interface RemoveUnwantedPropertiesOptions {
  ignoreAllUndefined?: boolean;
  ignoreUndefined?: string[];
  ignoreAllFalse?: boolean;
  ignoreFalse?: string[];
  ignoreAllEmptyString?: boolean;
  ignoreEmptyString?: string[];
  ignoreAllEmptyArrays?: boolean;
  ignoreEmptyArrays?: string[];
  ignoreAllEmptyObjects?: boolean;
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
   * Get the value of a property in a plain JS object
   * using a path string or array.
   *
   * @param obj the object to get a property from
   * @param path the path to the property to set as a dotted string or array or a mix of both
   * @returns the value of the property, or undefined if the property does not exist
   */
  getViaPath(obj: unknown, path: string | string[]): unknown {
    if (!obj) return undefined;
    if (!path) return undefined;
    if (!Array.isArray(path)) path = [path]; // Ensure path is an array

    // Split dotted paths
    path = path.flatMap((p) => p.split('.'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node = obj as any;

    for (const key of path) {
      if (node == null) return undefined;
      node = node[key];
    }

    return node;
  }

  /**
   * Set the value of a property in a plain JS object
   * using a path string or array.
   *
   * @param obj the object to modify
   * @param path the path to the property to set as a dotted string or array or a mix of both
   * @param value the value to set
   * @param create - if true, create plain objects in the path if they do not exist
   * @returns true if the value was set, false if the value was not set
   */
  setViaPath(obj: unknown, path: string | string[], value: unknown, create?: boolean): boolean {
    if (!obj) return false;
    if (!path) return false;
    if (!Array.isArray(path)) path = [path]; // Ensure path is an array

    // Split dotted paths
    path = path.flatMap((p) => p.split('.'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node = obj as any;

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (node[key] == undefined) {
        if (create) {
          node[key] = {};
        } else {
          return false;
        }
      }
      node = node[key];
    }

    node[path[path.length - 1]] = value;
    return true;
  }

  /**
   * Return an array of the objects at the end of the paths
   * specified in the path array.
   *
   * e.g.
   *
   * const obj = obj = {
   *   a: {
   *     b: {
   *       c: 1,
   *     },
   *   },
   *   d: [{ e: 2 }, { f: 3 }],
   *   g: [{ h: [{ i: 4 }] }, { h: [{ i: 5 }, { i: 6 }] }, { h: [{ i: 7 }] }],
   * }
   *
   * objectUtils.flatMapPath(obj, ['a']);
   * [{ b: { c: 1 }]
   *
   * objectUtils.flatMapPath(obj, ['a', 'b']);
   * [{ c: 1 }]
   *
   * objectUtils.flatMapPath(obj, ['a', 'b', 'c']);
   * [1]
   *
   * objectUtils.flatMapPath(obj, ['d']);
   * [{ e: 2 }, { f: 3 }]
   *
   * objectUtils.flatMapPath(obj, ['d', 'e']);
   * [2]
   *
   * objectUtils.flatMapPath(obj, ['g']);
   * [{ h: [{ i: 4 }] }, { h: [{ i: 5 }, { i: 6 }] }, { h: [{ i: 7 }] }]
   *
   * objectUtils.flatMapPath(obj, ['g', 'h']);
   * [{ i: 4 }, { i: 5 }, { i: 6 }, { i: 7 }]
   *
   * objectUtils.flatMapPath(obj, ['g', 'h', 'i']);
   * [4, 5, 6, 7]
   *
   * @param obj
   * @param path
   * @returns
   */
  flatMapPath(obj: unknown, path: string | string[]): unknown[] {
    if (!obj) return [];
    if (!path) return [];
    if (!Array.isArray(path)) path = [path]; // Ensure path is an array

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = obj as any;

    const key = path.shift();
    if (key == null) return node;
    const data = node[key];

    if (!data) return [];
    if (Array.isArray(data)) {
      return data.flatMap((d) => this.flatMapPath(d, path.slice()));
    } else {
      return [this.flatMapPath(data, path)].flat();
    }
  }

  // testFlatMapPath() {
  //   const obj = {
  //     a: {
  //       b: {
  //         c: 1,
  //       },
  //     },
  //     d: [{ e: 2 }, { f: 3 }],
  //     g: [{ h: [{ i: 4 }] }, { h: [{ i: 5 }, { i: 6 }] }, { h: [{ i: 4 }] }],
  //   };

  //   console.log(this.flatMapPath(obj, 'a')); // [{ b: { c: 1 }]
  //   console.log(this.flatMapPath(obj, ['a', 'b'])); // [{ c: 1 }]
  //   console.log(this.flatMapPath(obj, ['a', 'b', 'c'])); // [1]
  //   console.log(this.flatMapPath(obj, ['d'])); // [{ e: 2 }, { f: 3 }]
  //   console.log(this.flatMapPath(obj, ['d', 'e'])); // [2]
  //   console.log(this.flatMapPath(obj, ['g'])); // [{ h: [{ i: 4 }] }, { h: [{ i: 5 }, { i: 6 }] }, { h: [{ i: 4 }] }]
  //   console.log(this.flatMapPath(obj, ['g', 'h'])); // [{ i: 4 }, { i: 5 }, { i: 6 }, { i: 4 }]
  //   console.log(this.flatMapPath(obj, ['g', 'h', 'i'])); // [4, 5, 6, 4]
  // }

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

    if (!options.ignoreAllUndefined) this.removeUndefinedProperties(obj, options.ignoreUndefined);
    if (!options.ignoreAllFalse) this.removeFalseProperties(obj, options.ignoreFalse);
    if (!options.ignoreAllEmptyString)
      this.removeEmptyStringProperties(obj, options.ignoreEmptyString);
    if (!options.ignoreAllEmptyArrays)
      this.removeEmptyArrayProperties(obj, options.ignoreEmptyArrays);
    if (!options.ignoreAllEmptyObjects)
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
   * Deep merge two or more objects or arrays.
   * (c) 2023 Chris Ferdinandi, MIT License, https://gomakethings.com
   * TypeScript version (c) 2023 RA Sewell
   *
   * @param   objs  The arrays or objects to merge
   * @returns The merged arrays or objects
   */
  public deepMerge<T>(...objs: unknown[]): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _deepMerge(...objs: any[]) {
      /**
       * Get the object type
       */
      function getType(obj: unknown) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
      }

      /**
       * Deep merge two objects
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function mergeObj(clone: any, obj: any) {
        for (const [key, value] of Object.entries(obj)) {
          const type = getType(value);
          if (
            clone[key] !== undefined &&
            getType(clone[key]) === type &&
            ['array', 'object'].includes(type)
          ) {
            clone[key] = _deepMerge(clone[key], value);
          } else {
            clone[key] = structuredClone(value);
          }
        }
      }

      // Create a clone of the first item in the objs array
      let clone = structuredClone(objs.shift());

      // Loop through each item
      for (const obj of objs) {
        // Get the object type
        const type = getType(obj);

        // If the current item isn't the same type as the clone, replace it
        if (getType(clone) !== type) {
          clone = structuredClone(obj);
          continue;
        }

        // Otherwise, merge
        if (type === 'array') {
          clone = [...clone, ...structuredClone(obj)];
        } else if (type === 'object') {
          mergeObj(clone, obj);
        } else {
          clone = obj;
        }
      }

      return clone;
    }

    return _deepMerge(...objs) as T;
  }
}

const objectUtils = new ObjectUtils();

export { objectUtils as ObjectUtils };
