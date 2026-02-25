# PLAN-006: Multi-Card-Type Config (Sections → Cards Array)

## Problem

The `sections` property on `_CardSetConfig` maps qualified card dividers (e.g. `==== table-header ====`) to different JSON paths, but forces **all** section types to share one `sides` definition. If a future card type needs different variants/tags per section (e.g. header cells with extra tags, footer cells with fewer tags), the current design cannot represent it.

## Goal

Replace `sections` + shared `sides` with a `cards[]` array where **each entry** has its own `name`, `jsonKey`, `isDefault`, and independent `sides` definition. Apply this structure uniformly to all card configs for consistency.

## Scope

- Update `CARD_SCHEMA.md` — new schema structure
- Update `CARD_MAPPING.md` — table-extended section references new structure
- Update raw types (`_Config.ts`) and raw data (`cardSets.ts`)
- Update hydrated types (`CardSetConfig`, `CardSideConfig`)
- Update `ConfigHydrator`
- Update `ConfigBuilder.serializeCardSet()`
- Regenerate `assets/config/cards/*.jsonc`
- **NOT** in scope: refactoring parsers/generators to consume the new structure

## Design

### Current structure (table-extended)

```
{
  "key": "table-extended",
  "jsonKey": null,
  "sections": { "default": {...}, "table-header": {...}, "table-footer": {...} },
  "sides": [...]
}
```

### Current structure (flashcard — no sections)

```
{
  "key": "flashcard",
  "jsonKey": "cards",
  "sides": [...]
}
```

### New structure (all card configs)

```
{
  "key": "<card-config-name>",
  "cards": [
    {
      "name": "default" | "<qualifier>",
      "isDefault": true | undefined,
      "jsonKey": "...",
      "itemType": "object" | "array" | undefined,
      "sides": [...]
    },
    ...
  ]
}
```

- Non-section configs (flashcard, match-pairs, etc.): single entry in `cards[]` with `"isDefault": true`.
- Section configs (table-extended): multiple entries, one per section.
- `isDefault: true` marks the card type used when no qualifier on `====`.

### Example: flashcard (single card type)

```json
{
  "key": "flashcard",
  "cards": [
    {
      "name": "default",
      "isDefault": true,
      "jsonKey": "cards",
      "sides": [ { "name": "question", ... }, { "name": "answer", ... } ]
    }
  ]
}
```

### Example: table-extended (multiple card types)

```json
{
  "key": "table-extended",
  "cards": [
    {
      "name": "default",
      "isDefault": true,
      "jsonKey": "tableExtended.body.rows",
      "sides": [ { "name": "cell", "repeat": true, "variants": [...] } ]
    },
    {
      "name": "table-header",
      "jsonKey": "tableExtended.header.rows",
      "sides": [ { "name": "cell", "repeat": true, "variants": [...] } ]
    },
    {
      "name": "table-footer",
      "jsonKey": "tableExtended.footer.rows",
      "sides": [ { "name": "cell", "repeat": true, "variants": [...] } ]
    }
  ]
}
```

## Functional Requirements

### 1. Raw types (`_Config.ts`)

Replace `jsonKey`, `itemType`, `sections`, `sides` on `_CardSetConfig` with `cards`:

```typescript
export interface _CardSetConfig {
  cards: _CardTypeConfig[];
}

export interface _CardTypeConfig {
  name: string;                     // e.g. 'default', 'table-header'
  isDefault?: boolean;              // true for the unqualified ==== divider
  jsonKey: string | null;
  itemType?: 'object' | 'array';
  sides: _CardSideConfig[];
}
```

`_CardSideConfig` and `_CardVariantConfig` stay unchanged.

### 2. Raw data (`cardSets.ts`)

All 19 entries restructured: wrap existing `jsonKey`/`sides`/`itemType` into a `cards: [{ name: 'default', isDefault: true, ... }]`.

For `table-extended`: expand `sections` into 3 entries in `cards[]`, each duplicating the current `sides` definition.

### 3. Hydrated types

```typescript
// CardSetConfig.ts
class CardSetConfig {
  readonly configKey: CardSetConfigKeyType;
  readonly cards: CardTypeConfig[];

  // Legacy — returns sides of the default card type
  get sides(): CardSideConfig[] { ... }
  get jsonKey(): string | null { ... }
  get itemType(): 'object' | 'array' { ... }
  get variants(): CardVariantConfig[][] { ... }
}
```

New `CardTypeConfig` class:

```typescript
class CardTypeConfig {
  readonly name: string;
  readonly isDefault: boolean;
  readonly jsonKey: string | null;
  readonly itemType: 'object' | 'array';
  readonly sides: CardSideConfig[];
}
```

Legacy getters on `CardSetConfig` delegate to the default card type to keep downstream consumers working.

### 4. ConfigHydrator

`hydrateCardSetConfig()` iterates `_cardSetConfig.cards[]` and hydrates each `_CardTypeConfig` into a `CardTypeConfig`.

### 5. ConfigBuilder

`serializeCardSet()` outputs `cards[]` array instead of top-level `jsonKey`/`sections`/`sides`.

### 6. Spec docs

- **CARD_SCHEMA.md**: Update `CardConfig` node definition: remove `jsonKey`/`itemType`/`sections` from card level; add `cards` array. Add `CardTypeNode` definition. Update all 19 config YAML examples.
- **CARD_MAPPING.md**: Update table-extended section to reference multi-card-type structure.

## Non-Functional Requirements

- Legacy accessors on `CardSetConfig` ensure no runtime behavior change for existing parser/generator code.
- All existing tests pass without modification.
- No `any` in public interfaces.
- Generated JSONC output matches the new structure.

## Implementation Steps

| # | Task | Files |
|---|------|-------|
| 1 | Add `_CardTypeConfig` interface to raw types | `_Config.ts` |
| 2 | Restructure `_CardSetConfig` to use `cards: _CardTypeConfig[]` | `_Config.ts` |
| 3 | Create `CardTypeConfig` hydrated class | `src/model/config/CardTypeConfig.ts` (new) |
| 4 | Update `CardSetConfig` to hold `CardTypeConfig[]` + legacy getters | `CardSetConfig.ts` |
| 5 | Update `ConfigHydrator.hydrateCardSetConfig()` | `ConfigHydrator.ts` |
| 6 | Update all 19 entries in `cardSets.ts` to new structure | `cardSets.ts` |
| 7 | Update `ConfigBuilder.serializeCardSet()` | `ConfigBuilder.ts` |
| 8 | Regenerate configs and verify output | `assets/config/cards/*.jsonc` |
| 9 | Update `CARD_SCHEMA.md` | `specs/CARD_SCHEMA.md` |
| 10 | Update `CARD_MAPPING.md` (table-extended section) | `specs/CARD_MAPPING.md` |
| 11 | Run full test suite | — |

## Validation

- `npm run start-generate-config` — all 19 `.jsonc` files have `cards[]` structure.
- `npm test` — all tests pass (legacy accessors preserve behavior).
- Manual: cross-reference generated output with CARD_SCHEMA.md configurations.

## Future Work (out of scope)

- Refactor parsers/generators to consume `cards[]` instead of using legacy accessors.
- Per-section distinct `sides` definitions for table-extended (currently duplicated).
