import { UNBREAKSCAPE_REGEX } from '../generated/parser/text/text-peggy-parser';
import { BreakscapedString } from '../model/ast/BreakscapedString';

import { StringUtils } from './StringUtils';

// Regex explanation:
// - match a single character of a text mark = * _ ` ! and capture in group 1
// - match zero or more ^ characters and capture in group 2
// - match the same character as group 1
// - match a single | or [ and capture in group 3
// - match a single ] capture in group 4
// This will capture all double marks, escaped double marks, and [ or |, and ]
// Replace with group 1 (half mark), group 3 ([ or |), ^, group 2 (captured ^s), group 1 (half mark), group 4 (])
// Group 1, 3 and 4 may be empty, this is expected
const BREAKSCAPE_REGEX = new RegExp('([=*_`!])([\\^]*)\\1|([\\|\\[])|([\\]])', 'g');
const BREAKSCAPE_REGEX_REPLACER = '$1$3^$2$1$4';

// Regex explanation:
// - match a single | or • or # character at the start of a line and capture in group 1
// This will capture all new block characters within the code text.
// Replace with group 1, ^
const BREAKSCAPE_CODE_REGEX = new RegExp('^(\\||•|#)', 'gm');
const BREAKSCAPE_CODE_REGEX_REPLACER = '$1^';

class BreakscapeUtils {
  public readonly EMPTY_STRING = '' as BreakscapedString;

  /**
   * Breakscape a string or an array of strings.
   * If the input is an array, a new array will be returned.
   *
   * @param val input value
   * @param modifyArray if true, the original array will be modified rather than a copy being made
   * @returns the input value with any strings breakscaped.
   */
  public breakscape<T extends string | string[] | undefined>(
    val: T,
    modifyArray?: boolean,
  ): T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined {
    type R = T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined;

    if (val == null) return val as unknown as R;

    const breakscapeStr = (str: string) => {
      if (!str) return str;
      return str.replace(BREAKSCAPE_REGEX, BREAKSCAPE_REGEX_REPLACER);
    };

    if (Array.isArray(val)) {
      const newVal: unknown[] = modifyArray ? val : [val.length];
      for (let i = 0, len = val.length; i < len; i++) {
        const v = val[i];
        if (StringUtils.isString(v)) {
          newVal[i] = breakscapeStr(v);
        }
      }
      val = newVal as T;
    } else if (StringUtils.isString(val)) {
      val = breakscapeStr(val as string) as T;
    }

    return val as unknown as R;
  }

  /**
   * Unbreakscape a string or an array of strings.
   * If the input is an array, a new array will be returned.
   *
   * @param val input value
   * @param modifyArray if true, the original array will be modified rather than a copy being made
   * @returns the input value with any strings unbreakscaped.
   */
  public unbreakscape<T extends BreakscapedString | BreakscapedString[] | undefined>(
    val: T,
    modifyArray?: boolean,
  ): T extends BreakscapedString ? string : T extends BreakscapedString[] ? string[] : undefined {
    type R = T extends BreakscapedString ? string : T extends BreakscapedString[] ? string[] : undefined;

    if (val == null) return val as unknown as R;

    const unbreakscapeStr = (str: string) => {
      if (!str) return str;
      let u = str;

      function replacer(match: string) {
        return match.replace('^', '');
      }

      const regex = UNBREAKSCAPE_REGEX;
      u = u.replace(regex, replacer);

      return u;
    };

    if (Array.isArray(val)) {
      const newVal: unknown[] = modifyArray ? val : [val.length];
      for (let i = 0, len = val.length; i < len; i++) {
        const v = val[i];
        if (StringUtils.isString(v)) {
          newVal[i] = unbreakscapeStr(v);
        }
      }
      val = newVal as T;
    } else if (StringUtils.isString(val)) {
      val = unbreakscapeStr(val as string) as T;
    }

    return val as unknown as R;
  }

  /**
   * Breakscape a code string or an array of code strings.
   * If the input is an array, a new array will be returned.
   *
   * @param val input value
   * @param modifyArray if true, the original array will be modified rather than a copy being made
   * @returns the input value with any strings breakscaped
   */
  public breakscapeCode<T extends unknown | unknown[] | undefined>(
    val: T,
    modifyArray?: boolean,
  ): T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined {
    type R = T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined;

    if (val == null) return val as unknown as R;

    const breakscapeStr = (str: string) => {
      if (!str) return str;
      return str.replace(BREAKSCAPE_CODE_REGEX, BREAKSCAPE_CODE_REGEX_REPLACER);
    };

    if (Array.isArray(val)) {
      const newVal: unknown[] = modifyArray ? val : [val.length];
      for (let i = 0, len = val.length; i < len; i++) {
        const v = val[i];
        if (StringUtils.isString(v)) {
          val[i] = breakscapeStr(v);
        }
      }
      val = newVal as T;
    } else if (StringUtils.isString(val)) {
      val = breakscapeStr(val as string) as T;
    }

    return val as unknown as R;
  }

  /**
   * Concatenate two breakscaped strings.
   *
   * @param s1 first string
   * @param s2 second string
   * @returns the concatenated string
   */
  public concatenate(s1: BreakscapedString, s2: BreakscapedString): BreakscapedString {
    return (s1 + s2) as BreakscapedString;
  }
}

const instance = new BreakscapeUtils();

export { instance as BreakscapeUtils };
