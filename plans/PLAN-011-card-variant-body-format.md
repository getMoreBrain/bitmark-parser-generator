# Plan: Card Variant Body Format

## Context

`_CardVariantConfig` already supports `jsonKey` (the JSON path where a variant's body text is rendered — see `CARD_SCHEMA.md` § VariantNode). It does **not** yet describe **how** that body content is formatted (bitmark++, plain text, etc.). The new (Rust) parser needs both the path and the format to render the variant body correctly.

The current ConfigBuilder export emits `jsonKey` only when set, and never emits a body-level `format` for variants.

## Goal

1. Add a `format` field to `_CardVariantConfig` describing the body text format for that variant.
2. Default `format` to **bitmark++** (full bitmark) when not specified.
3. Always emit `jsonKey` and `format` for every variant in the generated `assets/config/cards/*.jsonc` export — including the default.

## Scope

- Type extension on `_CardVariantConfig` and hydrated `CardVariantConfig`.
- Hydration default application.
- ConfigBuilder export change — unconditional emission with default substitution.
- Source data updates in `src/config/raw/cardSets.ts` only where an explicit non-default value is needed.

Out of scope: changes to runtime parsing/generation behaviour. Plan PLAN-005 covers the broader card-mapping config structure; this plan extends that work with one new field plus an export-shape tweak.

## Functional Requirements

| # | Requirement |
|---|---|
| F1 | Add `format?: TextFormatType` to `_CardVariantConfig` in `src/model/config/_Config.ts`. |
| F2 | Add a corresponding `format` field on hydrated `CardVariantConfig` class. |
| F3 | When `format` is unset in the raw config, hydration leaves it `undefined`; the default is applied at export time only. |
| F4 | Existing variant body content remains semantically `bitmark++` — no source-data changes required for variants that already imply the default. |
| F5 | Source variants whose body is **not** bitmark++ (e.g., `feedback` in `bot-action-responses` is plain text) are annotated with an explicit `format: TextFormat.<x>`. |
| F6 | `ConfigBuilder.serializeCardSet()` always emits `jsonKey` for each variant. When the source value is `undefined`, emit `null`. |
| F7 | `ConfigBuilder.serializeCardSet()` always emits `format` for each variant. When the source value is `undefined`, emit `TextFormat.bitmarkText` (`'bitmark++'`). |

## Non-Functional Requirements

- No `any` in public types.
- No runtime parser/generator behaviour change.
- Generated `*.jsonc` diffs limited to the new `format` line per variant and (where previously omitted) a `"jsonKey": null` line.
- Follow existing naming conventions and ordering in serialized output.

## Format values

Variant body `format` uses the existing `TextFormat` enum directly (`src/model/enum/TextFormat.ts`). Wire strings are the enum's own values — no mapping helper needed.

| `TextFormat` key  | Wire string  |
| ----------------- | ------------ |
| `bitmarkText`     | `bitmark++`  |
| `plainText`       | `text`       |
| `latex`           | `latex`      |
| `json`            | `json`       |
| `xml`             | `xml`        |
| (unset → default) | `bitmark++`  |

## Implementation Steps

1. **Type** — extend `_CardVariantConfig` in `src/model/config/_Config.ts` with `format?: TextFormatType` (import from `../enum/TextFormat.ts`).
2. **Hydrated class** — add `readonly format?: TextFormatType` to `src/model/config/CardVariantConfig.ts`; thread through constructor.
3. **Hydrator** — `ConfigHydrator.hydrateCardVariantConfig()` destructures and forwards `format`.
4. **Builder** — in `ConfigBuilder.serializeCardSet()`, change the variant return object so:
   - `jsonKey` is always present (`variant.jsonKey ?? null`).
   - `format` is always present (`variant.format ?? TextFormat.bitmarkText`).
5. **Source data fix** — current diff in `src/config/raw/cardSets.ts` uses `TagFormat.plainText` on the bot-action-responses `feedback` variant; replace with `TextFormat.plainText` and add the `TextFormat` import.
6. **Source data audit** — confirm every other variant body in all 19 card sets is bitmark++ (i.e. no explicit `format`). Add explicit `format` only where non-default.
7. **Regenerate** — run `npm run start-generate-config`; review `assets/config/cards/*.jsonc` diffs: every variant gains `jsonKey` and `format` keys, defaults `null` / `bitmark++` where unset.
8. **Validate** — typecheck, lint, full test suite. No behavioural diffs expected.

## Files Touched

| File | Change |
|---|---|
| `src/model/config/_Config.ts` | Add `format?: TextFormatType` to `_CardVariantConfig`. |
| `src/model/config/CardVariantConfig.ts` | Add `format` property + constructor arg. |
| `src/config/ConfigHydrator.ts` | Forward `format` from raw to hydrated. |
| `src/info/ConfigBuilder.ts` | Always emit `jsonKey` and `format` per variant (default `null` / `'bitmark++'`). |
| `src/config/raw/cardSets.ts` | Replace stray `TagFormat.plainText` on the variant with `TextFormat.plainText`; add explicit `format` only where body is non-default. |
| `assets/config/cards/*.jsonc` | Regenerated — adds `format` (and any missing `jsonKey: null`) per variant. |

## Validation & Testing

- Existing test suite passes unchanged.
- Diff review of regenerated `assets/config/cards/*.jsonc`:
  - Every `variants[i]` block contains `jsonKey` and `format`.
  - `format` is `'bitmark++'` for all variants except those explicitly annotated.
- Cross-check against `CARD_SCHEMA.md` to confirm no semantic regressions.

## Resolved decisions

1. Format type/values come from the `TextFormat` enum.
2. `format` is always emitted as a string in the export — defaulting to `'bitmark++'`.
3. The existing diff's `TagFormat.plainText` on the bot-action-responses `feedback` variant is incorrect; switch to `TextFormat.plainText`.
