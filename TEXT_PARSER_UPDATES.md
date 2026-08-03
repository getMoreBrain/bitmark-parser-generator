# Text Parser Updates: v8.37.3 → v8.41.1

**Date**: 2026-08-02
**Audience**: bitmark-parser-generator maintainers and other parser implementations
(e.g. the Rust parser). The peggy grammar is the limiting reference implementation:
other parsers must mirror its observable behavior exactly, even where they could be
more flexible.

**Affected files**:

| File | Change |
|---|---|
| `assets/grammar/text/text-grammar.pegjs` | Grammar v8.37.3 → v8.41.1 |
| `src/generated/parser/text/text-peggy-parser.js` | Regenerated (gitignored, build artifact) |
| `src/model/enum/TextMarkType.ts` | `smallcaps` + `textStyle` added; `doubleUnderline` restored; `color`/`duration` kept as legacy |
| `src/generator/text/TextGenerator.ts` | New/changed mark writers, legacy-JSON normalization, imageInline default suppression |
| `test/standard/input/text-bitmark-body-parser/` | Fixtures updated (see Coverage) |
| `test/standard/input/plain-text-body/` | Timer/duration fixtures updated |
| `test/standard/input/bitmark/json/` | imageInline default attrs |
| `test/unit/generator/text-generator-legacy-marks.test.ts` | New: legacy-JSON generator tests |

---

## 1. Grammar changes (v8.41.1)

### 1.1 `timer` requires a chained `duration` (BREAKING)

The `timer` chain item now consumes a mandatory `duration:` continuation. The timer
mark's attrs gained a `duration` property.

```text
==Timer text==|timer|duration:P23DT23H|
==Timer text==|timer:name of timer|duration:P1DT6H|
```

```json
{ "marks": [{ "type": "timer",
              "attrs": { "name": "", "duration": "P23DT23H" } }],
  "text": "Timer text", "type": "text" }
```

The duration value must start with `P` (ISO-8601 duration). Old syntax degrades to
literal plain text:

| Input | Result |
|---|---|
| `==t==\|timer\|` (pre-8.41 syntax) | plain text |
| `==t==\|timer:name\|` (pre-8.41 syntax) | plain text |
| `==t==\|timer\|duration:123\|` (no `P` prefix) | plain text |

### 1.2 Standalone `duration` mark REMOVED (BREAKING)

`==t==|duration:P23DT23H|` no longer produces a `duration` mark — it degrades to
literal plain text. Duration only exists inside the timer compound (1.1).

### 1.3 `color:` produces `textStyle` marks (BREAKING)

The mark type emitted by `|color:<c>|` changed from `color` to `textStyle`. Syntax
and attrs are unchanged.

```text
==Color text==|color:aqua|
```

```json
// before (8.37.3)                      // after (8.41.1)
{ "type": "color",                      { "type": "textStyle",
  "attrs": { "color": "aqua" } }          "attrs": { "color": "aqua" } }
```

### 1.4 NEW: `highlight|color:` and `userHighlight|color:` compounds

A `highlight` or `userHighlight` chain item may be followed by a `color:` item whose
value is one of the ten `HighlightColor`s (new grammar rule):
`orange yellow green blue purple pink brown white black gray`.

```text
==some text==|highlight|color:yellow|
```

```json
{ "marks": [{ "type": "highlight", "attrs": { "color": "yellow" } }],
  "text": "some text", "type": "text" }
```

**Fallback behavior — read carefully.** The compound only forms when the color is a
valid HighlightColor. Otherwise PEG ordered choice falls through, and the visually
similar inputs mean different things. This is intentional (decision 2026-08-02; an
experimental guard that made the invalid case degrade to plain text was considered
and reverted):

| Input | Result | Meaning |
|---|---|---|
| `==t==\|highlight\|color:yellow\|` | `[{highlight, attrs:{color:"yellow"}}]` | yellow HIGHLIGHT, default text color |
| `==t==\|highlight\|color:red\|` (red is a Color, not a HighlightColor) | `[{highlight}, {textStyle, attrs:{color:"red"}}]` | red TEXT on default highlight |
| `==t==\|highlight\|color:bad\|` (not a Color at all) | `[{highlight}]` + literal tail text `color:bad\| …` | partial-tail degradation (see 1.7) |
| `==t==\|color:aqua\|highlight\|` | `[{textStyle, attrs:{color:"aqua"}}, {highlight}]` | explicit combo, order-dependent |

`userHighlight` behaves identically.

### 1.5 NEW: `smallcaps` style tag

`==text==|smallcaps|` → `{ "marks": [{ "type": "smallcaps" }], ... }`.
Added to `AlternativeStyleTags` (after `doubleUnderline`, which remains supported).

### 1.6 `imageInline` default attrs

Inline images now always carry `alignmentVertical` and `size` in their JSON, with
grammar-supplied defaults that any chain value overrides:

```text
a ==alt==|imageInline:https://img.io/i.svg| b
```

```json
{ "attrs": { "alt": "alt", "src": "https://img.io/i.svg",
             "alignmentVertical": "top", "size": "line-height",
             "zoomDisabled": true },
  "type": "imageInline" }
```

Defaults apply even with a partial chain (`|width:400|` still gets both defaults).
This also changes the embedded imageInline JSON in full-bit parsing (see fixture
updates to `article.json` / `cloze-instruction-grouped.json`).

### 1.7 General chain degradation rules (unchanged, now spec'd)

The inline chain (`==text==|a|b|…|`) has no closing terminator; key recognition is
the only delimiter. Consequences (inherent, apply to all chains):

- **First segment invalid** → the whole tag is literal plain text
  (e.g. `==t==|timerz:1234|`, `==t==|timer|` post-8.41).
- **Later segment invalid** → already-matched marks stick; the remainder becomes
  literal text. The `|` closing the last valid segment is consumed, so the literal
  tail starts at the invalid key (e.g. `==t==|bold|highlight|color:bad| x` →
  `[bold]` mark + text `highlight|color:bad| x`... for the exact node split see the
  `bitmark-body-highlight-color` fixture).

---

## 2. Model changes (`TextMarkType.ts`)

- `smallcaps` added (upstream edit had accidentally *replaced* `doubleUnderline`;
  `doubleUnderline` is restored — the grammar still supports it).
- `textStyle` added (1.3).
- `color` and `duration` KEPT, marked as legacy: the parser no longer produces them,
  but the generator accepts them as input from stored pre-8.41 JSON (section 3.2).

---

## 3. Generator changes (`TextGenerator.ts`)

Direction: JSON (TipTap) → bitmark text. Policy: **accept legacy input as far as it
is expressible, always emit current-format re-parseable text.**

### 3.1 New/changed writers

| Mark in JSON | Written as |
|---|---|
| `textStyle {color}` | `==t==\|color:<c>\|` |
| `timer {name, duration}` | `==t==\|timer:<name>\|duration:<d>\|` (or `\|timer\|duration:<d>\|` when name is empty) |
| `highlight {color}` / `userHighlight {color}` | `==t==\|highlight\|color:<c>\|` — the compound form; a highlight WITH color never uses the `!!…!!` standard form |
| imageInline | `alignmentVertical` suppressed when `"top"`, `size` suppressed when `"line-height"` (same precedent as `zoomDisabled`); the parser re-adds them |

### 3.2 Legacy-JSON normalization (`getWritableMarks`)

| Legacy input marks | Handling |
|---|---|
| `color {color}` | Written as `color:<c>` — identical to `textStyle`; output re-parses as `textStyle` |
| `[timer {name}, duration {duration}]` pair on one text node (old-grammar parse of `\|timer:n\|duration:P…\|`) | MERGED into one current-format `timer` compound |
| `duration` without a timer sibling | Mark dropped, text kept (inexpressible) |
| `timer` without any duration | Mark dropped, text kept (inexpressible) |

### 3.3 Split-pair ordering (round-trip safety)

JSON can contain `[{highlight}, {textStyle:{color}}]` as two independent marks
(e.g. authored in TipTap: colored text plus default highlight). Writing them in
that order is only safe when the color is NOT a HighlightColor:

- `[highlight, textStyle(red)]` → `|highlight|color:red|` → re-parses to the same
  two marks (red is not a HighlightColor). Order preserved.
- `[highlight, textStyle(yellow)]` → written as **`|color:yellow|highlight|`**
  (reordered). Written in the original order it would re-parse as the
  highlight-with-yellow COMPOUND and change meaning (yellow highlight instead of
  yellow text).

The generator swaps a bare `highlight`/`userHighlight` followed by a
`textStyle`/`color` mark whose value is a valid HighlightColor. The generator keeps
its own copy of the HighlightColor list (`HIGHLIGHT_COLORS`) — it must stay in sync
with the grammar rule.

---

## 4. Test coverage map

| Fixture / test | Covers |
|---|---|
| `text-bitmark-body-parser/bitmark-body-timer.*` | 1.1, 1.2 — new syntax positive; all old-syntax + bad-duration negatives |
| `…/bitmark-body-color.json`, `…-colorPicker.json`, `…-inline.json` | 1.3 — `color` → `textStyle` mark type |
| `…/bitmark-body-highlight-color.*` (NEW) | 1.4 — all 10 HighlightColors, userHighlight, red/yellow fallback pair, `color:bad` partial tail, bare + chained forms, explicit combo order |
| `…/bitmark-body-inline.*` | 1.5 — smallcaps (alongside all other style tags incl. doubleUnderline) |
| `…/bitmark-body-image.json` | 1.6 — defaults added; explicit-override case unchanged |
| `bitmark/json/article.json`, `…/cloze-instruction-grouped.json` | 1.6 at full-bit level (4 imageInline nodes) |
| `plain-text-body/bitmark-body-timer.*` | 1.1/1.2 in the plain-text pipeline (valid timers stripped to text, old syntax stays literal) |
| `test/unit/generator/text-generator-legacy-marks.test.ts` (NEW) | 3.1–3.3 — legacy color/timer/duration normalization, drops, split-pair ordering (11 tests) |
| `bitmark-body-duration.*` | DELETED (both suites) — standalone duration no longer exists; negative coverage lives in the timer fixtures |

The text→JSON fixtures are the conformance reference for other implementations.
Round-trip integrity (text → JSON → text → JSON) is enforced by the
`text-bitmark-body-generator` suite over the same fixtures.

---

## 5. Notes for the Rust parser

- Target grammar version: **8.41.1** (`version` start rule returns it).
- Mirror the fallback table in 1.4 and the degradation rules in 1.7 exactly, even
  if a more flexible tokenizer could do "better" — observable behavior parity with
  the peggy parser is the requirement.
- The `HighlightColor` set is closed (10 values) and distinct from the `Color` set
  (23 values); `red`, `aqua`, etc. being in `Color` but not `HighlightColor` is what
  drives the split fallback.
- Conformance fixtures: `test/standard/input/text-bitmark-body-parser/*.text` +
  `json/*.json`.

## 6. Build note

`src/generated/parser/text/text-peggy-parser.js` is gitignored and must be
regenerated after grammar changes (`npm run build-grammar-text`). The browser-bundle
tests (`web-*.test.ts`) run against `dist/` — run `npm run tsup && npm run build-browser`
(or a full `npm run build`) after grammar/source changes or they will test stale code.
