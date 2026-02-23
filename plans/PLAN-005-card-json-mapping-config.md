# Plan: Card JSON Mapping Config

## Context

The card-to-JSON mapping — which side/variant maps to which JSON key — is currently:

1. **Documented** in `CARD_SCHEMA.md` (the `jsonKey`, `secondaryJsonKey`, `resources`, `repeat`, `itemType`, `sections` properties).
2. **Hard-coded** across multiple files:
   - `src/parser/bitmark/peg/contentProcessors/CardContentProcessor.ts` — ~1400 lines of per-card-type functions (`parseFlashcardOrDefinitionList`, `parseMatchPairs`, `parseMatchMatrix`, `parseTable`, etc.) that interpret sides/variants positionally and build JSON objects with hard-coded key names (`question.text`, `answer.text`, `key`, `values[]`, etc.).
   - `src/ast/Builder.ts` — `buildCardNode()` dispatches to type-specific builders (`buildFlashcards`, `buildPairs`, `buildMatricies`, etc.), each hard-coding JSON shape.
   - `src/generator/json/JsonGenerator.ts` — AST-to-JSON walkers with `keyOverride: 'cards'` and similar hard-coded overrides per card type.
   - `src/generator/bitmark/BitmarkGenerator.ts` — JSON-to-bitmark walkers referencing specific AST node types (`flashcardsValue`, `alternativeAnswersValue`, etc.) per card type.
   - `src/parser/json/JsonParser.ts` — `buildBit()` maps JSON keys like `bit.cards` → `flashcards`, `bit.listItems` → `cardBits`, etc. by hard-coded conditionals.

The existing `src/config/raw/cardSets.ts` (`_CardSetsConfig`) describes **parser input constraints** (allowed tags, cardinality, body flags) per side/variant. Its structure already mirrors the `card > side > variant` tree from `CARD_SCHEMA.md`, but has **no information** about JSON output mapping.

## Goal

Extend the existing card set config types and data in `cardSets.ts` with the JSON mapping properties from `CARD_SCHEMA.md`. `ConfigBuilder` will include the mapping data in the generated `assets/config/cards/*.jsonc` files. Ultimately, the hard-coded per-card-type functions can be replaced by a single generic, config-driven card processor.

## Scope

This plan covers **only** extending the existing config types/data and `ConfigBuilder` output. It does **not** cover refactoring the hard-coded processors to consume the config (that is a separate, larger effort).

## Approach

Extend the existing types rather than creating a parallel config file. The current `_CardSetConfig` / `_CardVariantConfig` structure already maps 1:1 to the CARD_SCHEMA hierarchy. The one structural change is introducing a `_CardSideConfig` wrapper — currently sides are bare `_CardVariantConfig[]` arrays with no place for side-level properties (`name`, `repeat`).

### Type Changes Summary

| Level | Current type | Properties to add |
|---|---|---|
| Card set | `_CardSetConfig` | `jsonKey`, `itemType?`, `sections?`, `standardTags?`, `tags?` |
| Side | **new** `_CardSideConfig` | `name`, `repeat?`, wraps existing `variants` + `tags` |
| Variant | `_CardVariantConfig` | `jsonKey?`, `resources?` |
| Tag | `_AbstractTagConfig` | `secondaryJsonKey?` |

### Consumers to Update

The `_CardSetConfig.variants` type change (`_CardVariantConfig[][]` → `_CardSideConfig[]`) affects:

1. `src/config/ConfigHydrator.ts` — `hydrateCardSetConfig()` iterates `_cardSetConfig.variants`
2. `src/config/Config.ts` — `getCardSetVariantConfig()` indexes into `variants[sideIdx][variantNo]`
3. `src/info/ConfigBuilder.ts` — `serializeCardSet()` iterates `cardSetConfig.variants`
4. `src/parser/bitmark/peg/BitmarkPegParserValidator.ts` — reads variant config by side/variant index
5. `src/parser/bitmark/peg/contentProcessors/CardContentProcessor.ts` — calls `Config.getTagsConfigForCardSet()`
6. `src/ast/BaseBuilder.ts` — calls `Config.getTagsConfigForCardSet()`

Consumers 4–6 access variants via `Config.getCardSetVariantConfig()`, so only the Config/ConfigHydrator layer and ConfigBuilder need direct changes. The rest are unaffected as long as the hydrated `CardSetConfig` / `CardVariantConfig` classes maintain their current API.

## Functional Requirements

1. **New type** `_CardSideConfig` in `src/model/config/_Config.ts` wrapping variants with side-level properties.
2. **Extended types**:
   - `_CardSetConfig` — add `jsonKey`, `itemType?`, `sections?`, `standardTags?`, `tags?`
   - `_CardSetConfig.variants` changes from `_CardVariantConfig[][]` to `_CardSideConfig[]`
   - `_CardVariantConfig` — add `jsonKey?`, `resources?`
   - `_AbstractTagConfig` — add `secondaryJsonKey?`
3. **Updated data** in `src/config/raw/cardSets.ts` — add JSON mapping values to all 19 card set entries matching `CARD_SCHEMA.md`.
4. **Hydrated types** updated in parallel:
   - New `CardSideConfig` class in `src/model/config/`
   - `CardSetConfig` updated to hold `CardSideConfig[]` instead of `CardVariantConfig[][]`
   - `CardVariantConfig` extended with `jsonKey?`, `resources?`
5. **ConfigHydrator** updated to hydrate the new structure.
6. **Config accessor** `getCardSetVariantConfig()` updated to navigate `_CardSideConfig[]` → variants.
7. **ConfigBuilder** `serializeCardSet()` includes mapping data in generated `assets/config/cards/*.jsonc`.
8. **All 19 card set types** covered: `flashcard`, `definition-list`, `match-pairs`, `match-audio-pairs`, `match-image-pairs`, `match-matrix`, `statements`, `quiz`, `feedback`, `questions`, `elements`, `table`, `table-extended`, `pronunciation-table`, `bot-action-responses`, `cloze-list`, `example-bit-list`, `ingredients`, `book-reference-list`.

## Non-Functional Requirements

- No `any` in public interfaces.
- Config data must exactly match `CARD_SCHEMA.md` definitions.
- No runtime behavior changes — processors remain unchanged.
- Config stays declarative; no logic or computed values.
- Follow existing naming conventions.

## Type Definitions

### Raw types (`_Config.ts`)

```typescript
export interface _CardSetConfig {
  jsonKey: string | null;           // e.g. 'cards', 'pairs', null
  itemType?: 'object' | 'array';   // default: 'object'
  standardTags?: boolean;
  sections?: Record<string, { jsonKey: string }>;  // qualified card dividers
  tags?: _CardTagJsonMapping[];     // card-level tag-to-JSON mappings
  sides: _CardSideConfig[];        // was: variants: _CardVariantConfig[][]
}

export interface _CardSideConfig {
  name: string;                     // e.g. 'question', 'key', 'cell'
  repeat?: boolean;                 // side repeats for remaining -- dividers
  tags?: _CardTagJsonMapping[];     // side-level tag-to-JSON mappings
  variants: _CardVariantConfig[];
}

export interface _CardVariantConfig {
  // Existing fields (unchanged)
  tags: _AbstractTagConfig[];
  deprecated?: string;
  bodyAllowed?: boolean;
  bodyRequired?: boolean;
  repeatCount?: CountType;
  // New JSON mapping fields
  jsonKey?: string | null;          // JSON path for body text
  resources?: Record<string, string>;  // e.g. { icon: 'question.icon' }
}

export interface _CardTagJsonMapping {
  tag: string;                      // e.g. '[#]', '[@isCaseSensitive]'
  jsonKey: string;
  secondaryJsonKey?: string;        // heading card behavior
  type?: string;                    // e.g. 'boolean', 'number', 'bitmark--'
  value?: unknown;                  // literal value (e.g. true, false)
}

// Existing — add one field:
export interface _AbstractTagConfig {
  // ... existing fields ...
  secondaryJsonKey?: string;        // NEW: heading card alternate path
}
```

### Hydrated types

```typescript
// CardSideConfig.ts (new)
class CardSideConfig {
  readonly name: string;
  readonly repeat: boolean;
  readonly variants: CardVariantConfig[];
}

// CardSetConfig.ts (updated)
class CardSetConfig {
  readonly configKey: CardSetConfigKeyType;
  readonly jsonKey: string | null;
  readonly itemType: 'object' | 'array';
  readonly sides: CardSideConfig[];       // was: variants: CardVariantConfig[][]
  // ...
}

// CardVariantConfig.ts (extended)
class CardVariantConfig {
  // ... existing fields ...
  readonly jsonKey?: string | null;
  readonly resources?: Record<string, string>;
}
```

## Data Structure (example entry in `cardSets.ts`)

```typescript
[CardSetConfigKey.flashcard]: {
  jsonKey: 'cards',
  standardTags: true,
  sides: [
    {
      name: 'question',
      variants: [
        {
          jsonKey: 'question.text',
          resources: { icon: 'question.icon' },
          tags: [
            { key: ConfigKey.group_standardItemLeadInstructionHint, description: '...' },
            { key: ConfigKey.property_example, description: '...', format: TagFormat.plainText },
            { key: ConfigKey.tag_title, description: '...' },
            { key: ConfigKey.group_resourceIcon, description: '...' },
          ],
          repeatCount: Count.infinity,
        },
      ],
    },
    {
      name: 'answer',
      variants: [
        {
          jsonKey: 'answer.text',
          resources: { icon: 'answer.icon' },
          tags: [/* same tags */],
          repeatCount: Count.infinity,
        },
        {
          jsonKey: 'alternativeAnswers[].text',
          tags: [],
          repeatCount: Count.infinity,
        },
      ],
    },
  ],
},
```

## Generated Output (example)

```jsonc
// assets/config/cards/flashcard.jsonc
{
  "key": "flashcard",
  "jsonKey": "cards",
  "sides": [
    {
      "name": "question",
      "variants": [
        {
          "jsonKey": "question.text",
          "resources": { "icon": "question.icon" },
          "tags": [ /* existing tag definitions */ ],
          "repeatCount": "infinity",
          "bodyAllowed": true,
          "bodyRequired": false
        }
      ]
    },
    {
      "name": "answer",
      "variants": [
        {
          "jsonKey": "answer.text",
          "resources": { "icon": "answer.icon" },
          "tags": [ /* ... */ ],
          "repeatCount": "infinity",
          "bodyAllowed": true,
          "bodyRequired": false
        },
        {
          "jsonKey": "alternativeAnswers[].text",
          "tags": [],
          "bodyAllowed": true,
          "bodyRequired": false
        }
      ]
    }
  ]
}
```

## Implementation Steps

1. Add `_CardSideConfig` and `_CardTagJsonMapping` interfaces to `src/model/config/_Config.ts`. Extend `_CardSetConfig`, `_CardVariantConfig`, and `_AbstractTagConfig` with new fields.
2. Create `CardSideConfig` class in `src/model/config/CardSideConfig.ts`.
3. Update `CardSetConfig` and `CardVariantConfig` classes with new properties.
4. Update `ConfigHydrator.hydrateCardSetConfig()` to hydrate the new side wrapper and mapping fields.
5. Update `Config.getCardSetVariantConfig()` to navigate `sides[].variants[]` instead of `variants[][]`.
6. Update `src/config/raw/cardSets.ts` — restructure all 19 entries from `variants: [[...]]` to `sides: [{ name, variants: [...] }]` and add all JSON mapping values from `CARD_SCHEMA.md`.
7. Update `ConfigBuilder.serializeCardSet()` to include mapping data in card output.
8. Regenerate configs (`npm run start-generate-config`) and verify output.
9. Update `ConfigBuilder.validateConfigTree()` to validate mapping properties.

## Future Work (out of scope)

- Replace `CardContentProcessor.ts` per-card-type functions with a generic config-driven processor.
- Replace `Builder.buildCardNode()` type-specific dispatch with config-driven builder.
- Replace `JsonGenerator` / `BitmarkGenerator` hard-coded card walkers with config-driven generation.

## Validation & Testing

- Regenerate all configs and diff against current output to confirm only the new mapping fields are added.
- Verify all 19 `assets/config/cards/*.jsonc` files include correct `jsonKey`, side `name`, variant `jsonKey` etc.
- Cross-reference generated output against `CARD_SCHEMA.md` to confirm completeness.
- Existing test suite must continue to pass (no runtime behavior change).
