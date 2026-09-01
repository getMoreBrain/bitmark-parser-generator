# PLAN-020: Bit Groups, Resource Groups & Translated Names

Ticket: 9407-parser-bit-groups-and-bit-names

## Context

The book service maintains its own `bit-types.js`: hand-curated lists of bit types per
search/filter group (`tables`, `quizzes`, `reviews`, `static`, …) plus resource-type
groupings (`image`, `video`, …), with name translations in a separate file. Group
membership knowledge is encoded there three times (the lists, `startsWith`
heuristics in the filter builder, `quizCategories`). Problems:

- Duplicated knowledge; new bits are regularly forgotten in the group lists.
- Translations of group names and bit names live outside the parser config.

This plan moves groups + translations into the parser configuration (single source of
truth), exposes them via new API methods, and includes them in the generated
config export (`assets/config/`) and documentation.

**Terminology.** "Group" is already taken in this codebase (tag groups:
`raw/groups.ts`, `GroupConfigType`, `assets/config/groups/`). The new concept is named
**bit group** (`bitGroup`) everywhere, and **resource group** (`resourceGroup`) for the
resource-type groupings. Never plain "group".

## Decisions (agreed)

| # | Topic | Decision |
| --- | --- | --- |
| D1 | Membership storage | **Hybrid**: central `bitGroups` registry defines each group (key, description, titles); each bit config declares `bitGroups: [...]`. Group→bits direction is derived. |
| D2 | Resource groups | In scope; membership is a central list per group (`ResourceType` values have no per-item config to annotate). |
| D3 | Group keys | **Verbatim** from the book service (incl. `survey` AND `surveys`, `other`, `group`, `set`, …) so `g=<key>` queries keep working, **plus optional `aliases: string[]`** per registry entry for future renames. Lookups accept key or alias. |
| D4 | Unknown member names | **Drop + report**: seed only names in the `BitType` enum; unknowns listed in the PR description for human verdicts (see Reconciliation). The parser rejects unknown bit types at parse time anyway, so dead entries can never match parsed content. |
| D5 | `static` semantics | **Semantic**: static = any non-interactive, non-infrastructure content bit. All ~170 bits missing from every book-service list are seeded into `static` (+ obvious family group, e.g. `table-extended-image` → `tables`); every such assignment listed in the PR for review. |
| D6 | Deprecated bits | A deprecated bit with a migration target (via existing `Config.getMigratedBitType()`, PLAN-017 — derived, no new raw field) **derives its target's `bitGroups`** unless it declares its own. FR11 exempts these. Deprecated bits without a target declare explicitly. |
| D7 | API surface | **Typed methods on `BitmarkParserGenerator`** (implemented in `InfoBuilder` over `Config`); `info()` additionally gains `InfoType` values `bitGroups`/`resourceGroups` for CLI/doc output. |
| D8 | Language codes | **BCP-47** keys; lookup fallback chain `de-CH` → `de` → `en` → technical key. |
| D9 | Translation storage | English `title: string` inline on each bit/group config; **non-en languages in a separate module behind a `./translations` subpath export** (bundle-size split, supersedes the original all-inline intent for non-en). Registered once via the API; Node and browser identical. |
| D10 | Legacy resource values | Resource-group members are **canonical kebab `ResourceType` values only**; consumers normalize legacy camelCase input (`imageLink` → `image-link`) mechanically before matching. |
| D11 | Quiz categories | Registry entries support optional **`subgroupOf: BitGroupKey` metadata** (informational only — membership stays explicit/flat). `cloze`/`match`/`flashcard`/`multiple-choice`/… get `subgroupOf: 'quizzes'`, replacing the book service's `quizCategories()` knowledge. |
| D12 | Translation source | `docs/translations.json` (in repo): 464 entries × 6 complete languages (`en, de, es, fr, ro, it`); all 54 group keys covered; 396/671 bit types covered (rest fall back). |
| D13 | Export completeness | The `assets/config/**/*.jsonc` export is consumed by the **new parser**: it must contain ALL group information (registries, aliases, `subgroupOf`, memberships, en titles) — **everything except the translation language maps**, which stay out of the jsonc export entirely. |

## Functional Requirements

- FR1: Central registry of bit groups: key, `aliases?`, description, en `title`,
  `subgroupOf?`, `since`.
- FR2: Each bit config declares its bit-group memberships (`bitGroups`). A bit can be
  in several groups. Membership is explicit — no inheritance via `baseBitType`
  (curated groups like `static` must not leak through inheritance); the single
  exception is the deprecated-bit derivation of D6.
- FR3: Central registry of resource groups: key, `aliases?`, description, en
  `title`, member `resourceTypes` (canonical values only, D10), `since`.
- FR4: Bit configs support an en `title` (translated human name; the existing
  `name` field stays the technical key).
- FR5: API — get all bit types for one or more bit groups (union, deduped,
  deterministic order). Serves search `g=cloze&g=table`. Accepts keys or aliases.
- FR6: API — get all known bit groups, each with resolved bit types, aliases,
  description, `subgroupOf`, and title (en, or resolved for a requested language).
  Filterable by `subgroupOf` (D11).
- FR7: API — get the bit groups for one or more bit types (input parameter),
  optionally with titles resolved for a given language.
- FR8: API — get the translated name of a bit / bit group / resource group for a
  language, using the D8 fallback chain.
- FR9: API — resource-group equivalents of FR5–FR7 over `ResourceType` values.
- FR10: Config export (`ConfigBuilder`) writes `assets/config/bit-groups/*.jsonc` and
  `assets/config/resource-groups/*.jsonc` (one file per group: key, aliases,
  description, en `title`, `subgroupOf`, resolved member list — resolved means
  post D6 derivation, so the new parser needs no derivation logic), and includes
  `bitGroups` + en `title` in each bit's exported `.jsonc`. Per D13 the export is
  lossless for the new parser except translations: the non-en language maps are
  NOT exported to jsonc (they remain in `docs/translations.json` and the
  `./translations` subpath module).
- FR11: Validation — build/test fails when:
  - a bit references an unknown bit-group key;
  - a non-internal (`_*`), non-deprecated-with-target bit declares no `bitGroups`
    field (deliberately ungrouped bits must state `bitGroups: []`);
  - a bit-group registry entry has no member bits (dead group) — unless flagged;
  - a resource group references an unknown `ResourceType`;
  - an alias collides with another group's key or alias;
  - a group marked `subgroupOf: X` has a member bit not also in `X` (D11
    consistency);
  - a translations-module key matches no bit type / group key (guards against
    silent drift);
  - a language key is not valid BCP-47 (pragmatic regex).
  This is the mechanism that stops "forgot to add the new bit to the groups".
- FR12: Deprecated bits keep memberships (search must still find legacy content);
  API results include them by default, with an option to exclude.
- FR13: Translation registration — `./translations` subpath export provides the
  non-en title maps; a one-time registration call (exposed on
  `BitmarkParserGenerator`, stored in the Config layer) makes them available to
  the FR6–FR8 language resolution. Unregistered → fallback chain ends at en/key.

## Non-Functional Requirements

- NFR1: Works identically in Node and browser builds; no filesystem access in the
  API paths (export stays Node-only in `ConfigBuilder`).
- NFR2: Derived lookups (group→bitTypes, bitType→groups, alias→key) computed once
  and cached in the Config layer (immutable at runtime), per existing config rules.
- NFR3: Group keys are SuperEnums (`BitGroup`, `ResourceGroup`) for compile-time
  typo safety in `raw/bits.ts` and the registries; lookup inputs also accept
  plain strings (URL query values) — unknown inputs yield empty results, never
  throw (consistent with `getBitType`).
- NFR4: Main browser bundle impact minimal (membership + en titles only; the
  ~78kB translation payload rides the subpath export). Measure and report against
  the < 60kB budget.
- NFR5: Strict TypeScript, no `any` in public API; new types exported from
  `src/index.ts`.

## Design

### Model layer (`src/model/`)

- `enum/BitGroup.ts` — SuperEnum of bit-group keys (verbatim book-service keys).
- `enum/ResourceGroup.ts` — SuperEnum of resource-group keys (`image`, `video`,
  `still-image-film`, `document`, `article`, `audio`, `website`, `app`).
- `config/_Config.ts` additions:
  - `_BitGroupsConfig` / `_BitGroupConfig { aliases?; description; title; subgroupOf?; since }`
  - `_ResourceGroupsConfig` / `_ResourceGroupConfig { aliases?; description; title; resourceTypes; since }`
  - `_BitConfig` gains `bitGroups?: BitGroupType[]` and `title?: string` (en).
- `config/BitConfig.ts` (hydrated) gains `bitGroups: BitGroupType[]` (post
  D6 derivation) and `title?: string`.
- New info result types (`BitGroupInfo { key; aliases; description; subgroupOf?; title; bitTypes }`,
  resource equivalent) and `TranslationsData` (shape of the subpath module:
  `{ [bitTypeOrGroupKey: string]: { [bcp47: string]: string } }`).

### Raw config (`src/config/raw/`)

- `bitGroups.ts` — bit-group registry; `resourceGroups.ts` — resource-group
  registry.
- `bits.ts` — add `bitGroups` (and `title`) to every bit per D5/D6.
- `translations.ts` — non-en title maps keyed by bit type / group key, generated
  from `docs/translations.json` (see Seeding). NOT imported by `index.ts`;
  exported only via the `./translations` subpath (package.json `exports` map
  already exists — add the entry, incl. browser variants).

### Config layer (`src/config/Config.ts`)

Cached accessors (built lazily from raw config on first use):

- `getBitGroupConfig(keyOrAlias)`, `getBitGroups(filter?)`
- `getBitTypesForBitGroups(keysOrAliases: string[]): BitTypeType[]`
- `getBitGroupsForBitTypes(bitTypes: string[]): BitGroupType[]`
- `getBitTitle(bitType, language?)`, `getBitGroupTitle(keyOrAlias, language?)` —
  D8 fallback chain.
- `registerTranslations(data: TranslationsData)` (idempotent, one-time).
- Resource-group equivalents.
- D6 derivation and alias resolution happen here, once, at cache build.

### Info / API surface

- `InfoBuilder` methods wrapping the Config accessors (mirroring
  `getSupportedBits`), including language resolution.
- `BitmarkParserGenerator`: public typed methods delegating to `InfoBuilder`
  (D7), plus `registerTranslations`.
- `info()` gains `InfoType.bitGroups` / `InfoType.resourceGroups` honouring
  text/json output formats (full-catalog output).
- `src/index.ts` exports: `BitGroup`, `ResourceGroup`, new info/translation types.
- `SUPPORTED_BITS.md` generation: add each bit's groups (small annotation).

### Config export (`src/info/ConfigBuilder.ts`)

- New output folders `assets/config/bit-groups/`, `assets/config/resource-groups/`
  with the same clean-then-write lifecycle as `bits/`/`groups/`/`cards/`.
- Bit `.jsonc` files gain `bitGroups` (resolved, incl. D6 derivation) and en
  `title` (omit when absent). No translation maps in any `.jsonc` (D13).

### Validation

- FR11 as a unit test suite (`test/unit/config/bit-groups.test.ts`);
  registry-consistency checks that can throw cheaply also run in config hydration
  (fail fast, consistent with existing `alwaysEmit`/`nullable` checks).

## Data Seeding & Reconciliation

1. Seed group registries and memberships from the book service `bit-types.js`
   (content in ticket 9407), keys verbatim (D3).
2. Reconciled against the `BitType` enum (computed). **Dropped + reported for
   human verdict** (D4): `review`, `review-collapsible`, `conversation` (bare),
   `group`, `set`, `vocabulary`, `vocabulary-1`, `flashcard-set`,
   `flashcard-language-set`, `flashcard-language-1`, `match-prefix`,
   `self-assessment-1`, `rating-1`. Everything else (incl. `screenshot`,
   `rating`, `table-extended`, `survey-rating`) exists.
3. Resource lists: legacy camelCase spellings and bit-type entries are not
   seeded (D10 — bit-type entries are covered by bit groups; the consumer
   combines both). `image-online`, `image-with-audio` are unknown → report.
4. Unlisted bits (~170): seed per D5 (semantic `static` + family group);
   assignments listed in the PR.
5. Translations import — generate `raw/translations.ts` from
   `docs/translations.json`:
   - take en into the inline `title` fields; other languages into the module;
   - include only keys matching a bit type or group key (FR11 guard);
   - map near-miss keys instead of dropping: `book-acknowledgments`
     (→ `book-acknowledgements`), `smart-standard-image-figure-normativ`
     (truncated), `vendor_padlet_embed`, `lang_life_skills` (underscores) —
     full near-miss list produced by the import script;
   - ignore book-service UI strings (`true`, `correct-answer`, `printed-by`, …)
     and legacy camelCase resource keys — report the ignored set.

## Consumer Mapping (book service → new API)

| Book service today | Replacement |
| --- | --- |
| `bitTypes.<group>` lists | `getBitTypesForBitGroups(['<group>'])` |
| all groups + their types | `getBitGroups()` |
| `translations.translateForLanguage(name, lang)` | `getBitGroupTitle(name, lang)` / `getBitTitle(...)` (after `registerTranslations(...)`) |
| `resourceTypes.<group>` | `getResourceTypesForResourceGroups(['<group>'])` + camelToKebab normalization of stored values (D10) |
| `isMedia(type)` | membership test via resource groups (`image`, `video`, `website`) — thin consumer-side helper |
| `quizCategories(...)` | `getBitGroupsForBitTypes(types)` ∩ `getBitGroups({ subgroupOf: 'quizzes' })` (D11) |

## Task Breakdown

1. Model types + enums (`BitGroup`, `ResourceGroup`, `_Config` fields, info types).
2. Registries in `raw/` + seed memberships in `raw/bits.ts` (D4/D5 reports in PR).
3. Translations import script → `raw/translations.ts` + inline en titles;
   `./translations` subpath export wiring (Node + browser builds).
4. Config layer: accessors, caches, alias resolution, D6 derivation,
   `registerTranslations`.
5. Validation test suite (FR11) + hydration fail-fast checks.
6. InfoBuilder + BitmarkParserGenerator methods, `InfoType` additions,
   `index.ts` exports.
7. ConfigBuilder export (`bit-groups/`, `resource-groups/`, bit fields) +
   `SUPPORTED_BITS.md` annotation.
8. Tests: API unit tests (language fallback chain incl. BCP-47 subtag stripping,
   alias lookup, multi-group union, deprecated inclusion flag, unregistered vs
   registered translations), export snapshot check, bundle-size check (NFR4).

## Out of Scope

- Book-service search/filter implementation and TOC counting (stays consumer-side).
- Membership-implying group hierarchy (`subgroupOf` is metadata only, D11).
- Adding the 13 unknown bit types to the parser (separate tickets if the D4
  report verdicts say they should exist).

## Open Questions

- OQ1: Verdicts on the D4 dropped names and D5 `static` assignments — resolved in
  PR review of task 2.
- OQ2: Should `info()` text output for bit groups be added to the CLI docs
  (PLAN-001/002) — follow-up if yes.
