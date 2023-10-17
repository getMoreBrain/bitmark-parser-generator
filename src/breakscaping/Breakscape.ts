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
 * To include the special character in a text, use ^^ (once), ^^^ (twice), etc.
 *
 * The following sequences can be breakscaped:
 *  - inline:                                ==         ==>   =^=
 *  - comment:                               ||         ==>   |^|
 *  - remark:                                ::         ==>   :^:
 *  - title block:                   (SOL)[##]#(space)  ==>   (SOL)[##]#^(space)
 *  - new block:                     (SOL)|(WS EOL)     ==>   (SOL)|^(WS EOL)
 *  - code block:                    (SOL)|code(:type)  ==>   (SOL)|^code(:type)
 *  - image block:                   (SOL)|image:(url)  ==>   (SOL)|^image:(url)
 *  - bullet list:                   (SOL)•(space)      ==>   (SOL)•^(space)
 *  - ordered list:                  (SOL)•1(space)     ==>   (SOL)•^1(space)
 *  - tag list +:                    (SOL)•+(space)     ==>   (SOL)•^+(space)
 *  - tag list -:                    (SOL)•-(space)     ==>   (SOL)•^-(space)
 *  - bold:                                  **         ==>   *^*
 *  - light:                                 ``         ==>   `^`
 *  - italic:                                __         ==>   _^_
 *  - highlight:                             !!         ==>   !^!
 *  - start of bit:                          [.         ==>   [^.
 *  - start of property:                     [@         ==>   [^@
 *  - start of title:                        [#         ==>   [^#
 *  - start of anchor:                       [▼         ==>   [^▼
 *  - start of reference:                    [►         ==>   [^►
 *  - start of item/lead:                    [%         ==>   [^%
 *  - start of instruction:                  [!         ==>   [^!
 *  - start of hint:                         [?         ==>   [^?
 *  - start of true statement:               [+         ==>   [^+
 *  - start of false statement:              [-         ==>   [^-
 *  - start of sample solution:              [$         ==>   [^$
 *  - start of gap:                          [_         ==>   [^_
 *  - start of mark:                         [=         ==>   [^=
 *  - start of resource:                     [&         ==>   [^&
 *  - end of tag:                            ]          ==>   ^]
 *
 *
 * The following are breakscaped with ^ in between. Just add more ^s to increase the number of ^ string:
 *  - inline:                                =^=         ==>   =^^=
 *  - comment:                               |^|         ==>   |^^|
 *  - remark:                                :^:         ==>   :^^:
 *  - title block:                   (SOL)[##]#^(space)  ==>   (SOL)[##]#^^(space)
 *  - new block:                     (SOL)|^(WS EOL)     ==>   (SOL)|^^(WS EOL)
 *  - code block:                    (SOL)|^code(:type)  ==>   (SOL)|^^code(:type)
 *  - image block:                   (SOL)|^image:(url)  ==>   (SOL)|^^image:(url)
 *  - bullet list:                   (SOL)•^(space)      ==>   (SOL)•^^(space)
 *  - ordered list:                  (SOL)•^1(space)     ==>   (SOL)•^^1(space)
 *  - tag list +:                    (SOL)•^+(space)     ==>   (SOL)•^^+(space)
 *  - tag list -:                    (SOL)•^-(space)     ==>   (SOL)•^^-(space)
 *  - bold:                                  *^*         ==>   *^^*
 *  - light:                                 `^`         ==>   `^^`
 *  - italic:                                _^_         ==>   _^^_
 *  - highlight:                             !^!         ==>   !^^!
 *  - start of bit:                          [^.         ==>   [^^.
 *  - start of property:                     [^@         ==>   [^^@
 *  - start of title:                        [^#         ==>   [^^#
 *  - start of anchor:                       [^▼         ==>   [^^▼
 *  - start of reference:                    [^►         ==>   [^^►
 *  - start of item/lead:                    [^%         ==>   [^^%
 *  - start of instruction:                  [^!         ==>   [^^!
 *  - start of hint:                         [^?         ==>   [^^?
 *  - start of true statement:               [^+         ==>   [^^+
 *  - start of false statement:              [^-         ==>   [^^-
 *  - start of sample solution:              [^$         ==>   [^^$
 *  - start of gap:                          [^_         ==>   [^^_
 *  - start of mark:                         [^=         ==>   [^^=
 *  - start of resource:                     [^&         ==>   [^^&
 *  - end of tag:                            ^]          ==>   ^^]
 */

//
// Breakscaping
//

const REGEX_MARKS = /([*`_!|:=])([\^]*)\1/;
const REGEX_BLOCKS = /^(\|)([\^]*)(code[\s]*|code:|image:|[\s]*$)/;
const REGEX_TITLE_BLOCKS = /^([#]{1,3})([\^]*)([^\S\r\n]+)/;
const REGEX_LIST_BLOCKS = /^(•)([\^]*)(1|\+|-|)([^\S\r\n]+)/;
const REGEX_START_OF_TAG = /(\[)([\^]*)([.@#▼►%!?+\-$_=&])/;
const REGEX_END_OF_TAG = /([\^]*)(])/;

const BREAKSCAPE_REGEX_SOURCE = `${REGEX_MARKS.source}|${REGEX_BLOCKS.source}|${REGEX_TITLE_BLOCKS.source}|${REGEX_LIST_BLOCKS.source}|${REGEX_START_OF_TAG.source}|${REGEX_END_OF_TAG.source}`;
const UNBREAKSCAPE_REGEX_SOURCE = BREAKSCAPE_REGEX_SOURCE.replace(/(\(\[\\\^\]\*\))/g, '\\^$1'); // Add ^ into the regex

// Regex groups in BODY (bitmark++):
// 1: start of MARK
// 2: ^ in MARK
// 3: start of BLOCK
// 4: ^ in BLOCK
// 5: end of BLOCK
// 6: start of TITLE_BLOCK
// 7: ^ in TITLE_BLOCK
// 8: end of TITLE_BLOCK
// 9: start of LIST_BLOCK
// 10: ^ in LIST_BLOCK
// 11: end of LIST_BLOCK part 1
// 12: end of LIST_BLOCK part 2
// 13: start of START_OF_TAG block
// 14: ^ in START_OF_TAG block
// 15: end of START_OF_TAG block
// 16: ^ in END_OF_TAG block
// 17: end of END_OF_TAG block

const BREAKSCAPE_REGEX = new RegExp(BREAKSCAPE_REGEX_SOURCE, 'gm');
const BREAKSCAPE_REGEX_REPLACER = '$1$3$6$9$13^$2$1$4$5$7$8$10$11$12$14$15$16$17';

const UNBREAKSCAPE_REGEX = new RegExp(UNBREAKSCAPE_REGEX_SOURCE, 'gm');
const UNBREAKSCAPE_REGEX_REPLACER = BREAKSCAPE_REGEX_REPLACER.replace(/\^/g, ''); // Remove ^ from the regex replacer

// Regex explanation:
// - match a single | or • or # character at the start of a line and capture in group 1
// This will capture all new block characters within the code text.
// Replace with group 1, ^
const BREAKSCAPE_CODE_REGEX = new RegExp('^(\\||•|#)', 'gm');
const BREAKSCAPE_CODE_REGEX_REPLACER = '$1^';

//
// Unbreakscaping
//

export interface BreakscapeOptions {
  /**
   * if true, the original array will be modified rather than a copy being made
   */
  modifyArray?: boolean;
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
      str = str.replace(BREAKSCAPE_REGEX, BREAKSCAPE_REGEX_REPLACER);

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
      str = str.replace(UNBREAKSCAPE_REGEX, UNBREAKSCAPE_REGEX_REPLACER);

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
