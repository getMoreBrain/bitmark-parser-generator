/**
 * Media attribute chains (image block, inline image, symbol): sanitisation against the grammar's
 * MediaChain / InlineMediaChain rules, and serialisation.
 *
 * Only keys the grammar has a rule for are ever written. Values outside their rule are omitted
 * (every chain item is optional). Parser-injected defaults are suppressed where the parser injects
 * them (image, imageInline) so the round trip is idempotent.
 */
import {
  isChainString,
  isInlineMediaAlignment,
  isInlineMediaSize,
  isMediaAlignment,
  toBoolean,
  toUInt,
} from './TextGrammarConstraints.ts';

export type MediaKind = 'image' | 'imageInline' | 'symbol';
type Attrs = Record<string, unknown>;

type Validator = (v: unknown) => unknown;

const uint: Validator = (v) => toUInt(v);
const bool: Validator = (v) => toBoolean(v);
const alignment: Validator = (v) => (isMediaAlignment(v) ? v : undefined);
const chainString: Validator = (v) => (isChainString(v) ? v.trim() : undefined);
const inlineAlignment: Validator = (v) => (isInlineMediaAlignment(v) ? v : undefined);
const inlineSize: Validator = (v) => (isInlineMediaSize(v) ? v : undefined);

/**
 * Attribute key → validator, per media kind, in the canonical chain order (the order is fixed so
 * that generate(parse(generate(x))) === generate(x) whatever order the attrs arrive in).
 *
 * The key is the JSON attribute name (the parser's output), which for images differs from the
 * chain tag name (textAlign → captionAlign, title → caption). Symbol attrs come straight from the
 * chain, so both spellings are accepted.
 */
const VALIDATORS: Record<MediaKind, Record<string, Validator>> = {
  image: {
    alt: chainString,
    title: chainString,
    alignment,
    textAlign: alignment,
    zoomDisabled: bool,
    width: uint,
    height: uint,
    comment: chainString,
  },
  imageInline: {
    srcAlt: chainString,
    alignmentVertical: inlineAlignment,
    size: inlineSize,
    width: uint,
    height: uint,
    comment: chainString,
  },
  symbol: {
    alt: chainString,
    title: chainString,
    caption: chainString,
    alignment,
    textAlign: alignment,
    captionAlign: alignment,
    zoomDisabled: bool,
    width: uint,
    height: uint,
    comment: chainString,
  },
};

/** JSON attribute name → chain tag name */
const TAG_NAMES: Record<string, string> = {
  textAlign: 'captionAlign',
  title: 'caption',
};

/** Parser-injected defaults, not written */
const DEFAULTS: Record<MediaKind, Record<string, unknown>> = {
  image: { alignment: 'center', textAlign: 'left', zoomDisabled: true },
  imageInline: { alignmentVertical: 'top', size: 'line-height' },
  symbol: {},
};

/**
 * Keep only the chain attributes the grammar has a rule for, with valid values (src excluded).
 */
export function sanitizeMediaAttrs(kind: MediaKind, attrs: unknown): Attrs {
  const result: Attrs = {};
  if (!attrs || typeof attrs !== 'object') return result;

  const validators = VALIDATORS[kind];
  for (const [k, v] of Object.entries(attrs as Attrs)) {
    const validator = validators[k];
    if (!validator || v == null) continue;
    const valid = validator(v);
    if (valid !== undefined) result[k] = valid;
  }

  // Symbol attrs may carry both the JSON and the chain spelling of a tag: one segment only
  // (the chain spelling is what the parser produces)
  if (kind === 'symbol') {
    if ('caption' in result) delete result.title;
    if ('captionAlign' in result) delete result.textAlign;
  }
  return result;
}

/**
 * Serialise the (sanitised) chain attributes as `|key:value` segments, without a trailing `|`.
 */
export function serializeMediaChain(kind: MediaKind, attrs: Attrs): string {
  const defaults = DEFAULTS[kind];
  let s = '';

  // Only keys the grammar has a chain item for (src and alt are written outside the chain), in
  // canonical order
  for (const k of Object.keys(VALIDATORS[kind])) {
    const v = attrs[k];
    if (v == null) continue;
    if (k in defaults && defaults[k] === v) continue;
    if (k === 'comment') {
      if (v) s += `|#${v}`;
    } else if (typeof v === 'string' && v === '') {
      // empty free-string values carry no information
      continue;
    } else {
      s += `|${TAG_NAMES[k] ?? k}:${v}`;
    }
  }

  return s;
}
