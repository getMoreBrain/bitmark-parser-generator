/**
 *  breakscape.ts
 *  ------------------------------------------------------------
 *  Breakscaping for bitmark text.
 *  (c) 2025 — MIT / public domain
 */

import { PACKAGE_INFO } from '../generated/package_info.ts';
import { BodyTextFormat, type BodyTextFormatType } from '../model/enum/BodyTextFormat.ts';
import { TextLocation, type TextLocationType } from '../model/enum/TextLocation.ts';
import { type BreakscapeOptions } from './BreakscapeOptions.ts';

const DEF = {
  format: BodyTextFormat.bitmarkPlusPlus,
  location: TextLocation.body,
} as const;

// -----------------------------------------------------------------------------
//  ╭──────────────────────────────────────────────────────────────────────────╮
//  │ 1.  LOW‑LEVEL helpers                                                   │
//  ╰──────────────────────────────────────────────────────────────────────────╯

// 1‑a) Trigger characters that start a bit tag construct when they follow "["
const TRIGGERS = new Set('.@#▼►%!?+-$_=&');
// 1‑b) Paired punctuation we have to split with a caret
const HALF_TAGS = new Set(['*', '`', '_', '!', '=']);

/**
 * Predicate – true for every flavour that the spec calls “bitmark text”
 */
function isBitmarkText(fmt: BodyTextFormatType): boolean {
  // Only bitmarkPlusPlus is defined in TextFormat, so only check for that
  return (
    fmt === BodyTextFormat.bitmarkPlusPlus ||
    (fmt as string) === 'bitmark+' ||
    (fmt as string) === 'bitmark--'
  );
}

// -----------------------------------------------------------------------------
// 1‑c) Single‑buffer worker (BREAKSCAPE)
// -----------------------------------------------------------------------------
function breakscapeBuf(src: string, fmt: BodyTextFormatType, loc: TextLocationType): string {
  // If an unrecognized type is passed, return it as is (e.g. true, false, 0, 1, etc.)
  if (!isString(src)) return src;

  const bitmarkText = isBitmarkText(fmt);
  const body = loc === TextLocation.body;
  const inTag = loc === TextLocation.tag;

  const len = src.length;

  // Assume breakscaping will usually increas the length of the string by less than 20%
  // we can allocate a buffer of that size as reallocation is expensive

  const out = new Array<string>(Math.ceil(len * 1.1)); // upper bound

  let atLineStart = true;
  let col = 0;

  for (let i = 0; i < len; ) {
    const ch = src.charCodeAt(i); // number
    const nxt = i + 1 < len ? src.charCodeAt(i + 1) : 0;

    // 1) newline ----------------------------------------------------------
    if (ch === 0x0a) {
      // '\n'
      out.push('\n');
      atLineStart = true;
      col = 0;
      i++;
      continue;
    }

    const space = ch === 0x20 || ch === 0x09; // ' ' or '\t'
    const physicalBOC = col === 0; // zero indent

    // 2) hats -------------------------------------------------------------
    if (bitmarkText || inTag) {
      if (ch === 0x5e) {
        // '^'
        let j = i + 1;
        while (j < len && src.charCodeAt(j) === 0x5e) j++;
        out.push('^'); // extra one
        out.push(src.slice(i, j)); // original run
        col += j - i;
        i = j;
        atLineStart = false;
        continue;
      }
    }

    // 3) inline doubles ---------------------------------------------------
    if (bitmarkText && HALF_TAGS.has(String.fromCharCode(ch))) {
      out.push(String.fromCharCode(ch));
      if (nxt === ch) out.push('^');
      i++;
      col++;
      atLineStart = false;
      continue;
    }

    // 4) end-of-tag -------------------------------------------------------
    if (inTag && ch === 0x5d /* ']' */ && (i === 0 || src.charCodeAt(i - 1) !== 0x5e)) {
      out.push('^', ']');
      i++;
      col++;
      atLineStart = false;
      continue;
    }

    // 5) body-only rules --------------------------------------------------
    if (body) {
      // (a) ### | •  at BOL
      if (
        atLineStart &&
        physicalBOC &&
        bitmarkText &&
        (ch === 0x23 || ch === 0x7c || ch === 0x2022)
      ) {
        let j = i;
        while (j < len && src.charCodeAt(j) === ch) j++;
        out.push(src.slice(i, j));
        if (nxt !== 0x5e) out.push('^');
        col += j - i;
        i = j;
        atLineStart = false;
        continue;
      }

      // (b) '[' + trigger
      if (bitmarkText && ch === 0x5b /* '[' */ && TRIGGERS.has(String.fromCharCode(nxt))) {
        out.push('[', '^');
        i++;
        col++;
        atLineStart = false;
        continue;
      }
    }

    // 6) plain-text "[." or "[^^... ." at BOL
    if (!bitmarkText && body && atLineStart && physicalBOC && ch === 0x5b /* '[' */) {
      // count carets after '['
      let j = i + 1;
      let count = 0;
      while (j < len && src.charCodeAt(j) === 0x5e /* '^' */) {
        count++;
        j++;
      }
      // if next char is dot, escape by adding one more caret
      if (j < len && src.charCodeAt(j) === 0x2e /* '.' */) {
        out.push('[');
        for (let k = 0; k < count + 1; k++) out.push('^');
        col += count + 1;
        i = j; // skip '[' and all carets, next iteration handles '.'
        atLineStart = false;
        continue;
      }
    }

    // default copy --------------------------------------------------------
    out.push(String.fromCharCode(ch));
    if (!space) atLineStart = false;
    col++;
    i++;
  }

  return out.join('');
}

// -----------------------------------------------------------------------------
// 1‑d) Single‑buffer worker (UNBREAKSCAPE)
// -----------------------------------------------------------------------------
function unbreakscapeBuf(src: string, fmt: BodyTextFormatType, loc: TextLocationType): string {
  // If an unrecognized type is passed, return it as is (e.g. true, false, 0, 1, etc.)
  if (!isString(src)) return src;

  const bitmarkText = isBitmarkText(fmt);
  const isTag = loc === TextLocation.tag;
  const isPlainBody = loc === TextLocation.body && !bitmarkText;

  const len = src.length;
  const out = new Array<string>(len); // upper bound
  let outPos = 0;
  let bol = true; // beginning-of-line flag

  for (let i = 0; i < len; ) {
    const ch = src[i] as string;

    // 1) HATS  – remove exactly one ^ from each run
    if ((bitmarkText || isTag) && ch === '^') {
      let j = i + 1;
      while (j < len && src[j] === '^') j++;
      if (j - i > 1) out[outPos++] = src.slice(i + 1, j); // keep the rest
      i = j;
      continue;
    }

    // 2) PLAIN-body “[ ^ .” with zero indent
    if (isPlainBody && bol && ch === '[') {
      let j = i + 1;
      let count = 0;
      while (j < len && src[j] === '^') {
        count++;
        j++;
      }
      if (count >= 1 && j < len && src[j] === '.') {
        out[outPos++] = '[';
        for (let k = 0; k < count - 1; k++) out[outPos++] = '^';
        out[outPos++] = '.';
        i = j + 1;
        bol = false;
        continue;
      }
    }

    // 3) default copy
    out[outPos++] = ch;
    i++;

    // keep bol up to date
    if (ch === '\n') bol = true;
    else if (bol && ch !== ' ' && ch !== '\t') bol = false;
  }

  return out.slice(0, outPos).join('');
}

// -----------------------------------------------------------------------------
//  ╭──────────────────────────────────────────────────────────────────────────╮
//  │ 2.  PUBLIC  API                                                         │
//  ╰──────────────────────────────────────────────────────────────────────────╯

function isString(x: unknown): x is string {
  return typeof x === 'string' || x instanceof String;
}

/**
 * Main class for performing breakscape and unbreakscape operations on bitmark text.
 *
 * Breakscaping is the process of escaping special characters in bitmark text to prevent
 * them from being interpreted as markup. This includes adding caret (^) characters before
 * special characters that would otherwise be interpreted as bitmark syntax.
 *
 * @example
 * ```typescript
 * const breakscape = new Breakscape();
 *
 * // Breakscape a string
 * const escaped = breakscape.breakscape('[.hello]');
 *
 * // Unbreakscape a string
 * const unescaped = breakscape.unbreakscape('[^.hello]');
 *
 * // Process arrays
 * const escapedArray = breakscape.breakscape(['[.hello]', '[.world]']);
 * ```
 *
 * @public
 */
class Breakscape {
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
    const { format: fmt, location: loc } = { ...DEF, ...opts };
    if (val == null) return undefined;
    const proc = (s: string) => breakscapeBuf(s, fmt, loc);
    if (Array.isArray(val)) {
      const a = opts.inPlaceArray ? val : [...val];
      for (let i = 0; i < a.length; i++) if (isString(a[i])) a[i] = proc(a[i] as string);
      return a;
    }
    return proc(val as string);
  }

  /**
   * Removes escape characters (carets) from previously breakscaped bitmark text.
   *
   * This method reverses the breakscape operation by removing caret (^) characters
   * that were added to escape special bitmark syntax.
   *
   * IMPORTANT: Unbreakscaping differs depending on the bit text format, and if the text will
   * be used in a tag or in the body of a bitmark. The default is bitmark++ in the body.
   * If the text is to be used in a tag, or is not bitmark++, you must specify the textFormat
   * and textLocation options.
   *
   * @param val - The input to unbreakscape. Can be a string, array of strings, null, or undefined.
   * @param opts - Optional configuration for the unbreakscape operation.
   * @returns The unbreakscaped result with the same type as the input.
   *
   * @example
   * ```typescript
   * const breakscape = new Breakscape();
   *
   * // Single string
   * breakscape.unbreakscape('[^.hello]'); // Returns '[.hello]'
   *
   * // Array of strings
   * breakscape.unbreakscape(['[^.hello]', '[^.world]']); // Returns ['[.hello]', '[.world]']
   *
   * // With options
   * breakscape.unbreakscape('[^.hello]', {
   *   textFormat: TextFormat.bitmarkPlusPlus,
   *   textLocation: TextLocation.body
   * });
   * ```
   */
  unbreakscape(val: string, opts?: BreakscapeOptions): string;
  unbreakscape(val: string[], opts?: BreakscapeOptions): string[];
  unbreakscape(val: undefined | null, opts?: BreakscapeOptions): undefined;
  unbreakscape(
    val: string | string[] | undefined | null,
    opts: BreakscapeOptions = {},
  ): string | string[] | undefined {
    const { format: fmt, location: loc } = { ...DEF, ...opts };
    if (val == null) return undefined;
    const proc = (s: string) => unbreakscapeBuf(s, fmt, loc);
    if (Array.isArray(val)) {
      const a = opts.inPlaceArray ? val : [...val];
      for (let i = 0; i < a.length; i++) if (isString(a[i])) a[i] = proc(a[i] as string);
      return a;
    }
    return proc(val as string);
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
    _val: T,
    _options?: BreakscapeOptions,
  ): T extends string ? string : T extends string[] ? string[] : undefined {
    throw new Error('breakscapeCode is not implemented.');
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
