import { type BreakscapedString } from '../model/ast/BreakscapedString.ts';
import { TextFormat } from '../model/enum/TextFormat.ts';
import { TextLocation } from '../model/enum/TextLocation.ts';
import { type BreakscapeOptions } from './BreakscapeOptions.ts';
import { Breakscape as BreakscapeImpl } from './BreakscapeRegex.ts';

/**
 * Utility class for breakscaping strings.
 *
 * For the implementation of breakscaping, see:
 * https://github.com/getMoreBrain/bitmark-breakscape
 *
 */

const DEFAULT_BREAKSCAPE_OPTIONS: BreakscapeOptions = {
  format: TextFormat.bitmarkText,
  location: TextLocation.body,
  inPlaceArray: false,
  v2: false,
};

const externalBreakscape = new BreakscapeImpl();

class Breakscape {
  public readonly EMPTY_STRING = '' as BreakscapedString;

  /**
   * Breakscape a string or an array of strings.
   * If the input is an array, a new array will be returned.
   *
   * @param val input value
   * @param options options for breakscaping
   * @param modifyArray
   * @returns the input value with any strings breakscaped.
   */
  public breakscape<T extends string | string[] | undefined>(
    val: T,
    options: BreakscapeOptions,
  ): T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined {
    type R = T extends string
      ? BreakscapedString
      : T extends string[]
        ? BreakscapedString[]
        : undefined;

    const opts = Object.assign({}, DEFAULT_BREAKSCAPE_OPTIONS, options);

    return externalBreakscape.breakscape(val as BreakscapedString, {
      format: opts.format,
      location: opts.location,
      inPlaceArray: opts.inPlaceArray,
      v2: opts.v2,
    }) as R;
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
    options: BreakscapeOptions,
  ): T extends BreakscapedString ? string : T extends BreakscapedString[] ? string[] : undefined {
    type R = T extends BreakscapedString
      ? string
      : T extends BreakscapedString[]
        ? string[]
        : undefined;

    const opts = Object.assign({}, DEFAULT_BREAKSCAPE_OPTIONS, options);

    return externalBreakscape.unbreakscape(val as BreakscapedString, opts) as R;
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
  ): T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined {
    type R = T extends string
      ? BreakscapedString
      : T extends string[]
        ? BreakscapedString[]
        : undefined;

    const opts = Object.assign({}, DEFAULT_BREAKSCAPE_OPTIONS, options);

    return externalBreakscape.breakscapeCode(val as BreakscapedString, opts) as R;
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

const instance = new Breakscape();

export { instance as Breakscape };
