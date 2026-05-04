# PLAN: Nullable Tag Definitions

## Context

The new parser supports two output modes:

- **Optimised** — omits keys the consumer can imply (e.g. `aiGenerated:false` → emit nothing).
- **Full** — emits every defined tag for inspection.

Most tags have a single implied default (booleans default to `false`, strings default to `""`). A few tags are **nullable**: when absent in bitmark, the consumer treats the value as `null`, not as the type's zero value.

Example — ingredients `checked`:

| Bitmark                         | JSON               |
| ------------------------------- | ------------------ |
| `[+] Geflügelkraftbrühe`        | `checked: true`    |
| `[-] Geflügelkraftbrühe`        | `checked: false`   |
| `Geflügelkraftbrühe` (neither)  | _no `checked` key_ |

The consumer needs to know that `checked` differs from typical booleans (where absent → `false`). The same can apply to strings (`"" | "x" | null`).

## Problem

Without a nullability marker on tag definitions:

1. **Optimised output** can't decide whether to emit `false` (must emit if nullable, since absent → null ≠ false).
2. **Full output** can't render `null` for a tag whose only bitmark forms are presence/absence-based (e.g. `[+]` / `[-]`).

Problem 2 is unsolvable in bitmark for presence-based tags — accepted as a known limitation.

## Goal

Add a `nullable` boolean to tag config definitions. The TS app does not consume it; it passes it through to the generated `assets/config/**/*.jsonc` so downstream consumers (rust parser) can handle nullability.

A single boolean flag (vs. a parallel `booleanNullable` format) keeps it format-agnostic and avoids changes everywhere `format` is read.

## Scope

- Schema: add `nullable?: boolean` to `_AbstractTagConfig`.
- Serialisation: `ConfigBuilder` emits `nullable: true` when set; omit otherwise.
- Data: mark ingredient `[+]` / `[-]` tags (`tag_true` / `tag_false` in `CardSetConfigKey.ingredients`) as nullable.
- **Out of scope**: runtime hydration (hydrated `AbstractTagConfig` / `PropertyTagConfig` classes unchanged); auditing other tags for nullability; downstream consumer changes; bitmark/JSON generator behaviour changes.

## Functional Requirements

1. `_AbstractTagConfig` in `src/model/config/_Config.ts` gains `nullable?: boolean`.
2. `ConfigBuilder.processTagEntries()` in `src/info/ConfigBuilder.ts` emits `nullable: true` on the output tag object when `tag.nullable === true`; omits the key otherwise.
3. The two ingredient tags in `src/config/raw/cardSets.ts` (`CardSetConfigKey.ingredients` → `tag_true` and `tag_false`) gain `nullable: true`.
4. Generated `assets/config/cards/ingredients.jsonc` contains `nullable: true` on the corresponding two tag entries; no other generated files change.

## Non-Functional Requirements

- No runtime API changes.
- No changes to hydrated config types (`AbstractTagConfig`, `PropertyTagConfig`, etc.).
- No changes to parser/generator behaviour.
- Existing tests pass unchanged.

## Implementation Steps

1. **Type**: add `nullable?: boolean` field to `_AbstractTagConfig` in `src/model/config/_Config.ts` (placed near `defaultValue`).
2. **Serialiser**: in `processTagEntries()` in `src/info/ConfigBuilder.ts`, conditionally spread `...(tag.nullable ? { nullable: true } : {})` into the output tag object.
3. **Data**: add `nullable: true` to the two relevant tag entries in `src/config/raw/cardSets.ts` (`CardSetConfigKey.ingredients` variant).
4. **Regenerate**: `npm run start-generate-config` and verify the diff in `assets/config/cards/ingredients.jsonc`.
5. **Verify**: `npm run check` (typecheck + lint) and `npm test`.

## Out of Scope / Future Work

- Audit other tags for nullability (e.g. `[+]` / `[-]` in statements/choices, nullable strings).
- Propagate `nullable` into hydrated runtime config types if/when the TS app needs to use it.
- Define a representation for `null` in bitmark for full-mode round-tripping of presence-based nullable tags.
