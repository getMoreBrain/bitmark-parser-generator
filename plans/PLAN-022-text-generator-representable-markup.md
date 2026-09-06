# PLAN-022: Text generator must only emit markup the text grammar can parse back

Bug #10567 (`[.info]` task list: `==Du entwickelst …==|color:|` appears literally in the text).

## Problem

### The reported case

TipTap hands the JSON generator a text node with an empty colour:

```json
{ "type": "text", "text": "Du entwickelst …", "marks": [{ "type": "textStyle", "attrs": { "color": "" } }] }
```

`TextGenerator` (JSON → bitmark text) writes `==Du entwickelst …==|color:|`. The text grammar
(`assets/grammar/text/text-grammar.pegjs`, v8.41.1) only accepts `color:` followed by a value of
the `Color` rule, so the whole tag fails and, per the **Text Parsing Principle** ("text is always
text unless it's a valid bitmark tag"), is re-parsed as literal text. The markup is now baked
into the content and every further round trip keeps it.

### The class

The parser is lenient by design: anything it does not recognise degrades to text (or to a
literal tail after the last valid chain segment). The generator is NOT symmetric: it trusts the
JSON and writes whatever it is given. Every place the generator writes a value it did not
validate against the grammar rule that will consume it is an instance of this class:

| # | Sub-class | Example JSON → generated → re-parsed |
|---|-----------|--------------------------------------|
| C1 | Enum-valued attribute outside the grammar's enum | `textStyle{color:""}` / `"bad"` / `"RED"` / `"red "` / `5` → `\|color:x\|` → whole tag literal |
| C2 | Chain value containing a chain terminator (`\|`) or line terminator | `var{name:"a\|b"}` → `\|var:a\|b\|` → var `a` + literal `b\|` |
| C3 | Required attribute absent so a malformed segment is written | `var` (no attrs) → `\|var\|` → literal; `symbol` (no attrs) → `==text==\|\|` → literal |
| C4 | Value fails a typed rule | `timer{duration:"123"}` (must start `P`) → literal; `image{width:"abc"}` / `-5` / `1.5` → parser `error` attr; `image{src:"img.png"}` (must be `https?://`) → literal paragraph |
| C5 | Attribute key the grammar has no rule for | `image{class:"left"}` → `\|align:left\|`; `image{foo:"bar"}`; stale parser output keys `error`, `type`, `msg`, `found`, `""` → re-written as chain segments → `error` attr / literal tail |
| C6 | Empty / fully-dropped mark list still wrapped | `marks: []` → `==text==^==` (wrapper written 3×, no chain) → literal `==text====` |
| C7 | Node-level values outside the grammar | heading `level: 4` → `#### H` → paragraph; `level: 0` → `" H"`; `orderedList{start:"x"}` → `•x a` literal; codeBlock with no/empty language → header omitted → becomes a paragraph (this one also breaks a valid parser round trip: `\|code` → `{codeBlock, language:""}`) |
| C8 | Nested chain-value context ignores its restrictions | footnote content with any `\|`-form mark (`bold+italic`, `textStyle`) or a `\|` in its text → `footnote:==x==\|bold\|italic\|\|` → marks escape onto the OUTER text |
| C9 | Standard mark silently dropped on junk attrs | `bold{color:"red"}` → not a "standard mark" any more → text written unstyled (lossy, though valid) |
| C10 | Generator throws on malformed shapes | `marks: "bold"`, `marks: [null]`, `text: 5` → exception (violates "parser errors contained, don't crash process") |

Only a partial-chain failure (C1/C2 as the 2nd+ segment) keeps the earlier marks; a failure in
the first segment loses everything. Either way the output is not the input, and the literal
tags become permanent.

Verified with a probe of ~130 malformed inputs against the current generator + v8.41.1 parser
(see Appendix A for the full observed inventory). Cases that already behave correctly:
unknown mark types (dropped), `timer` without duration (dropped, PLAN-015), legacy
`color`/`duration` marks (normalised, PLAN-015), `highlight`+`textStyle` ordering (PLAN-015).

## Goal

The text generator never emits markup that the current text grammar would not parse back into
the same AST. Anything not representable is removed at the smallest granularity, and the
remaining text content is always preserved. The generator becomes the exact inverse of the
parser's leniency: **the parser turns invalid markup into text; the generator turns invalid
JSON into text.**

## Requirements

### Functional

- **FR1 Representability check per grammar rule.** Every value the generator writes into
  markup is validated against the *value class* of the grammar rule that consumes it (table
  below). A value outside its class is not written.
- **FR2 Reduction ladder** (derived from the Resolution rule below). Drop at the smallest
  granularity, always keeping the text:
  1. unknown attribute, or invalid value of an attribute whose segment is optional in the
     grammar → attribute omitted (mark or node still written);
  2. invalid value of an attribute whose segment is mandatory in the grammar (*essential*
     column) → mark/node omitted; text content kept (heading → paragraph, list → its item
     paragraphs, image/imageInline → nothing);
  3. unknown mark type → mark omitted;
  4. text node with no writable marks (incl. `marks: []`, all dropped) → plain text, no `==`
     wrapper, no chain.
  An invalid value is never coerced to a default or another value.
- **FR3 Mirror parser normalisation** so a round trip is idempotent: trim free-string values
  (parser trims), lower-case inline `code` language (parser lower-cases). Enum values are
  matched exactly (case-sensitive, untrimmed) — the grammar does not normalise them.
- **FR4 Missing vs. invalid.** A missing/empty free-string value is representable
  (`\|link:\|`, `\|var:\|`, `\|footnote:\|`, `\|symbol:\|`, `\|#\|` all parse) and is written
  as empty, preserving current behaviour and fixtures. A missing/empty *enum* value is not
  representable → ladder.
- **FR5 Chain-value context.** Content generated *inside* a chain value (footnote /
  footnote\* content) can only contain plain text, `hardBreak` and single standard marks in
  their short form (`**`, `__`, ` `` `, `!!`). In this context: `hardBreak` → single space;
  any other mark → dropped; if the generated content still contains `\|` or a line
  terminator → footnote mark dropped (mandatory segment).
- **FR6 Never write unknown keys.** Media attribute writers (`image`, `imageInline`,
  `symbol`) write only keys the grammar has a rule for. Keys never written: `class`/`align`
  (no grammar rule; parser defaults `class` to `center`), `""`, `error`, `type`, `msg`,
  `found`, anything else unknown. Existing default-suppression (alignment `center`, textAlign
  `left`, zoomDisabled `true`, inline `alignmentVertical: top`, `size: line-height`) stays.
- **FR7 Standard marks ignore attrs.** `bold`, `italic`, `light`, and all
  `AlternativeStyleTags` marks carry no attributes in the grammar; any attrs present are
  ignored and the mark is still written (fixes C9). Exception: `highlight`/`userHighlight`
  `color` (a `HighlightColor`) is meaningful and validated (C1).
- **FR8 Robustness.** Malformed shapes never throw: non-array `marks`, `null`/non-object
  mark entries, marks without a string `type`, non-object `attrs`, non-string `text`,
  non-array footnote `content` / extref `references` are treated as absent.
- **FR9 Both locations.** Rules apply identically for `TextLocation.body`
  (`bitmarkPlusPlus`) and `TextLocation.tag` (`bitmarkPlus`) — same `InlineTags` grammar.
- **FR10 Existing normalisations kept.** Legacy `color`/`duration`/timer merge and the
  `[highlight, textStyle(HighlightColor)]` reorder (PLAN-015) run first; representability
  runs on the result.
- **FR11 #10567 end to end.** The reported bit JSON converts to bitmark with no `\|color:\|`
  and converts back to plain text nodes.

### Non-functional

- **NFR1** No grammar change. v8.41.1 stays the source of truth; the generator's constraint
  tables are a mirror and a test guards against drift (T3).
- **NFR2** No public API / option changes. No change to breakscaping.
- **NFR3** All existing suites pass unchanged (fixtures are parser-produced JSON, which is
  always representable by construction — any diff is a bug in the new rules).
- **NFR4** Single-pass walker performance unchanged: validation is O(marks) per text node.
- **NFR5** Fixtures added here are the conformance reference for the Rust implementation,
  which has the same defect (handover only; Rust changes out of scope).

## Value classes (mirror of the grammar)

| Class | Grammar rule | Representable values | Generator normalisation |
|-------|--------------|----------------------|-------------------------|
| `chainString` | `$((!BlockTag char)*)` | string, no `\|`, no line terminator; `""` ok | trim |
| `Color` | `Color` (23 names) | exact member | none |
| `HighlightColor` | `HighlightColor` (10 names) | exact member | none |
| `MediaAlignment` | `left\|center\|right` | exact member | none |
| `InlineMediaAlignment` | 8 names | exact member | none |
| `InlineMediaSize` | 5 names | exact member | none |
| `Boolean` | `true\|false` | boolean, or `"true"`/`"false"` | to boolean |
| `UInt` | `[0-9]+` | non-negative integer number or all-digit string | to integer |
| `Duration` | `'P' chainString` | `chainString` starting with `P` | trim |
| `UrlHttp` | `'http' 's'? '://' UrlChars*` | `^https?://` then only `UrlChars` (no `\|`, no whitespace) | none |
| `Url` | `UrlHttp` or `mailto:` prefix | as above with `mailto:` allowed | none |
| `inlineAlt` | `$((!InlineTag .)*)` (not unbreakscaped) | string without `==` | none |
| `latexFormula` | `$((!InlineTag .)*)` + unbreakscape | any string (generator breakscapes `==`) | breakscape |
| `codeLanguage` | inline: `chainString`; block: `char+` to EOL | string, no `\|` (inline) / no line terminator | trim, lower-case |
| `headingLevel` | `TitleTags` | 1, 2, 3 | invalid → heading dropped, written as paragraph |
| `listStart` | `[0-9]+` | `UInt` | invalid → list dropped, items written as paragraphs |

## Mark table (attrs → class, essential?)

| Mark | Attr → class | Essential | Notes |
|------|--------------|-----------|-------|
| `textStyle`, legacy `color` | `color → Color` | yes | the #10567 case; invalid → mark dropped |
| `highlight`, `userHighlight` | `color → HighlightColor` | no | invalid (incl. `red`, `""`) → bare `\|highlight\|` / `!!…!!` |
| `bold`, `italic`, `light`, all `AlternativeStyleTags` | none | — | attrs ignored (FR7) |
| `link` | `href → chainString` | yes | short form (bare URL) only when `href` matches `Url` fully; else `\|link:\|` chain form |
| `ref` | `reference → chainString` | yes | |
| `xref` | `xref → chainString`, `reference → chainString` | `xref` | |
| `extref` | `extref → chainString`, `references[] → chainString` each, `provider → chainString` | `extref`, `provider` (`provider:` segment is mandatory) | invalid reference element → element dropped (`Ref*`); non-array → `[]` |
| `footnote`, `footnote*` | `content → TextAst` in chain-value context (FR5) | yes | non-array → `[]` |
| `symbol` | `src → chainString` + media chain (see below) | `src` | no attrs → `\|symbol:\|` (fixes C3 `==text==\|\|`) |
| `var` | `name → chainString` | yes | no attrs → `\|var:\|` (fixes C3 `\|var\|`) |
| `code` | `language → codeLanguage` | no | missing / `plain text` / invalid → `\|code\|` |
| `timer` | `name → chainString`, `duration → Duration` | `duration` | |
| `colorPicker` | `propertyRef → chainString` | yes | no attrs → `\|colorPicker:\|` |
| `comment` | `comment → chainString` | yes | |
| unknown type | — | — | dropped (unchanged) |

## Node table

| Node | Attr → class | Policy when not representable |
|------|--------------|-------------------------------|
| `image` | `src → UrlHttp` (essential); `width`,`height → UInt`; `alignment`,`textAlign` (as `captionAlign`) `→ MediaAlignment`; `alt`,`title` (as `caption`),`comment → chainString`; `zoomDisabled → Boolean` | invalid `src` → node omitted; other invalid attr → attr omitted (`MediaChain?` items are optional); unknown keys never written (FR6) |
| `imageInline` | `src → Url` (essential); `alt → inlineAlt` (essential: the `==alt==` segment is mandatory and not unbreakscaped); `srcAlt → chainString`; `width`,`height → UInt`; `alignmentVertical → InlineMediaAlignment`; `size → InlineMediaSize`; `comment → chainString` | invalid `src` or `alt` → node omitted; other invalid attr → omitted |
| `symbol` media chain | `width`,`height → UInt`; `alignment`,`captionAlign → MediaAlignment`; `alt`,`caption → chainString`; `zoomDisabled → Boolean`; `comment → chainString` | attr omitted; unknown keys never written |
| `latex` | `formula → latexFormula` | missing → node omitted (unchanged) |
| `heading` | `level → headingLevel` (essential: `TitleTags` mandatory); content is single-line | invalid level → written as a paragraph; absent → level 1 (existing default); `hardBreak` in content → space |
| `codeBlock` | `language → codeLanguage` (read from `attrs.language` OR top-level `language`, which is what the parser emits for `\|code`) | missing/empty → write `\|code` header (fixes C7 round trip); invalid (line terminator) → `\|code` header (`CodeHeader` has a language-less alternative) |
| `orderedList*` | `start → listStart` (essential: bullet digits mandatory) | invalid → list dropped, item paragraphs written; absent → 1 (existing default) |
| `taskItem` | `checked → Boolean` | only `true` → `•+`, else `•-` (non-boolean ignored) |

## Resolution rule (replaces case-by-case decisions)

Every choice below is derived from one rule, not decided: **the generator writes a piece of
markup only if the parser turns that markup back into the JSON it came from.** Applied per
attribute, this gives a mechanical procedure:

1. **Attribute the grammar has no rule for** (for this mark/node type): the parser can never
   produce it, so it has no markup form. It is ignored; the mark/node is still written.
   (`bold{color}`, `image{class}`, `image{error}`, `imageInline{foo}`.)
2. **Attribute the grammar has a rule for, value outside that rule**: the attribute has no
   markup form. It is not written, and it is **never coerced** to a default, another value, or
   a normalised spelling (`RED` is not `red`; `"x"` is not `1`; `4` is not `3`). Then:
   - the grammar rule for the mark/node has an alternative **without that segment**
     (`'highlight' BlockTag`, `'code' BlockTag`, `'timer' BlockTag 'duration:'`,
     `'xref:' str BlockTag` without `►`, `Ref*`, `MediaChain?`) → that form is written; the
     parser fills its own default (bare highlight, `plain text`, name `""`, reference `""`,
     `alignment: center`, …);
   - the segment is **mandatory** in the rule (`color:` of textStyle, `duration:` of timer,
     the value of `link:` / `var:` / `►` / `xref:` / `extref:` / `provider:` / `footnote:` /
     `symbol:` / `colorPicker:` / `#`, `src` of image and imageInline, the `==alt==` of
     imageInline, `formula` of latex, `TitleTags` of a heading, the digits of an ordered-list
     bullet) → the mark/node has no markup form and is dropped; its text content is kept.
3. **Absent** is not invalid. An absent free-string value is written empty (`\|link:\|`,
   `\|footnote:\|` — forms the parser produces and existing fixtures use); an absent
   structural value takes the default the generator already uses (heading level 1, list start
   1, code `plain text`).
4. **Parser normalisation is mirrored, not extended.** The parser trims free strings and
   lower-cases inline code language, so the generator does the same to keep the round trip
   idempotent. It does nothing the parser does not do.

The "essential" column in the tables above is exactly step 2's *mandatory segment* test; it is
listed only so the implementation does not have to re-derive it.

Former open questions, answered by the rule:

| Case | Parser on the markup the generator would write | Therefore the generator writes |
|------|-----------------------------------------------|--------------------------------|
| `textStyle{color:""}` (#10567) | `\|color:\|` → literal text | plain text (mark dropped) |
| `highlight{color:"bad"}` | `\|highlight\|color:bad\|` → highlight + literal tail | `\|highlight\|` (segment optional) |
| `highlight{color:"red"}` | `\|highlight\|color:red\|` → `[highlight, textStyle(red)]`, a different AST | `\|highlight\|` |
| `bold{color:"red"}` | grammar has no colour rule for bold | `**text**` (attr ignored) |
| `link{href:"a\|b"}`, `var{name:"a\|b"}`, `extref{provider:"p\|q"}` | value truncated + literal tail; the segment is mandatory | plain text (mark dropped) |
| `timer{name:"a\|b", duration:"P1D"}`, `xref{xref:"a", reference:"b\|c"}`, `code{language:"a\|b"}` | segment optional | `\|timer\|duration:P1D\|`, `\|xref:a\|`, `\|code\|` |
| `textStyle{color:"RED"}` / `"red "` | `Color` is exact-match; parser would not accept `RED` and never emits it | plain text (no case-folding) |
| footnote content with `\|` in its text | `\|footnote:a\|b\|` → truncated + tail; segment mandatory | plain text (footnote dropped) |
| footnote content with chain-form marks | `\|footnote:==x==\|bold\|italic\|\|` → marks escape to outer text | `\|footnote:x\|` (inner marks dropped in chain-value context) |
| heading `level: 4` / `0` / `"x"` | `#### H` → paragraph `"#### H"`; `TitleTags` mandatory | paragraph `H` |
| `orderedList{start:"x"}` | `•x a` → paragraph `"•x a"`; digits mandatory | the item paragraphs, no list |
| `image{src:"img.png"}` | `\|image:img.png\|` → paragraph of literal text; `UrlHttp` mandatory | nothing (node dropped) |
| `imageInline{src:"img.png"}` / `{alt:"a==b"}` | literal text / truncated alt; both segments mandatory | nothing (node dropped) |
| `image{alignment:"bad"}`, `{width:"abc"}`, `{class:"left"}` | `error` attr; chain items optional | `\|image:…\|` without that item |
| `taskItem{checked:"yes"}` | grammar only knows `true`/`false` | `•- ` (attr ignored, default unchecked) |

## Design

- New module `src/generator/text/TextGrammarConstraints.ts` (generator layer, no grammar
  change): the enum lists (extend the existing `HIGHLIGHT_COLORS` precedent with `COLORS`,
  `MEDIA_ALIGNMENTS`, `INLINE_MEDIA_ALIGNMENTS`, `INLINE_MEDIA_SIZES`), the value-class
  predicates/normalisers, and the mark/node attribute tables above. Header comment names the
  grammar rule each item mirrors and the grammar version.
- `TextGenerator`:
  - `getWritableMarks` → keeps legacy normalisation, then applies the mark table
    (validate/normalise/drop attrs; drop marks per essential column; drop unknown/garbage
    entries). Returns marks that are guaranteed representable so the `writeXxxMark` writers
    stay dumb.
  - `writeMarks`: remove the `emptyMarks` triple-write path; `marks.length === 0` after
    sanitising ⇒ plain text (FR2.4). Standard-mark test ignores attrs (FR7).
  - `getMediaAttrs`: replaced by table-driven writer per media kind (`image`, `imageInline`,
    `symbol`) — allow-list of keys, class validation, default suppression; delete the `''`
    key and `class → align` branches (FR6).
  - `writeImage`, `writeHeading`, `writeCodeBlock`, `writeBullet`: node table.
  - `writeFootnoteMark` / `writeFootnoteStarMark`: internal generator runs with a new
    `GenerateOptions.chainValueContext` (extends `forceInline`) implementing FR5; the writer
    checks the result for `\|`/line terminators and drops the mark.
  - `isSimpleLink`: additionally require `href` to match `Url` fully.
- Architecture check: generator layer only; grammar remains source of truth (mirror + drift
  test); parsers, AST, config, breakscaping untouched. Output stays deterministic.

## Tests

- **T1 Unit — representability matrix** `test/unit/generator/text-generator-representable-markup.test.ts`.
  Table-driven; one row per cell of the mark table × {valid, empty, missing, wrong-enum,
  wrong-case, whitespace, `\|`, newline, wrong-type} where the class makes the cell
  meaningful, plus node table rows, C6, C8, C9, C10 shapes, and both locations (FR9).
  Every row asserts four things, the last two being the mechanical form of the Resolution
  rule so no row depends on hand judgement:
  1. `generate(json)` equals the expected markup;
  2. `parse(generate(json))` deep-equals the expected (reduced) AST, modulo parser-injected
     defaults (`link.target`, `code.language: plain text`, imageInline/image defaults);
  3. **no leaked markup**: every `text` in `parse(generate(json))` is a substring of the
     input's text content (concatenated text nodes, footnote content included), so no `==`,
     `\|…\|`, `#### `, `•x ` fragment can appear as literal text;
  4. idempotence: `generate(parse(generate(json))) === generate(json)`.
  Oracles 3 and 4 are also run over every existing parser fixture JSON and over the full
  Appendix A probe matrix (as a fixed list), so the whole class is checked, not only the rows
  written by hand.
  Reuse the `mark()` / `ast()` / `reparseMarks()` helpers from
  `text-generator-legacy-marks.test.ts` (extract to a shared helper if useful).
- **T2 Unit — #10567 end to end** (same file or `bitmark-generator-invalid-text-json.test.ts`):
  the reported bit JSON (`.info`, taskList, five `textStyle{color:""}` items) through
  `BitmarkParserGenerator.convert` JSON→bitmark→JSON; assert no `\|color:\|` in the bitmark
  and plain text nodes in the result.
- **T3 Unit — grammar drift guard** `test/unit/generator/text-grammar-constraints-sync.test.ts`:
  read `assets/grammar/text/text-grammar.pegjs`, extract the literal alternatives of `Color`,
  `HighlightColor`, `AlternativeStyleTags`, `MediaAlignment`, `InlineMediaAlignment`,
  `InlineMediaSize`, `MediaSizeTags`, `MediaTextTags`, `MediaBooleanTags`, and the `VERSION`
  constant; compare with `TextGrammarConstraints` tables (and `INLINE_MARK_TYPES` /
  `TextMarkType` for `AlternativeStyleTags`). Fails when the grammar changes without the
  mirror.
- **T4 Standard fixtures — JSON-driven generator suite** (the existing generator suite is
  text-driven, so it cannot hold invalid JSON):
  `test/standard/input/text-bitmark-body-generator-json/<case>.json` (input) with expected
  `expected/<case>.text` and `expected/<case>.json`; new
  `test/standard/text-bitmark-body-generator-json.test.ts` mirrors the existing suite's
  output/diff-file conventions (`results/…/output`). Assertions as T1 (1)–(3). One fixture
  per sub-class C1–C10 with several cases each; include the #10567 body verbatim. These files
  are the Rust conformance handover (NFR5).
- **T5 Regression**: `npm run check`, `npm test` — all existing suites unchanged (NFR3);
  in particular `text-bitmark-body-generator`, `text-bitmark-tag-generator`, `bitmark-generator`,
  `plain-text-*`. Any fixture diff is investigated as a rule bug, not regenerated.
- **T6 Browser**: `npm run tsup && npm run build-browser`, then `web-generator` suite.

## Docs

- `TEXT_PARSER_UPDATES.md`: add a "Generator representability rules" section (the Resolution
  rule, value classes, mark/node tables, fixture location) as the handover for the Rust team.

## Out of scope

- Grammar changes (e.g. escaping `\|` inside chain values, headings beyond level 3).
- The inverse class: the parser *adding* markup the JSON did not have — a plain text node
  containing `https://…` re-parses with an auto `link` mark (observed; breakscaping layer).
- `section` text node (`writeSection`): no grammar rule exists; unchanged.
- Rust implementation changes (fixtures + doc are the handover).
- Bitmark-level (bit/tag) generator validation — a separate class, see PLAN-014 for the
  JSON-generator analogue.

## Verification checklist

- [ ] Reproduce #10567 pre-fix via T2 (fails), then passes after the change.
- [ ] T1 matrix green in both locations; T3 green against v8.41.1.
- [ ] T4 fixtures committed; `expected/*.json` checked against the Resolution rule table.
- [ ] T5/T6 green with zero fixture changes.
- [ ] Probe script re-run (Appendix A) shows no row whose re-parse contains a literal `==`,
      `\|` chain fragment, `#### `, `•x `, or a parser `error` attribute originating from
      generator output.

## Appendix A — observed current behaviour (probe, generator + parser v8.41.1)

Legend: **LIT** = whole tag re-parsed as literal text; **TAIL** = earlier marks kept, rest
literal; **ERR** = parser `error` attr / literal tail; **LOSS** = valid but lost data; **THROW**.

| Input | Generated | Result |
|-------|-----------|--------|
| `textStyle{color:""}` / no attrs / `bad` / `RED` / `"red "` / `5`; legacy `color` same | `==text==\|color:x\|` | LIT |
| `[bold, textStyle{""}]` | `==text==\|bold\|color:\|` | TAIL (`color:\|` literal) |
| `[textStyle{""}, bold]` | `==text==\|color:\|bold\|` | LIT |
| `highlight{color:"bad"}`, `userHighlight{color:"bad"}` | `\|highlight\|color:bad\|` | TAIL |
| `highlight{color:"red"}` | `\|highlight\|color:red\|` | re-parses as `[highlight, textStyle(red)]` — AST changed |
| `bold{color:"red"}` | `text` | LOSS (bold dropped) |
| `timer{duration:"123"}` | `\|timer:n\|duration:123\|` | LIT |
| `timer{name:"a\|b"}` | `\|timer:a\|b\|duration:P1D\|` | LIT |
| `var` no attrs | `\|var\|` | LIT |
| `var{name:"a\|b"}`, `code{language:"a\|b"}`, `ref{"a\|b"}`, `xref{"a\|b"}`, `link{href:"…x\|y"}`, `comment "a\|b"`, `colorPicker{"a\|b"}`, `extref{provider:"p\|q"}` | `…\|a\|b\|` | TAIL |
| `var{name:"a\nb"}` | `\|var:a` NL `b\|` | LIT + hardBreak |
| `extref{references:["a\|b"]}` | `\|extref:e\|►a\|b\|provider:p\|` | LIT |
| `symbol` no attrs | `==text==\|\|` | LIT |
| `symbol{width:"abc"}` / `{foo:"bar"}` / `{alignment:"bad"}` / `{comment:"a\|b"}` / `{error:"x"}` | `\|symbol:s\|…\|` | ERR |
| `footnote{content:[text+textStyle]}` / `[bold,italic]` / nested footnote | `\|footnote:==x==\|bold\|italic\|\|` | marks escape to outer text + literal `\|` |
| `footnote{content:[text "a\|b"]}` | `\|footnote:a\|b\|` | TAIL |
| `marks: []` (body, tag, in heading, 2nd node) | `==text==^==` | LIT (`==text====`) |
| `marks: "bold"`, `marks: [null]`, `text: 5` | — | THROW |
| `imageInline{src:"img.png"}` | `==alt==\|imageInline:img.png\|` | LIT |
| `imageInline{alt:"a==b"}` | `==a==b==\|imageInline:…\|` | alt truncated, literal `==a` |
| `imageInline{width:"abc"}` | `\|width:abc\|` | ERR |
| `imageInline{foo}` / `{alignmentVertical:"bad"}` / `{size:"bad"}` / stale `type/msg/found` | `\|foo:bar\|` | TAIL |
| `image{src:"img.png"}` / `{src:"https://a/i .png"}` | `\|image:img.png\|` | LIT paragraph |
| `image{width:"abc"/-5/1.5}` / `{alignment:"bad"}` / `{textAlign:"bad"}` / `{foo}` / `{class:"left"}` / `{"":"v"}` / `{error:…}` | `\|image:…\|x\|` | ERR |
| `image{alt:"a\nb"}` | `\|image:…\|alt:a` NL `b\|` | LIT + autolink |
| heading `level:4` | `#### H` | LIT paragraph |
| heading `level:0` / `"x"` | ` H` | paragraph (LOSS) |
| heading with `hardBreak` | `# H` NL `I` | heading + paragraph |
| codeBlock no/empty language (incl. parser's own `\|code` output) | body only | paragraph (LOSS) |
| `orderedList{start:"x"}` / `-1` | `•x a` | LIT |
| `taskItem{checked:"yes"}` | `•+ a` | checked (coercion) |

Correct today: unknown mark type, `link`/`ref`/`xref`/`extref`/`footnote`/`symbol`/`comment`/
`colorPicker`/`var`/`code` with empty values, `code` language upper-case (parser lower-cases),
`timer{duration:""}` (dropped), `latex` formula with `==` or `\|`, `image{width:"300"}`,
`imageInline{srcAlt, comment}`, `highlightYellow{junk attrs}`.
