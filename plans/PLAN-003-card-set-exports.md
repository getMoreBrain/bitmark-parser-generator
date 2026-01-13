# Plan: Card Sets in Bit Exports

## Context
- Bit exports from ConfigBuilder currently emit bit-level tags and group references only; cardSet data in bit configs is ignored in exported JSON (see src/info/ConfigBuilder.ts).
- Card set definitions live in config/raw/cardSets.ts and are attached to bits via cardSet keys in config/raw/bits.ts; runtime uses Config.getCardSetVariantConfig for side/variant lookups, but exports do not surface these rules.
- Card set variants contain tags (and groups) that may not appear in bit-level tags, so consumers cannot currently discover per-card tag rules from the exports.

## Functional Requirements
- Add card set information to each bit export when a bit has a card set (exported under a single `card`).
- Export schema is always card -> sides[] -> variants[]; a bit can have at most one card (so cards is a single entry or absent).
- Each exported variant should include its tags (using the same tag/group/resource expansion and jsonKey handling as bit tags), repeatCount, and bodyAllowed/bodyRequired flags.
- Group references appearing inside card set tags must resolve to exported group files (respecting squashed group mapping used elsewhere).
- Preserve existing bit export structure for bits without card sets.

## Non-Functional Requirements
- Do not break existing validation of bit/group exports; extend validation to cover card-set references.
- Keep output locations and filenames backward compatible unless a new folder is explicitly required.

## Proposed Approach
- Reuse ConfigBuilder’s tag processing and group-resolution helpers to serialize card set variant tags, ensuring consistency with bit tag exports.
- Formalize schema as `card` (single) -> `sides[]` -> `variants[]`; model repeatCount as metadata on variants (not as multiple card objects).
- Embed the card set block into bit exports (and, if applicable, bits_flat) alongside existing fields; omit or null when not applicable.
- Extend the config-tree validation to traverse card-set tags for missing group references.
- Regenerate exports via the existing generateConfig path and verify outputs.

## Open Questions
- Exact field names for the schema (e.g., `cardSet.key`, `card`, `sides`, `variants`, `tags`)?
- Should bits_flat exports include the same card set structure, or is hierarchy-only sufficient?
- Any consumers expecting a specific placement (inside each bit file vs a separate card-set folder)?

## Validation & Testing
- Regenerate config exports (npm run start-generate-config) and ensure validation passes with new card-set references.
- Spot-check bits that declare cardSet (e.g., flashcard) to confirm card->side->variant nesting and tag resolution.

## Progress
- [x] Schema: single `card` -> `sides[]` -> `variants[]`, repeatCount on variants
- [x] Export card data in `bits` configs with tag/group handling
- [x] Export card data in `bits_flat` configs
- [x] Extend validation to cover card tags/groups
- [x] Regenerate configs and verify outputs
- [x] Spot-check exports (multiple-choice, book-reference-list, flashcard) and inventory carded bits (25 files)
