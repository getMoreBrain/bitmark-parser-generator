/**
 *  breakscape.ts
 *  ------------------------------------------------------------
 *  Breakscaping for bitmark text.
 *  (c) 2025 — MIT / public domain
 */

import { PACKAGE_INFO } from '../generated/package_info.ts';
import { BodyTextFormat, type BodyTextFormatType } from '../model/enum/BodyTextFormat.ts';
import { TextLocation, type TextLocationType } from '../model/enum/TextLocation.ts';
import type { BreakscapeOptions } from './BreakscapeOptions.ts';
import * as RC from './RegexConfigs.ts';

// default options
const DEF = {
  format: BodyTextFormat.bitmarkPlusPlus,
  location: TextLocation.body,
  v2: false,
} as const;

/**
 * Check if an object is a string.
 *
 * @param obj - The object to check.
 * @returns true if the object is a string, otherwise false.
 */
function isString(obj: unknown): boolean {
  return typeof obj === 'string' || obj instanceof String;
}

/**
 * For breakscaping, select the correct regex and replacer for the text format, location, and v2 flag.
 */
function selectBreakscapeRegexAndReplacer(
  textFormat: BodyTextFormatType,
  textLocation: TextLocationType,
  v2 = false,
): { regex: RegExp; replacer: string } {
  if (textLocation === TextLocation.tag) {
    if (!v2 && textFormat === BodyTextFormat.bitmarkPlusPlus) {
      return {
        regex: RC.BREAKSCAPE_BITMARK_TAG_REGEX,
        replacer: RC.BREAKSCAPE_BITMARK_TAG_REGEX_REPLACER,
      };
    }
    return {
      regex: RC.BREAKSCAPE_PLAIN_TAG_REGEX,
      replacer: RC.BREAKSCAPE_PLAIN_TAG_REGEX_REPLACER,
    };
  } else {
    if (textFormat === BodyTextFormat.bitmarkPlusPlus) {
      if (v2) {
        return {
          regex: RC.BREAKSCAPE_V2_BODY_REGEX,
          replacer: RC.BREAKSCAPE_V2_BODY_REGEX_REPLACER,
        };
      }
      return {
        regex: RC.BREAKSCAPE_BITMARK_BODY_REGEX,
        replacer: RC.BREAKSCAPE_BITMARK_BODY_REGEX_REPLACER,
      };
    }
    return {
      regex: RC.BREAKSCAPE_PLAIN_BODY_REGEX,
      replacer: RC.BREAKSCAPE_PLAIN_BODY_REGEX_REPLACER,
    };
  }
}

/**
 * For unbreakscaping, select the correct regex and replacer for the text format and location.
 */
function selectUnbreakscapeRegexAndReplacer(
  textFormat: BodyTextFormatType,
  textLocation: TextLocationType,
): { regex: RegExp; replacer: string } {
  const isPlain = textFormat !== BodyTextFormat.bitmarkPlusPlus;
  if (textLocation === TextLocation.body && isPlain) {
    return {
      regex: RC.UNBREAKSCAPE_PLAIN_IN_BODY_REGEX,
      replacer: RC.UNBREAKSCAPE_PLAIN_IN_BODY_REGEX_REPLACER,
    };
  }
  return {
    regex: RC.UNBREAKSCAPE_REGEX,
    replacer: RC.UNBREAKSCAPE_REGEX_REPLACER,
  };
}

// -----------------------------------------------------------------------------
//  ╭──────────────────────────────────────────────────────────────────────────╮
//  │ 2.  PUBLIC  API                                                         │
//  ╰──────────────────────────────────────────────────────────────────────────╯
class Breakscape {
  public readonly EMPTY_STRING = '' as string;

  /**
   * Escapes special characters in bitmark text by adding caret (^) characters.
   *
   * This method processes text to prevent special characters from being interpreted
   * as bitmark markup. It handles various scenarios including:
   * - Tag triggers after '[' characters
   * - Paired punctuation marks
   * - Hat characters (^)
   * - End-of-tag brackets
   * - Beginning-of-line markers
   *
   * IMPORTANT: Breakscaping differs depending on the bit text format, and if the text will
   * be used in a tag or in the body of a bitmark. The default is bitmark++ in the body.
   * If the text is to be used in a tag, or is not bitmark++, you must specify the textFormat
   * and textLocation options.
   *
   * @param val - The input to breakscape. Can be a string, array of strings, null, or undefined.
   * @param opts - Optional configuration for the breakscape operation.
   * @returns The breakscaped result with the same type as the input.
   *
   * @example
   * ```typescript
   * const breakscape = new Breakscape();
   *
   * // Single string
   * breakscape.breakscape('[.hello]'); // Returns '[^.hello]'
   *
   * // Array of strings
   * breakscape.breakscape(['[.hello]', '[.world]']); // Returns ['[^.hello]', '[^.world]']
   *
   * // With options
   * breakscape.breakscape('[.hello]', {
   *   textFormat: TextFormat.bitmark++,
   *   textLocation: TextLocation.body
   * });
   * ```
   */
  breakscape(val: string, opts?: BreakscapeOptions): string;
  breakscape(val: string[], opts?: BreakscapeOptions): string[];
  breakscape(val: undefined | null, opts?: BreakscapeOptions): undefined;
  breakscape(
    val: string | string[] | undefined | null,
    opts: BreakscapeOptions = {},
  ): string | string[] | undefined {
    if (val == null) return undefined;
    const options = Object.assign({}, DEF, opts);
    if (Array.isArray(val)) {
      return val.map((v) => this.breakscape(v, options)) as string[];
    }

    // If an unrecognized type is passed, return it as is (e.g. true, false, 0, 1, etc.)
    if (!isString(val)) return val as string | undefined;

    const { regex, replacer } = selectBreakscapeRegexAndReplacer(
      options.format,
      options.location,
      options.v2,
    );
    let str = val;
    str = str.replace(regex, replacer);
    return str;
  }

  /**
   * Unbreakscape a string or an array of strings.
   * If the input is an array, a new array will be returned.
   *
   * @param val input value
   * @param opts options for unbreakscaping
   * @returns the input value with any strings unbreakscaped.
   */
  unbreakscape(val: string, opts?: BreakscapeOptions): string;
  unbreakscape(val: string[], opts?: BreakscapeOptions): string[];
  unbreakscape(val: undefined | null, opts?: BreakscapeOptions): undefined;
  unbreakscape(
    val: string | string[] | undefined | null,
    opts: BreakscapeOptions = {},
  ): string | string[] | undefined {
    if (val == null) return undefined;
    const options = Object.assign({}, DEF, opts);
    if (Array.isArray(val)) {
      return val.map((v) => this.unbreakscape(v, options)) as string[];
    }

    // If an unrecognized type is passed, return it as is (e.g. true, false, 0, 1, etc.)
    if (!isString(val)) return val as string | undefined;

    const { regex, replacer } = selectUnbreakscapeRegexAndReplacer(
      options.format,
      options.location,
    );
    let str = val;
    str = str.replace(regex, replacer);
    return str;
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
    options?: BreakscapeOptions,
  ): T extends string ? string : T extends string[] ? string[] : undefined {
    type R = T extends string ? string : T extends string[] ? string[] : undefined;

    if (val == null) return val as unknown as R;

    const opts = Object.assign({}, DEF, options);

    const breakscapeStr = (str: string) => {
      if (!str) return str;
      return str.replace(RC.BREAKSCAPE_CODE_REGEX, RC.BREAKSCAPE_CODE_REGEX_REPLACER);
    };

    if (Array.isArray(val)) {
      const newVal: unknown[] = opts.inPlaceArray ? val : [val.length];
      for (let i = 0, len = val.length; i < len; i++) {
        const v = val[i];
        if (isString(v)) {
          val[i] = breakscapeStr(v);
        }
      }
      val = newVal as T;
    } else if (isString(val)) {
      val = breakscapeStr(val as string) as T;
    }

    return val as unknown as R;
  }

  /**
   * Gets the version of the breakscape library.
   *
   * @returns The current version string of the library.
   *
   * @example
   * ```typescript
   * const breakscape = new Breakscape();
   * console.log(breakscape.version()); // e.g., "1.0.0"
   * ```
   */
  version(): string {
    return PACKAGE_INFO.version;
  }

  /**
   * Gets the license information for the breakscape library.
   *
   * @returns The license string for the library.
   *
   * @example
   * ```typescript
   * const breakscape = new Breakscape();
   * console.log(breakscape.license()); // e.g., "MIT"
   * ```
   */
  license(): string {
    return PACKAGE_INFO.license;
  }
}

export { Breakscape };
