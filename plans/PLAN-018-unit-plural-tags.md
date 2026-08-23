# PLAN-018: Singular/plural unit tags for `cook-ingredients`

## Context

`cook-ingredients` (and its derivative `recipe`) carry a unit of measurement in **two** places:

| Location                     | Config source                                | JSON type        |
| ---------------------------- | -------------------------------------------- | ---------------- |
| Bit-level `[@servings]` chain | `src/config/raw/bits.ts` (`cookIngredients`) | `ServingsJson`   |
| Ingredient card variant      | `src/config/raw/cardSets.ts` (`ingredients`) | `IngredientJson` |

Today each exposes `[@unit]` + `[@unitAbbr]` with a single (singular) form:

```
[@servings:4.5][@unit:Litre][@unitAbbr:l][@decimalPlaces:2]
[!2][@unit:Liter][@unitAbbr:Lt] Geflügelkraftbrühe
```

Consuming platforms need to switch between singular and plural ("1 Kilogramm" / "2 Kilogramm**s**").
A single field forces each platform to pluralise on its own, and gives AI translation no stable target.

## Goal

Add an explicit plural form alongside the existing singular tags. `[@unit]` / `[@unitAbbr]` keep their
current meaning (singular) — this is purely additive, so all existing content and all existing JSON are
unaffected.

```
[@servings:4.5][@unit:Litre][@unitPlural:Litres][@unitAbbr:l][@unitAbbrPlural:l]
[!2][@unit:Kilogramm][@unitPlural:Kilogramms][@unitAbbr:kg][@unitAbbrPlural:kg]
```

## Decisions (agreed)

| Question               | Decision                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tag naming             | **Keep `@unit` as singular, add `@unitPlural`** — rejects the meeting's `@unitSg`/`@unitPl` rename, which would break every existing bit and every existing consumer       |
| `@unitAbbr`            | **Also gets a plural** — `@unitAbbrPlural`. Abbreviations do pluralise in some locales (`hr`/`hrs`, `min`/`mins`); an asymmetric pair would be surprising for translation |
| Scope                  | **Both locations** — the `[@servings]` chain and the ingredient card variant                                                                                              |
| Absent value behaviour | **Omit the key** — never fabricate a plural. Consumers fall back to the singular themselves                                                                               |
| Deprecation            | **None.** `@unit` / `@unitAbbr` are not deprecated                                                                                                                        |

### Emit convention — follow `@unitAbbr`, not `@unit`

The two existing tags do **not** behave the same:

- `unit` is exempted from empty-string stripping (`ignoreEmptyString: ['item', 'unit']` /
  `['servings', 'unit']`), so it is emitted as `""` even when unauthored.
- `unitAbbr` is **not** exempted, so it disappears when empty.

The "omit when absent" decision means the two new tags follow **`unitAbbr`**: default to `''` in the
builder, and do **not** add them to the `ignoreEmptyString` exemption list. Consequence: JSON for every
existing `cook-ingredients` / `recipe` bit is byte-identical.

## Functional requirements

### FR1 — Property keys

`src/model/enum/PropertyKey.ts` — add (alphabetical; `unitAbbrPlural` sorts before `unitPlural`):

```
property_unitAbbrPlural: '@unitAbbrPlural'
property_unitPlural:     '@unitPlural'
```

`ConfigKey` derives from `propertyKeys`, so no separate change there.

### FR2 — Bit config (`[@servings]` chain)

`src/config/raw/bits.ts`, `BitType.cookIngredients` → `property_servings.chain`:

- insert `property_unitPlural` immediately after `property_unit`
- insert `property_unitAbbrPlural` immediately after `property_unitAbbr`
- both `format: TagFormat.plainText`, no `defaultValue`, no `jsonKey`/`exportJsonKey` (default key = tag name)

`BitType.recipe` inherits via `baseBitType` — no change needed.

### FR3 — Card-set config (ingredient variant)

`src/config/raw/cardSets.ts`, `CardSetConfigKey.ingredients` → `sides[0].variants[0].tags`: same two
insertions, same settings, same relative ordering.

### FR4 — JSON model

`src/model/json/BitJson.ts`:

- `ServingsJson`: `unitPlural: string` after `unit`; `unitAbbrPlural: string` after `unitAbbr`
- `IngredientJson`: same two insertions, same positions

`src/model/json/BitJson.schema.json`: mirror both — add to `properties` and to `required` for
`ServingsJson` and `IngredientJson`. (The schema already lists strippable fields such as `unitAbbr` as
`required` throughout; follow that convention rather than diverging here. Nothing consumes this file.)

### FR5 — AST node types

`src/model/ast/NodeType.ts`: add `unitAbbrPlural` and `unitPlural`. The walker falls back to
`unknown(<key>)` for unlisted keys, so this is for consistency with the existing `unit` / `unitAbbr`
entries rather than to fix a fault.

### FR6 — Parser

`src/parser/bitmark/peg/BitmarkPegParserTypes.ts` — add `unitPlural?: BreakscapedString` and
`unitAbbrPlural?: BreakscapedString` to the tag result type.

`ServingsChainContentProcessor.ts` — destructure and forward both. **No `??` default** — leave undefined
when unauthored.

`CardContentProcessor.ts` (`parseIngredients`) — forward both. Either destructure explicitly (matching the
existing `unit` / `unitAbbr` style) or let them pass through the `...tags` rest; final key order is
imposed by the builder either way. **Do not default to `''` here.**

### FR7 — Builder

`src/ast/Builder.ts` — node order is significant and is defined in these two methods:

- `buildServings`: `unitPlural: unitPlural ?? ''` after `unit`; `unitAbbrPlural: unitAbbrPlural ?? ''`
  after `unitAbbr`. Leave `ignoreEmptyString: ['servings', 'unit']` **unchanged**.
- `buildIngredient`: same two insertions. Leave `ignoreEmptyString: ['item', 'unit']` **unchanged**.

Net effect: both new keys are stripped when empty.

### FR8 — Bitmark generator

`src/generator/bitmark/BitmarkGenerator.ts`:

- `enter_servings` (~L575): write `unitPlural` after `unit` and `unitAbbrPlural` after `unitAbbr`,
  each `{ format: TagFormat.plainText, forceChain: true }`, guarded by `!= null` like their neighbours
- ingredient writer (~L1950): same two insertions, `{ format: TagFormat.plainText }`, no `forceChain`

`writeProperty` already skips `''` unless `writeEmpty` is set, so unauthored plurals emit no tag.

### FR9 — JSON generator

**No change.** `enter_ingredients` and the servings path use `standardHandler`, which passes the JSON
object through verbatim.

### FR10 — Grammar

**No change.** `@key:value` properties are generic; no `.pegjs` edit and no parser regeneration.

## Non-functional requirements

### NFR1 — Backward compatibility

- No existing tag renamed, removed, or deprecated.
- JSON output for existing content is byte-identical (FR7 leaves the exemption lists alone).
- Round-trip is preserved in both directions for content that omits the new tags.

### NFR2 — Rust submodule (`bitmark-parser-rust`)

Out of scope for implementation, but verified: the rust parser has **no hardcoded `unit` handling** — the
tags are resolved entirely from the exported config. Regenerating `assets/config/**` and bumping the
submodule's `bitmark.json` is sufficient; no rust code change is required.

Affected generated files (all gitignored, produced by `npm run start-generate-config`):
`assets/config/groups/group-cook-ingredients.jsonc`, `assets/config/partials/group-cook-ingredients.jsonc`,
`assets/config/cards/ingredients.jsonc`.

### NFR3 — Documentation

Regenerate `SUPPORTED_BITS.md` (`npm run build-supported-info`).

### NFR4 — Test coverage

- Extend `test/standard/input/bitmark/cook-ingredients.bitmark` to exercise, in both locations:
  singular only; singular + plural; plural + abbreviation plural; plural on an ingredient with no
  abbreviation.
- Leave at least one existing ingredient with **no** plural tags to pin the "omit the key" behaviour.
- Regenerate the affected fixtures with `npm run regenerate-bitmark-test-json`, keeping only
  `cook-ingredients.json` and `recipe.json` and restoring the `parser` version block from `HEAD` —
  a blanket regeneration rewrites ~400 unrelated files with version-stamp drift only.
- Add `test/unit/unitPlural.test.ts` asserting: bitmark → JSON emits `unitPlural`/`unitAbbrPlural` only
  when authored; JSON → bitmark emits `[@unitPlural]`/`[@unitAbbrPlural]` only when present;
  round-trip stability; `unit` still emitted as `""` when unauthored (unchanged behaviour).
- Run `npm run tsup && npm run build-browser` before the web tests, which execute against `dist/`.

### NFR5 — Versioning

Tag configs carry no `since` field (only `deprecated`), so no per-tag version stamping is needed.
Ship in the next release alongside the pending PLAN-016/017 work — assumed **5.37.0**; if those ship
first, this becomes 5.38.0.

## Out of scope

- Renaming `@unit` → `@unitSg` (rejected above).
- Pluralisation logic, locale rules, or any automatic derivation of the plural from the singular.
- Plural units on any bit type other than `cook-ingredients` / `recipe`.
- Changes to `bitmark-parser-rust` beyond consuming the regenerated config.
