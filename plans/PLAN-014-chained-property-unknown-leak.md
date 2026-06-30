# PLAN-014: Chained properties leak past `excludeUnknownProperties`

## Problem

A property that is only valid inside a tag chain (e.g. `@width`, which is a chained
property of image/video resources) is emitted as a first-class bit field when written at
the bit level — even when `excludeUnknownProperties` is `true`. A genuinely novel property
(e.g. `@madeupprop`) is correctly excluded. The chain-defined property "sneaks through".

Requirement (confirmed): **Any tag not validated at its current position is an unknown
property.** There is no "valid somewhere in a chain ⇒ valid here" leniency. The existing
`excludeUnknownProperties` JSON option is the control; no new flag.

## Root Cause (diagnosed + verified)

The parser and AST are **correct**. `[@width]` at bit level is:
- flagged with an "unknown property" warning by the validator, and
- stored in `bit.extraProperties = { width: ["999"] }` (NOT a first-class field).

The leak is in the **JSON generator**:

- `JsonGenerator.enter_extraProperties` (`src/generator/json/JsonGenerator.ts:601`) returns
  `void`, not `false`.
- The AST walker (`src/ast/Ast.ts:227-238`) only stops descending when an `enter_*`
  callback returns `false`. So it **descends into the `extraProperties` object** and fires a
  per-key handler for each child.
- `width` matches the dedicated `enter_width` handler → emitted as first-class `bit.width`,
  bypassing the `excludeUnknownProperties` guard (which lives only inside
  `enter_extraProperties`).
- `madeupprop` has no matching handler, so it is only ever emitted by
  `enter_extraProperties` → correctly excluded.

This is why the leak is chain/config specific: only property names that exist somewhere in
config have a dedicated generator handler.

## Fix

Stop the walker from descending into `extraProperties` children, so extra properties are
emitted **only** by `enter_extraProperties` (which already respects
`excludeUnknownProperties`).

- `src/generator/json/JsonGenerator.ts` — `enter_extraProperties`: keep current emission
  loop, then `return false`. Change return type `void` → `boolean`.

Verified behaviour with this change:
| input @ bit level | `excludeUnknownProperties: false` | `excludeUnknownProperties: true` |
|---|---|---|
| `@width` (chain-defined) | `width: ["999"]` (extra-property form) | omitted |
| `@madeupprop` (novel)    | `madeupprop: ["hello"]`               | omitted |

Both unknown properties are now treated uniformly.

## Functional Requirements

- FR1: With `excludeUnknownProperties: true`, a property invalid at its current position is
  absent from JSON output, regardless of whether its name is defined elsewhere (chain or
  another bit).
- FR2: With `excludeUnknownProperties: false`, such a property is still present, emitted via
  the extra-property path (array form, key prefixed `_` only on collision — existing
  `enter_extraProperties` behaviour).
- FR3: Genuinely-novel properties (FR1/FR2 already correct) keep behaving as today.
- FR4: Properties valid at their position (legitimately chained, e.g. `[&image][@width]`)
  are unaffected — they are not in `extraProperties`.

## Non-Functional Requirements

- NFR1: No change to parser, validator, AST, or config.
- NFR2: No new options or public API changes.
- NFR3: Single-pass walker performance unchanged.

## Behaviour Change / Risk

- For `excludeUnknownProperties: false`, a chain-defined property at bit level changes shape
  from a typed scalar (e.g. `width: "999"`) to the generic extra-property array
  (`width: ["999"]`). This is the intended, consistent treatment but **will shift existing
  expected-JSON fixtures**.

## Verification

- [ ] Reproduce pre-fix: `[.image]` + bit-level `[@width:999]` ⇒ `width` present under
      `excludeUnknownProperties: true`.
- [ ] Apply fix; confirm table above for `@width` and `@madeupprop`.
- [ ] Run full suite (`npm test`); inspect diffs for bit-level chain-defined properties.
- [ ] Regenerate expected JSON where the new behaviour is correct
      (`npm run regenerate-bitmark-test-json`); review the diff — ensure only
      bit-level-misplaced chained properties changed, not legitimately-chained ones.
- [ ] Add a regression test: bit-level chain-defined property excluded under
      `excludeUnknownProperties: true`, retained (extra form) when `false`.
- [ ] Check card / list-item levels also build `extraProperties`; confirm the same single
      `enter_extraProperties` handler governs them (no second leak path). Add a card-level
      case if applicable.
