# PLAN-020: Lightweight Paragraph / List / Heading Bits

Branch: `10387-parser-add-lightweight-paragraph-bits`

## Goal

Add lightweight body bits whose body is **bitmark+** (inline styling only — no
bitmark++ block elements), with a minimal tag set:

- `[.p]`, `[.p-alt]` — lightweight paragraph
- `[.list]`, `[.list-alt]` — lightweight list (see OPEN DECISION D1: `.list` already exists)
- `[.smart-standard-p]` — smart standard variant (pattern: `smart-standard-list`)
- `[.h]` — lightweight heading with chapter-style title levels 1–7

## Background / Current State

- `TextFormat` enum (`src/model/enum/TextFormat.ts`) has no `bitmark+` value;
  `bitmarkText: 'bitmark++'` means body = bitmark++, tag = bitmark+.
- The text grammar (`assets/grammar/text/text-grammar.pegjs`) already has a
  `bitmarkPlus` start rule (used for tag text): returns a single
  `{ type: 'paragraph', content: [inline...] }` TextAst block.
- `TextParser.toAst()` picks the start rule from `TextLocation` only
  (`tag` → `bitmarkPlus`, `body` → `bitmarkPlusPlus`).
- `.list`, `.standard-list`, `.smart-standard-list` already exist, all based on
  `article` (full bitmark++ body, instruction/lead/hint via `_standard`).
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
  `resourceAttachmentAllowed`, `textFormatDefault`.

## Decisions (resolved with user)

- New `TextFormat.bitmarkPlus = 'bitmark+'` enum value (not a config-only flag).
- Smart standard naming: `smart-standard-<bit>` only (no normative /
  non-normative split, no `-alt` smart variants — matches `smart-standard-list`).
- `.h` = title/level + item only: `bodyAllowed: false`, `footerAllowed: false`,
  no toc/progress/anchor (NOT chapter-based).
- `.list` redefinition is planned but **gated** (D1 below).

## Open Decisions

- **D1 (GATE — final user sign-off required before implementation)**:
  Redefine existing `.list` as lightweight (breaking change: loses bitmark++
  body blocks, instruction/lead/hint, attachments). Also decide whether
  `.standard-list` / `.smart-standard-list` are rebased onto the new `.list`
  or stay article-based.
- **D2**: Does `.h` also get a `smart-standard-h`? (Not in request; default: no.)
- **D3**: Title level > 7 on `.h`: emit parser warning; keep or clamp value
  (default: warn + clamp to 7; chapter behavior unchanged).
- **D4**: Header format override (e.g. `[.p:bitmark++]`): default = remains
  possible like all bits (the `bitmark+` restriction is the *default*, not a
  hard limit). Confirm.

## Functional Requirements

### FR1 — `bitmark+` text format

1. Add `bitmarkPlus: 'bitmark+'` to `TextFormat` (and to `BodyTextFormat` /
   breakscaping enums as needed).
2. `TextParser.toAst()`: format `bitmark+` at `TextLocation.body` → parse with
   the existing `bitmarkPlus` start rule (bitmark++ block syntax inside the
   body is plain text — "text is always text" principle).
3. JSON: bit emits `"format": "bitmark+"`; body remains TextAst (single
   paragraph block with inline content / hardBreaks).
4. JSON → bitmark: `JsonParser` accepts `format: 'bitmark+'`;
   `TextGenerator`/`BitmarkGenerator` regenerate the body as bitmark+ (inline
   marks only). Header omits `:bitmark+` when it equals `textFormatDefault`
   (existing `isWriteTextFormat` logic).
5. Breakscaping: body-location breakscape/unbreakscape for `bitmark+`
   (inline markers escaped; block markers need no escaping).
6. Bit header grammar: `[:format]` already parses any value — only enum
   validation needs the new value.

### FR2 — Minimal tag set (new config groups)

1. New group `group_standardItem`: `tag_item` only (`[%item]`, jsonKey `item`)
   — **no** lead/pageNumber/marginNumber chain.
2. New group (or abstract base bit `_standardLight`):
   `group_standardAllBits` + `group_standardItem` + `property_example`
   (same example entry as `group_standardTags`). Excluded vs `_standard`:
   instruction, hint, lead (+ chain).
3. All new bits: `resourceAttachmentAllowed: false`.

### FR3 — Bit definitions

| Bit | BitType key | Base | Body | Footer | Title | Item |
| --- | --- | --- | --- | --- | --- | --- |
| `.p` | `p` | `_standardLight` | bitmark+ | yes | no | yes |
| `.p-alt` | `pAlt` | `p` | ← | ← | ← | ← |
| `.smart-standard-p` | `smartStandardP` | `p` | ← | ← | ← | ← |
| `.list` (D1) | `list` (existing) | `_standardLight` | bitmark+ | yes | no | yes |
| `.list-alt` | `listAlt` | `list` | ← | ← | ← | ← |
| `.h` | `h` | `_standardLight` | none | no | levels 1–7 | yes |

- All: `textFormatDefault: TextFormat.bitmarkPlus`, `since:` next minor version.
- `.h`: `bodyAllowed: false`, `footerAllowed: false`,
  `tag_title` configured like chapter (`jsonKey: 'title|setMulti(level)'`,
  `exportJsonKey: { title: '$', level: '$level' }`).

### FR4 — `.h` title/level processing

1. Extend the chapter special-case in
   `TitleTagContentProcessor.buildTitles()` (and any other
   `isOfBitType(…, BitType.chapter)` title/level sites, incl. JSON → bitmark
   generation of `[#`×level`]`) to cover `.h`.
2. Levels 1–7 valid; > 7 per D3.
3. JSON: `title` (TextAst/string per existing chapter shape) + `level: number`.

## Non-Functional Requirements

- No regression for existing bits: full test suite passes; `chapter`,
  `article`, existing `standard-list` (pending D1) outputs unchanged.
- Grammar changes only if the header/text grammars actually need them
  (expected: text grammar unchanged — `bitmarkPlus` rule exists; bit grammar
  unchanged). If any `.pegjs` changes: regenerate parsers
  (`npm run build-grammar-*`) — staleness test enforces this.
- Browser bundle: stay < 60kB minified; rebuild `dist` for web tests
  (`npm run tsup && npm run build-browser`).
- Regenerate `SUPPORTED_BITS.md` (`npm run build-supported-info`).

## Implementation Outline

1. Enums: `BitType` (`p`, `pAlt`, `smartStandardP`, `listAlt`, `h`),
   `TextFormat.bitmarkPlus` (+ `BodyTextFormat`).
2. `TextParser` start-rule selection; breakscaping bitmark+ body mode.
3. Config: new groups (`group_standardItem`, light base), bit entries in
   `src/config/raw/bits.ts`; D1 `.list` rebase behind final decision.
4. Parser: title/level processing for `.h`; level validation (D3).
5. Generators: JSON `format` emission; bitmark+ body generation; `.h`
   title regeneration.
6. `JsonParser`/`Builder`: accept new bits/format round-trip.

## Testing

- `test/standard/input/bitmark/`: new inputs `p.bitmark`, `p-alt.bitmark`,
  `smart-standard-p.bitmark`, `list-alt.bitmark`, `h.bitmark` (+ `list.bitmark`
  update pending D1); expected JSON via `npm run regenerate-bitmark-test-json`
  after manual verification.
- Cases: plain body; inline styling (bold/italic/inline image/latex); body
  containing bitmark++ block syntax (`|code`, bullet lists, `|image:`) →
  must stay plain text; item tag; footer (`.p`/`.list` only); rejected tags
  (instruction/hint/lead → warning); `.h` levels 1, 7, and 8 (D3);
  `.h` with body → warning/error; resource attachment rejected.
- Round-trip: bitmark → JSON → bitmark stable for all new bits.
- Web parser/generator tests against rebuilt `dist`.
