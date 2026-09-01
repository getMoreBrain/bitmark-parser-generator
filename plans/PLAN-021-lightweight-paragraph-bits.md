# PLAN-021: Lightweight Paragraph / List / Heading Bits

Branch: `10387-parser-add-lightweight-paragraph-bits`
(renumbered from PLAN-020 — that number is taken by `PLAN-020-bit-groups-and-bit-names.md` on main)

## Goal

Add lightweight body bits with a **minimal tag set** (no instruction/hint/lead, no
resource attachments):

- `[.p]`, `[.p-alt]` — lightweight paragraph
- `[.list]`, `[.list-alt]` — lightweight list (whole list family redefined, see decisions)
- `[.smart-standard-p]` — smart standard variant (pattern: `smart-standard-list`)
- `[.h]` — lightweight heading with chapter-style title levels 1–7

Bodies are ordinary **bitmark++** like every other bit — no new text format
(decision, 2026-09-01). "Lightweight" refers to the tag set only.

## Background / Current State

- The list family already exists: `list`, `list-item`, and `standard-list` are
  based on `article`; `standard-list-item` and the `smart-standard-list(-item)`
  variants chain off them (instruction/lead/hint via `_standard`).
- Item/lead/pageNumber/marginNumber is a single chained tag group
  (`group_standardItemLead` in `src/config/raw/groups.ts`); instruction/hint are
  added by `group_standardItemLeadInstructionHint`; `_standard` pulls all of
  them via `group_standardTags`.
- Chapter title (`[#`…`]`): grammar counts `#`s (`"#"+`, unbounded);
  `TitleTagContentProcessor.buildTitles()` special-cases
  `Config.isOfBitType(bitType, BitType.chapter)` to emit `title` + `level`
  (`jsonKey: 'title|setMulti(level)'`). No level clamp exists today, so
  "7 levels" is structurally supported but unvalidated.
- `_BitConfig` already supports `footerAllowed`, `bodyAllowed`,
  `resourceAttachmentAllowed`.
- PLAN-020 (main): every new bit must declare `bitGroups` (FR11 validation
  fails the build otherwise) and may carry an English `title`.

## Decisions (resolved with user)

- **Bodies are bitmark++** (2026-09-01): no new `TextFormat` value, no
  `TextParser`/breakscaping/grammar changes. Drops the original plan's
  text-format requirement (old FR1) entirely.
- **The whole list family is redefined** (2026-09-01): the existing list bits
  are unused in production, so the ENTIRE family is rebased onto the
  lightweight base (loses instruction/lead/hint and resource attachments):
  `list`, `list-item`, `standard-list`, `standard-list-item`,
  `smart-standard-list`, `smart-standard-list-item` (the deprecated
  `*-collapsible` leaves follow automatically via `baseBitType`).
- Smart standard naming: `smart-standard-<bit>` only (no normative /
  non-normative split, no `-alt` smart variants — matches `smart-standard-list`).
- `.h` = title/level + item only: `bodyAllowed: false`, `footerAllowed: false`,
  no toc/progress/anchor (NOT chapter-based).
- **`.h` has no variants** (2026-09-01): there is no `h-alt` and no
  `smart-standard-h` (resolves former D2).

## Open Decisions

- **D3**: Title level > 7 on `.h`: emit parser warning; keep or clamp value
  (default: warn + clamp to 7; chapter behavior unchanged).

## Functional Requirements

### FR1 — Minimal tag set (new config groups)

1. New group `group_standardItem`: `tag_item` only (`[%item]`, jsonKey `item`)
   — **no** lead/pageNumber/marginNumber chain.
2. New abstract base bit `_standardLight` (or group): `group_standardAllBits` +
   `group_standardItem` + `property_example` (same example entry as
   `group_standardTags`). Excluded vs `_standard`: instruction, hint, lead
   (+ chain).
3. `_standardLight` sets `resourceAttachmentAllowed: false` — inherited by all
   new bits AND the rebased list family.

### FR2 — Bit definitions

| Bit | BitType key | Base | Footer | Title | Item |
| --- | --- | --- | --- | --- | --- |
| `.p` | `p` | `_standardLight` | yes | no | yes |
| `.p-alt` | `pAlt` | `p` | ← | ← | ← |
| `.smart-standard-p` | `smartStandardP` | `p` | ← | ← | ← |
| `.list` | `list` (existing, rebased) | `_standardLight` | yes | no | yes |
| `.list-alt` | `listAlt` | `list` | ← | ← | ← |
| `.h` | `h` | `_standardLight` | no | levels 1–7 | yes |

List-family rebase (existing bits; `standard-list` is re-rooted onto `list`,
the other chain links are unchanged):

| Bit (existing) | Base today | Base after |
| --- | --- | --- |
| `list` | `article` | `_standardLight` |
| `list-item` | `article` | `_standardLight` |
| `standard-list` | `article` | `list` |
| `standard-list-item` | `list-item` | ← (unchanged) |
| `smart-standard-list` | `standard-list` | ← (unchanged) |
| `smart-standard-list-item` | `standard-list-item` | ← (unchanged) |

The deprecated `smart-standard-list(-item)-collapsible` bits keep their base
and inherit the lightweight tag set (and derive `bitGroups`) automatically.

- All new bits: default body format (bitmark++), `since:` next minor version
  (rebased existing bits keep their `since`).
- `.h`: `bodyAllowed: false`, `footerAllowed: false`,
  `tag_title` configured like chapter (`jsonKey: 'title|setMulti(level)'`,
  `exportJsonKey: { title: '$', level: '$level' }`).
- PLAN-020 compliance: all new bits declare `bitGroups: [BitGroup.static]` and
  an English `title` (e.g. 'Paragraph', 'Heading'); the rebased existing bits
  already carry `bitGroups` + `title` (unchanged).

### FR3 — `.h` title/level processing

1. Extend the chapter special-case in
   `TitleTagContentProcessor.buildTitles()` (and any other
   `isOfBitType(…, BitType.chapter)` title/level sites, incl. JSON → bitmark
   generation of `[#`×level`]`) to cover `.h`.
2. Levels 1–7 valid; > 7 per D3.
3. JSON: `title` (TextAst/string per existing chapter shape) + `level: number`.

## Non-Functional Requirements

- No regression for bits outside the list family: full test suite passes;
  `chapter` and `article` outputs unchanged. List-family fixtures are expected
  to change (lightweight tag set) and are regenerated + manually verified.
- No grammar changes expected (header and text grammars untouched). If any
  `.pegjs` changes: regenerate parsers (`npm run build-grammar-*`) —
  staleness test enforces this.
- Rebuild `dist` for web tests (`npm run tsup && npm run build-browser`).
- Regenerate `SUPPORTED_BITS.md` (`npm run build-supported-info`).

## Implementation Outline

1. Merge `main` into this branch first (brings PLAN-020 bit-groups validation)
   — DONE (`fae9b4b5`).
2. Enums: `BitType` additions (`p`, `pAlt`, `smartStandardP`, `listAlt`, `h`).
3. Config: `group_standardItem`, `_standardLight` base, bit entries in
   `src/config/raw/bits.ts` (incl. the list-family rebase, `bitGroups`,
   `title`).
4. Parser: title/level processing for `.h`; level validation (D3).
5. Generators: `.h` title regeneration (`[#`×level`]`).
6. `JsonParser`/`Builder`: accept new bits round-trip.

## Testing

- `test/standard/input/bitmark/`: new inputs `p.bitmark`, `p-alt.bitmark`,
  `smart-standard-p.bitmark`, `list-alt.bitmark`, `h.bitmark`; existing
  list-family fixtures (`list`, `list-item`, `standard-list*`,
  `smart-standard-list*`) updated for the lightweight tag set; expected JSON
  via `npm run regenerate-bitmark-test-json` after manual verification.
- Cases: plain body; inline styling; bitmark++ blocks in body (allowed —
  ordinary body behavior); item tag; footer (all bits except `.h`); rejected tags
  (instruction/hint/lead → warning); `.h` levels 1, 7, and 8 (D3);
  `.h` with body → warning/error; resource attachment rejected.
- Round-trip: bitmark → JSON → bitmark stable for all new bits.
- PLAN-020 FR11 config validation passes (bitGroups declared on all new bits).
- Web parser/generator tests against rebuilt `dist`.
