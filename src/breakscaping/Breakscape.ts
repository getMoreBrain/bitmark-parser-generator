import { BreakscapedString } from '../model/ast/BreakscapedString';
import { TextFormat, TextFormatType } from '../model/enum/TextFormat';
import { StringUtils } from '../utils/StringUtils';

/**
 * Utility class for breakscaping strings.
 *
 * ============
 * Breakscaping
 * ============
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
 * Any sequence can be breakscaped by breaking it with a single ^ character.
 *
 * When breakscaping text programmatically, the following rules apply to keep the breakscaping to a minimum:
 *
 * The following breakscaping rules are applied when breakscaping text:
 *    <item>                                 <from>                   <to>                       <textFormat>
 *  - hat:                                   ^                  ==>   ^^                         [bitmark-- / bitmark++]
 *  - hat:                                   ^^                 ==>   ^^^                        [bitmark-- / bitmark++]
 *  - hat:                                   ^..N               ==>   ^..N+1                     [bitmark-- / bitmark++]
 *  - inline:                                ==                 ==>   =^=                        [bitmark-- / bitmark++]
 *  - bold:                                  **                 ==>   *^*                        [bitmark-- / bitmark++]
 *  - light:                                 ``                 ==>   `^`                        [bitmark-- / bitmark++]
 *  - italic:                                __                 ==>   _^_                        [bitmark-- / bitmark++]
 *  - highlight:                             !!                 ==>   !^!                        [bitmark-- / bitmark++]
 *  - start of bit (at end):                 [<end>             ==>   [^<end>                    [bitmark-- / bitmark++] NOTE: this is not required if the generator performs a check for building accidental [., [@, etc
 *  - start of bit:                          [.                 ==>   [^.                        [bitmark-- / bitmark++]
 *  - start of property:                     [@                 ==>   [^@                        [bitmark-- / bitmark++]
 *  - start of title:                        [#                 ==>   [^#                        [bitmark-- / bitmark++]
 *  - start of anchor:                       [▼                 ==>   [^▼                        [bitmark-- / bitmark++]
 *  - start of reference:                    [►                 ==>   [^►                        [bitmark-- / bitmark++]
 *  - start of item/lead:                    [%                 ==>   [^%                        [bitmark-- / bitmark++]
 *  - start of instruction:                  [!                 ==>   [^!                        [bitmark-- / bitmark++]
 *  - start of hint:                         [?                 ==>   [^?                        [bitmark-- / bitmark++]
 *  - start of true statement:               [+                 ==>   [^+                        [bitmark-- / bitmark++]
 *  - start of false statement:              [-                 ==>   [^-                        [bitmark-- / bitmark++]
 *  - start of sample solution:              [$                 ==>   [^$                        [bitmark-- / bitmark++]
 *  - start of gap:                          [_                 ==>   [^_                        [bitmark-- / bitmark++]
 *  - start of mark:                         [=                 ==>   [^=                        [bitmark-- / bitmark++]
 *  - start of resource:                     [&                 ==>   [^&                        [bitmark-- / bitmark++]
 *  - old plain text divider:                $$$$               ==>   $^$$$                      [bitmark-- / bitmark++]
 *  - old footer divider:                    ~~~~               ==>   ~^~~~                      [bitmark-- / bitmark++]
 *  - title block:                   (SOL)[##]#(space)          ==>   (SOL)[##]#^(space)         [bitmark++]
 *  - new block:                     (SOL)|(WS EOL)             ==>   (SOL)|^(WS EOL)            [bitmark++]
 *  - code block:                    (SOL)|code(:type)          ==>   (SOL)|^code(:type)         [bitmark++]
 *  - image block:                   (SOL)|image:(url)          ==>   (SOL)|^image:(url)         [bitmark++]
 *  - bullet list:                   (SOL)•(space)              ==>   (SOL)•^(space)             [bitmark++]
 *  - simple list:                   (SOL)•_(space)             ==>   (SOL)•^_(space)            [bitmark++]
 *  - ordered list (numeric):        (SOL)•<numbers>(space)     ==>   (SOL)•^<numbers>(space)    [bitmark++]
 *  - ordered list: (roman,lower)    (SOL)•<numbers>i(space)    ==>   (SOL)•^<numbers>i(space)   [bitmark++]
 *  - ordered list: (roman,upper)    (SOL)•<numbers>I(space)    ==>   (SOL)•^<numbers>I(space)   [bitmark++]
 *  - ordered list:                  (SOL)•<letters>(space)     ==>   (SOL)•^<letters>(space)    [bitmark++]
 *  - tag list +:                    (SOL)•+(space)             ==>   (SOL)•^+(space)            [bitmark++]
 *  - tag list -:                    (SOL)•-(space)             ==>   (SOL)•^-(space)            [bitmark++]
 *  - start of bit:                  (SOL)[.                    ==>   (SOL)[^.                   [plain]
 *  - start of bit:                  (SOL)[^.                   ==>   (SOL)[^^.                  [plain]
 *  - start of bit:                  (SOL)[^..N.                ==>   (SOL)[^..N+1.              [plain]
 *  - end of tag:                            ]                  ==>   ^]                         [tag]
 *
 *
 * ==============
 * Unbreakscaping
 * ==============
 *
 * Unbreakscaping is the process of removing the breakscaping characters from a string.
 * It is the opposite of breakscaping.
 *
 * In all text but plain text:
 * ^ is always removed/reduced wherever it is found.
 * ^^ is always needed to represent a ^.
 *
 * In plain text:
 * ^ is only removed/reduced when it would break the start of a bit.
 *
 * The following unbreakscaping rules apply when unbreakscaping text:
 *   <item>                                 <from>                         <to>                 <textFormat>
 * - hat:                                   ^                   ==>                             [!plain]
 * - hat:                                   ^^                  ==>        ^                    [!plain]
 * - hat:                                   ^..N                ==>        ^..N-1               [!plain]
 * - start of bit:                     (SOL)[^.                 ==>   (SOL)[.                   [plain]
 * - start of bit:                     (SOL)[^^.                ==>   (SOL)[^.                  [plain]
 * - start of bit:                     (SOL)[^..N.              ==>   (SOL)[^..N-1.             [plain]
 *
 */

//
// Breakscaping
//

// RAS 2025-05-21
// See: https://github.com/getMoreBrain/cosmic/issues/7919
// We now only unbreakscape differently in plain in body text (see UNBREAKSCAPE_PLAIN_IN_BODY_REGEX).
// In plain tag text or bitmark text, we ALWAYS need ^^ for ^ as ^ can breakscape anywhere, not just where needed.
// This is by request from Gaba.
const SPECIFIC_UNBREAKSCAPING = false; // true;

const REGEX_MARKS = /([*`_!=])(?=\1)/; // $1^
const REGEX_BLOCKS = /^(\|)(code[\s]*|code:|image:|[\s]*$)/; // $2^$3
const REGEX_TITLE_BLOCKS = /^([#]{1,3})([^\S\r\n]+)/; // $4^$5
const REGEX_LIST_BLOCKS = /^(•)([0-9]+[iI]*|[a-zA-Z]{1}|_|\+|-|)([^\S\r\n]+)/; // $6^$7$8
const REGEX_START_OF_TAG = /(\[)([.@#▼►%!?+\-$_=&])/; // $9^$10   /   $2^$3
const REGEX_FOOTER_DIVIDER = /^(~)(~~~[ \t]*)$/; // $11^$12   /   $4^$5
const REGEX_PLAIN_TEXT_DIVIDER = /^(\$)(\$\$\$[ \t]*)$/; // $13^$14   /   $6^$7
const REGEX_END_OF_TAG = /(\^*])/; // ^$15   /   ^$8
const REGEX_HATS = /(\^+)/; // $16^   /   ^$9  // Must be last

const BREAKSCAPE_PLUSPLUS_REGEX_SOURCE = `${REGEX_MARKS.source}|${REGEX_BLOCKS.source}|${REGEX_TITLE_BLOCKS.source}|${REGEX_LIST_BLOCKS.source}|${REGEX_START_OF_TAG.source}|${REGEX_FOOTER_DIVIDER.source}|${REGEX_PLAIN_TEXT_DIVIDER.source}|${REGEX_END_OF_TAG.source}|${REGEX_HATS.source}`;
const BREAKSCAPE_MINUSMINUS_REGEX_SOURCE = `${REGEX_MARKS.source}|${REGEX_START_OF_TAG.source}|${REGEX_FOOTER_DIVIDER.source}|${REGEX_PLAIN_TEXT_DIVIDER.source}|${REGEX_END_OF_TAG.source}|${REGEX_HATS.source}`;

const REGEX_END = /([\\[])$/; // $1^
const BREAKSCAPE_ENDS_REGEX_SOURCE = `${REGEX_END.source}`;

const BREAKSCAPE_PLUSPLUS_REGEX = new RegExp(BREAKSCAPE_PLUSPLUS_REGEX_SOURCE, 'gm');
const BREAKSCAPE_PLUSPLUS_REGEX_REPLACER = '$1$2$4$6$9$11$13$16^$3$5$7$8$10$12$14$15';

const BREAKSCAPE_MINUSMINUS_REGEX = new RegExp(BREAKSCAPE_MINUSMINUS_REGEX_SOURCE, 'gm');
const BREAKSCAPE_MINUSMINUS_REGEX_REPLACER = '$1$2$4$6^$3$5$7$8$9';

const BREAKSCAPE_PLAIN_IN_BODY_REGEX = new RegExp('^(\\[)(\\^*)(\\.)', 'gm');
const BREAKSCAPE_PLAIN_IN_BODY_REGEX_REPLACER = '$1^$2$3';

const BREAKSCAPE_TAG_REGEX = new RegExp('(\\^*)(\\])', 'gm');
const BREAKSCAPE_TAG_REPLACER = '$1^$2';

const BREAKSCAPE_V2_REGEX = new RegExp('^(?:(\\[)(\\^*)(\\.))|(?:(\\^+))', 'gm');
const BREAKSCAPE_V2_REGEX_REPLACER = '$1$4^$2$3';

const BREAKSCAPE_ENDS_REGEX = new RegExp(BREAKSCAPE_ENDS_REGEX_SOURCE, 'g');
const BREAKSCAPE_ENDS_REGEX_REPLACER = '$1^';

const UNBREAKSCAPE_REGEX = new RegExp('\\^([\\^]*)', 'gm');
const UNBREAKSCAPE_REGEX_REPLACER = '$1';

const UNBREAKSCAPE_TAG_REGEX = new RegExp('\\^(\\^*)(\\])', 'gm');
const UNBREAKSCAPE_TAG_REPLACER = '$1$2';

const UNBREAKSCAPE_PLAIN_IN_BODY_REGEX = new RegExp('^(\\[)\\^(\\^*)(\\.)', 'gm');
const UNBREAKSCAPE_PLAIN_IN_BODY_REGEX_REPLACER = '$1$2$3';

// Regex explanation:
// - match a single | or • or # character at the start of a line and capture in group 1
// This will capture all new block characters within the code text.
// Replace with group 1, ^
const BREAKSCAPE_CODE_REGEX = new RegExp('^(\\||•|#)', 'gm');
const BREAKSCAPE_CODE_REGEX_REPLACER = '$1^';

export interface BreakscapeOptions {
  /**
   * The format of the text being breakscaped, defaults to TextFormat.bitmarkMinusMinus
   */
  textFormat: TextFormatType;

  /**
   * if true, the original array will be modified rather than a copy being made
   */
  modifyArray?: boolean;

  /**
   * if true, perform v2 breakscaping from JSON
   */
  v2?: boolean;
}

const DEFAULT_BREAKSCAPE_OPTIONS: BreakscapeOptions = {
  textFormat: TextFormat.bitmarkMinusMinus,
};

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

    if (val == null) return val as unknown as R;

    const opts = Object.assign({}, DEFAULT_BREAKSCAPE_OPTIONS, options);

    const breakscapeStr = (str: string) => {
      if (!str) return str;

      let regex = BREAKSCAPE_PLAIN_IN_BODY_REGEX;
      let replacer = BREAKSCAPE_PLAIN_IN_BODY_REGEX_REPLACER;
      if (opts.textFormat === TextFormat.tag) {
        regex = BREAKSCAPE_TAG_REGEX;
        replacer = BREAKSCAPE_TAG_REPLACER;
      } else if (opts.textFormat === TextFormat.bitmarkMinusMinus) {
        if (opts.v2) {
          // Hack for v2 breakscaping
          regex = BREAKSCAPE_V2_REGEX;
          replacer = BREAKSCAPE_V2_REGEX_REPLACER;
        } else {
          regex = BREAKSCAPE_MINUSMINUS_REGEX;
          replacer = BREAKSCAPE_MINUSMINUS_REGEX_REPLACER;
        }
      } else if (opts.textFormat === TextFormat.bitmarkPlusPlus) {
        if (opts.v2) {
          // Hack for v2 breakscaping
          regex = BREAKSCAPE_V2_REGEX;
          replacer = BREAKSCAPE_V2_REGEX_REPLACER;
        } else {
          regex = BREAKSCAPE_PLUSPLUS_REGEX;
          replacer = BREAKSCAPE_PLUSPLUS_REGEX_REPLACER;
        }
      }

      str = str.replace(regex, replacer);

      // Ends - ensures that the start and end of the string are breakscaped in cases where the ends could otherwise
      // come together to form a recognized sequence
      // TODO: this should not be needed in the future
      if (!opts.v2) {
        if (opts.textFormat === TextFormat.bitmarkMinusMinus || opts.textFormat === TextFormat.bitmarkPlusPlus) {
          str = str.replace(BREAKSCAPE_ENDS_REGEX, BREAKSCAPE_ENDS_REGEX_REPLACER);
        }
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

    const opts = Object.assign({}, DEFAULT_BREAKSCAPE_OPTIONS, options);

    const unbreakscapeStr = (str: string) => {
      if (!str) return str;

      let regex = UNBREAKSCAPE_PLAIN_IN_BODY_REGEX;
      let replacer = UNBREAKSCAPE_PLAIN_IN_BODY_REGEX_REPLACER;
      if (opts.textFormat === TextFormat.tag) {
        regex = SPECIFIC_UNBREAKSCAPING ? UNBREAKSCAPE_TAG_REGEX : UNBREAKSCAPE_REGEX;
        replacer = SPECIFIC_UNBREAKSCAPING ? UNBREAKSCAPE_TAG_REPLACER : UNBREAKSCAPE_REGEX_REPLACER;
      } else if (opts.textFormat === TextFormat.bitmarkMinusMinus || opts.textFormat === TextFormat.bitmarkPlusPlus) {
        regex = UNBREAKSCAPE_REGEX;
        replacer = UNBREAKSCAPE_REGEX_REPLACER;
      }

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

    const opts = Object.assign({}, DEFAULT_BREAKSCAPE_OPTIONS, options);

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
