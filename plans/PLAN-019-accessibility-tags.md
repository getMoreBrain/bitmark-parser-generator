# PLAN-019: Accessibility classification tags (`@accessibilityGroupTag` / `@accessibilityTag`)

## Context

Images (and other bits) need a machine-readable accessibility classification so consumers can decide
whether to announce, describe, or skip a bit for assistive technology. The classification is a
`(group, value)` pair — the group names the classified aspect, the value is one of a fixed vocabulary:

```
[@accessibilityGroupTag:image][@accessibilityTag:decorative]
```

The existing `@groupTag` / `@tag` pair already models exactly this shape (a named group with a set of
member tags, plus a flat standalone tag list), so the new tags mirror it rather than inventing a new one.

Five bit types are decorative by definition and must carry the classification even when the author
omits it: `image-separator`, `image-separator-alt`, `separator`, `separator-alt`, `image-mood`.

## Decisions (agreed)

| Question | Decision |
| --- | --- |
| Structure | **Chained, mirroring `@groupTag`/`@tag`.** `@accessibilityTag` is a chain child of `@accessibilityGroupTag` **and** a standalone bit-level property |
| Bit scope | **All bits** — added to `group_standardAllBits` next to `@tag`/`@groupTag` |
| Cardinality | **`Count.infinity`** in both positions, matching `@tag` |
| Format | `@accessibilityGroupTag` = `TagFormat.plainText` (exports as `string`); `@accessibilityTag` = `TagFormat.enumeration` with `values: ['complex','functional','decorative','standard']` |
| Defaults | **Materialised into JSON output** for the five bit types (not config-declaration only) |
| Bitmark output | **Always written** for the five bit types, even when the source omitted them |
| Default delivery | A **dedicated group** (`group_accessibilityDecorative`) attached to each of the five bits — *not* a `defaultValue` on a base bit type |
| `print-page-break` | Excluded. Its `baseBitType` changes `separator` → `article` so it can never inherit the default (see NFR2) |
| Enum export | **Fixed as part of this work** — `TagFormat.enumeration` currently exports as `"format": ""` with no `values` |

### Why a group rather than a bit-level `defaultValue`

Bit config inherits its base's whole tag list, so a `defaultValue` on `separator` would leak to
`separator-alt` **and** `print-page-break`. A named group makes each defaulted bit opt in explicitly and
is self-documenting in the generated config.

Tag hydration is last-wins per config key (`ConfigHydrator.hydrateTagsConfig`, spread merge) and bit
`tags` arrays concatenate root-first (`ObjectUtils.deepMerge`), so a group reference in a bit's own
`tags` overrides the same keys coming from `group_standardAllBits`. This is the established pattern
(cf. the `@isCollapsible` overrides on the deprecated `*-collapsible` bits).

## Functional requirements

### FR1 — Property keys

`src/model/enum/PropertyKey.ts` — add (alphabetical):

```
property_accessibilityGroupTag: '@accessibilityGroupTag'
property_accessibilityTag:      '@accessibilityTag'
```

`ConfigKey` derives from `propertyKeys` — no separate change.

### FR2 — Group key

`src/model/enum/GroupKey.ts` — add `group_accessibilityDecorative`.

### FR3 — Standard group (no defaults)

`src/config/raw/groups.ts`, `group_standardAllBits`, immediately after the `property_groupTag` block:

- `property_accessibilityTag` — standalone. `format: TagFormat.enumeration`,
  `values: ['complex','functional','decorative','standard']`, `nullable: true`,
  `maxCount: Count.infinity`. Mirrors `property_tag`.
- `property_accessibilityGroupTag` — `format: TagFormat.plainText`, `maxCount: Count.infinity`,
  `jsonKey: 'accessibilityGroupTag.name'`,
  `exportJsonKey: { accessibilityGroupTag: [{ '@id': 'name', name: '$' }] }` (entity-merge starter-array,
  same as `groupTag` — repeated occurrences with the same name fold into one entry and their chained
  arrays merge as sets).
  `chain: [ property_accessibilityTag ]` with `exportJsonKey: { tags: ['$'] }`,
  `format: TagFormat.enumeration`, the same `values`, `nullable: true`, `maxCount: Count.infinity`.

### FR4 — Defaults group

`src/config/raw/groups.ts` — new `group_accessibilityDecorative`, `type: GroupConfigType.standard`.
It re-declares **only** `property_accessibilityGroupTag` (full definition — last-wins replaces, it does
not merge), identical to FR3 except:

- `defaultValue: 'image'` on `property_accessibilityGroupTag`
- `defaultValue: 'decorative'` on the chained `property_accessibilityTag`
- `nullable` omitted on both (a defaulted tag is not nullable)

The **standalone** `property_accessibilityTag` is deliberately *not* re-declared — the default belongs to
the group structure only, so the flat `accessibilityTag` key stays unset on defaulted bits.

Do not set `maxCount`/`minCount` on the group *reference* — `hydrateTagGroupConfig` would apply it to the
group's first tag.

### FR5 — Bit config

`src/config/raw/bits.ts` — add `{ key: ConfigKey.group_accessibilityDecorative, description: ... }` to the
`tags` array of:

| Bit type | since |
| --- | --- |
| `separator` | 1.4.15 |
| `separatorAlt` | 1.16.0 |
| `imageSeparator` | 1.4.15 |
| `imageSeparatorAlt` | 1.16.0 |
| `imageMood` | 1.3.0 |

Declared on **all five** explicitly, not relying on inheritance — `separator-alt` and
`image-separator-alt` currently have no `tags` array and gain one.

Also change `[BitType.printPageBreak].baseBitType` from `BitType.separator` to `BitType.article`
(see NFR2 for the behaviour-neutrality argument).

### FR6 — Enum format export

`src/info/ConfigBuilder.ts`, `processTagEntries()`:

- In the `BitTagConfigKeyType.property` format branch, map `TagFormat.enumeration` → `'enum'`.
- Emit the vocabulary: `...(tag.values ? { values: tag.values } : {})`, placed next to `default`.

The existing `format && format !== 'string'` guard already lets `'enum'` through. This also changes the
existing `@allowPrint` entry (`assets/config/partials/book-common.jsonc`) from `"format": ""` to
`"format": "enum"` plus a `values` list — an intended fix, flagged in the review diff.

`values` remains inert at parse time — no enum validation is introduced (see Out of scope).

### FR7 — JSON model

`src/model/json/BitJson.ts` — after `groupTag`:

```
accessibilityTag: string | string[];
accessibilityGroupTag: GroupTagJson[];
```

`GroupTagJson` (`{ name, tags }`) is reused verbatim; no new interface.

`src/model/json/BitJson.schema.json` — mirror both under `properties` (and `required`, following the
file's existing convention): `accessibilityTag` → `$ref: stringOrStringArray`; `accessibilityGroupTag` →
array of `GroupTagJson`.

### FR8 — AST node types

`src/model/ast/Nodes.ts` (`Bit`): `accessibilityTag?`, `accessibilityGroupTag?: GroupTagJson[]`.

`src/model/ast/NodeType.ts`: add `accessibilityTag` / `accessibilityTagValue` and
`accessibilityGroupTag` / `accessibilityGroupTagValue`, mirroring the `groupTag` entries.

### FR9 — Parser

`src/parser/bitmark/peg/BitmarkPegParserTypes.ts` — add
`accessibilityGroupTag?: Partial<GroupTagJson>[]` alongside `groupTag`.

`src/parser/bitmark/peg/contentProcessors/GroupTagChainContentProcessor.ts` — generalise: parameterise the
chain child key it reads out of the processed chain (`tag` vs `accessibilityTag`) and the target key it
pushes to (`groupTag` vs `accessibilityGroupTag`). Keep the existing behaviour identical for `groupTag`.

`PropertyContentProcessor.ts` — add an `else if (configKey === ConfigKey.property_accessibilityGroupTag)`
branch dispatching to the generalised processor.

### FR10 — Builder

`src/ast/Builder.ts`:

- Generalise `buildGroupTags` / `buildGroupTag` so the same-name combining logic serves both keys
  (they operate purely on `GroupTagJson`, so a shared implementation suffices).
- `buildBit` data type + node construction: add `accessibilityTag` (via `toAstProperty`, like `tag`) and
  `accessibilityGroupTag` immediately after `groupTag`. **Node order defines JSON key order.**
- **Default materialisation** — following the `isCollapsibleDefaultsTrue` precedent (Builder.ts ~L470):
  read `bitConfig.tags[ConfigKey.property_accessibilityGroupTag]` as `PropertyTagConfig`; if its
  `defaultValue` is set and the incoming `data.accessibilityGroupTag` is absent/empty, synthesize
  `[{ name: <groupDefault>, tags: [<chainDefault>] }]` where `<chainDefault>` comes from
  `chain[ConfigKey.property_accessibilityTag].defaultValue` (omit `tags` entry if unset).
  Applies to both parse paths, since bitmark and JSON both converge on `buildBit()`.
  An explicitly authored value always wins — the default only fills an absent slot.

### FR11 — Bitmark generator

`src/generator/bitmark/BitmarkGenerator.ts` — add `enter_accessibilityGroupTag`, a direct analogue of
`enter_groupTag` (~L431): bit-level guard on `NodeType.bitsValue`, write
`accessibilityGroupTag` with `{ format: TagFormat.plainText, writeEmpty: true }`, then each member as
`accessibilityTag` with `{ format: TagFormat.plainText, writeEmpty: true, forceChain: true }`, return
`false` to stop traversal.

No default-suppression logic: because the default is materialised into the AST (FR10), the tags are
present on the node and are written unconditionally — this is the agreed "always write" behaviour.

Standalone `accessibilityTag` needs no handler; the generic property writer covers it.

### FR12 — JSON generator

**No change.** `groupTag` has no dedicated handler; `standardHandler` passes the node through verbatim.
Same applies to both new keys.

### FR13 — Grammar

**No change.** `@key:value` properties are generic — no `.pegjs` edit, no parser regeneration.

## Non-functional requirements

### NFR1 — Backward compatibility

- Purely additive for the ~all bit types that are not one of the five.
- JSON for the five defaulted bit types **changes**: they gain an `accessibilityGroupTag` array.
  This is the intended, agreed behaviour.
- Prettified bitmark for the five bit types **changes**: it gains
  `[@accessibilityGroupTag:image][@accessibilityTag:decorative]`.
- Round-trips stay stable in both directions: JSON → bitmark writes the tags, bitmark → JSON reads them
  back to the same structure; a bitmark source that omits them re-materialises to the same JSON.

### NFR2 — `print-page-break` base change

Changing `[BitType.printPageBreak].baseBitType` from `separator` to `article` is behaviour-neutral:

- `[BitType.separator]` declares only `since`, `baseBitType: article` and a `description` — no `tags`,
  no flags. The generated `assets/config/partials/group-separator.jsonc` is a bare passthrough whose
  only entry is a reference to `group-article`.
- No file under `src/` references `BitType.separator`. The two `isOfBitType` call sites that could matter
  (`JsonGenerator.ts:1690`, `:1918`) test for `article` / `articleResponsive` — still satisfied.
- Observable deltas, both cosmetic: `Config.isOfBitType(printPageBreak, separator)` becomes `false`
  (nothing calls it), and `bitConfig.inheritedBitTypes` (exposed via `InfoBuilder`) drops `separator`.
- Generated output: `assets/config/bits/print-page-break.jsonc` switches its group reference from
  `group-separator` to `group-article`. `group-separator` is still generated for `separator-alt`.
- `SUPPORTED_BITS.md` lists name + `since` only — unchanged.

**Verify during implementation** that `print-page-break.jsonc` and `separator.jsonc` differ only by that
group reference, and that no `accessibility*` key appears in `print-page-break`'s config or JSON output.

### NFR3 — Generated config (`assets/config/**`, gitignored)

Regenerate with `npm run start-generate-config`. Expected diff:
new `assets/config/groups/` + `partials/` entries for `group_accessibilityDecorative`; the two new tags in
every bit's standard-tags partial; the group reference in the five bits' files; the
`print-page-break.jsonc` base change; and the `@allowPrint` enum-format fix (FR6).

### NFR4 — Rust submodule (`bitmark-parser-rust`)

Out of scope for implementation. The rust parser resolves tags from the exported config, but the
**entity-merge `exportJsonKey`** and the **`enum` format + `values`** are the two places it may need to
learn something new. Confirm before shipping whether the submodule already handles the `groupTag`
entity-merge form (it must, since `@groupTag` ships today) and how it treats an unrecognised `format`.

### NFR5 — Documentation

Regenerate `SUPPORTED_BITS.md` (`npm run build-supported-info`).

### NFR6 — Test coverage

- Extend an existing general fixture (e.g. `test/standard/input/bitmark/bug.bitmark`, which already
  exercises `@groupTag`) with: a standalone `@accessibilityTag`; a single group + one tag; a group with
  several tags; two occurrences of the same group name (asserting the entity-merge fold); a group with
  no chained tag.
- The three affected fixtures — `separator.bitmark`, `image-separator.bitmark`, `image-mood.bitmark` —
  need no source edit; their expected JSON changes because of the materialised default. Add one bit to
  each that authors the tags explicitly, to pin that an explicit value overrides the default.
- Regenerate with `npm run regenerate-bitmark-test-json`, keeping **only** the touched files and
  restoring the `parser` version block from `HEAD` — a blanket regeneration rewrites ~400 unrelated
  files with version-stamp drift only.
- New `test/unit/accessibilityTag.test.ts`: bitmark → JSON structure for both keys; the five defaulted
  bit types emit the default when the tags are absent; an authored value overrides the default;
  `print-page-break` and an ordinary bit (e.g. `article`) emit **no** `accessibility*` key;
  JSON → bitmark emits both tags for defaulted bits; round-trip stability.
- Run `npm run tsup && npm run build-browser` before the web tests, which execute against `dist/`.
- `npm run check` and `npm test`.

### NFR7 — Versioning

Tag configs carry no `since` field (only `deprecated`), so the new tags need no version stamp. The five
bit types keep their existing `since` values. Ship in the next release after 5.37.0.

## Out of scope

- Enum **validation** at parse time. `values` is hydrated but consumed by nothing; FR6 only exports it.
  Rejecting out-of-vocabulary values would introduce new parse warnings on existing content.
- Any accessibility semantics beyond carrying the classification — no derivation from resources, alt
  text, or bit content.
- Defaults on any bit type other than the five listed.
- Changes to `bitmark-parser-rust` beyond consuming the regenerated config.
