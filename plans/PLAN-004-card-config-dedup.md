# Plan: Card Config Deduplication

## Context
- `ConfigBuilder` (src/info/ConfigBuilder.ts) currently inlines full card-set structures inside every bit export (both assets/config/bits and assets/config/bits_flat) by reading from CARDS in src/config/raw/cardSets.ts.
- Multiple bits can share the same card set, so the generated configs contain duplicated card metadata and tag definitions.
- There is no dedicated assets/config/cards directory yet; groups are already exported once into assets/config/partials and bits reference them indirectly, so cards should follow a similar pattern to avoid duplication.

## Functional Requirements
1. Emit a single JSONC file per card set under assets/config/cards/<card-key>.jsonc, preserving the existing card schema (key + sides[] + variants[] + variant tags/repeat/body flags).
2. Bit exports (bits and bits_flat) must replace the embedded card object with a simple `"card": "<card-key>"` string reference when a bit declares a card set; omit the field entirely when no card applies.
3. The config build pipeline must create/clean the new cards directory alongside bits and partials so each card key is exported exactly once per run.
4. Validation must cover the new structure: every referenced card key must have a corresponding file, and card files must themselves pass tag/group validation just like bit or group configs.
5. Regenerated assets should remain deterministic and backwards compatible apart from the intentional card field shape change; downstream consumers (docs, supported bits generator, etc.) need to handle the new reference-based schema.

## Non-Functional Requirements
- Reuse the existing tag serialization logic so card files stay in sync with bit/group tag formatting and key normalization rules.
- Keep output naming deterministic (likely kebab-case card keys) and avoid introducing new dependencies beyond Config + fs-extra already used by ConfigBuilder.
- Ensure the build + validation steps continue to run within current performance envelopes despite the extra directory traversal.
- Maintain architecture boundaries by keeping all export logic inside the info/config builder layer; runtime config consumers should remain untouched until they explicitly read the generated assets.

## Proposed Approach

- **Shared serialization helper**: Extract the variant/tag processing previously embedded inside the bit writers into a helper (e.g., `serializeCardSet(cardSetKey)`) so both the bit reference resolver and the new card writer rely on a single implementation.
- **Cards writer**: Add a `writeCardConfigs()` routine in ConfigBuilder that (a) ensures `assets/config/cards` exists and is cleaned, (b) iterates CARDS, (c) serializes each set to the same schema currently embedded in bits, and (d) writes `<card-key>.jsonc` using kebab-case keys.
- **Bit outputs**: Update both `build()` (hierarchical bits) and `buildFlat()` to stop embedding the serialized card object; instead, if `b.cardSet` is defined, set `card: normalizedCardKey` (string). This also means removing card-tag validation from the bit writer and delegating it to the dedicated card files.
- **Validation updates**: Extend `validateConfigTree()` to (1) collect available card filenames, (2) ensure every bit’s `card` reference matches one of those files, and (3) run the same `checkTags` routine against card variant tags (iterate all sides/variants) so group references inside cards are verified.
- **Downstream consumer audit**: Review any scripts/docs that read `assets/config/bits` (e.g., SUPPORTED_BITS generator, docs builders) and adjust them to expect `card` to be a string plus an external file if they need card metadata.
- **Regeneration & verification**: Run `npm run start-generate-config` (or equivalent) to populate the new directory, then spot-check representative bits (multiple-choice, flashcard, etc.) along with their corresponding files in assets/config/cards to confirm deduplication.

## Decisions
- Card filenames will be normalized to kebab-case, matching the treatment of other exported config artifacts.
- Card JSONC files retain the existing minimal schema (key + sides/variants/tags metadata) with no extra description/history boilerplate.
- No compatibility/migration shim is required because downstream consumers do not rely on the previously inlined card blocks.

## Validation & Testing
- Execute the config generation script and ensure no validation errors arise, particularly missing-card or missing-group references.
- Add/adjust unit coverage (if present) around `validateConfigTree` to cover successful card references and failure cases (unknown card key, card file missing group).
- Manually inspect a sample bit + its referenced card file to confirm the card content moved out of the bit configs and remains accurate.

## Progress
- [x] Helper extracted for shared card serialization
- [x] Cards directory writer implemented and invoked
- [x] Bit + bits_flat outputs switched to string card references
- [x] Validation updated for card references/files
- [x] Downstream consumers updated to new schema (if needed)
- [x] Config regeneration & manual verification complete
