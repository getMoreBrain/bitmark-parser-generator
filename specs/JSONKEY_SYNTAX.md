# jsonKey Mini-Language Specification

This document defines the mini-language used in `jsonKey` strings throughout the bitmark configuration system. The `jsonKey` tells a parser _where_ in the JSON output to write a tag's value, including nesting, arrays, type conversions, and fixed-value emission.

## Syntax Overview

A `jsonKey` string has this structure:

```
[^]path[.path...][[]|[{s}|{v}]][|transform]
```

Or the special transparent path:

```
.
```

Parsing precedence (left to right):

1. `^` — root escape (optional prefix)
2. `|` — pipe separator for transforms
3. `.` — dot separator for nested object keys
4. `[]` — array append
5. `[{s}]` / `[{v}]` — side/variant offset substitution

---

## Path Expressions

### Transparent path (`.`)

A standalone `.` means the tag produces no separate JSON key. The tag's content merges into the parent context (typically the variant body).

```
jsonKey: "."
```

Used when a bitmark tag is syntactically meaningful but transparent in JSON output. For example, the `[#]` title tag in `table-extended` cells — `[#Name]` writes "Name" to the cell's `content` field (the variant body), not to a separate `title` key.

### Simple key

```
jsonKey: "instruction"
```

Emits: `"instruction": <value>`

### Dot-separated nesting

```
jsonKey: "question.text"
```

Emits: `"question": { "text": <value> }`

### Array append (`[]`)

```
jsonKey: "values[]"
```

Emits: appends `<value>` to the `values` array.

```
jsonKey: "alternativeAnswers[].text"
```

Emits: appends `{ "text": <value> }` to the `alternativeAnswers` array.

### Side offset substitution (`{s}`)

Used in repeating sides. The `{s}` placeholder is replaced with the 0-based side index.

```
jsonKey: "cells[{s}].values[]"
```

For side 0: `"cells": [{ "values": [<value>] }]`
For side 1: `"cells": [..., { "values": [<value>] }]`

### Variant offset substitution (`{v}`)

Used in repeating variants. The `{v}` placeholder is replaced with the 0-based variant index.

```
jsonKey: "values[{v}]"
```

---

## Root Escape (`^`)

When `jsonKey` starts with `^`, the value is emitted at the **bit root level** rather than relative to the current card item.

```
jsonKey: "^heading.forKeys"
```

This is used for heading cards — the first card in a card set where `[#]` title tags write to bit-level properties.

---

## Transforms (`|`)

A pipe `|` separates the key path from a transform function. The transform modifies how the tag value is converted to JSON.

### `bool(x)`

Emit `true` if the tag's raw value equals `x`; **omit the key entirely** otherwise.

```
jsonKey: "title|bool(th)"
```

If `[@tableCellType:th]` → emits `"title": true`
If `[@tableCellType:td]` → key is omitted

### `set(k=v)`

Sets field `k` to value `v` on the object resolved by the key path. The tag or variant content is written to the key path as normal; the `set()` transform adds an additional fixed property alongside it.

Supported value literals:

- `true` / `false` — JSON booleans
- Unquoted text — JSON string

**On a tag jsonKey** — the tag content goes to the key path, and `k=v` is set on the containing object:

```
jsonKey: "statement|set(isCorrect=true)"
```

Tag `[+this is true]` → emits `{ "statement": "this is true", "isCorrect": true }` on the card item.

```
jsonKey: "ingredient|set(checked=false)"
```

Tag `[-]` → emits `{ "ingredient": <content>, "checked": false }` on the card item.

**On an array path** — creates an array element and sets `k=v` on it. The tag content is written to a content field derived from the array name (singular form: `choices[]` → `choice`).

```
jsonKey: "choices[]|set(isCorrect=true)"
```

Tag `[+Choice text]` → appends `{ "choice": <content>, "isCorrect": true, ... }` to `choices[]`

Child chain tags (item, lead, hint, instruction, example) are added as sibling fields on the same element.

**On a side jsonKey** — sets `k=v` on every object created by the side path. Variant and tag content populates the object as normal.

```
jsonKey: "cells[{s}]|set(title=true)"
```

Every cell object at `cells[{s}]` gets `"title": true` set automatically, in addition to whatever content and tags populate it.

### `multi(count=N, key=K)`

Lexer-count-driven destination redirect. Today this applies only to `Tag::Title` (`[#…]` count = 1, `[##…]` count = 2, …). When the tag is parsed, its lexer count is matched against any `multi(count=N, …)` arms — if it matches, the value is emitted at `K` instead of the base key.

Stackable: chain `|multi(...)|multi(...)` to declare further levels. Codegen sorts arms by `count` ascending and silently overrides the schema's `max` to `1` when any `multi(...)` is present (each count slot is implicitly cardinality 1).

```
jsonKey: "title|multi(count=2, key=subtitle)"
```

`[.book]\n[#Title]` → emits `"title": [...]`
`[.book]\n[##Subtitle]` → emits `"subtitle": [...]`

```
jsonKey: "title|multi(count=2, key=subtitle)|multi(count=3, key=section)"
```

Counts 1/2/3 → keys `title`/`subtitle`/`section`.

**Validity**: the set of valid counts is `{1} ∪ {arm.count}`. Counts outside that set produce an `InvalidHeadingLevel` validator warning and the tag is dropped.

**Codegen rejects** at build time:

- duplicate `count=N` across arms,
- `count=1` (level 1 is the default base key — express it as the bare path before the pipe),
- `count=0`,
- chaining `|multi(...)` with non-multi transforms.

### `setMulti(field)`

Like `set(k=v)` but the value comes from the lexer count rather than a literal. Emits the tag's value at the base key **and** a sibling field whose value is the count.

```
jsonKey: "title|setMulti(level)"
```

`[.chapter]\n[##My Chapter]` → emits `{ "title": [...], "level": 2 }` on the bit.

Argument is a single bare field name — no `=`, no commas. Any count is valid (no `multi(...)` cap is implied; if a bound is needed, declare matching `|multi(...)` arms or add a future `|maxCount(N)` transform).

The array form composes naturally: each `[#…]`/`[##…]`/etc. produces one `{ baseKey: …, field: count }` element appended to the base array.

```
jsonKey: "title[]|setMulti(level)"
```

`[#A]\n[##B]\n[###C]` → `"title": [{...,"level":1},{...,"level":2},{...,"level":3}]`.

### `resource(type=t, key=k)`

Resource-only transform. When a resource tag's value is serialized as a nested resource object, override the inner `"type"` field and the inner slot key. The outer key (the path on the left of `|`) is unaffected.

Both arguments are optional and named. Defaults:

- `type` — falls back to the resource's `res_type`
- `key` — falls back to the tag's `jsonKey` path

```
jsonKey: "icon|resource(type=image, key=image)"
```

For chained `[&icon:url]` on a card term — the outer key remains `icon` (from the path), but the inner object reflects the underlying media:

```json
"icon": {
  "type": "image",
  "image": { "src": "url" }
}
```

The transform is read only by the resource value serializer. On non-resource tags it has no effect.

---

## Context-Dependent jsonKey

The same bitmark tag can have different `jsonKey` values depending on context. Tags are registered with unique IDs per context (group, card variant, chain position). The parser resolves which tag config to use based on the current parsing context.

### Example: `[+]` and `[-]` tags

| Context                          | `[+]` jsonKey                    | `[-]` jsonKey                     | Behavior                           |
| -------------------------------- | -------------------------------- | --------------------------------- | ---------------------------------- |
| `group_trueFalse` (default/quiz) | `choices[]\|set(isCorrect=true)` | `choices[]\|set(isCorrect=false)` | Creates choice array elements      |
| `statements` card set            | `statement\|set(isCorrect=true)` | `statement\|set(isCorrect=false)` | Content → statement, sets boolean  |
| `ingredients` card set           | `ingredient\|set(checked=true)`  | `ingredient\|set(checked=false)`  | Content → ingredient, sets boolean |

### Example: `[_]` (gap) tag

| Context                   | jsonKey       | Behavior                                  |
| ------------------------- | ------------- | ----------------------------------------- |
| `group_gap` (top level)   | `solutions[]` | Tag content appended to `solutions` array |
| `group_gap` (chain child) | `solutions[]` | Alternative solutions appended            |

### Example: `[=]` (mark) tag

| Context      | jsonKey    | Behavior                               |
| ------------ | ---------- | -------------------------------------- |
| `group_mark` | `solution` | Tag content written as solution string |

---

## Complete Grammar (EBNF)

```ebnf
jsonKey      = transparent | [root_escape] key_path [transform_suffix]
transparent  = "."
root_escape  = "^"
key_path     = segment ("." segment)*
segment      = identifier [array_marker]
identifier   = letter (letter | digit | "_")*
array_marker = "[]" | "[{s}]" | "[{v}]"
transform_suffix = "|" transform
transform_suffix = "|" transform ("|" "multi(" multi_args ")")*
transform    = bool_transform | set_transform | resource_transform
              | multi_transform | set_multi_transform
bool_transform  = "bool(" literal ")"
set_transform   = "set(" identifier "=" literal ")"
resource_transform = "resource(" [resource_args] ")"
resource_args   = resource_arg ("," resource_arg)*
resource_arg    = ("type" | "key") "=" literal
multi_transform = "multi(" multi_args ")"
multi_args   = "count=" integer "," "key=" identifier
set_multi_transform = "setMulti(" identifier ")"
literal      = ~[)|=,]+
integer      = digit+
```

Only `|multi(...)` is repeatable in a chain; mixing `|multi(...)` with other transforms is rejected at codegen time.

---

## Summary Table

| Syntax                        | Purpose                                    | Example                                 |
| ----------------------------- | ------------------------------------------ | --------------------------------------- |
| `.`                           | Transparent (no separate key)              | `.`                                     |
| `key`                         | Simple property                            | `instruction`                           |
| `key.sub`                     | Nested object                              | `question.text`                         |
| `key[]`                       | Array append                               | `values[]`                              |
| `key[].sub`                   | Array of objects                           | `alternativeAnswers[].text`             |
| `key[{s}]`                    | Side-indexed array                         | `cells[{s}].values[]`                   |
| `^key`                        | Emit at bit root                           | `^heading.forKeys`                      |
| `key\|bool(x)`                | Boolean if value matches                   | `title\|bool(th)`                       |
| `key\|set(k=v)`               | Set fixed field on object                  | `statement\|set(isCorrect=true)`        |
| `key[]\|set(k=v)`             | Array element with fixed field             | `choices[]\|set(isCorrect=true)`        |
| `key\|multi(count=N, key=K)`  | Redirect to `K` when lexer count == N      | `title\|multi(count=2, key=subtitle)`   |
| `key\|setMulti(field)`        | Set sibling `field` to lexer count         | `title\|setMulti(level)`                |
| `key\|resource(type=t,key=k)` | Override inner type/slot for resource tags | `icon\|resource(type=image, key=image)` |
