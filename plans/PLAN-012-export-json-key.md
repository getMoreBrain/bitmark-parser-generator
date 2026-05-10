# PLAN-012 — `exportJsonKey` (new JSON-pattern jsonKey for export)

## Summary

Introduce a second, JSON-pattern form of `jsonKey` (per `specs/JSONKEY_SYNTAX.md`) called `exportJsonKey` on raw configs. The existing string-form `jsonKey` is **kept unchanged** and continues to drive this parser at runtime. The exporter (`ConfigBuilder`) replaces the legacy `jsonKey` it currently writes into `assets/config/**/*.jsonc` with the new `exportJsonKey` value, written under the field name `jsonKey` (which is what the new parser reads).

Defaults are omitted from both source and export: an absent `exportJsonKey` whose default pattern would be `{ <key>: "$" }` is not stored and not emitted — the new parser knows the default.

## Functional Requirements

### FR-1 New field on raw configs

Add optional `exportJsonKey` alongside `jsonKey` on:

| Interface (`src/model/config/_Config.ts`) | Field |
| - | - |
| `_AbstractTagConfig` | `exportJsonKey?: ExportJsonKey` |
| `_PropertyConfig`, `_ResourceConfig` | `exportJsonKey?: ExportJsonKey` |
| `_CardSetConfig` | `exportJsonKey?: ExportJsonKey` |
| `_CardSetConfig.sections[k]` | `exportJsonKey?: ExportJsonKey` |
| `_CardSideConfig` | `exportJsonKey?: ExportJsonKey` |
| `_CardVariantConfig` | `exportJsonKey?: ExportJsonKey` |

Type alias:

```ts
export type ExportJsonKey =
  | null
  | boolean
  | number
  | string
  | ExportJsonKey[]
  | { [k: string]: ExportJsonKey };
```

Source-side validation is structural-JSON only. Pattern-language validation (sigils, scope-shifts, predicates per `JSONKEY_SYNTAX.md` §§3–7) is the new parser's job.

### FR-2 Default-omission rule

`exportJsonKey` is **omitted** in source and **omitted** from export when the value would equal the trivial default:

| Entry kind | Trivial default |
| - | - |
| Property / resource / `@…` / `&…` tag with bare key | `{ "<key>": "$" }` |
| `_CardSetConfig.jsonKey` / sections / sides / variants | none — never trivially default |
| Symbol-mapped tags (`#`, `+`, `-`, `_`, `=`, `%`, `?`, `!`, `▼`, `►`, `$`) | none — always non-default |

Existing string `jsonKey` containing any of `.`, `|`, `[`, `^` is non-default and **requires** an `exportJsonKey` companion (FR-4 validator).

`null` is a legitimate explicit value (per `JSONKEY_SYNTAX.md` §2 — "consume only, emit nothing"). Distinguish absent (omit from export) from explicit `null` (emit `"jsonKey": null`).

### FR-3 Hydration

`src/config/ConfigHydrator.ts` propagates `exportJsonKey` from raw config into hydrated runtime classes parallel to `jsonKey`. Inheritance, chain expansion, group resolution, and squashed-group merging all carry `exportJsonKey` through unchanged.

Runtime classes that gain a readonly `exportJsonKey` field:
`AbstractTagConfig`, `PropertyTagConfig`, `ResourceTagConfig`, `MarkupTagConfig`, `CardSetConfig`, `CardSideConfig`, `CardVariantConfig`.

### FR-4 Export pipeline (`src/info/ConfigBuilder.ts`)

Single change of contract: the legacy `keyToJsonKey()` mini-language emission is replaced by `exportJsonKey` emission in every output path.

- `processTagEntries(tag, …)` — emit `jsonKey: <exportJsonKey>` if explicit; emit nothing if default-omitted; emit `jsonKey: null` if explicit null.
- `serializeCardSet` — same swap for cardSet root, `sections[k]`, sides, and variants.
- `writeBitsAsGroupConfigs` / `writeGroupConfigs` — same swap.
- `squashedGroups` `GroupRef` carries `exportJsonKey` parallel to its current `jsonKey`.
- Add a validator pass run before files are written:
  - For every source entry whose existing string `jsonKey` is non-default (per FR-2 rule), require `exportJsonKey` to be present.
  - On failure, throw with a heading-style path list mirroring `JSONKEYMIGRATION.md` (`bits.<bit> [/ groups.<g>] [/ tags.@<name>]`).

The legacy `jsonKey` in raw configs is **never** written to the exported jsonc.

### FR-5 Source population

Walk `JSONKEYMIGRATION.md` (654 entries) and copy each `**New**` value into the corresponding source location in `src/config/raw/{bits,groups,cardSets}.ts` as `exportJsonKey`.

Mapping (heading → source location):

| Heading shape | Target |
| - | - |
| `bits.<bit> / tags.@<name>` | `BITS[<bit>].tags[?].exportJsonKey` (entry whose `key` matches `<name>`) |
| `bits.<bit> / groups.<g> / tags.@<name>` | `GROUPS[<g>].tags[?].exportJsonKey` (canonical home; only override on `BITS[<bit>]` if that bit already sets a local `jsonKey`) |
| `bits.<bit> / cardSets.<cs> / cards.<card> / sides.<side> / variants.<v> / tags.<t>` | `CARDSETS[<cs>].sides[i].variants[j].tags[k].exportJsonKey` |
| `bits.<bit> / cardSets.<cs> / cards.<card>` | `CARDSETS[<cs>].exportJsonKey` (or `CARDSETS[<cs>].sections[<card>].exportJsonKey` when sectioned) |
| Heading lists multiple paths with one **New** | populate the deepest shared canonical home (group definition); only fork to per-bit overrides when migration assigns different values per path |

After population, drop any `exportJsonKey` whose value equals the trivial default for its key — these are noise.

### FR-6 Runtime parser unaffected

This parser keeps reading the legacy string `jsonKey` exclusively. `exportJsonKey` is consumed only by `ConfigBuilder`. No edits to `src/parser/`, `src/generator/`, `src/ast/`, `assets/grammar/`.

## Non-Functional Requirements

- **NFR-1 Backward compatibility** — every existing `jsonKey` string stays. All current parser/generator tests pass without change.
- **NFR-2 Build-time validation** — `npm run build` (which invokes the config build) fails when any non-default `jsonKey` lacks a paired `exportJsonKey`. Error message uses the migration-style path so offenders are findable.
- **NFR-3 Type safety** — `ExportJsonKey` is a recursive JSON type. No `any` introduced in public types.
- **NFR-4 No grammar/parser changes** — config-layer only.
- **NFR-5 Determinism** — exported jsonc is byte-identical given identical raw configs (key order in `exportJsonKey` objects is preserved).

## Phases

1. **Types** — extend `_Config.ts` interfaces and runtime config classes; add `ExportJsonKey` alias.
2. **Hydration** — thread `exportJsonKey` through `ConfigHydrator.ts` (chains, groups, sets/sides/variants, inheritance, squash).
3. **Builder swap** — replace legacy `keyToJsonKey()` emission in `ConfigBuilder.ts` with `exportJsonKey` emission, add the FR-4 validator, drop legacy `jsonKey` from output.
4. **Population sweep** — apply `JSONKEYMIGRATION.md` to `bits.ts` / `groups.ts` / `cardSets.ts` per FR-5; iterate against the validator until clean.
5. **Tests**:
   - Builder unit tests: default-omit, explicit-on-tag, explicit-null, on cardSet root / sections / sides / variants, via squashed group.
   - Snapshot a small representative slice of generated jsonc (one bit, one group, one card set with sections) covering each shape from `JSONKEY_SYNTAX.md` §10.
   - Validator failure test (non-default `jsonKey` without `exportJsonKey` → throws with path).
6. **Docs** — no new docs. `specs/JSONKEY_SYNTAX.md` already describes the language.

## Critical files

- `src/model/config/_Config.ts`
- `src/model/config/{AbstractTagConfig,PropertyTagConfig,ResourceTagConfig,MarkupTagConfig,CardSetConfig,CardSideConfig,CardVariantConfig}.ts`
- `src/config/ConfigHydrator.ts`
- `src/info/ConfigBuilder.ts`
- `src/config/raw/{bits,groups,cardSets}.ts`

## Out of scope

- Removing/altering existing string `jsonKey`.
- Validating `exportJsonKey` against `JSONKEY_SYNTAX.md` (sigils, predicates, scope-shifts) — handled by the new parser's compiler.
- Reverse-flow (jsonc → TS source) regeneration.
- Any change in `submodules/bitmark-parser-rust`.
