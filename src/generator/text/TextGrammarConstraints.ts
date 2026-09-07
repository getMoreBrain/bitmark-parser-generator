/**
 * Mirror of the value rules in the bitmark text grammar (assets/grammar/text/text-grammar.pegjs).
 *
 * The text generator must only write markup the text parser turns back into the JSON it came
 * from. Every value written into markup is checked against the grammar rule that will consume
 * it, using the predicates here. The grammar is the source of truth; these tables mirror it and
 * `test/unit/generator/text-grammar-constraints-sync.test.ts` fails if they drift.
 */

/** Grammar version these constraints mirror (VERSION constant in text-grammar.pegjs) */
export const TEXT_GRAMMAR_VERSION = '8.41.1';

/** Grammar rule: Color */
export const COLORS: readonly string[] = [
  'aqua',
  'black',
  'blue',
  'brown',
  'fuchsia',
  'lightgrey',
  'gray',
  'darkgray',
  'green',
  'lime',
  'magenta',
  'maroon',
  'navy',
  'olive',
  'orange',
  'pink',
  'purple',
  'red',
  'silver',
  'teal',
  'violet',
  'white',
  'yellow',
];

/** Grammar rule: HighlightColor */
export const HIGHLIGHT_COLORS: readonly string[] = [
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'brown',
  'white',
  'black',
  'gray',
];

/** Grammar rule: AlternativeStyleTags */
export const ALTERNATIVE_STYLE_TAGS: readonly string[] = [
  'bold',
  'italic',
  'light',
  'highlightOrange',
  'highlightYellow',
  'highlightGreen',
  'highlightBlue',
  'highlightPurple',
  'highlightPink',
  'highlightBrown',
  'highlightBlack',
  'highlightWhite',
  'highlightGray',
  'highlight',
  'strike',
  'subscript',
  'superscript',
  'ins',
  'del',
  'underline',
  'doubleUnderline',
  'smallcaps',
  'circle',
  'languageEmRed',
  'languageEmOrange',
  'languageEmYellow',
  'languageEmGreen',
  'languageEmBlue',
  'languageEmPurple',
  'languageEmPink',
  'languageEmBrown',
  'languageEmBlack',
  'languageEmWhite',
  'languageEmGray',
  'languageEm',
  'userUnderline',
  'userDoubleUnderline',
  'userStrike',
  'userCircle',
  'userHighlight',
  'notranslate',
];

/** Grammar rule: MediaAlignment */
export const MEDIA_ALIGNMENTS: readonly string[] = ['left', 'center', 'right'];

/** Grammar rule: InlineMediaAlignment */
export const INLINE_MEDIA_ALIGNMENTS: readonly string[] = [
  'top',
  'middle',
  'bottom',
  'baseline',
  'sub',
  'super',
  'text-bottom',
  'text-top',
];

/** Grammar rule: InlineMediaSize */
export const INLINE_MEDIA_SIZES: readonly string[] = [
  'line-height',
  'font-height',
  'super',
  'sub',
  'explicit',
];

/** Grammar rule: MediaSizeTags */
export const MEDIA_SIZE_TAGS: readonly string[] = ['width', 'height'];
/** Grammar rule: MediaTextTags */
export const MEDIA_TEXT_TAGS: readonly string[] = ['alt', 'caption'];
/** Grammar rule: MediaBooleanTags */
export const MEDIA_BOOLEAN_TAGS: readonly string[] = ['zoomDisabled'];

const LINE_TERMINATOR_REGEX = /[\n\r\u2028\u2029]/;
const CHAIN_STRING_INVALID_REGEX = /[|\n\r\u2028\u2029]/;

// Grammar rule: UrlChars = [a-zA-Z0-9!*'()=+-/._?#@[\]$&(),;%:{}] / '~' / '^' / "'"
// ('+-/' is a range: + , - . /)
const URL_CHAR_CLASS = "a-zA-Z0-9!*'()=+,\\-./_?#@[\\]$&;%:{}~^";
const URL_CHAR_REGEX = new RegExp(`^[${URL_CHAR_CLASS}]$`);
const URL_HTTP_REGEX = new RegExp(`^https?://[${URL_CHAR_CLASS}]*$`);
const URL_REGEX = new RegExp(`^(https?://|mailto:)[${URL_CHAR_CLASS}]*$`);

/** Value of `$((!BlockTag char)*)` chain segments: no `|`, no line terminator. */
export function isChainString(v: unknown): v is string {
  return typeof v === 'string' && !CHAIN_STRING_INVALID_REGEX.test(v);
}

/** A string without line terminators (`char+` rules). */
export function isSingleLine(v: unknown): v is string {
  return typeof v === 'string' && !LINE_TERMINATOR_REGEX.test(v);
}

export function hasLineTerminator(v: string): boolean {
  return LINE_TERMINATOR_REGEX.test(v);
}

export function isColor(v: unknown): v is string {
  return typeof v === 'string' && COLORS.indexOf(v) !== -1;
}

export function isHighlightColor(v: unknown): v is string {
  return typeof v === 'string' && HIGHLIGHT_COLORS.indexOf(v) !== -1;
}

export function isMediaAlignment(v: unknown): v is string {
  return typeof v === 'string' && MEDIA_ALIGNMENTS.indexOf(v) !== -1;
}

export function isInlineMediaAlignment(v: unknown): v is string {
  return typeof v === 'string' && INLINE_MEDIA_ALIGNMENTS.indexOf(v) !== -1;
}

export function isInlineMediaSize(v: unknown): v is string {
  return typeof v === 'string' && INLINE_MEDIA_SIZES.indexOf(v) !== -1;
}

/** `[0-9]+`: a non-negative integer, or a string of digits. Returns the integer, or undefined. */
export function toUInt(v: unknown): number | undefined {
  if (typeof v === 'number') return Number.isInteger(v) && v >= 0 ? v : undefined;
  if (typeof v === 'string' && /^[0-9]+$/.test(v)) return parseInt(v, 10);
  return undefined;
}

/** `Boolean` rule: `true` / `false`. Returns the boolean, or undefined. */
export function toBoolean(v: unknown): boolean | undefined {
  if (typeof v === 'boolean') return v;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
}

/** `'P' $((!BlockTag char)*)`: ISO-8601 duration chain value. */
export function isDuration(v: unknown): v is string {
  return isChainString(v) && v.trim().startsWith('P');
}

/** `UrlHttp` rule: block image src. */
export function isUrlHttp(v: unknown): v is string {
  return typeof v === 'string' && URL_HTTP_REGEX.test(v);
}

/** `Url` rule: inline image src, and the bare-URL link short form. */
export function isUrl(v: unknown): v is string {
  return typeof v === 'string' && URL_REGEX.test(v);
}

/** True if `c` (a single character) is a `UrlChars` character. */
export function isUrlChar(c: string): boolean {
  return URL_CHAR_REGEX.test(c);
}

/** The text the parser gives a bare URL: the href without its `https?://` / `mailto:` prefix. */
export function bareUrlText(href: string): string {
  return href.replace(/^(https?:\/\/|mailto:)/, '');
}

/**
 * `==alt==` of an inline image: `$((!InlineTag .)*)` without unbreakscaping, so no `==` inside;
 * and it cannot be empty or start/end with `=` (`===`/`====` are read as text, `InlineTagTags`).
 */
export function isInlineAlt(v: unknown): v is string {
  return (
    typeof v === 'string' &&
    v.length > 0 &&
    v.indexOf('==') === -1 &&
    !v.startsWith('=') &&
    !v.endsWith('=')
  );
}

/** `TitleTags`: heading level 1..3. */
export function isHeadingLevel(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 3;
}

/** Inline code language (`code:` chain value): trimmed and lower-cased by the parser. */
export function normalizeInlineCodeLanguage(v: unknown): string | undefined {
  if (!isChainString(v)) return undefined;
  return v.trim().toLowerCase();
}

/** Block code language (`CodeLanguage` rule): single line, trimmed and lower-cased by the parser. */
export function normalizeBlockCodeLanguage(v: unknown): string | undefined {
  if (!isSingleLine(v)) return undefined;
  return v.trim().toLowerCase();
}
