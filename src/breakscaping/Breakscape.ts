import type * as BreakscapeModule from '@gmb/bitmark-breakscape';

import { BreakscapedString } from '../model/ast/BreakscapedString';
import { TextFormat, TextFormatType } from '../model/enum/TextFormat';
import { TextLocation, TextLocationType } from '../model/enum/TextLocation';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ExternalBreakscape = require('@gmb/bitmark-breakscape') as typeof BreakscapeModule;

/**
 * Utility class for breakscaping strings.
 *
 * For the implementation of breakscaping, see:
 * https://github.com/getMoreBrain/bitmark-breakscape
 *
 */

export interface BreakscapeOptions {
  /**
   * The format of the text being breakscaped, defaults to TextFormat.bitmarkText
   */
  textFormat: TextFormatType;

  /**
   * The location of the text being breakscaped, defaults to TextLocation.body
   */
  textLocation: TextLocationType;

  /**
   * if true, the original array will be modified rather than a copy being made
   */
  inPlaceArray?: boolean;

  /**
   * if true, perform v2 breakscaping from JSON
   */
  v2?: boolean;
}

const DEFAULT_BREAKSCAPE_OPTIONS: BreakscapeOptions = {
  textFormat: TextFormat.bitmarkText,
  textLocation: TextLocation.body,
  inPlaceArray: false,
  v2: false,
};

const externalBreakscape = new ExternalBreakscape.Breakscape();

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
    type R = T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined;

    const opts = Object.assign({}, DEFAULT_BREAKSCAPE_OPTIONS, options);

    return externalBreakscape.breakscape(val as BreakscapedString, {
      format: opts.textFormat,
      location: opts.textLocation,
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
    type R = T extends BreakscapedString ? string : T extends BreakscapedString[] ? string[] : undefined;

    const opts = Object.assign({}, DEFAULT_BREAKSCAPE_OPTIONS, options);

    return externalBreakscape.unbreakscape(val as BreakscapedString, {
      format: opts.textFormat,
      location: opts.textLocation,
      inPlaceArray: opts.inPlaceArray,
      v2: opts.v2,
    }) as R;
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
    type R = T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined;

    const opts = Object.assign({}, DEFAULT_BREAKSCAPE_OPTIONS, options);

    return externalBreakscape.breakscapeCode(val as BreakscapedString, {
      format: opts.textFormat,
      location: opts.textLocation,
      inPlaceArray: opts.inPlaceArray,
      v2: opts.v2,
    }) as R;
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
