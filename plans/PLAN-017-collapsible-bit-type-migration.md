# PLAN-017: Migrate deprecated `*-collapsible` bit types to base bit + `@isCollapsible`

Depends on: PLAN-016 (universal `@isCollapsible`, 46 bit types deprecated).

## Context

PLAN-016 made `isCollapsible` a universal bit-level boolean and deprecated the 46 `*-collapsible` bit types.
They still round-trip as themselves. This plan makes the parser/generator emit the **new** form for content
authored in the old form.

## Goal

```
JSON    { "type": "smart-standard-remark-table-image-normative-collapsible" }
bitmark [.smart-standard-remark-table-image-normative-collapsible]
   ⇩ both migrate to
bitmark [.smart-standard-remark-table-image-normative]
        [@isCollapsible:true]
JSON    { "type": "smart-standard-remark-table-image-normative", "isCollapsible": true }
```

Nothing else about the bit changes.

## Decisions (agreed)

| Question       | Decision                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Scope          | **Every input, every output** — migrate in the AST layer, so bitmark and JSON input both migrate, and both outputs carry the new form |
| `.collapsible` | **Unchanged** — no non-collapsible counterpart exists; it stays deprecated and keeps emitting `isCollapsible: true` via PLAN-016      |
| Tag form       | Follow other boolean properties — `[@isCollapsible:true]`, no special-casing                                                          |

## Mapping rule

Every `*-collapsible` bit type now declares its non-collapsible cousin as its `baseBitType`. The mapping is
therefore **read from the config**, not from a hand-maintained table:

```
target = bitConfig.baseBitType      for any bit type whose name ends in `-collapsible`
```

Verified: all 45 `*-collapsible` bit types have `baseBitType` equal to their name minus the suffix.

**Config equivalence verified for all 45 pairs** at two levels:

- hydrated runtime config (`Config.getBitConfig`) — resolved tag-key sets (ignoring `@isCollapsible`),
  `textFormatDefault`, `bodyAllowed`/`bodyRequired`, `footerAllowed`/`footerRequired`,
  `resourceAttachmentAllowed`, `rootExampleType`, `quizBit`, `cardSet` → **0 differences**
- generated `assets/config/bits/*.jsonc` — group refs and tag lists → **0 differences**

The migration is consequently loss-free by construction: the target's config _is_ the collapsible bit's
config, minus the `@isCollapsible` default.

### Exclusion (1 of 46)

| Bit type      | Why                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `collapsible` | Special case — no non-collapsible cousin. Its `baseBitType` is `article`, so the config-derived rule must **not** be applied to it blindly. |

Net: **45 bit types migrate**, 1 passes through.

New `*-collapsible` bit types are covered automatically by the rule — no table to update.

## Design decisions

- **Single insertion point: `Builder.buildBit()`.** Verified both input paths converge there —
  `BitmarkPegParserProcessor` calls `builder.buildBit()` (2 sites) and `JsonParser` calls it once. One remap
  covers bitmark→*, JSON→*, and both generators, with no generator changes at all.
  Rejected: a JSON-only pre-parse step in `JsonParser.preprocessJson()` — it would not migrate bitmark input,
  which the agreed scope requires.
- **Order matters**: remap `data.bitType` **before** `Config.getBitConfig(bitType)`, and set
  `isCollapsible` as part of the remap. After the remap the bit config is the target's, which has no
  `defaultValue`, so PLAN-016 FR4's default-materialisation no longer fires for these bits — the remap must
  supply the value itself. FR4 still fires for `.collapsible` (excluded, keeps `defaultValue: 'true'`).
- **`?? true`, not `= true`**: preserve PLAN-016 semantics — an explicit `isCollapsible: false` in the source
  still wins and still yields no JSON key.
- **Config unchanged.** The 45 keep `deprecated` and `defaultValue: 'true'`; those now serve only the
  exported config / downstream consumers that do not migrate (see NFR).

## Functional Requirements

### FR1 — Config-derived remap lookup

A lookup (e.g. `Config.getMigratedBitType(bitType)`) returning the migration target or `undefined`:

1. `undefined` if the bit type is `BitType.collapsible` (explicit exclusion).
2. `undefined` if the name does not end in `-collapsible`.
3. otherwise `bitConfig.baseBitType`.

Cache alongside the existing bit-config cache; the answer is static per bit type.

A test asserts, for every `*-collapsible` bit type except `.collapsible`, that `baseBitType` equals the
name-derived target — so a future bit type that breaks the naming/inheritance convention fails loudly rather
than migrating to the wrong target.

### FR2 — Remap in `Builder.buildBit()`

Before the bit config is resolved:

1. If `data.bitType` is in the map, replace it with the target.
2. Set `data.isCollapsible = data.isCollapsible ?? true`.
3. Everything downstream (config resolution, tag validation, AST construction) uses the target type.

`data` is already `structuredClone`d at the top of `buildBit()`, so mutating it is safe.

### FR3 — Commented bits

`[.|info-collapsible]` parses to `type: _comment` + `originalType`. The remap must apply to the original
type too, so commented old bits migrate consistently. Verify against `JsonParser` (`bit.originalType`) and
the PEG comment path.

### FR4 — Generators unchanged

No change to `BitmarkGenerator` or `JsonGenerator`:

- bitmark: the target type has no `defaultValue` for `@isCollapsible`, so `ignoreTrue` is off and the tag is
  written as `[@isCollapsible:true]` by the normal boolean path.
- JSON: `type` comes from the AST bit type; `isCollapsible: true` is emitted by PLAN-016 FR6.

### FR5 — `markup` / `bitmark` field: Option A (implemented)

`BitmarkPegParserHelper` sets `bit.markup` from the verbatim source **after** `buildBit()`, so for
bitmark → JSON the emitted `bitmark` field still reads `[.info-collapsible]` while `type` reads `info`.

**Option A taken: leave as-is.** `bitmark` is defined as the original source markup, and the standard tests
strip it (`removeMarkup: true`). The consequence is observable — JSON output is not byte-identical across a
re-parse — so it is pinned by an explicit test rather than left implicit:
`isCollapsibleBitTypeMigration.test.ts` asserts the migrated `type` alongside the pre-migration `bitmark`,
and the idempotence test compares bits with `bitmark` excluded.

Switch to Option B (clear `markup` on migrated bits, so the field is omitted rather than stale) if a
consumer re-parses that field.

## Non-Functional Requirements

- No config data changes; no regeneration of `assets/config/**` or `SUPPORTED_BITS.md`.
- No grammar changes; the old bit types remain **parseable** — only the output form changes.
- Migration is unconditional (no option flag), per the agreed scope.
- Deterministic and idempotent: migrated output re-parses to the same AST.
- **Cross-engine divergence (accepted, flag downstream)**: `submodules/bitmark-parser-rust` does not migrate,
  so for old input the TS engine now emits `type: "info"` where rust emits `type: "info-collapsible"`. Both
  agree on `isCollapsible: true` (rust via the `defaultValue: 'true'` the config still declares).

## Breaking Changes

1. The emitted `type` changes for 45 bit types when the input uses the old form.
2. `bitmark → bitmark` (prettify) rewrites the bit header for those 45.
3. Consumers keyed on the old `type` strings see the base type instead.

## Test Impact

Fixtures containing the 45 types — expect `type` changes plus an added `[@isCollapsible:true]`:
`collapsible`, `smart-standard-collapsible-bits`, `definition-list`, `page`, `table-extended`,
`extractor-page`, `extractor-page-with-blocks`, `extractor-page-number`, `extractor-page-header`,
`extractor-page-footer`, `extractor-image`.

New coverage:

- Each of the 45 migrates (table-driven over the map): bitmark in → new type + tag; JSON in → new type + `isCollapsible: true`.
- `.collapsible` passes through unchanged.
- Explicit `isCollapsible: false` on an old-form bit → migrated type, no JSON key.
- Commented `[.|info-collapsible]` migrates.
- Idempotence: migrated output re-parses unchanged.

## Implementation Steps

1. FR1 — build the map (generate from the name rule, assert all targets exist, minus `.collapsible`).
2. FR2 — remap + `?? true` at the top of `Builder.buildBit()`, before `Config.getBitConfig`.
3. FR3 — commented-bit path.
4. FR5 — apply the chosen option.
5. Regenerate the affected fixtures only (as in PLAN-016: full regeneration churns ~400 files with unrelated
   version-stamp drift).
6. Add the tests above.
7. `npm run tsup && npm run build-browser` (web tests run against `dist/`), then `npm test`.

## Out of Scope / Future Work

- Migrating `.collapsible` (no target bit type exists).
- Mirroring the migration in `bitmark-parser-rust`.
- Removing the 46 deprecated bit types (a later major).
- Any migration of other deprecated bit types (e.g. `screenshot`).
