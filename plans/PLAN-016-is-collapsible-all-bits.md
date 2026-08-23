# PLAN-016: `@isCollapsible` on all bits; deprecate `*-collapsible` bit types

Issue: #10488

## Context

`@isCollapsible` exists today only on `.chapter` (`src/config/raw/bits.ts`, `[BitType.chapter]`), where
`JsonGenerator` force-emits `isCollapsible: false` when absent.

Collapsibility is otherwise expressed by 46 dedicated bit types (`.collapsible`, `.info-collapsible`,
`.smart-standard-table-normative-collapsible`, …) — each a near-empty subtype of a non-collapsible base
(see Appendix A). This doubles the bit-type surface for a single boolean.

## Goal

Make `isCollapsible` a universal bit-level boolean. The `*-collapsible` bit types keep working but become
deprecated: their collapsibility is now also expressed as `isCollapsible: true`, which the base bit type can
carry instead.

## Semantics

| Input                                            | JSON out                  | Bitmark out                                     |
| ------------------------------------------------ | ------------------------- | ----------------------------------------------- |
| `[.article]`                                     | _no key_                  | _no tag_                                        |
| `[.article]` + `[@isCollapsible:true]`           | `isCollapsible: true`     | `[@isCollapsible:true]`                         |
| `[.article]` + `[@isCollapsible:false]`          | _no key_                  | `[@isCollapsible:false]` (lossless)             |
| `[.chapter]`                                     | _no key_ (**breaking**)   | _no tag_                                        |
| `[.info-collapsible]`                            | `isCollapsible: true`     | `[.info-collapsible]` + `[@isCollapsible:true]` |
| `[.info-collapsible]` + `[@isCollapsible:false]` | _no key_ ⇒ implies `true` | `[@isCollapsible:false]` (see FR5)              |

Rules:

1. `isCollapsible` is available on every bit (declared once in `group_standardAllBits`).
2. `false` is the implied default and is **never** emitted to JSON — the key appears only when `true`.
3. On a `*-collapsible` bit type the tag config defaults to `true`, materialised into the AST when the tag
   is absent. An explicit `[@isCollapsible:false]` produces no JSON key, so the consumer falls back to that
   bit's `default: "true"` — effectively the hard-code that was asked for (FR5).
4. The defaulted value is a real AST property, so both generators see it without special-casing.

## Design decisions

- **Behaviour is encoded in the tag config / jsonKey, not in a new config field.** `JSONKEY_SYNTAX.md` §8
  (PLAN-051 §3) is explicit: behaviours are re-homed into the tag pattern language rather than new sibling
  flags. So there is **no** new bit-level flag; the difference between the two bit families is carried by
  fields the export already emits (`default`, `jsonKey`).
- **Force point = `Builder.buildBit()`**, not the generators. Both parse paths (bitmark PEG → Builder,
  JSON → Builder) converge there, so one line covers every direction and the AST stays canonical. The
  condition is read from the bit's _resolved_ tag config, so config remains the source of truth.
- **Per-bit tag override is the existing mechanism.** Config inheritance `deepMerge` **concatenates** `tags`
  arrays (`ObjectUtils.deepMerge`), and `ConfigHydrator.hydrateTagsConfig()` keys them by `ConfigKey` with
  **last-one-wins, whole-entry replacement**. A bit-level entry therefore fully replaces the group entry and
  must restate `format` and `description`. This is exactly how `.chapter` overrides tags today, and it
  surfaces in the export as an inline tag beside the `standard-tags` group reference (see `chapter.jsonc`).
- **`.chapter` loses its always-emit `false`.** Accepted breaking change (chosen explicitly); the local
  `.chapter` tag entry is removed in favour of the universal one.
- **Deprecation is marker-only.** No aliasing/rewriting of `*-collapsible` bits to their base type — the
  emitted `type` is unchanged. Migration to `base bit + [@isCollapsible:true]` is a consumer-side concern.

## Export encoding — verified against `submodules/bitmark-parser-rust`

The behaviour must be reconstructible downstream from the exported config alone. It is, using **only
`defaultValue`** — no new fields, no `exportJsonKey`.

Mechanism (`crates/lib/bitmark_parser/src/serializer/json/render.rs::synthesize_default`):

```rust
let Some(default_val) = tc.default else { return SynthesisOutcome::default() };  // no default -> emit nothing
match ctx.mode {
    OutputMode::Full      => render_default_value(tc, ctx.parent_id),
    OutputMode::Optimized => {
        if is_natural_default(tc.format, tc.nullable, Some(default_val)) {
            return SynthesisOutcome::default();      // "false" on a bool == natural -> skip
        }
        typed_value_json(default_val, tc, ctx.parent_id)   // "true" on a bool -> EMIT
    }
}
```

| Config on the tag       | rust optimised output (tag absent from markup)        |
| ----------------------- | ----------------------------------------------------- |
| `defaultValue: 'true'`  | **emits `true`** (non-natural default is synthesized) |
| `defaultValue: 'false'` | omitted (natural default for `bool`)                  |
| no `defaultValue`       | omitted (early return)                                |

**Per-bit overrides survive into the rust config.** `resources/bitmark-configurator/bitmark.json` carries
each bit's inline tag entries with their own `defaultValue` — `bits.chapter.tags` contains
`{"tag": "@toc", "format": "boolean", "defaultValue": "true"}` and
`{"tag": "@isCollapsible", ..., "defaultValue": "false"}`.

**Empirically confirmed** by the submodule's own reference fixture
`fixtures/reference/bitmark/optimised_json/chapter.json`: every chapter bit emits `toc: true, progress: true`
(per-bit `defaultValue: "true"`, absent from the markup) and emits **no** `isCollapsible`
(`defaultValue: "false"`). That is exactly the pair of behaviours required here.

Side effect worth noting: today TS emits `isCollapsible: false` on chapters and rust does not. Removing the
`.chapter` special case (FR2/FR6) **converges** the two engines rather than diverging them.

### Authored `[@isCollapsible:false]` — empirically verified

No `exportJsonKey` is needed to suppress it, and adding one would break it.

Strip decision (`render.rs::strippable` → `field_default_is_strippable`) is made by whichever `TagDef`
`tag_by_json_key(key)` resolves to. That map is built first-wins over tags sorted by id
(`gen_tag_registry.rs:200` + `json_key_map.entry(k).or_insert(i)`), and ids are assigned
**groups before bits** (`loader.rs:281`: "phase order groups (topo) → card-set variants → bits").

For `isCollapsible` the only group-level declaration is `standard-all-bits` (no default, not nullable), so it
wins the lookup ⇒ `None => !nullable` ⇒ **strippable** ⇒ an authored `false` is dropped on every bit.

Confirmed against committed fixtures:

| Fixture                                | Authored                                     | Tag's default                      | Optimised output                                                         |
| -------------------------------------- | -------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `table.bitmark:133-134`                | `[@tableSearch:false]`, `[@tableSort:false]` | `"false"` (natural)                | **stripped** — absent from `optimised_json/table.json`                   |
| `table.bitmark` bit 3                  | `[@tableAutoWidth:false]`                    | `"true"` (non-natural)             | **kept** as `tableAutoWidth: false`                                      |
| `cloze-solution-grouped.bitmark:3`     | `[@quizCountItems: false]`                   | mixed: group `none` / bit `"true"` | **kept** as `false` (a `defaultValue: "true"` **group** wins the lookup) |
| `cloze-solution-grouped.json` bits 1-2 | _(absent)_                                   | bit `"true"`                       | **emitted** `quizCountItems: true`                                       |

The third row is the one to note: it is kept only because a _group_ (`group-cloze-instruction-grouped`)
declares `"true"`. Our 46 overrides are **bit-level**, which sort after every group, so `isCollapsible`
resolves to the no-default group entry instead — the strip we want.

A multi-rule `exportJsonKey` would break this: multi-rule tags are absent from `tag_by_json_key`, and
`gen_tag_registry.rs` collects the value-position keys of every tag whose absence "differs" into
`JSON_KEYS_UNSTRIPPABLE`, forcing the field to be **kept**. Use the plain default jsonKey.

## Functional Requirements

### FR1 — Universal tag config (no default, no jsonKey)

`src/config/raw/groups.ts`, `group_standardAllBits`: add

```ts
{
  key: ConfigKey.property_isCollapsible,
  description: 'If true, the bit is collapsible',
  format: TagFormat.boolean,
  // no defaultValue     -> exports `"default": null`; false is the standard boolean default
  // no exportJsonKey    -> default single-rule key; see "Authored [@isCollapsible:false]" above
}
```

Consequence in `BitmarkGenerator`: with no `defaultValue`, `ignoreFalse` is off, so an AST `false` **is**
written back as `[@isCollapsible:false]`. That keeps bitmark → bitmark lossless while bitmark → JSON drops
the key; JSON never carries `false`, so JSON → bitmark never produces the tag.

### FR2 — Remove the `.chapter` local entry

`src/config/raw/bits.ts`, `[BitType.chapter]`: delete the `property_isCollapsible` tag entry (now inherited).

### FR3 — Per-bit override on the 46 `*-collapsible` bit types

For each bit type in Appendix A, in `src/config/raw/bits.ts`, add `deprecated: '5.37.0'` and a `tags` entry
(creating the `tags` array where the bit has none). The entry replaces the inherited one wholesale, so
`format` and `description` are restated:

```ts
deprecated: '5.37.0',
tags: [
  {
    key: ConfigKey.property_isCollapsible,
    description: 'If true, the bit is collapsible (defaults true for this deprecated bit type)',
    format: TagFormat.boolean,
    defaultValue: 'true',   // absent -> true; synthesized by both engines
  },
],
```

This is the same shape as `.chapter`'s `@toc` / `@progress`, which the rust submodule already honours
(see "Export encoding"). **No new config schema field** — the previously-considered bit-level
`collapsibleBit` flag is dropped: it would have added a field the export cannot carry and downstream would
have had to learn, contrary to `JSONKEY_SYNTAX.md` §8.

### FR4 — Materialise the default in the Builder

`src/ast/Builder.ts`, `buildBit()` (`bitConfig` already in scope) — read the condition from the resolved tag
config rather than a bit-type list, and apply it **only when the value is absent**, matching the `default`
semantics both engines share:

```ts
const collapsibleTag = bitConfig.tags[ConfigKey.property_isCollapsible] as PropertyTagConfig | undefined;
const defaultsTrue = collapsibleTag?.defaultValue === 'true';
...
isCollapsible: this.toAstProperty(
  bitType,
  ConfigKey.property_isCollapsible,
  data.isCollapsible ?? (defaultsTrue ? true : undefined),
  options,
),
```

Scoped to `property_isCollapsible` only — 20 other tags use `defaultValue: 'true'` (incl. `.chapter`'s
`@toc` / `@progress`), and materialising all of them into the AST is out of scope.

**Semantics note.** This is "absent ⇒ true" in the AST. An explicit `[@isCollapsible:false]` survives into
the AST and into generated bitmark, but FR6 keeps it out of the JSON — see FR5.

### FR5 — Hard-code is achieved without a constant jsonKey

`defaultValue` only covers _absence_, so it cannot literally hard-code a value. It does not need to:

- FR6 makes TS emit `isCollapsible` **only when `true`**, so `[@isCollapsible:false]` yields no JSON key on
  any bit.
- rust does the same by a different route — see "Authored `[@isCollapsible:false]`" above.
- With no key emitted, the consumer applies that bit's configured default, which for the 46 bits is `true`.

So the contradictory input degrades to `true` at the consumer, which is the requested behaviour. No
constants-only `exportJsonKey` is needed, and the multi-rule strip hazard is avoided.

### FR6 — JSON generator: emit only when true

`src/generator/json/JsonGenerator.ts`:

- Delete the `.chapter` line `if (bitJson.isCollapsible == null) bitJson.isCollapsible = false;` (~L1753).
  Leave `toc` / `progress` untouched.
- Add explicit `leaf_isCollapsible` (and `enter_isCollapsible`) handlers that write `bitJson.isCollapsible`
  only when the value is `true`. Defining them suppresses the auto-generated generic property handlers
  (the generator loop skips names already defined on the class).

### FR7 — Bitmark output for `*-collapsible` bits: Option A (implemented)

`defaultValue: 'true'` makes `BitmarkGenerator` set `ignoreTrue`, so `[@isCollapsible:true]` is omitted from
generated bitmark for the 46 bits. **Option A was taken: no generator change.** The value stays implicit in
bitmark (redundant with the bit type) and explicit in JSON, matching how `.chapter`'s `@toc` / `@progress`
already behave. Round-trip is stable — verified by the full `bitmark-generator` suite.

### FR8 — Regeneration

| Command                                 | Regenerates                                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run start-generate-config`         | `assets/config/partials/standard-all-bits.jsonc`, `bits/chapter.jsonc`, the 46 `*-collapsible` bit jsonc |
| `npm run regenerate-bitmark-test-json`  | expected JSON fixtures                                                                                   |
| `npm run build-supported-info`          | `SUPPORTED_BITS.md` (46 bits move to deprecated)                                                         |
| `npm run tsup && npm run build-browser` | `dist/` for `test/standard/web-*.test.ts`                                                                |

## Non-Functional Requirements

- No model/type changes: `BitJson.isCollapsible`, `Bit.isCollapsible`, `NodeType.isCollapsible`,
  `PropertyKey.property_isCollapsible` and the `buildBit` data field all already exist.
- No grammar changes; no parser rebuild.
- No new config schema fields: only `defaultValue` and `deprecated`, both already exported and both already
  honoured by `submodules/bitmark-parser-rust` (no submodule change required).
- TS and rust optimised-mode JSON must agree for all four cases in the Semantics table.
- Bit-type resolution, inheritance and emitted `type` values are unchanged.
- `bitmark → JSON → bitmark` is stable/idempotent for `*-collapsible` bits (the injected tag re-parses to
  the same forced value).
- Deprecation has no runtime effect — only `info list --deprecated`, `--all` and `SUPPORTED_BITS.md`.

## Breaking Changes

1. `.chapter` no longer emits `isCollapsible: false`; the key appears only when `true`.
2. An explicit `[@isCollapsible:false]` (any bit) is no longer emitted to JSON.
3. `*-collapsible` bits now emit `isCollapsible: true` and gain `[@isCollapsible:true]` in generated bitmark.

## Test Impact

Fixtures carrying collapsible bits or `isCollapsible` (regenerate + review diff):

- `chapter.*`, `book.json` — `isCollapsible: false` entries disappear.
- `collapsible`, `smart-standard-collapsible-bits`, `definition-list`, `page`, `table-extended`,
  `extractor-page`, `extractor-page-with-blocks`, `extractor-page-number`, `extractor-page-header`,
  `extractor-page-footer`, `extractor-image` — gain `isCollapsible: true` + the markup tag.

New coverage to add:

- `[@isCollapsible:true]` on a plain bit (e.g. `.article`) round-trips.
- `[@isCollapsible:false]` on a plain bit → key absent in JSON, tag absent in bitmark.
- `[.info-collapsible]` with no tag → `isCollapsible: true`.
- `[.info-collapsible]` + `[@isCollapsible:false]` → still `true`.

## Implementation Steps

1. FR1 + FR2 — universal tag in `groups.ts`; drop the `.chapter` entry.
2. FR3 — `deprecated` + the `@isCollapsible` override on the 46 bit configs (scripted edit, then review).
3. FR4 — `Builder.buildBit()` force from the resolved tag config.
4. FR6 — `JsonGenerator` handlers + remove the `.chapter` always-emit default.
5. FR7 — apply the chosen option.
6. FR8 — regenerate config, fixtures, supported-bits, dist.
7. Verify the export: `assets/config/partials/standard-all-bits.jsonc` gains `@isCollapsible` with
   `"default": null`; `assets/config/bits/info-collapsible.jsonc` gains an inline `@isCollapsible` with
   `"default": "true"`.
8. Cross-engine check against the submodule: rebuild `bitmark.json`, then diff rust optimised output for
   `chapter`, `collapsible` and `smart-standard-collapsible-bits` against the TS output. The
   `tag_by_json_key` resolution risk was investigated and does not apply (see "Authored
   `[@isCollapsible:false]`"), but re-confirm it if any **group** ever declares `@isCollapsible` with
   `defaultValue: 'true'` — that would flip the lookup and keep authored `false` on every bit.
9. Add the new test fixtures/cases.
10. `npm run check` && `npm test`.

## Out of Scope / Future Work

- Aliasing `*-collapsible` bit types onto their base type at parse time.
- Removing the deprecated bit types (a later major).
- Any `isCollapsibleOpen` / default-open-state tag.
- Auditing `toc` / `progress` on `.chapter` for the same always-emit removal.

## Appendix A — the 46 `*-collapsible` bit types

`bugCollapsible`, `collapsible`, `dangerCollapsible`, `definitionListCollapsible`, `exampleCollapsible`,
`extractorImageCollapsible`, `extractorPageCollapsible`, `extractorPageFooterCollapsible`,
`extractorPageHeaderCollapsible`, `extractorPageNumberCollapsible`, `extractorPageWithBlocksCollapsible`,
`hintCollapsible`, `infoCollapsible`, `noteCollapsible`, `pageCollapsible`, `remarkCollapsible`,
`sideNoteCollapsible`, `smartStandardArticleNonNormativeCollapsible`,
`smartStandardArticleNormativeCollapsible`, `smartStandardExampleNonNormativeCollapsible`,
`smartStandardExampleNormativeCollapsible`, `smartStandardImageFigureNonNormativeCollapsible`,
`smartStandardImageFigureNormativeCollapsible`, `smartStandardListCollapsible`,
`smartStandardListItemCollapsible`, `smartStandardNoteNonNormativeCollapsible`,
`smartStandardNoteNormativeCollapsible`, `smartStandardRemarkNonNormativeCollapsible`,
`smartStandardRemarkNormativeCollapsible`, `smartStandardRemarkTableExtendedImageNonNormativeCollapsible`,
`smartStandardRemarkTableExtendedImageNormativeCollapsible`,
`smartStandardRemarkTableExtendedNonNormativeCollapsible`,
`smartStandardRemarkTableExtendedNormativeCollapsible`,
`smartStandardRemarkTableImageNonNormativeCollapsible`, `smartStandardRemarkTableImageNormativeCollapsible`,
`smartStandardRemarkTableNonNormativeCollapsible`, `smartStandardRemarkTableNormativeCollapsible`,
`smartStandardTableExtendedImageNonNormativeCollapsible`,
`smartStandardTableExtendedImageNormativeCollapsible`, `smartStandardTableExtendedNonNormativeCollapsible`,
`smartStandardTableExtendedNormativeCollapsible`, `smartStandardTableImageNonNormativeCollapsible`,
`smartStandardTableImageNormativeCollapsible`, `smartStandardTableNonNormativeCollapsible`,
`smartStandardTableNormativeCollapsible`, `warningCollapsible`
