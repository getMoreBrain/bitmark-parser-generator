/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DeepDiffMapperOptions {
  ignoreUnchanged?: boolean;
}

const IGNORE_KEY = '__4__34__2_IGNORE_ME__3__6__88_';

const deepDiffMapper = (function () {
  return {
    VALUE_CREATED: 'created',
    VALUE_UPDATED: 'updated',
    VALUE_DELETED: 'deleted',
    VALUE_UNCHANGED: 'unchanged',
    map: function (obj1: any, obj2: any, options?: DeepDiffMapperOptions): any {
      const _options = Object.assign({}, options);

      if (this.isFunction(obj1) || this.isFunction(obj2)) {
        throw 'Invalid argument. Function given, object expected.';
      }
      if (this.isValue(obj1) || this.isValue(obj2)) {
        return {
          type: this.compareValues(obj1, obj2),
          data1: obj1,
          data2: obj2,
        };
      }

      const _map = (key, val1, val2) => {
        const thisDiff = this.map(val1, val2, options);
        const ignore = _options.ignoreUnchanged && thisDiff.type === this.VALUE_UNCHANGED;
        if (!ignore) {
          diff[key] = thisDiff;
        } else {
          diff[key] = IGNORE_KEY;
        }
      };

      const diff = {};
      for (const key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue;
        }

        let value2 = undefined;
        if (obj2[key] !== undefined) {
          value2 = obj2[key];
        }

        _map(key, obj1[key], value2);
      }
      for (const key in obj2) {
        if (diff[key] === IGNORE_KEY) {
          delete diff[key];
          continue;
        }
        if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
          continue;
        }

        _map(key, undefined, obj2[key]);
      }

      return diff;
    },
    compareValues: function (value1, value2) {
      if (value1 === value2) {
        return this.VALUE_UNCHANGED;
      }
      if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
        return this.VALUE_UNCHANGED;
      }
      if (value1 === undefined) {
        return this.VALUE_CREATED;
      }
      if (value2 === undefined) {
        return this.VALUE_DELETED;
      }
      return this.VALUE_UPDATED;
    },
    isFunction: function (x) {
      return Object.prototype.toString.call(x) === '[object Function]';
    },
    isArray: function (x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    },
    isDate: function (x) {
      return Object.prototype.toString.call(x) === '[object Date]';
    },
    isObject: function (x) {
      return Object.prototype.toString.call(x) === '[object Object]';
    },
    isValue: function (x) {
      return !this.isObject(x) && !this.isArray(x);
    },
  };
})();

export { deepDiffMapper };
