/**
 * Minimal, dependency-free HTML tokenizer + tree builder.
 *
 * This is NOT a full HTML5 parser. It recognises just enough structure to extract HTML tables
 * and their cell content (the tags required by {@link HtmlTableParser}). It is intentionally
 * lenient: it never throws on malformed markup and applies a small set of implied end-tag rules
 * so that common real-world (unclosed `<td>`, `<tr>`, `<li>`, `<p>`) markup parses sensibly.
 *
 * Works in both Node and browser (no DOM, no `fs`, no external dependencies).
 */

export interface HtmlElement {
  type: 'element';
  /** Lower-cased tag name */
  name: string;
  attrs: Record<string, string>;
  children: HtmlNode[];
}

export interface HtmlText {
  type: 'text';
  /** Raw text (HTML entities NOT decoded here) */
  value: string;
}

export type HtmlNode = HtmlElement | HtmlText;

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/**
 * Implied end tags: opening a `key` tag auto-closes any currently-open tag whose name is in the
 * associated set (popping them off the stack first). Mirrors browser behaviour loosely without a
 * full tree-construction algorithm.
 */
const IMPLIED_CLOSE: Record<string, Set<string>> = {
  li: new Set(['li']),
  td: new Set(['td', 'th']),
  th: new Set(['td', 'th']),
  tr: new Set(['td', 'th', 'tr']),
  thead: new Set(['td', 'th', 'tr', 'thead', 'tbody', 'tfoot']),
  tbody: new Set(['td', 'th', 'tr', 'thead', 'tbody', 'tfoot']),
  tfoot: new Set(['td', 'th', 'tr', 'thead', 'tbody', 'tfoot']),
  p: new Set(['p']),
  option: new Set(['option']),
};

// Matches an opening or closing tag, tolerating quoted attribute values that contain `>`.
const TAG_RE = /<(\/)?([a-zA-Z][a-zA-Z0-9-]*)((?:\s+(?:"[^"]*"|'[^']*'|[^<>"'])*)?)(\/)?>/g;

// Matches a single attribute: name plus optional (quoted/unquoted) value.
const ATTR_RE = /([a-zA-Z_:][a-zA-Z0-9:._-]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;

interface Token {
  kind: 'open' | 'close' | 'text';
  name?: string;
  attrs?: Record<string, string>;
  selfClose?: boolean;
  text?: string;
}

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (!raw) return attrs;

  ATTR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ATTR_RE.exec(raw)) !== null) {
    const name = m[1].toLowerCase();
    let value = m[2] ?? '';
    if (value.length >= 2 && (value[0] === '"' || value[0] === "'")) {
      value = value.slice(1, -1);
    }
    attrs[name] = value;
  }
  return attrs;
}

/**
 * Remove markup that must never contribute to extracted content.
 */
function stripNonContent(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
    .replace(/<!doctype[^>]*>/gi, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
}

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  const clean = stripNonContent(html);

  TAG_RE.lastIndex = 0;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TAG_RE.exec(clean)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ kind: 'text', text: clean.slice(lastIndex, m.index) });
    }
    lastIndex = TAG_RE.lastIndex;

    const isClose = m[1] === '/';
    const name = m[2].toLowerCase();
    if (isClose) {
      tokens.push({ kind: 'close', name });
    } else {
      tokens.push({
        kind: 'open',
        name,
        attrs: parseAttrs(m[3]),
        selfClose: m[4] === '/',
      });
    }
  }
  if (lastIndex < clean.length) {
    tokens.push({ kind: 'text', text: clean.slice(lastIndex) });
  }
  return tokens;
}

/**
 * Parse an HTML string into a lightweight node tree.
 * @returns the top-level child nodes (document fragment).
 */
export function parseHtml(html: string): HtmlNode[] {
  const root: HtmlElement = { type: 'element', name: '#root', attrs: {}, children: [] };
  const stack: HtmlElement[] = [root];
  const top = (): HtmlElement => stack[stack.length - 1];

  for (const token of tokenize(html)) {
    if (token.kind === 'text') {
      if (token.text) top().children.push({ type: 'text', value: token.text });
      continue;
    }

    if (token.kind === 'open') {
      const name = token.name as string;

      // Apply implied end-tags
      const closes = IMPLIED_CLOSE[name];
      if (closes) {
        while (stack.length > 1 && closes.has(top().name)) stack.pop();
      }

      const el: HtmlElement = {
        type: 'element',
        name,
        attrs: token.attrs ?? {},
        children: [],
      };
      top().children.push(el);

      if (!token.selfClose && !VOID_ELEMENTS.has(name)) {
        stack.push(el);
      }
      continue;
    }

    // close tag: pop down to (and including) the nearest matching open element
    for (let i = stack.length - 1; i > 0; i--) {
      if (stack[i].name === token.name) {
        stack.length = i;
        break;
      }
    }
  }

  return root.children;
}

/** Get the first direct child element with the given tag name. */
export function firstChildElement(el: HtmlElement, name: string): HtmlElement | undefined {
  return el.children.find((c): c is HtmlElement => c.type === 'element' && c.name === name);
}

/** Get all direct child elements whose name is in the given set. */
export function childElements(el: HtmlElement, names: Set<string>): HtmlElement[] {
  return el.children.filter((c): c is HtmlElement => c.type === 'element' && names.has(c.name));
}
