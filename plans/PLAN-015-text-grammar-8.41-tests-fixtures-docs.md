# PLAN-015: Text Grammar v8.41.1 — Tests, Fixtures & Change Documentation

## Context

`assets/grammar/text/text-grammar.pegjs` has been updated from v8.37.3 to v8.41.1
(committed as `291a53a4` together with `TextMarkType.ts` / `TextGenerator.ts` edits).
This plan covers:

1. Prerequisite code fixes (without which tests cannot pass).
2. Updating tests and fixtures to cover the changes.
3. Writing `/TEXT_PARSER_UPDATES.md` (internal engineering doc).

The grammar itself is FINAL at v8.41.1 — no grammar changes are in scope (see D4).

## Decisions (resolved)

| # | Decision |
|---|----------|
| D1 | `doubleUnderline` removal from `TextMarkType` was accidental → restored alongside `smallcaps`. **DONE** (in `291a53a4`). |
| D2 | Legacy JSON marks (`color`, `duration`, timer-without-duration) remain supported as generator INPUT as far as expressible; generator always emits current-format text. |
| D3 | Generator suppresses imageInline attrs equal to grammar defaults (`alignmentVertical:"top"`, `size:"line-height"`) — same precedent as `zoomDisabled`. |
| D4 | **REVERSED 2026-08-02**: the `highlight\|color:` fallback behavior is INTENTIONAL, not a bug. A valid HighlightColor binds to the highlight mark; any other valid Color falls through to a separate `textStyle` mark (see Behavior below). A briefly-applied "Policy A" guard fix (v8.41.2) was reverted; grammar stays at v8.41.1. |
| D5 | Follows D4 reversal: no version bump; `VERSION = "8.41.1"`. |
| D6 | `/TEXT_PARSER_UPDATES.md` is an internal engineering doc (maintainers + Rust parser team), full technical depth incl. design rationale. Must document the D4 behavior explicitly. |
| D7 | Delete `bitmark-body-duration` fixtures; negative `duration:` coverage lives in the rewritten timer fixture. |

## Grammar Changes Being Covered (8.37.3 → 8.41.1, verified empirically)

| # | Change | Grammar rule |
|---|--------|--------------|
| 1 | Version bump 8.37.3 → 8.41.1 | `VERSION` |
| 2 | `imageInline` gains default attrs `alignmentVertical: "top"`, `size: "line-height"` (chain-overridable; applied even with partial chains) | `InlineStyledText` |
| 3 | `timer` REQUIRES chained duration: `==t==\|timer\|duration:P…\|`, `==t==\|timer:name\|duration:P…\|`; attrs now `{ name, duration }`. Old syntax (`\|timer\|`, `\|timer:name\|`) and bad durations (no `P` prefix) degrade to plain text | `AttrChainItem` |
| 4 | Standalone `\|duration:P…\|` mark REMOVED (degrades to plain text) | `AttrChainItem` |
| 5 | `\|color:<c>\|` now emits mark type `textStyle` (was `color`) | `AttrChainItem` |
| 6 | NEW: `\|highlight\|color:<hc>\|` → `{ type: "highlight", attrs: { color } }`; same for `userHighlight` | `AttrChainItem` |
| 7 | NEW style tag `smallcaps` | `AlternativeStyleTags` |
| 8 | NEW `HighlightColor` rule: orange, yellow, green, blue, purple, pink, brown, white, black, gray | `HighlightColor` |

### Behavior: highlight + color fallback (D4 — intentional, verified)

The compound `highlight\|color:` chain resolves by PEG ordered choice:

| Input | Result |
|---|---|
| `==t==\|highlight\|color:yellow\|` | `{highlight, attrs:{color:"yellow"}}` — yellow is a HighlightColor: color binds to the highlight |
| `==t==\|highlight\|color:red\|` | `{highlight}` + `{textStyle, attrs:{color:"red"}}` — red is a Color but NOT a HighlightColor: red text on default highlight |
| `==t==\|highlight\|color:bad\|` | `{highlight}` mark + literal tail text (`color:bad\|…`) — bad is no Color at all; chain ends, partial-tail rule applies |
| `==t==\|userHighlight\|color:red\|` | same fallback pattern as highlight |

General chain degradation (inherent, no-terminator syntax): first segment invalid →
whole tag is literal text; later segment invalid → matched marks stick, remainder is
literal text (the `\|` closing the last valid segment is consumed).

## Task 1 — Parser Regeneration

- [x] **G-1** `npm run build-grammar-text` — regenerate
      `src/generated/parser/text/text-peggy-parser.js` from the v8.41.1 grammar
      (was stale at 8.37.3). **DONE** (uncommitted; commit with the fixture wave).

## Task 2 — Model & Generator Fixes (D1, D2, D3)

- [x] **M-1** `TextMarkType.ts`: restore `doubleUnderline`, keep `smallcaps`. **DONE** (`291a53a4`).
- [x] **M-2** `TextMarkType.ts`: add `textStyle`. KEEP `color` and `duration` entries
      (legacy input support per D2).
- [x] **M-3** `TextGenerator.ts` writers (JSON → bitmark text), always emitting
      current-format output:
  - `textStyle` mark → `color:<c>`; legacy `color` mark → `color:<c>` (identical output).
  - `timer` mark → `timer\|duration:<d>` (empty name) / `timer:<name>\|duration:<d>`.
    (Current attr loop would emit invalid `timer:<name>:<d>`.)
  - Legacy pair `[{timer:{name}}, {duration:{duration}}]` on one text node (old-grammar
    output) → MERGE into one `timer…\|duration:…` chain.
  - Standalone legacy `duration` mark (no timer sibling) → drop mark, keep text.
  - `timer` mark with NO duration attr (legacy) → drop mark, keep text.
  - `highlight` / `userHighlight` mark WITH `attrs.color` → `highlight\|color:<c>` /
    `userHighlight\|color:<c>` inline chain form. Note: `attrs.color` is always a valid
    HighlightColor here (the parser only binds valid ones), so output always re-parses
    to the same compound mark.
  - Marks `[{highlight}, {textStyle:{color}}]` (the D4 split) → `highlight\|color:<c>`
    only re-parses as a split if `<c>` is NOT a HighlightColor; writer must emit marks
    in an order that round-trips: `color:<c>\|highlight` is the safe, unambiguous order
    for the split pair. Verify round-trip in fixtures.
  - `writeImage` (inline): suppress `alignmentVertical` when `"top"` and `size` when
    `"line-height"` (extend existing ignore/default mechanism used for `zoomDisabled`).
  - Remove `duration` from `INLINE_MARK_TYPES` (handled via timer merge above).

## Task 3 — Fixtures (`test/standard/input/text-bitmark-body-parser/`)

Fixture list is auto-discovered (`*.text`); same fixtures drive parser (text→JSON) AND
generator (text→JSON→text→JSON round-trip) suites.

- [x] **T-1 smallcaps** — `bitmark-body-inline.text`: insert
      `Here is some inline 'style' applied ==here is the text==|smallcaps|, nice huh?`
      directly after the `doubleUnderline` line (expected JSON already updated; node sits
      after the `doubleUnderline` node).
- [x] **T-2 textStyle** — `json/bitmark-body-color.json`: mark `"type": "color"` →
      `"type": "textStyle"` (23 cases). Same in `json/bitmark-body-inline.json` for
      `|color:pink|` and in `json/bitmark-body-colorPicker.json` for the chained
      `|color:yellow|colorPicker:highlightGray|` case (verified: only failing diff there).
- [x] **T-3 timer** — rewrite `bitmark-body-timer.text` + json:
  - `==Timer text==\|timer\|duration:P23DT23H\|` → `{timer, attrs:{name:"", duration}}`
  - `==Timer text==\|timer:name of timer\|duration:P1DT6H\|` → named variant
  - Negative (all → plain text): `\|timer\|`, `\|timer:name\|`, `\|timer\|duration:123\|`,
    `\|timerz:1234\|`, standalone `\|duration:P23DT23H\|` (coverage moved from deleted
    duration fixture per D7)
- [x] **T-4 duration** — DELETE `bitmark-body-duration.text` + `json/bitmark-body-duration.json` (D7).
- [x] **T-5 highlight color** — NEW `bitmark-body-highlight-color.text` + json asserting
      the D4 behavior table:
  - `==text==\|highlight\|color:<hc>\|` for all 10 HighlightColors → compound mark
  - `==text==\|userHighlight\|color:<hc>\|` (2–3 colors) → compound mark
  - Fallback split: `\|highlight\|color:red\|` and `\|userHighlight\|color:red\|`
    → `[highlight, textStyle(red)]` (canonical yellow-vs-red example pair)
  - Partial tail: `\|highlight\|color:bad\|` → highlight mark + literal tail
  - Bare `\|highlight\|`, `\|userHighlight\|`, chain `\|highlight\|bold\|` unchanged
  - Explicit combo order: `\|color:aqua\|highlight\|` → `[textStyle(aqua), highlight]`
- [x] **T-6 imageInline defaults** — `json/bitmark-body-image.json`: add
      `"alignmentVertical"`/`"size"` to nodes not overriding them; explicit case keeps
      `bottom`/`super`.
- [x] **T-7 bitmark-level fixtures** — add the two imageInline default attrs in:
      `test/standard/input/bitmark/json/article.json` (1 node),
      `test/standard/input/bitmark/json/cloze-instruction-grouped.json` (3 nodes).
- [x] **T-8 legacy-JSON generator unit tests** — NEW unit tests (hand-written JSON input,
      cannot be produced via .text fixtures): legacy `color` mark → `color:` output;
      legacy timer+duration pair merge; standalone `duration` drop; timer-without-duration
      drop. Location: `test/unit/`.
- [x] **T-9 plain-text-body fixtures** — this suite keeps its own copies
      (`test/standard/input/plain-text-body/*.text` → expected `*.txt`). Verified failing
      after parser regen: timer + duration (old syntax now stays literal instead of having
      marks stripped). Apply D7 consistently:
  - Rewrite `bitmark-body-timer.text`/`.txt` to new `timer\|duration:` syntax; keep old
    syntax lines as literal-passthrough negatives.
  - DELETE `bitmark-body-duration.text`/`.txt`.
- [x] **T-10 unaffected suites** — verified passing after parser regen: tag-parser,
      plain-text-bitmark. Still to verify at the end: breakscape/unbreakscape suites,
      full `npm test`.

### Test Execution Order

1. `npm run check` (typecheck + lint; verifies M-2..M-3)
2. `npm run test-text-bitmark-body-parser`
3. `npm run test-text-bitmark-body-generator`
4. `npm test` (full suite; catches T-7, T-9, T-10)

## Task 4 — /TEXT_PARSER_UPDATES.md (D6: internal engineering doc)

Audience: repo maintainers + Rust parser team (Rust must mirror the peggy parser's
observable behavior exactly; peggy is the limiting reference implementation). Structure:

- [x] **D-1** Header: version range 8.37.3 → 8.41.1, date, affected files.
- [x] **D-2** Per-change sections (rows of Grammar Changes table), each: grammar rule
      diff, before/after bitmark syntax, before/after JSON, breaking-change flag,
      degradation behavior.
- [x] **D-3** The D4 highlight/color fallback semantics as a first-class section:
      the yellow/red/bad example triple, why it follows from no-terminator chains +
      PEG ordered choice, the reversal decision record (briefly), and partial-tail
      degradation as a general rule.
- [x] **D-4** Code changes: TextMarkType (doubleUnderline restored, smallcaps +
      textStyle added, legacy entries kept), TextGenerator writers incl. legacy-JSON
      normalization (D2), split-pair round-trip ordering (M-3), imageInline default
      suppression (D3), parser regeneration.
- [x] **D-5** Fixture/test coverage map (T-1..T-10 ↔ changes).
- [x] **D-6** Rust parser sync notes: behaviors to mirror, target version 8.41.1;
      fixtures in `test/standard/input/text-bitmark-body-parser/` are the conformance
      reference.

## Non-Functional Requirements

- Round-trip integrity: every positive fixture survives text → JSON → text → JSON —
  including the D4 split pair (see M-3 ordering note).
- Chain error behavior follows PEG ordered-choice fallback semantics as specified in
  the D4 behavior table; fixtures are the conformance record. No grammar changes.
- Generator output is always current-format, re-parseable text (legacy input normalized).
- No changes to breakscaping behavior.
- Regenerated parser (`src/generated/`) committed (browser builds depend on it).
- `submodules/bitmark-parser-rust` pointer NOT committed as part of this work; Rust-side
  changes are out of scope (doc D-6 is the handover).

## Out of Scope

- Grammar changes of any kind (v8.41.1 is final; the reverted v8.41.2 guard experiment
  is documented only as a decision record in D4).
- Rust parser implementation changes (doc-only handover).
- Browser bundle rebuild (`npm run build` at release time).
- `.devcontainer/scripts/post-create.sh` (unrelated local change).
