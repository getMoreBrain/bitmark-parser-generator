# jsonKey Mini-Language Specification

This document defines the mini-language used in `jsonKey` strings throughout the bitmark configuration system. The `jsonKey` tells a parser _where_ in the JSON output to write a tag's value, including nesting, arrays, type conversions, and fixed-value emission.

## Syntax Overview

A `jsonKey` string has this structure:

```
[^]path[.path...][[]|[{s}|{v}]][|transform]
```

Parsing precedence (left to right):

1. `^` — root escape (optional prefix)
2. `|` — pipe separator for transforms
3. `.` — dot separator for nested object keys
4. `[]` — array append
5. `[{s}]` / `[{v}]` — side/variant offset substitution

---

## Path Expressions

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

### `value(x)`

Always emit the fixed value `x` regardless of the tag's content. The tag content is written to its parent's `jsonKey` (the variant body or another designated field).

Supported value literals:

- `true` / `false` — JSON booleans
- Unquoted text — JSON string

```
jsonKey: "isCorrect|value(true)"
```

Tag `[+...]` → emits `"isCorrect": true` (tag content goes to variant body)

```
jsonKey: "isCorrect|value(false)"
```

Tag `[-...]` → emits `"isCorrect": false`

```
jsonKey: "checked|value(true)"
```

Tag `[+]` → emits `"checked": true`

### `set(k=v)`

Creates an **array element** in the parent and sets field `k` to value `v` on that element. The tag content is written to a `content` field on the same element. The parent key is taken from the key path (which must end with `[]`).

```
jsonKey: "choices[]|set(isCorrect=true)"
```

Tag `[+Choice text]` → appends `{ "choice": <content>, "isCorrect": true, ... }` to `choices[]`

```
jsonKey: "choices[]|set(isCorrect=false)"
```

Tag `[-Choice text]` → appends `{ "choice": <content>, "isCorrect": false, ... }` to `choices[]`

The content field name is derived from the array name — `choices[]` → `choice`, `responses[]` → `response` (singular form). Child chain tags (item, lead, hint, instruction, example) are added as sibling fields on the same element.

---

## Context-Dependent jsonKey

The same bitmark tag can have different `jsonKey` values depending on context. Tags are registered with unique IDs per context (group, card variant, chain position). The parser resolves which tag config to use based on the current parsing context.

### Example: `[+]` and `[-]` tags

| Context                          | `[+]` jsonKey                    | `[-]` jsonKey                     | Behavior                      |
| -------------------------------- | -------------------------------- | --------------------------------- | ----------------------------- |
| `group_trueFalse` (default/quiz) | `choices[]\|set(isCorrect=true)` | `choices[]\|set(isCorrect=false)` | Creates choice array elements |
| `statements` card set            | `isCorrect\|value(true)`         | `isCorrect\|value(false)`         | Sets scalar boolean           |
| `ingredients` card set           | `checked\|value(true)`           | `checked\|value(false)`           | Sets scalar boolean           |

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
jsonKey      = [root_escape] key_path [transform_suffix]
root_escape  = "^"
key_path     = segment ("." segment)*
segment      = identifier [array_marker]
identifier   = letter (letter | digit | "_")*
array_marker = "[]" | "[{s}]" | "[{v}]"
transform_suffix = "|" transform
transform    = bool_transform | value_transform | set_transform
bool_transform  = "bool(" literal ")"
value_transform = "value(" literal ")"
set_transform   = "set(" identifier "=" literal ")"
literal      = ~[)|=]+
```

---

## Summary Table

| Syntax            | Purpose                        | Example                          |
| ----------------- | ------------------------------ | -------------------------------- |
| `key`             | Simple property                | `instruction`                    |
| `key.sub`         | Nested object                  | `question.text`                  |
| `key[]`           | Array append                   | `values[]`                       |
| `key[].sub`       | Array of objects               | `alternativeAnswers[].text`      |
| `key[{s}]`        | Side-indexed array             | `cells[{s}].values[]`            |
| `^key`            | Emit at bit root               | `^heading.forKeys`               |
| `key\|bool(x)`    | Boolean if value matches       | `title\|bool(th)`                |
| `key\|value(x)`   | Fixed value emission           | `isCorrect\|value(true)`         |
| `key[]\|set(k=v)` | Array element with fixed field | `choices[]\|set(isCorrect=true)` |
