# PLAN-023: Lightweight Bit Item Chain (pageNumber / marginNumber)

Branch: `10626-parser-lightweight-bits-item-chain-change`

## Goal

Give the lightweight bits (`_standardLight`) the **whole** item chain
`[%item][%lead][%pageNumber][%marginNumber]` so they can be referenced and
cited by page and margin number.

On lightweight bits `item` and `lead` are **positional placeholders** — they
hold the chain position but carry no value. `.h` is the single exception: it
keeps a valued `item`.

## Background / Current State

- There is only one markup tag, `[%…]` (`Tag.tag_item = '%'`). Role is decided
  purely by **position in the chain**: 1st = item, 2nd = lead, 3rd = pageNumber,
  4th (or last) = marginNumber. Demux at
  `BitmarkPegParserProcessor.ts:707-722`.
- `group_standardItemLead` (`groups.ts:524`) declares the 4-link chain, all
  links keyed `ConfigKey.tag_item`, distinguished by `jsonKey`/`exportJsonKey`.
  It reaches normal bits via `group_standardItemLeadInstructionHint` →
  `group_standardTags` → `_standard`.
- PLAN-021 gave lightweight bits `group_standardItem` (`groups.ts:508`) —
  a single **un-chained** `tag_item`. `_standardLight` (`bits.ts:35`) is the
  only consumer.
- Affected bits — the 13 that resolve to `_standardLight`, enumerated from the
  live config: `h`, `p`, `p-alt`, `smart-standard-p`, `list`, `list-alt`,
  `list-item`, `standard-list`, `standard-list-item`, `smart-standard-list`,
  `smart-standard-list-item`, `smart-standard-list-collapsible`,
  `smart-standard-list-item-collapsible`.

### Verified current behaviour (no change needed)

| Input | Result |
| ----- | ------ |
| `[.article]` + `[%][%][%12][%m3]` | pageNumber=12, marginNumber=m3, no warning |
| round-trip of the above | `[%][%][% 12 ][% m3 ]` |
| `[.article]` + `[%]` or `[%][%]` | all four empty, round-trips to nothing |
| `[.p]` + `[%][%][%12][%m3]` | **broken**: item=`m3`, 3× "included more than the required 1 time(s)" |

So the "either no `[%]`, or a chain of at least three" rule is **already** what
`BitmarkGenerator.enter_pageNumber` / `enter_marginNumber`
(`BitmarkGenerator.ts:1017-1063`) emit — each writes the whole prefix chain
from the deepest non-empty link, using `''` for empty earlier links. The JSON
side is likewise already correct: `cleanBitJson` (`JsonGenerator.ts:1683-1691`)
emits `item`/`lead`/`pageNumber`/`marginNumber` as `[]` (or `''` in plain-text
mode) for every bit except `_error`/`_comment`/`page`.

**The only broken piece is the lightweight config**, and only in the
bitmark-parse direction. The JSON shape needs no change either: `cleanBitJson`
never consults the bit's tag config, so lightweight bits already emit all four
keys (`h.json` today has `"lead": [], "pageNumber": [], "marginNumber": []`).

### The break is one-directional

JSON → bitmark already emits the chain correctly for lightweight bits. Only
re-parsing it fails, so a value survives one hop and dies on the next:

```
JSON {type:'p', pageNumber:'12', marginNumber:'m3'}
  → bitmark  "[.p]\n[%][%][% 12 ][% m3 ]"      ← correct
  → JSON     pageNumber:'', marginNumber:''     ← both lost, 3 warnings
```

Identical for `.h` and `.smart-standard-list-item`. Nothing is losing data in
practice — the lightweight bits are not in use yet — but it confirms the scope
claim: the generator and the JSON shape are already right, and a regression
test should pin this round trip.

## Decisions (resolved with user)

- **D1** Severity for a value on a placeholder link: **warning**, not error.
  Consistent with how `.p` already reports ignored instruction/hint/resource
  tags. The value is dropped.
- **D2** Enforcement is **bitmark parse path only**. The JSON path (Builder) is
  not touched; `Builder` has no error/warning channel and none is added.
- **D3** `.h` **and the whole list-item family** keep a **valued item**; every
  other lightweight bit loses it and gets a placeholder. Late requirement change
  (2026-09-13): a list item carries a label ('a)', 'iii.'), so the earlier
  decision to strip it was reversed.

  | Valued item | Placeholder item |
  | ----------- | ---------------- |
  | `h` | `p`, `p-alt`, `smart-standard-p` |
  | `list-item`, `standard-list-item` | `list`, `list-alt` |
  | `smart-standard-list-item` (+ `-collapsible`) | `standard-list`, `smart-standard-list` (+ `-collapsible`) |

  The split is list **items** keep a label, list **containers** do not. Shape-
  breaking for the placeholder bits (released v5.40.0), but **they are not in
  use yet**, so no migration is needed.
- **D4** `lead` is a placeholder on **all** lightweight bits, `.h` included.
- **D5** `.h` gets the **full chain** — item (valued) + lead + pageNumber +
  marginNumber. Citation is the point of this work and a numbered heading is
  the most citable target.
- **D6** "Placeholder" is encoded as **`exportJsonKey: '@ignore'`**, a small
  targeted extension to the key-pattern language (specs/JSONKEY_SYNTAX.md §6.2):
  the tag fires and consumes its chain slot, writes nothing, and any value
  written in it is dropped with a warning. `@ignore` is general — valid on any
  tag whose value is never meaningful, not only chain links.
  - Two earlier revisions were wrong. `format: TagFormat.none` would have
    **broken the new parser's build**: its codegen closes the format match with
    `other => panic!("Unknown tag format: {other}")`, and `bitmark_confgen`
    validates against a fixed six-value list. The config source it reads is a
    symlink to **this repo's `assets/config`**, so the bad value would have gone
    straight into their build.
  - Reusing the existing suppress form `{}` was also wrong. `{}` means
    "consumed and used, written elsewhere" and has 16 users in the shipped
    config, including `[@internalComment]` and `[@isCaseSensitive]`, which both
    carry meaningful values. A warning keyed on it would misfire on every one.
  - `null`/absent is a third distinct thing: "use the tag-name default key".
    confgen rejects an authored null with "omit the member instead".
  - The legacy `jsonKey` is kept on placeholder links only to name the slot
    ('item' / 'lead') in the warning; it is not exported.
  - `@ignore` supersedes the `emptyReservesSlot: true` schema flag, which was
    prose-only and never implemented.
- **D7** The `xml-niso-iec → <label>` `mappingKeys` entry is **carried over
  unchanged** onto both new groups, mirroring `group_standardItemLead`. NISO is
  not released and these mappings are provisional, so the fact that the mapping
  cannot currently fire on a placeholder item link is accepted and imposes no
  constraint on D3. Revisit when NISO ships.
- **D8** Warning wording follows house style — see FR4.2.

## Functional Requirements

### FR1 — `@ignore` key-pattern extension

1. Spec: add `"@ignore"` to the §6 pattern-shape table and a new §6.2 defining
   it, and replace the `emptyReservesSlot` prose in §11.4. Done in
   `specs/JSONKEY_SYNTAX.md`.
2. Add `JSONKEY_IGNORE = '@ignore'` to `src/model/config/_Config.ts`.
3. No plumbing: `exportJsonKey` is already carried on the raw config, hydrated
   onto `MarkupTagConfig`, and exported verbatim by `ConfigBuilder.ts:173`
   (non-null values pass through), so `'@ignore'` reaches the exported config
   with no exporter change.

**Downstream, still to do (not in this repo):** the same §6.2 delta in
`crates/lib/jsonkey_parser/doc/JSON.md`, one token in the key compiler mapping
to a pattern variant that `is_consume_only` accepts (so emission gating is
unchanged), and one warn site.

### FR2 — New config groups

Replace `group_standardItem` with two groups in `src/config/raw/groups.ts`
(new `GroupKey` entries in `src/model/enum/GroupKey.ts`). Both mirror
`group_standardItemLead`'s 4-link shape, `jsonKey`/`exportJsonKey`/`mappingKeys`
and `maxCount: 1` per link.

| Group | item | lead | pageNumber | marginNumber | Used by |
| ----- | ---- | ---- | ---------- | ------------ | ------- |
| `group_standardPageMargin` | `@ignore` |  `@ignore` | value | value | `_standardLight` |
| `group_standardItemPageMargin` | value | `@ignore` | value | value | `h` |

`group_standardItem` and its `GroupKey` entry are **deleted** (no other
consumer).

Two full group definitions are required, not one plus an override of a single
link: the hydrated map is keyed on the top-level `tag_item`, and the whole
3-link chain hangs off it, so overriding the head replaces the chain wholesale.

### FR3 — Bit wiring

1. `_standardLight` (`bits.ts:35`): swap `group_standardItem` →
   `group_standardPageMargin`. Update the description (it currently says
   "item + example only").
2. `h` (`bits.ts:2933`) **and `list-item` (`bits.ts:5910`)**: add
   `group_standardItemPageMargin` to their own `tags`, overriding the inherited
   group. One override on `list-item` covers the whole family, since
   `standard-list-item` → `smart-standard-list-item` → the collapsible leaf all
   chain off it. Update its description (currently
   "title/level + item only").
   - **Override verified**: `Config.ts:396` merges the inheritance tree
     root-first with `ObjectUtils.deepMerge`, whose array branch
     (`ObjectUtils.ts:440`) **concatenates**, so `h`'s own tags land after
     `_standardLight`'s. `ConfigHydrator.hydrateTagsConfig:52` then spread-merges
     each hydrated entry into a `{ [configKey]: TagConfig }` map in order, so the
     later `tag_item` entry wins. No extra base bit is needed.
3. No change to the remaining 8 bits — they inherit FR3.1: `p`, `p-alt`,
   `smart-standard-p`, `list`, `list-alt`, `standard-list`,
   `smart-standard-list` and `smart-standard-list-collapsible`.

### FR4 — Placeholder validation (bitmark path)

1. When a `[%…]` chain link whose config is `@ignore` carries a
   non-empty value: drop the value (treat as empty) and emit **one** warning
   per offending link, so `[%a][%b][%12]` on `.p` warns twice.
2. Message: ``[%] '<jsonKey>' does not take a value on bit '<bitType>'. It will
   be ignored.`` — `<jsonKey>` is `item` or `lead`. Deliberately mirrors the
   house style of the adjacent `[%] is included more than the required 1
   time(s). The earlier ones will be ignored`. Do **not** reuse the generic
   `is not valid here (incorrectly chained?)` phrasing: the tag *is* valid in
   that position, only its value is not.
3. Implementation site: `ItemLeadChainContentProcessor.buildItemLead()`
   (`ItemLeadChainContentProcessor.ts:60-67`). Verified as the only correct
   single point — it holds the bit's `tagsConfig`, resolves `itemLeadConfig`,
   and assigns **both** output arrays on adjacent lines:
   - `target.itemLead` (TextAst per position)
   - `target.__itemLeadString` (plain string per position, consumed by
     `CardContentProcessor.ts:1143-1154`)

   Both must be blanked in lockstep or a dropped value can reappear via the
   string array. Walk positions against the config chain: position 0 is
   `itemLeadConfig`, position *n* is reached by following `.chain[tag_item]`
   *n* times. `context.addWarning` is in scope.

   Do **not** use the demux at `BitmarkPegParserProcessor.ts:707-722` — it is
   hardcoded positional and has no tag config.
4. Trailing links beyond marginNumber keep today's behaviour (the last one wins,
   `itemLead[l - 1]`).

### FR5 — No generator or JSON change

`BitmarkGenerator` and `JsonGenerator` are **not** modified. Their existing
behaviour already satisfies the requirement (see Verified current behaviour).
Cover with regression tests only.

## Non-Functional Requirements

- No behaviour change for any bit based on `_standard`. `article`, `chapter`
  and the rest of the suite unchanged.
- Lightweight-bit fixtures change and are regenerated
  (`npm run regenerate-bitmark-test-json`) **after** manual verification.
- Regenerate `SUPPORTED_BITS.md` (`npm run build-supported-info`) — all 13
  lightweight bits gain three chain links, and 12 of them lose the item value.
- Version: minor bump (5.41.0 → 5.42.0) at release time. Version bumps are
  separate `chore: bumped version to vX` commits here, so this is **not** part
  of the feature commit. No `since` change on the bits themselves; the tags
  arrive via the group, and groups carry no `since`.
- Rebuild `dist` for the web tests (`npm run tsup && npm run build-browser`).
- No grammar change expected (`[%…]` and `TagChain` already parse arbitrary
  chain lengths). If any `.pegjs` changes, regenerate parsers — the staleness
  test enforces it.

## Implementation Outline

1. FR1 — nothing to do.
2. FR2 — two new groups; delete `group_standardItem` and its `GroupKey`.
3. FR3 — bit wiring (`_standardLight`, then `h`'s override).
4. FR4 — validation + warning in `buildItemLead()`.
5. Fixtures + regeneration; `SUPPORTED_BITS.md`; `dist`.

Steps 1-3 are inert on their own: until FR4 lands, a value on a placeholder
link is silently kept rather than warned about. Land 1-4 together.

## Testing

### Fixture changes

Every fixture below was found by scanning `test/standard/input/bitmark/` for a
lightweight bit type together with a `[%…]` tag. The list is complete.

| Fixture | Today | After |
| ------- | ----- | ----- |
| `p.bitmark` | `[%1]` on `.p` | keep as a **warning** case; add `[%][%][%12][%m3]` |
| `p-alt.bitmark` | `[%A]` on `.p-alt` | as above |
| `smart-standard-p.bitmark` | `[%2]` | as above |
| `list-alt.bitmark` | `[%1]` on `.list-alt` | as above |
| `h.bitmark` | `[%4.1]` | still valid; add `[%4.1][%][%12][%m3]` and `[%4.1][%lead]` (lead warning) |
| `list-item.bitmark` | 5-link empty chain only | add `[%a)]`, `[%a)][%][%12][%m3]`, and `[%a)][%lead][%12]` (lead warning) — the item value is **kept** |
| `list.bitmark` | `[%][%][%][%][%marginNumber]` on `standard-list` | 1 warning instead of 3; marginNumber set |
| `list-item.bitmark` | same on `standard-list-item` | as above |
| `smart-standard-bits.bitmark` | same on `smart-standard-list` + `smart-standard-list-item` (lines 57-65) | as above |
| `smart-standard-collapsible-bits.bitmark` | same on the two `*-collapsible` leaves | as above |

The last two fixtures also contain many non-lightweight bits whose output must
not move; diff them carefully rather than regenerating blind.

### Behaviour already verified against the current build (regression guards)

| Input | Result |
| ----- | ------ |
| `.article` + `[%][%][%][%][%marginNumber]` | 1 × "included more than the required 1 time(s)", marginNumber = last link |
| `.article` + `[%a][%b][%c][%d][%e][%f]` | 2 warnings; item=a, lead=b, pageNumber=c, marginNumber=f |
| JSON input `{instruction, hint, item}` on `.p` | all three **kept**, written back as `[% 1 ][? hint ][! inst ]` |

The third row is the precedent for **D2**: the bitmark path already drops
instruction/hint on `.p` with a warning while the JSON path keeps them, so
enforcing only on the bitmark path introduces no new class of asymmetry.

### Cases

Fixtures cover the bitmark-parse cases. The rest — the JSON input path, the
JSON → bitmark → JSON round trip, short chains and the `article` regression —
cannot be expressed as a `.bitmark` fixture and live in
`test/unit/lightweightItemChain.test.ts`.

- Lightweight bit, `[%][%][%page]` → pageNumber set, item/lead empty, no warning.
- Lightweight bit, `[%][%][%page][%margin]` → both set, no warning.
- Lightweight bit, `[%value]` → warning, value dropped, all four empty.
- Lightweight bit, `[%a][%b][%12]` → two warnings (item + lead), pageNumber=12.
- `.h`, `[%4.1]` → item set, no warning.
- `.h`, `[%4.1][%lead][%12]` → one warning (lead), item=4.1, pageNumber=12.
- Short chains `[%]` / `[%][%]` → no output, no warning (existing tolerance).
- Round-trip bitmark → JSON → bitmark stable for every case above; a set
  pageNumber always regenerates as a chain of at least three.
- JSON input with a non-empty item on `.p` → value **kept**, no warning (D2).
  Pin this explicitly so the asymmetry is a documented choice, not a surprise.
- **Round-trip regression**: JSON `{type:'p', pageNumber:'12',
  marginNumber:'m3'}` → bitmark → JSON must preserve both values. Repeat for
  `.h` and `.smart-standard-list-item`.
- Regression: `article` with `[%][%][%12][%m3]` unchanged.
