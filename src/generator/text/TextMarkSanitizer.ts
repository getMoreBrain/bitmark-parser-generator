/**
 * Reduces the marks of a text node to the marks the text grammar can express, in an order the
 * parser reads back unambiguously.
 *
 * Rules (PLAN-022):
 * - an attribute the grammar has no rule for is ignored;
 * - an attribute with a value outside its grammar rule is not written and never coerced; if its
 *   chain segment is optional the mark is written without it, if mandatory the mark is dropped;
 * - a missing free-string value is written empty (the parser produces that form);
 * - the parser's own normalisation (trim, lower-case code language) is mirrored.
 */
import { type TextMark, type TextNode } from '../../model/ast/TextNodes.ts';
import { TextMarkType } from '../../model/enum/TextMarkType.ts';
import {
  ALTERNATIVE_STYLE_TAGS,
  isChainString,
  isColor,
  isDuration,
  isHighlightColor,
  normalizeInlineCodeLanguage,
} from './TextGrammarConstraints.ts';
import { sanitizeMediaAttrs } from './TextMediaAttrs.ts';

type Attrs = Record<string, unknown>;
type LooseMark = { type: string; attrs?: Attrs; comment?: unknown };

export interface MarkSanitizeOptions {
  /**
   * Inside a chain value (footnote content) only plain text and a single standard mark in its
   * short form (** __ `` !!) are representable.
   */
  chainValue?: boolean;
  /**
   * Normalises footnote content for the chain-value context. Returns undefined when the content
   * cannot be represented inside a chain value.
   */
  normalizeChainValue?: (content: unknown) => TextNode[] | undefined;
}

const STANDARD_SHORT_FORM_MARKS: readonly string[] = [
  TextMarkType.bold,
  TextMarkType.italic,
  TextMarkType.light,
  TextMarkType.highlight,
];

function attrsOf(mark: LooseMark): Attrs {
  const a = mark.attrs;
  return a && typeof a === 'object' && !Array.isArray(a) ? (a as Attrs) : {};
}

/** Free-string chain value: missing → '', valid → trimmed, invalid → undefined */
function chainValue(v: unknown): string | undefined {
  if (v == null) return '';
  return isChainString(v) ? v.trim() : undefined;
}

function mark(type: string, attrs?: Attrs): TextMark {
  return (attrs ? { type, attrs } : { type }) as TextMark;
}

/**
 * Sanitise one mark. Returns undefined when the mark has no representable form.
 */
function sanitizeMark(m: LooseMark, options: MarkSanitizeOptions): TextMark | undefined {
  const attrs = attrsOf(m);

  switch (m.type) {
    case TextMarkType.highlight:
    case TextMarkType.userHighlight: {
      // color: HighlightColor - optional segment
      const color = attrs.color;
      return isHighlightColor(color) ? mark(m.type, { color }) : mark(m.type);
    }

    case TextMarkType.textStyle:
    case TextMarkType.color: {
      // legacy 'color' mark is the same as textStyle; color: Color - mandatory segment
      const color = attrs.color;
      return isColor(color) ? mark(TextMarkType.textStyle, { color }) : undefined;
    }

    case TextMarkType.link: {
      const href = chainValue(attrs.href);
      return href === undefined ? undefined : mark(m.type, { href });
    }

    case TextMarkType.ref: {
      const reference = chainValue(attrs.reference);
      return reference === undefined ? undefined : mark(m.type, { reference });
    }

    case TextMarkType.xref: {
      const xref = chainValue(attrs.xref);
      if (xref === undefined) return undefined;
      // reference: optional segment (►)
      const reference = chainValue(attrs.reference) ?? '';
      return mark(m.type, { xref, reference });
    }

    case TextMarkType.extref: {
      const extref = chainValue(attrs.extref);
      const provider = chainValue(attrs.provider);
      if (extref === undefined || provider === undefined) return undefined;
      const refs = Array.isArray(attrs.references) ? attrs.references : [];
      const references = refs.map((r) => chainValue(r)).filter((r) => r !== undefined);
      return mark(m.type, { extref, references, provider });
    }

    case TextMarkType.footnote:
    case TextMarkType.footnoteStar: {
      const content = options.normalizeChainValue
        ? options.normalizeChainValue(attrs.content)
        : Array.isArray(attrs.content)
          ? (attrs.content as TextNode[])
          : [];
      return content === undefined ? undefined : mark(m.type, { content });
    }

    case TextMarkType.symbol: {
      const src = chainValue(attrs.src);
      if (src === undefined) return undefined;
      return mark(m.type, { src, ...sanitizeMediaAttrs('symbol', attrs) });
    }

    case TextMarkType.var: {
      const name = chainValue(attrs.name);
      return name === undefined ? undefined : mark(m.type, { name });
    }

    case TextMarkType.code: {
      // language: optional segment (`code` alone = plain text)
      const language = normalizeInlineCodeLanguage(attrs.language);
      return language === undefined ? mark(m.type) : mark(m.type, { language });
    }

    case TextMarkType.timer: {
      // duration: mandatory segment; name: optional segment
      const duration = attrs.duration;
      if (!isDuration(duration)) return undefined;
      const name = chainValue(attrs.name) ?? '';
      return mark(m.type, { name, duration: duration.trim() });
    }

    case TextMarkType.colorPicker: {
      const propertyRef = chainValue(attrs.propertyRef);
      return propertyRef === undefined ? undefined : mark(m.type, { propertyRef });
    }

    case TextMarkType.comment: {
      const comment = chainValue(m.comment);
      return comment === undefined ? undefined : ({ type: m.type, comment } as TextMark);
    }

    default:
      // Style marks carry no attributes in the grammar
      if (ALTERNATIVE_STYLE_TAGS.indexOf(m.type) !== -1) return mark(m.type);
      // Unknown mark type (incl. legacy 'duration', handled by mergeLegacyTimer)
      return undefined;
  }
}

/**
 * A legacy (pre-8.41.1) timer + duration mark pair is merged into a timer mark with a duration.
 */
function mergeLegacyTimer(marks: LooseMark[]): LooseMark[] {
  const timer = marks.find((m) => m.type === TextMarkType.timer);
  const duration = marks.find((m) => m.type === TextMarkType.duration);
  if (!timer || !duration || attrsOf(timer).duration) return marks;

  return marks.map((m) =>
    m === timer
      ? { ...timer, attrs: { ...attrsOf(timer), duration: attrsOf(duration).duration } }
      : m,
  );
}

/**
 * Order the marks so the chain re-parses to the same marks:
 * - a bare highlight/userHighlight followed by textStyle with a HighlightColor would re-parse as
 *   a highlight-with-color compound: swap them;
 * - a ref following an xref with an empty reference would be absorbed as the xref's reference:
 *   refs are moved before such an xref;
 * - a symbol's media chain absorbs every later segment: symbol goes last, a 2nd symbol is dropped.
 */
function orderMarks(marks: TextMark[]): TextMark[] {
  const a = (m: TextMark) => (m.attrs ?? {}) as Attrs;
  const isBareHighlight = (m: TextMark) =>
    (m.type === TextMarkType.highlight || m.type === TextMarkType.userHighlight) && !a(m).color;
  const isHighlightColorStyle = (m: TextMark) =>
    m.type === TextMarkType.textStyle && isHighlightColor(a(m).color);
  const isEmptyXref = (m: TextMark) => m.type === TextMarkType.xref && !a(m).reference;

  const result: TextMark[] = [];
  for (const m of marks) {
    if (m.type === TextMarkType.ref) {
      const xrefIdx = result.findIndex(isEmptyXref);
      if (xrefIdx !== -1) {
        result.splice(xrefIdx, 0, m);
        continue;
      }
    }
    result.push(m);
  }

  for (let i = 0; i < result.length - 1; i++) {
    if (isBareHighlight(result[i]) && isHighlightColorStyle(result[i + 1])) {
      [result[i], result[i + 1]] = [result[i + 1], result[i]];
    }
  }

  const symbols = result.filter((m) => m.type === TextMarkType.symbol);
  if (symbols.length === 0) return result;
  return [...result.filter((m) => m.type !== TextMarkType.symbol), symbols[0]];
}

/**
 * Sanitise the marks of a text node.
 *
 * @param marks the raw marks (any shape)
 * @param options context options
 * @returns the representable marks, in a representable order (possibly empty)
 */
export function sanitizeMarks(marks: unknown, options: MarkSanitizeOptions = {}): TextMark[] {
  if (!Array.isArray(marks)) return [];

  let loose = marks.filter(
    (m): m is LooseMark =>
      !!m && typeof m === 'object' && typeof (m as LooseMark).type === 'string',
  );
  loose = mergeLegacyTimer(loose);

  const result: TextMark[] = [];
  for (const m of loose) {
    const s = sanitizeMark(m, options);
    if (s) result.push(s);
  }

  if (options.chainValue) {
    // Only a single standard mark in its short form survives inside a chain value, or a single
    // link mark - kept here, and dropped by the normaliser unless it can be written as a bare URL
    if (result.length === 1 && STANDARD_SHORT_FORM_MARKS.indexOf(result[0].type) !== -1) {
      return [mark(result[0].type)];
    }
    if (result.length === 1 && result[0].type === TextMarkType.link) return result;
    return [];
  }

  return orderMarks(result);
}
