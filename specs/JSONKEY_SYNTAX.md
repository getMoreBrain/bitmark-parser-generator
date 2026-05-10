# jsonKey JSON-Pattern Language — reference

This crate compiles bitmark `jsonKey` values written in the **JSON-pattern**
language at code-generation time. The companion runtime semantics doc is
`RUNTIME.md`. Background design lives in `PLAN-051`.

## 1. The idea

A `jsonKey` is a **JSON pattern** — a JSON value that _is_ the sub-tree the
tag contributes, with sigils standing in for source-driven values.

Forward (bitmark → JSON): write the literals, substitute sigils.
Reverse (JSON → bitmark): structurally match literals, extract sigils.

A jsonKey is therefore reversible by construction, with no operator
vocabulary.

Per PLAN-051 §3, **only** the `jsonKey` field on a tag entry may be edited
in `bitmark.json`. No sibling "schema flag" fields are added or read; every
behaviour previously imagined as a flag is either implicit in the pattern,
inferred at codegen, or expressed via inline scope-shift writes.

## 2. Storage

`jsonKey` is a JSON value:

| Type     | Meaning                                                                |
| -------- | ---------------------------------------------------------------------- |
| `null`   | "consume only, emit nothing" — pairs with cascade detection at codegen |
| `bool`   | constants-only literal pattern                                         |
| `number` | constants-only literal pattern                                         |
| `string` | sigil pattern (must start with `$`); else legacy-rejected at top level |
| `array`  | multiple-rule list, evaluated first-match-wins                         |
| `object` | single-rule pattern shape                                              |

Top-level non-`$`-prefixed strings are rejected as legacy. Inside a pattern,
ordinary string values are literal-string constants.

## 3. Sigils — value position

| Sigil              | Meaning                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `"$"`              | tag's source value                                                                                      |
| `"$s"`             | side index (also valid as object key)                                                                   |
| `"$i"`             | tag's occurrence index on its parent                                                                    |
| `"$level"`         | tag-carried level integer                                                                               |
| `"$parent.<path>"` | value at the parent's JSON sub-tree at `<path>` (e.g. `$parent.solutions[0]`)                           |
| `"$<name>"`        | named placeholder for multi-input tags (validated by codegen against the parser-side multi-input table) |

`$parent` paths use `.<field>` and `[N]` segments:

```
$parent.solutions[0]
$parent.isCorrect
$parent.cells[2].values[0]
```

## 4. Scope-shift keys (key position only)

Place a sub-tree at a fixed scope. **Multiple scope-shift keys may coexist
at the same object level**, alongside regular keys — that's how bubble is
expressed (writing `true` to ancestor flags is idempotent OR).

| Key         | Target                                                            |
| ----------- | ----------------------------------------------------------------- |
| `"@bit"`    | bit root (top of `bit.*`)                                         |
| `"@parser"` | parser scope (sibling of `bit`, e.g. `parser.internalComments[]`) |
| `"@card"`   | active card-array entry root                                      |

A scope-shift cannot **nest** inside another scope-shift (`@bit` inside
`@parser` is rejected). Adjacent scope-shifts at the same level are fine.

## 5. Predicate keys (outermost rule level only)

Discriminate sibling rules in the multi-rule array form.

| Predicate    | Meaning                                           |
| ------------ | ------------------------------------------------- |
| `"@value=V"` | tag's value (post-format-coerce) equals literal V |
| `"@level=N"` | tag's level equals integer N                      |
| `"@i=N"`     | tag's occurrence index equals integer N           |

Predicate values are typed by the parent tag's `format` (boolean, integer,
or string). The compiler stores them as `JsonLiteral`; codegen later
re-types them under the schema.

## 6. Pattern shape

| Shape                                     | Meaning                                                               |
| ----------------------------------------- | --------------------------------------------------------------------- |
| literal scalar (`true`, `42`, `"th"`)     | constant — emitted forward, matched on reverse                        |
| `"$"`                                     | value placeholder                                                     |
| `["$"]`                                   | append-per-occurrence array                                           |
| `[lit, "$", lit]`                         | array with constants surrounding the value                            |
| `{ k1: v1, k2: v2 }`                      | object — fields/keys can be literals, sigils, scope-shifts, templates |
| object with no `"$"` placeholder anywhere | constants-only rule — fires on tag presence, emits only literals      |
| `null`                                    | no JSON output                                                        |
| template key (e.g. `"sub${level}title"`)  | key with sigil interpolation; reverse splits literal anchors          |

### 6.1 Object-key forms

Keys in an object can be:

- literal (`"alt"`, `"choice"`)
- bare-sigil from the whitelist: `"$s"`, `"$<name>"`
- template (literal + sigil mix): `"sub${level}title"`. Template keys must
  contain at least one literal character between sigils.
- scope shift: `"@bit"` / `"@parser"` / `"@card"`
- placeholder: `"$"` (pairs with a sibling value pattern)

`$`, `$i`, `$level`, `$parent.…` are **not** valid bare-sigil keys — only
`$s` and named placeholders are.

The braced placeholder form `${name}` lets a sigil sit immediately next to
ident-characters, e.g. `"sub${level}title"` (otherwise `$leveltitle` reads
greedily as one identifier).

## 7. Multiple rules per tag

Canonical form: an **array** of rule objects, evaluated first-match-wins.

```json
[{ "@value=th": { "title": true, "$": "$" } }, { "@value=td": {} }]
```

Each rule object:

- has at most one outermost predicate key (whose value is the pattern), or
- has no predicate keys (the entire object is an unconditional pattern;
  conventionally this rule appears last as a fallback).

The predicate-keyed-object alternative
(`{"@value=th": …, "@value=td": …}`) is rejected by the compiler.

## 8. Behaviours expressed without sibling fields

Per PLAN-051 §3, no fields besides `jsonKey` may be added to or modified in
`bitmark.json`. The behaviours that earlier drafts imagined as flags are
re-homed:

| Behaviour                                                   | Where it lives now                                                                                                                                                                                                         |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sub-scope chain (`[@posterImage][@width]`)                  | Existing `parentTagIds` records the chain attachment. The serializer walks the parent tag's compiled pattern to locate the sub-object that chained children fill.                                                          |
| Starter array (`[@mark][@color][@emphasis]`)                | Implicit from the introducer's pattern shape: an array at the leaf (`{"marks": [{"mark": "$"}]}`) means each occurrence appends a fresh entry.                                                                             |
| Consume-at-scope (`[@isCaseSensitive]` at bit-header)       | `jsonKey: null` — the pattern itself signals "no JSON output."                                                                                                                                                             |
| Cascade (bit-header `[@example]` broadcasts to descendants) | **Inferred at codegen.** Same tag name with `null` pattern at one scope and non-null pattern at descendant scope ⇒ cascade pair; codegen emits a static map; runtime reads the bit-header value as the descendant default. |
| Bubble (`isExample` propagating up)                         | **Inline scope-shift writes** in the descendant rule: `{"@bit": {"isExample": true}, "@card": {"isExample": true}, "isExample": true, ...}`. Idempotent OR is the natural semantic.                                        |
| Multi-input lex template (`[=word                           | mark:name]`)                                                                                                                                                                                                               | Lex templates already live in parser code. Pattern `$<name>` sigils refer to parser-known slots. Codegen validates against a hardcoded multi-input table. |
| Parent-derived value (`$parent.<path>`)                     | Self-describing in the pattern.                                                                                                                                                                                            |

## 9. Compiler entry point

```rust
use jsonkey_parser::compile_json_key;
use serde_json::json;

let value = json!({ "alt": "$" });
let compiled = compile_json_key(&value, "$.tags.42.jsonKey")?;
assert_eq!(compiled.rules.len(), 1);
```

The compiler accepts only the jsonKey JSON value. There are no schema-flag
inputs.

Phase-1 rejections (structural — see PLAN-051 §7.2):

- two sibling `"$"` placeholders in one object,
- predicate-keyed-object multi-rule form,
- predicate keys at non-outermost positions,
- mixed predicate / regular keys at the outermost rule level,
- scope-shift nested inside another scope-shift,
- adjacent sigils in a template key,
- bare-sigil keys outside the whitelist (only `$s` and `$<name>` allowed),
- `$parent` in a key position,
- top-level non-`$`-prefixed strings (legacy),
- duplicate predicates in a rule list.

Phase-3 rejections (require codegen + schema graph — implemented in `bitmark_codegen`):

- `$parent.<path>` whose path can't be resolved against the parent's schema,
- predicate value type mismatched with parent tag's `format`,
- `$level` used without a paired `@level=N` predicate,
- sibling rules whose forward outputs collide structurally,
- `$<name>` not declared in the parser-side multi-input template table.

## 10. Worked examples

```json
{ "alt": "$" }                                    // [@alt:foo] → { "alt": "foo" }
{ "id": ["$"] }                                   // [@id:x][@id:y] → { "id": ["x","y"] }
{ "@bit": { "heading": { "forKeys": "$" } } }     // match-side-0 → bit root
{ "cells": { "$s": { "title": true, "body": "$" } } }
{ "choices": [{ "choice": "$", "isCorrect": true }] }
{ "resource": { "type": "image", "image": { "src": "$" } } }
[
  { "@level=1": { "title": "$" } },
  { "@level=2": { "subtitle": "$" } }
]
[
  { "@value=th": { "title": true } },
  { "@value=td": {} }
]
{ "@bit": { "isExample": true }, "isExample": true, "example": "$parent.solutions[0]" }
{ "marks": [{ "mark": "$" }] }                    // chain children fill `marks[i]`
{ "posterImage": { "src": "$" } }                 // chained tags attach via existing parentTagIds
null                                              // cascade pair detected at codegen
```

## 11. Full example set — bitmark token → jsonKey pattern

For each row, the **left** column is the bitmark token; the **right** column
is the jsonKey JSON pattern.

### 11.1 Direct mapping & multiplicity

```json
@id              →  [ "$" ]
@language        →  [ "$" ]                           // schema decides if many or single
@width           →  { "width": "$" }                  // (or "$" alone if jsonKey of "width" set elsewhere)
@alt             →  { "alt": "$" }
@aiGenerated     →  { "aiGenerated": "$" }
@duration        →  { "duration": "$" }
[!text]          →  { "instruction": "$" }
[?text]          →  { "hint": "$" }
[▼anchor]        →  { "anchor": "$" }
[$tag]  (alias)  →  { "tag": [ "$" ] }
```

### 11.2 Card-set containers

```json
flashcard card body          →  { "cards": [ "$" ] }
                                // (variant rules below fill each entry)

MCQ quiz body                →  { "quizzes": [ "$" ] }
match pair body              →  { "pairs": [ "$" ] }
table row                    →  { "table": { "data": [ "$" ] } }
cloze-list item              →  { "listItems": [ "$" ] }
feedback card                →  { "feedbacks": [ "$" ] }

// `[+]` MCQ choice
                             →  { "choices": [ { "choice": "$", "isCorrect": true } ] }
// `[-]` MCQ choice
                             →  { "choices": [ { "choice": "$", "isCorrect": false } ] }

// true-false `[+]`
                             →  { "statements": [ { "statement": "$", "isCorrect": true } ] }

// table heading cell `[#]` in heading row
                             →  { "cells": { "$s": { "title": true, "body": "$" } } }
```

### 11.3 Heading-card promotion

```json
match heading side 0   →  { "@bit": { "heading": { "forKeys": "$" } } }
match heading side 1   →  { "@bit": { "heading": { "forValues": "$" } } }
matrix heading sides   →  { "@bit": { "heading": { "forValues": [ "$" ] } } }
table heading column   →  { "@bit": { "table": { "columns": [ "$" ] } } }
```

### 11.4 `[%]` four-slot positional (handled by chaining)

`[%]` tags chain together; the parser tracks chain position and routes each
occurrence to a separate schema entry, each with its own jsonKey. The schema
has four entries for `[%]`, distinguished by chain position:

```json
[%]  chain pos 1   →  { "item":         "$" }
[%]  chain pos 2   →  { "lead":         "$" }
[%]  chain pos 3   →  { "pageNumber":   "$" }
[%]  chain pos 4   →  { "marginNumber": "$" }
```

Empty `[%]` reserves a slot (handled by parser/schema, not jsonKey — schema
flag `emptyReservesSlot: true` on the tag).

### 11.5 `[►]` two-slot (handled by chaining)

Same pattern as `[%]`: `[►ref][►end]` chains; parser routes each chain
position to its own schema entry.

```json
[►]  chain pos 1   →  { "reference":    "$" }
[►]  chain pos 2   →  { "referenceEnd": "$" }
```

### 11.6 `[#]` family (one tag, level-discriminated)

The lexer emits one `TitleStart(level)` token for `[#x]`, `[##x]`, `[###x]`,
… with `level` = number of hash characters. The schema has one tag entry
with multiple rules, picked by `@level=N`:

```json
"jsonKey": [
  { "@level=1": { "title":       "$" } },
  { "@level=2": { "subtitle":    "$" } },
  { "@level=3": { "subsubtitle": "$" } }
]
```

Inside a heading-card context the same token routes elsewhere via the `@bit`
scope shift (§11.3 `{"@bit": {"heading": …}}` etc.) — that discrimination is
by _parent context_, handled by the parser giving the rule a different
active scope, so it's a different schema entry rather than a predicate.

### 11.7 Per-value (`[@tableCellType]`)

```json
@tableCellType   →  [
                     { "@value=th": { "title": true } },
                     { "@value=td": { } }
                   ]
```

### 11.8 Resources

```json
[&image:url]                  →  { "resource": { "type": "image",
                                                  "image":  { "src": "$" } } }
[&image-link:url]             →  { "resource": { "type": "image-link",
                                                  "imageLink": { "url": "$" } } }
[&audio:url]                  →  { "resource": { "type": "audio",
                                                  "audio":  { "src": "$" } } }
[&app-link:url]               →  { "resource": { "type": "app-link",
                                                  "appLink": { "url": "$" } } }
[&coverImage:url]   (book)    →  { "coverImage":   { "type": "image",
                                                      "image": { "src": "$" } } }
[&backgroundWallpaper:url]    →  { "backgroundWallpaper":
                                                    { "type": "image",
                                                      "image": { "src": "$" } } }
[&icon:url]   (on side)       →  { "icon":         { "type": "image",
                                                      "image": { "src": "$" } } }

@width  in resource scope     →  { "width":  "$" }
@alt    in resource scope     →  { "alt":    "$" }
@caption                      →  { "caption": [ "$" ] }
@srcAlt                       →  { "srcAlt": [ "$" ] }
@posterImage:url  (in video)  →  { "posterImage": { "src": "$" } }
                                  // schema flag subscope:true on @posterImage
                                  // so chained @width lands inside posterImage
```

### 11.9 Composite property objects (chain of property tags)

```json
@ratingLevelStart   →  { "ratingLevelStart": { "level": "$" } }
                       // schema flag subscope:true; chained tags fill ratingLevelStart
@label              →  { "label": "$" }      // active scope = ratingLevelStart

@servings           →  { "servings": { "servings": "$" } }
                       // schema flag subscope:true
@unit               →  { "unit": "$" }       // active scope = servings
@unitAbbr           →  { "unitAbbr": "$" }   // active scope = servings
@hint               →  { "hint": "$" }       // active scope = servings
```

### 11.10 Starter-tag arrays (mark definitions)

```json
@mark               →  { "marks": [ { "mark": "$" } ] }
                       // schema flag starter:true means each occurrence opens new entry
@color              →  { "color": "$" }      // active scope = current marks[*] entry
@emphasis           →  { "emphasis": "$" }

// video-link thumbnails
@src1x              →  { "videoLink": { "thumbnails": [
                          { "src": "$" } ] } }   // schema flag starter:true
@src2x              →  same as src1x — schema flag starter:true on each
```

### 11.11 Variants (flashcard `++`)

```json
flashcard side 1 variant 0    →  { "cards": [ { "question": { "text": "$" } } ] }
flashcard side 2 variant 0    →  { "cards": [ { "answer":   { "text": "$" } } ] }
flashcard side 2 variants 1+  →  { "cards": [ { "alternativeAnswers":
                                                  [ { "text": "$" } ] } ] }
```

(Variant index → which schema rule is used. Schema metadata, not jsonKey
logic.)

### 11.12 Repeating-side bare values (table.data cells)

```json
table.data variant body       →  "$"
                                  // bare placeholder = no key wrapper
                                  // active scope = table.data[row][col]
```

### 11.13 Side-as-namespace

```json
match side 0 (key)            →  { "key":    "$" }
match side 1 (values)         →  { "values": [ "$" ] }
flashcard side 1 (question)   →  { "question": { "text": "$" } }
flashcard side 2 (answer)     →  { "answer":   { "text": "$" } }
match-matrix side i cells     →  { "cells": { "$s": { "values": [ "$" ] } } }
```

### 11.14 Multi-section card-set (table-extended)

```json
header section card           →  { "@bit": { "table": { "header": { "rows": [ "$" ] } } } }
body   section card           →  { "@bit": { "table": { "body":   { "rows": [ "$" ] } } } }
footer section card           →  { "@bit": { "table": { "footer": { "rows": [ "$" ] } } } }
```

### 11.15 Multi-side composite cards (feedback)

```json
choice side variant `[+]`     →  { "feedbacks": [ { "choices": [
                                    { "choice": "$", "isCorrect": true,
                                      "requireReason": true } ] } ] }
                                  // requireReason value is itself a per-card flag,
                                  // schema-driven from the presence of the reason side

reason side primary           →  { "feedbacks": [ { "reason": { "text": "$" } } ] }
reason side @reasonableNumOfChars
                              →  { "reasonableNumOfChars": "$" }
                                  // active scope = feedbacks[*].reason
```

### 11.16 Inline body nodes

The pattern style works inside body too. The "active scope" for a body
inline tag is the inline node attrs:

```json
[_solution]    (cloze gap)    →  { "solutions": [ "$" ] }
[+text]   highlight-text body →  { "texts": [ { "text": "$",
                                                 "isCorrect": true,
                                                 "isHighlighted": false } ] }
[+text]   cloze-mc-text body  →  { "options": [ { "text": "$",
                                                   "isCorrect": true } ] }
[=word|mark:name]  mark body  →  { "solution": "$word", "mark": "$name" }
                                  // two named placeholders for the two sub-fields
                                  // (see multi-input tags below)
|image:url|  inline image     →  { "src": "$", "alt": null, "srcAlt": null,
                                    "zoomDisabled": false }
```

### 11.17 Parser scope

```json
@internalComment  (bit-header)  →  { "@parser": { "internalComments": [ "$" ] } }
```

### 11.18 `[@example]`

```json
@example  (bare on gap)        →  { "isExample": true, "example": "$parent" }
@example  (valued on gap)      →  { "isExample": true, "example": "$" }
                                   // two rules, picked by presence of value
@example  (bare on [+] choice) →  { "isExample": true, "example": "$parent" }
                                   // $parent here = parent's isCorrect (bool)
@example  (at bit-header)      →  { "isExample": true }
                                   // schema flag cascade:true broadcasts to children
```

### 11.19 Cascade-only tags (`[@isCaseSensitive]` at bit-header)

```json
@isCaseSensitive  (at bit-header)  →  null
                                       // schema flag cascade:true does the work
@isCaseSensitive  (at gap)         →  { "isCaseSensitive": "$" }
```

### 11.20 Single-card flatten variants (`*-1`)

The schema's per-bit-type entry simply uses a different jsonKey:

```json
multiple-choice    [+]   →  { "quizzes": [ { "choices": [ { "choice": "$",
                                                              "isCorrect": true } ] } ] }
multiple-choice-1  [+]   →  { "choices": [ { "choice": "$", "isCorrect": true } ] }

true-false         [+]   →  { "statements": [ { "statement": "$",
                                                  "isCorrect": true } ] }
true-false-1       [+]   →  { "statement": "$", "isCorrect": true }
                            // direct scalar at bit root
```
