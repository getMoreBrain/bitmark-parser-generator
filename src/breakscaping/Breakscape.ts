import { BreakscapedString } from '../model/ast/BreakscapedString';
import { StringUtils } from '../utils/StringUtils';

/**
 * Utility class for breakscaping strings.
 *
 * Breakscaping is the process of escaping certain character sequences in a string so that they are not interpreted as
 * special sequences by the parser.
 *
 * This is different from escaping in that when escaping, single characters tend to be escaped, rather than sequences
 * being broken (split) by a special charater.
 *
 * The special character is ^
 * To include the special character in a text which is breakscaped, use ^^ (once), ^^^ (twice), etc.
 *
 * Any sequence can be breakscaped by breaking it with a ^ character.
 *
 * The following unbreakscaping rules are applied when unbreakscaping text:
 *  - hat:                                   ^                  ==>
 *  - hat:                                   ^^                 ==>   ^
 *  - hat:                                   ^..N               ==>   ^..N-1
 *
 * The following breakscaping rules are applied when breakscaping text:
 *  - hat:                                   ^                  ==>   ^^
 *  - hat:                                   ^^                 ==>   ^^^
 *  - hat:                                   ^..N               ==>   ^..N+1
 *  - inline:                                ==                 ==>   =^=
 *  - title block:                   (SOL)[##]#(space)          ==>   (SOL)[##]#^(space)
 *  - new block:                     (SOL)|(WS EOL)             ==>   (SOL)|^(WS EOL)
 *  - code block:                    (SOL)|code(:type)          ==>   (SOL)|^code(:type)
 *  - image block:                   (SOL)|image:(url)          ==>   (SOL)|^image:(url)
 *  - bullet list:                   (SOL)•(space)              ==>   (SOL)•^(space)
 *  - simple list:                   (SOL)•_(space)             ==>   (SOL)•^_(space)
 *  - ordered list (numeric):        (SOL)•<numbers>(space)     ==>   (SOL)•^<numbers>(space)
 *  - ordered list: (roman,lower)    (SOL)•<numbers>i(space)    ==>   (SOL)•^<numbers>i(space)
 *  - ordered list: (roman,upper)    (SOL)•<numbers>I(space)    ==>   (SOL)•^<numbers>I(space)
 *  - ordered list:                  (SOL)•<letters>(space)     ==>   (SOL)•^<letters>(space)
 *  - tag list +:                    (SOL)•+(space)             ==>   (SOL)•^+(space)
 *  - tag list -:                    (SOL)•-(space)             ==>   (SOL)•^-(space)
 *  - bold:                                  **                 ==>   *^*
 *  - half-bold (at end):                    *<end>             ==>   *^<end>
 *  - half-bold (at start):                  <start>*           ==>   <start>^*
 *  - light:                                 ``                 ==>   `^`
 *  - half-light (at end):                   `<end>             ==>   `^<end>
 *  - half-light (at start):                 <start>`           ==>   <start>^`
 *  - italic:                                __                 ==>   _^_
 *  - half-italic (at end):                  _<end>             ==>   _^<end>
 *  - half-italic (at start):                <start>_           ==>   <start>^_
 *  - highlight:                             !!                 ==>   !^!
 *  - half-highlight (at end):               !<end>             ==>   !^<end>
 *  - half-highlight (at start):             <start>!           ==>   <start>^!
 *  - start of bit (at end):                 [<end>             ==>   [^<end>
 *  - start of bit:                          [.                 ==>   [^.
 *  - start of property:                     [@                 ==>   [^@
 *  - start of title:                        [#                 ==>   [^#
 *  - start of anchor:                       [▼                 ==>   [^▼
 *  - start of reference:                    [►                 ==>   [^►
 *  - start of item/lead:                    [%                 ==>   [^%
 *  - start of instruction:                  [!                 ==>   [^!
 *  - start of hint:                         [?                 ==>   [^?
 *  - start of true statement:               [+                 ==>   [^+
 *  - start of false statement:              [-                 ==>   [^-
 *  - start of sample solution:              [$                 ==>   [^$
 *  - start of gap:                          [_                 ==>   [^_
 *  - start of mark:                         [=                 ==>   [^=
 *  - start of resource:                     [&                 ==>   [^&
 *  - end of tag:                            ]                  ==>   ^]
 *
 * In non- bitmark++ / bitmark-- text, breakscaping is only applied to bit tags.
 * This is true for both breakscaping and unbreakscaping.
 *
 * The following unbreakscaping rules are applied when unbreakscaping plain text:
 *  - start of bit:              <line start>[^.                ==>   <line start>[.
 *  - start of bit:              <line start>[^^.               ==>   <line start>[^.
 *  - start of bit:              <line start>[^..N.             ==>   <line start>[^..N-1.
 *
 * The following breakscaping rules are applied when breakscaping plain text:
 *  - start of bit:              <line start>[.                 ==>   <line start>[^.
 *  - start of bit:              <line start>[^.                ==>   <line start>[^^.
 *  - start of bit:              <line start>[^..N.             ==>   <line start>[^..N+1.
 */

//
// Breakscaping
//

const REGEX_MARKS = /([*`_!=])(?=\1)/; // $1^
const REGEX_BLOCKS = /^(\|)(code[\s]*|code:|image:|[\s]*$)/; // $2^$3
const REGEX_TITLE_BLOCKS = /^([#]{1,3})([^\S\r\n]+)/; // $4^$5
const REGEX_LIST_BLOCKS = /^(•)([0-9]+[iI]*|[a-zA-Z]{1}|_|\+|-|)([^\S\r\n]+)/; // $6^$7$8
const REGEX_START_OF_TAG = /(\[)([.@#▼►%!?+\-$_=&])/; // $9^$10
const REGEX_FOOTER_DIVIDER = /^(~)(~~~)[ \t]*$/; // $11^$12
const REGEX_PLAIN_TEXT_DIVIDER = /^(\$)(\$\$\$)[ \t]*$/; // $13^$14
const REGEX_END_OF_TAG = /(\^*])/; // ^$15
const REGEX_HATS = /(\^+)/; // $16^  // Must be last

const BREAKSCAPE_REGEX_SOURCE = `${REGEX_MARKS.source}|${REGEX_BLOCKS.source}|${REGEX_TITLE_BLOCKS.source}|${REGEX_LIST_BLOCKS.source}|${REGEX_START_OF_TAG.source}|${REGEX_FOOTER_DIVIDER.source}|${REGEX_PLAIN_TEXT_DIVIDER.source}|${REGEX_END_OF_TAG.source}|${REGEX_HATS.source}`;
// const BREAKSCAPE_REGEX_SOURCE = `${REGEX_MARKS.source}|${REGEX_START.source}|${REGEX_END.source}|${REGEX_BLOCKS.source}|${REGEX_TITLE_BLOCKS.source}|${REGEX_LIST_BLOCKS.source}|${REGEX_START_OF_TAG.source}|${REGEX_FOOTER_DIVIDER.source}|${REGEX_PLAIN_TEXT_DIVIDER.source}|${REGEX_END_OF_TAG.source}|${REGEX_HATS.source}`;

const REGEX_START = /^([*`_!=])/; // ^$1
const REGEX_END = /([*`_!=\\[])$/; // $2^
const BREAKSCAPE_ENDS_REGEX_SOURCE = `${REGEX_START.source}|${REGEX_END.source}`;

const BREAKSCAPE_REGEX = new RegExp(BREAKSCAPE_REGEX_SOURCE, 'gm');
const BREAKSCAPE_REGEX_REPLACER = '$1$2$4$6$9$11$13$16^$3$5$7$8$10$12$14$15';
// const BREAKSCAPE_REGEX_REPLACER = '$1$3$4$6$8$11$13$15$18^$1$2$5$7$9$10$12$14$16$17';
const BREAKSCAPE_ENDS_REGEX = new RegExp(BREAKSCAPE_ENDS_REGEX_SOURCE, 'g');
const BREAKSCAPE_ENDS_REGEX_REPLACER = '$2^$1';
const BREAKSCAPE_BIT_TAG_ONLY_REGEX = new RegExp('^(\\[)(\\^*)(\\.)', 'gm');
const BREAKSCAPE_BIT_TAG_ONLY_REGEX_REPLACER = '$1^$2$3';

// const UNBREAKSCAPE_REGEX = new RegExp(UNBREAKSCAPE_REGEX_SOURCE, 'gm');
// const UNBREAKSCAPE_REGEX_REPLACER = BREAKSCAPE_REGEX_REPLACER.replace(/\^/g, ''); // Remove ^ from the regex replacer

const UNBREAKSCAPE_REGEX = new RegExp('\\^([\\^]*)', 'gm');
const UNBREAKSCAPE_REGEX_REPLACER = '$1';
const UNBREAKSCAPE_BIT_TAG_ONLY_REGEX = new RegExp('^(\\[)\\^(\\^*)(\\.)', 'gm');
const UNBREAKSCAPE_BIT_TAG_ONLY_REGEX_REPLACER = '$1$2$3';

// Regex explanation:
// - match a single | or • or # character at the start of a line and capture in group 1
// This will capture all new block characters within the code text.
// Replace with group 1, ^
const BREAKSCAPE_CODE_REGEX = new RegExp('^(\\||•|#)', 'gm');
const BREAKSCAPE_CODE_REGEX_REPLACER = '$1^';

export interface BreakscapeOptions {
  /**
   * if true, the original array will be modified rather than a copy being made
   */
  modifyArray?: boolean;

  /**
   * if true, only the bit start tag will be (un-)breakscaped
   */
  bitTagOnly?: boolean;
}

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
    options?: BreakscapeOptions,
  ): T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined {
    type R = T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined;

    if (val == null) return val as unknown as R;

    const opts = Object.assign({}, options);

    const breakscapeStr = (str: string) => {
      if (!str) return str;
      const regex = opts.bitTagOnly ? BREAKSCAPE_BIT_TAG_ONLY_REGEX : BREAKSCAPE_REGEX;
      const replacer = opts.bitTagOnly ? BREAKSCAPE_BIT_TAG_ONLY_REGEX_REPLACER : BREAKSCAPE_REGEX_REPLACER;
      str = str.replace(regex, replacer);

      // Ends
      if (!opts.bitTagOnly) {
        str = str.replace(BREAKSCAPE_ENDS_REGEX, BREAKSCAPE_ENDS_REGEX_REPLACER);
      }

      return str;
    };

    if (Array.isArray(val)) {
      const newVal: unknown[] = opts.modifyArray ? val : [val.length];
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
    options?: BreakscapeOptions,
  ): T extends BreakscapedString ? string : T extends BreakscapedString[] ? string[] : undefined {
    type R = T extends BreakscapedString ? string : T extends BreakscapedString[] ? string[] : undefined;

    if (val == null) return val as unknown as R;

    const opts = Object.assign({}, options);

    const unbreakscapeStr = (str: string) => {
      if (!str) return str;
      const regex = opts.bitTagOnly ? UNBREAKSCAPE_BIT_TAG_ONLY_REGEX : UNBREAKSCAPE_REGEX;
      const replacer = opts.bitTagOnly ? UNBREAKSCAPE_BIT_TAG_ONLY_REGEX_REPLACER : UNBREAKSCAPE_REGEX_REPLACER;
      str = str.replace(regex, replacer);

      return str;
    };

    if (Array.isArray(val)) {
      const newVal: unknown[] = opts.modifyArray ? val : [];
      for (let i = 0, len = val.length; i < len; i++) {
        const v = val[i];
        if (StringUtils.isString(v)) {
          newVal[i] = unbreakscapeStr(v);
        } else {
          newVal[i] = v;
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
    options?: BreakscapeOptions,
  ): T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined {
    type R = T extends string ? BreakscapedString : T extends string[] ? BreakscapedString[] : undefined;

    if (val == null) return val as unknown as R;

    const opts = Object.assign({}, options);

    const breakscapeStr = (str: string) => {
      if (!str) return str;
      return str.replace(BREAKSCAPE_CODE_REGEX, BREAKSCAPE_CODE_REGEX_REPLACER);
    };

    if (Array.isArray(val)) {
      const newVal: unknown[] = opts.modifyArray ? val : [val.length];
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

const instance = new Breakscape();

export { instance as Breakscape };
