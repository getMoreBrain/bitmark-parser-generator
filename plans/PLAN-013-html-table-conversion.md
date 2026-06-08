# PLAN-013 HTML ↔ Bitmark Table Conversion

## Overview

Add bidirectional conversion between **HTML tables** and **bitmark tables**, exposed as a
dedicated API method + CLI command **`convertHtmlTable`** (parallel to `convertText` /
`extractPlainText`), independent of `convert`.

- **HTML → bits**: extract **all** `<table>` elements and emit one table bit per table
  (`[.table-extended]` by default, `[.table]` optional via flag). Output as bitmark, JSON, or AST.
- **bits → HTML**: render each `table` / `table-extended` bit as an HTML `<table>` fragment.
- Cell content is reproduced verbatim except inline conversion to bitmark text **marks**
  (broad mapping — see FR5); block structure beyond paragraphs is flattened.
- HTML is parsed by a **custom hand-written scanner** (required tags only) — no `parse5` /
  `jsdom` / external HTML dependency. Node + browser safe.

## Decisions (resolved via design review)

| # | Decision |
|---|----------|
| Direction | Bidirectional HTML ↔ table bits. |
| Surface | Dedicated method/command `convertHtmlTable` (not folded into `convert`). |
| Inline mapping | **Broad**: map every HTML inline tag that has an exact bitmark mark; literal fallback only for truly-unmappable tags. |
| Cell build | Build **TextAst (JsonText) directly** (text nodes + `marks[]`); no "HTML→bitmark string→re-parse". |
| Block content | Map `<p>`→paragraph, `<br>`→`hardBreak`, `<ul>/<ol>/<li>`→list nodes, `<img>`→image/imageInline. Flatten remaining containers (div/headings/nested tables) to text. |
| Unmappable tags | Flag **`--keepUnknownTags`** (default off = unwrap/keep inner text; on = keep raw tag as literal text). HTML→bits only. |
| Input detect | HTML iff trimmed input starts with `<` **and** contains `<table`; else bitmark. AST/JSON tried first. `--inputFormat` overrides. |
| HTML generator | Consumes the **JSON bit array** (like `PlainTextGenerator`), not the AST walker. |
| HTML parser | Emits a **bit-JSON array**, then reuses the existing JSON→AST→output pipeline (`convert()`); no `Builder`. |
| HTML output | Bare `<table>` **fragments**, blank-line (`\n\n`) separated, **pretty-printed** (2-space indent). |
| th/td | Input: `th`⇒`title:true`, `td`⇒omit. Output: `th` iff `title===true`, else `td` (title-driven, matching `BitmarkGenerator`; section defaults are applied at parse time when setting `title`, not at render time). |
| colwidth | Input: cell `width="N"` attr or `style="width:Npx"` → `colwidth` (int). Output: `colwidth`→`width="N"`. `<colgroup>/<col>` deferred. |
| Output bit-type | HTML generator renders **only `table` + `table-extended`** bits (others skipped). |
| `--tableFormat` | `<table\|table-extended>`, default `table-extended` (lossless). `table` is **lossy** (warn) — flattens via `convertExtendedToBasicTableFormat`. HTML→bits only. |
| Whitespace | Collapse runs + trim per cell (HTML-standard); `<br>`→`hardBreak` preserved. |
| Caption | `<caption>` ↔ `@caption` (bitmarkText), inline-converted, bidirectional. |
| Robustness | Lenient scanner; never throw on malformed table HTML; skip zero-row tables; nested tables flattened (not extracted). |

---

## Context

### Existing building blocks (reuse, do not duplicate)
- `TableExtendedJson` / `TableJson` model: `src/model/json/BitJson.ts:543-570`
  (`header`/`body`/`footer` → `rows` → `cells`; cell = `content` (JsonText), `title`,
  `rowspan`, `colspan`, `scope`, `colwidth`).
- Cell content shape (confirmed in `test/.../json/table-image.json`):
  `content: [{ type:'paragraph', content:[{ text, type:'text', marks? }], attrs:{} }]`.
- Text model: `JsonText = string | TextAst`, `TextAst = TextNode[]`, `TextNode.marks: TextMark[]`
  (`src/model/ast/TextNodes.ts`). Rich `TextMarkType` incl. bold/italic/superscript/subscript/
  strike/underline/ins/del/code/link/highlight (`src/model/enum/TextMarkType.ts`). `hardBreak`
  node type (`src/model/enum/TextNodeType.ts:8`).
- List nodes: `bulletList`/`orderedList`(+`orderedListRoman[Lower]`/`letteredList[Lower]`,
  `attrs.start`)/`noBulletList`/`taskList` with `listItem`/`taskItem`(`attrs.checked`) children;
  nesting allowed (`ListTextNode`, `src/model/ast/TextNodes.ts:92`).
- Image nodes: `image` (block) / `imageInline`, `attrs` = `MediaAttributes`
  (`src, alt, title, width, height, class, textAlign, comment`; `TextNodes.ts:164`).
- `table` / `table-extended` fully wired: parser `CardContentProcessor.ts` (section defaults
  `body→td, header/footer→th`; `title:true ⟺ th`, ~lines 969-1050), `JsonParser.toAst(json: unknown)`
  (accepts an object), `TableUtils.ts` (`convertBasicToExtendedTableFormat:47`,
  `convertExtendedToBasicTableFormat:96`, `normalizeTableFormat`).
- `caption` is a `bitmarkText` property on the table family (`bits.ts`; `tableExtended` →
  `baseBitType: table`, inherits caption).
- AST node fields: `table?` and `pronunciationTable?` are **separate** (`Nodes.ts:414-415`) →
  keying on `bit.table` excludes pronunciation tables.
- `convert()` accepts object input and routes file/string/stdout I/O — reused by delegation.
- `InputFormat` enum: `src/BitmarkParserGenerator.ts:365` (extend with `html`).
- Precedents: CLI `src/cli/commands/extractPlainText.ts`; JSON-consuming generator
  `src/generator/plainText/PlainTextGenerator.ts`; API `extractPlainText` (`:1059`).

### Architecture fit (per /specs/ARCHITECTURE.md)
- New **Parser** `src/parser/html/` (HTML → bit-JSON) and **Generator** `src/generator/html/`
  (JSON → HTML string). Both ends still pass through the canonical AST (HTML→bit-JSON→AST;
  input→AST→JSON→HTML).
- No Peggy grammar change (HTML parsed by a focused hand-written scanner).
- Browser-safe: no `fs`, no DOM dependency.

---

## Functional Requirements

### FR1 — API method `convertHtmlTable(input, options)`
- New method on `BitmarkParserGenerator`.
- **Input detection** (overridable via `options.inputFormat`):
  1. file path (Node) → read file;
  2. try AST preprocess → AST; try JSON parse → JSON;
  3. residual string: HTML iff `trimmed.startsWith('<') && /<table/i`; else bitmark.
- **Direction & output** (`options.outputFormat`):
  - HTML in → build bit-JSON → **delegate to `convert()`** with `bitmark` (default) | `json` | `ast`;
    `html` also allowed (re-extract + re-emit = normalize).
  - bits in (bitmark/json/ast) → `convert()` to JSON → `HtmlTableGenerator` → HTML string
    (only valid output is `html`).
  - Nonsensical combos (e.g. bitmark in + `json` out) → clear error pointing to `convert`.
- **Options**: `inputFormat`, `outputFormat`, `tableFormat` (`table|table-extended`,
  default `table-extended`), `keepUnknownTags` (default false), plus reused `jsonOptions`,
  `bitmarkOptions`, `fileOptions`, `outputFile`.

### FR2 — CLI command `convertHtmlTable`
- New `src/cli/commands/convertHtmlTable.ts`, registered in `src/cli/main.ts`; thin wrapper
  (`extractPlainText.ts` style) → `bpg.convertHtmlTable(...)` → `writeOutput`.
- Flags:
  - `[input]` file / string / stdin.
  - `-f, --format <html|bitmark|json|ast>` (default per FR1 direction).
  - `--inputFormat <html|bitmark|json>` force input format.
  - `--tableFormat <table|table-extended>` (default `table-extended`; HTML→bits only).
  - `--keepUnknownTags` (default off; HTML→bits only).
  - `-p, --pretty`, `--indent` (json/ast output).
  - `-a, --append`, `-o, --output` (all outputs).

### FR3 — HTML → bit-JSON (parser, `src/parser/html/`)
Hand-written scanner (`HtmlTableParser.ts`), lenient (FR-robustness):
1. Find every top-level `<table>…</table>` in source order; nested `<table>` inside a cell is
   **not** extracted (flattened per FR5 block rules).
2. Structural tags `<caption> <thead> <tbody> <tfoot> <tr> <th> <td>` + attrs
   `rowspan colspan scope width` / `style="width:…"`. Inside cells/caption also recognize the
   inline/block content tags of FR5 (`<p> <br> <ul> <ol> <li> <img>` + inline marks). Tag/attr
   names case-insensitive; quoted/unquoted attr values; implicit closes; strip
   comments/`<script>`/`<style>`.
3. Section map `thead→header, tbody→body, tfoot→footer`; rows outside a section → `body`.
4. Cell map: `th`⇒`title:true`; `td`⇒omit; `rowspan`/`colspan` (int ≥2 kept, else dropped);
   `scope` (row|col|rowgroup|colgroup, else dropped); width → `colwidth` (int).
5. `<caption>` → bit `@caption` property (TextAst via inline converter, **inline marks only** —
   block tags in a caption flattened to text).
6. Cell `content` built as **TextAst** (FR5). Emit bit-JSON per table:
   `{ type, format:'bitmark++', caption?, table:{header?,body?,footer?} }`, where `type` =
   `table-extended` or `table` per `--tableFormat`. For `table`, flatten via
   `convertExtendedToBasicTableFormat` and **warn** on dropped span/scope/multi-section data.
7. Zero-row tables skipped. No tables → empty bit array.

### FR4 — bit-JSON → HTML (generator, `src/generator/html/`)
`HtmlTableGenerator.generate(json)` consumes the JSON bit array (mirrors `PlainTextGenerator`):
- For each bit with a `bit.table` whose type is `table` or `table-extended`
  (normalize `table`→extended via `convertBasicToExtendedTableFormat`):
  emit a `<table>` fragment.
- `caption` → `<caption>` (first child).
- sections → `<thead>/<tbody>/<tfoot>`; rows → `<tr>`; cells → `<th>`/`<td>` per FR-th/td rule;
  emit `rowspan`/`colspan` when >1, `scope` when present, `colwidth`→`width="N"`.
- Cell `content` (JsonText) → inline/block HTML (FR5 reverse: marks, lists, images, breaks).
- Other bit types skipped silently. Fragments joined by `\n\n`, pretty-printed (2-space indent).

### FR5 — Inline + block content conversion
**Inline mark mapping** (HTML tag ↔ `TextMarkType`):

| HTML | bitmark mark |
|------|--------------|
| `b`, `strong` | bold |
| `i`, `em` | italic |
| `sup` | superscript |
| `sub` | subscript |
| `s`, `strike` | strike |
| `del` | del |
| `ins` | ins |
| `u` | underline |
| `mark` | highlight |
| `code` | code |
| `a href` | link (href→attrs) |
| `br` | → `hardBreak` node (not a mark) |

**Block / node mapping** (HTML ↔ TextNode):

| HTML | bitmark node |
|------|--------------|
| `p` | `paragraph` |
| `ul` | `bulletList` (`list-style:none` → `noBulletList`) |
| `ol` | `orderedList` (+`type` i/I/a/A → roman/lettered variants; `start`→`attrs.start`) |
| `li` | `listItem` (leading `<input type=checkbox>` → `taskItem`+`attrs.checked`) |
| `img` | `imageInline` in inline flow; `image` when standalone block child (`src/alt/title/width/height/class`→attrs) |

- **HTML → TextAst**: build `paragraph`/list/image nodes; text nodes carry `marks[]` for the
  enclosing mapped inline tags (nesting composes marks). Lists may nest. Decode entities
  (`&amp; &lt; &gt; &quot; &nbsp;` + numeric). Collapse+trim whitespace; `<br>`→`hardBreak`.
  Unmappable tags: default **unwrap** (keep inner text + recurse); `--keepUnknownTags` →
  keep raw tag as literal text. (Downstream generators handle breakscaping; no manual escaping.)
- **TextAst → HTML** (reverse): mapped marks → corresponding tags; `hardBreak`→`<br>`;
  `paragraph`→`<p>` (single bare paragraph may omit the wrapper); lists→`<ul>/<ol>/<li>`
  (+`type`/`start`), `taskItem`→`<li><input type=checkbox [checked]>`; `image`/`imageInline`
  →`<img …>`; text HTML-escaped (`& < >`). Marks/nodes with no HTML mapping → inner text only.

### FR6 — Exports
- Export `convertHtmlTable` options/types and `InputFormat.html` from the API (`src/index.ts`).
- Keep CLI out of the browser build (existing STRIP convention).

---

## Non-Functional Requirements

### Validation / robustness
| Rule | Action |
|------|--------|
| rowspan/colspan not int ≥2 | drop attribute |
| invalid `scope` | drop attribute |
| non-int / `%` width | drop `colwidth` |
| malformed table HTML | best-effort, never throw |
| `<table>` with zero rows | skip (no bit) |
| nested `<table>` in cell | flatten to text, not extracted |
| no `<table>` in input | empty output, exit 0 |
| `--tableFormat table` loses span/scope/sections | emit warning |

### Compatibility
- Pure addition; no change to `convert`, existing table parsing/generation, or grammar.
- HTML generation accepts both `[.table]` and `[.table-extended]` inputs.

### Performance / Security
- Single-pass scanner; no catastrophic-backtracking regex on large tables.
- No `eval`, no network, no DOM; Node + browser safe; no new runtime dependency.

---

## Testing Strategy
- Unit (parser): sections, spans, scope, width/style, caption, entities, broad inline marks,
  `<p>`/`<br>`, lists (`ul`/`ol` variants/`start`/nested/task), images (block + inline),
  unmappable-tag unwrap vs `--keepUnknownTags`, lenient/malformed cases.
- Unit (generator): th/td incl. section-default clause, spans, scope, width, caption, lists,
  images, escaping, multi-table separation, pretty-print determinism.
- Round-trip: HTML → bitmark/json → HTML (structural + mark/list/image fidelity); table-extended
  bitmark → HTML → bitmark.
- `--tableFormat table` lossy-path + warning.
- CLI integration (`test/cli/`): string, stdin, file in/out, `-f` per direction, flag combos,
  invalid-combo error.
- Regression: all existing table / table-extended tests pass.

---

## Implementation Steps
1. `InputFormat.html` value + detection helper (trimmed `<`-start + `<table`).
2. `src/parser/html/` — inline/block converter (HTML fragment → TextAst) + table scanner →
   bit-JSON array (`--tableFormat`, `--keepUnknownTags`).
3. `src/generator/html/HtmlTableGenerator` — JSON bit array → HTML string (+ TextAst → inline HTML).
4. `BitmarkParserGenerator.convertHtmlTable` — detect direction; HTML in → bit-JSON → `convert()`;
   bits in → `convert()`→JSON → `HtmlTableGenerator`; reuse file/stdout I/O.
5. `src/cli/commands/convertHtmlTable.ts` + register in `src/cli/main.ts`.
6. Exports (API types + enum); keep CLI out of browser build.
7. Tests (unit, round-trip, CLI); ensure `npm run check` passes.

---

## Resolved checks (verified in code)
- **Rich cell content renders correctly** — block nodes (lists/images/multi-paragraph) in a cell
  work in both outputs: `handleJsonText` passes a **TextAst through unchanged** (the `textLocation`
  arg only affects the string-parse/breakscape branch — `BaseBuilder.ts:197-201`), and
  `writeTableCell` renders cell content at **`TextLocation.body`** (`BitmarkGenerator.ts:1670`),
  the rich location that supports block content. JSON output stores the TextAst verbatim. No
  rerouting needed.
- **`caption` is valid on `[.table-extended]`** — bit config merges the full `baseBitType` chain
  (`tableExtended → table → _standard`) incl. `tags` via `deepMerge` (`Config.ts:100-120`), and
  `property_caption` is defined on `[.table]`. Inherited, confirmed.

## Build-time note
- `@caption` is a **property** (rendered in tag location), so the caption inline converter must
  emit **inline content only** (marks, no list/image/paragraph block nodes).

## Known limitations (discovered during implementation)
- **Images round-trip via JSON, not bitmark.** A cell `<img>` is preserved as an `image`/
  `imageInline` node through HTML → JSON → HTML, but the existing bitmark text engine serialises
  an image node to `|image:…|` and does **not** parse that back to an image node (verified: even
  plain `convertText` is lossy here). So HTML → bitmark → HTML degrades an in-cell image to text.
  This is a pre-existing bitmark-text characteristic, not specific to this feature.

## Deferred / Out of Scope (v1)
- `<colgroup>/<col>` width model (positional).
- `<pre>`/whitespace-significant cells (future flag).
- Headings (`<h1..6>`) and nested `<table>` inside cells → flattened to text.
- `pronunciation-table` and wider table-family bits in the HTML generator.

---

## References
- Spec: `/specs/SPEC-table-advanced.md`
- Architecture: `/specs/ARCHITECTURE.md`
- Table model: `src/model/json/BitJson.ts:543-570`
- Text model: `src/model/ast/TextNodes.ts`; marks `src/model/enum/TextMarkType.ts`
- Table utils: `src/parser/json/TableUtils.ts`
- Table parser (th/td defaults): `src/parser/bitmark/peg/contentProcessors/CardContentProcessor.ts:969-1050`
- JSON-consuming generator precedent: `src/generator/plainText/PlainTextGenerator.ts`
- CLI precedent: `src/cli/commands/extractPlainText.ts`
- API precedent: `src/BitmarkParserGenerator.ts:1059`
