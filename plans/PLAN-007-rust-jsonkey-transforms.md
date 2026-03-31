# PLAN: Implement `value()` and `set()` jsonKey Transforms in Rust Parser

## Overview

Extend the Rust parser's `jsonKey` mini-language to support two new transforms — `value()` and `set()` — enabling config-driven serialization of `[+]`, `[-]`, `[_]`, and `[=]` tags. This replaces the hardcoded handling in `collect_legacy_text_tag()`.

**Spec**: See `specs/JSONKEY_SYNTAX.md` for the full mini-language grammar.

---

## Background

The `jsonKey` mini-language already supports:

- `^` prefix (root escape)
- `.` dot nesting
- `[]` array append
- `{s}` / `{v}` offset substitution
- `|bool(x)` transform

Currently, `[+]`, `[-]`, `[_]`, `[=]` tags are hardcoded in `json_serializer.rs`:

```rust
// Line 513-516 — hardcoded legacy mapping
Tag::True(t) => ("isCorrect", t.text.as_deref(), t.span),
Tag::False(t) => ("isCorrect", t.text.as_deref(), t.span),
Tag::Gap(t) => ("gap", t.text.as_deref(), t.span),
Tag::Mark(t) => ("mark", t.text.as_deref(), t.span),
```

After this plan, these will be config-driven via their `jsonKey` values from `bitmark.json`.

---

## New jsonKey Values

### Default (trueFalse group — quiz/feedback context)

| Tag   | jsonKey                           |
| ----- | --------------------------------- |
| `[+]` | `choices[]\|set(isCorrect=true)`  |
| `[-]` | `choices[]\|set(isCorrect=false)` |

### Statements card override

| Tag   | jsonKey                   |
| ----- | ------------------------- |
| `[+]` | `isCorrect\|value(true)`  |
| `[-]` | `isCorrect\|value(false)` |

### Ingredients card override

| Tag   | jsonKey                 |
| ----- | ----------------------- |
| `[+]` | `checked\|value(true)`  |
| `[-]` | `checked\|value(false)` |

### Gap group

| Tag                 | jsonKey       |
| ------------------- | ------------- |
| `[_]` (top level)   | `solutions[]` |
| `[_]` (chain child) | `solutions[]` |

### Mark group

| Tag   | jsonKey    |
| ----- | ---------- |
| `[=]` | `solution` |

---

## Implementation Steps

### Step 1: Extend `ParsedJsonKey` and `Transform` enum

**File**: `crates/lib/bitmark_parser/src/json_serializer.rs`

Add two new transform variants:

```rust
enum Transform<'a> {
    /// `bool(x)` — emit `true` when tag value equals `x`; omit key otherwise.
    Bool(&'a str),
    /// `value(x)` — always emit the fixed literal `x` as the value.
    Value(&'a str),
    /// `set(k=v)` — create array element, set field `k` to `v`, content goes
    /// to a derived content field (e.g., choices[] → choice).
    Set { field: &'a str, value: &'a str },
}
```

### Step 2: Update `parse_transform()`

```rust
fn parse_transform(s: &str) -> Option<Transform<'_>> {
    if let Some(inner) = s.strip_prefix("bool(").and_then(|s| s.strip_suffix(')')) {
        return Some(Transform::Bool(inner));
    }
    if let Some(inner) = s.strip_prefix("value(").and_then(|s| s.strip_suffix(')')) {
        return Some(Transform::Value(inner));
    }
    if let Some(inner) = s.strip_prefix("set(").and_then(|s| s.strip_suffix(')')) {
        if let Some(eq_pos) = inner.find('=') {
            return Some(Transform::Set {
                field: &inner[..eq_pos],
                value: &inner[eq_pos + 1..],
            });
        }
    }
    None
}
```

### Step 3: Implement `value()` in tag emission

In the existing `resolve_variant_tag()` method (and any equivalent for bit-level tags), when a tag has `Transform::Value`:

```rust
Transform::Value(literal) => {
    let json_value = match literal {
        "true" => "true".to_string(),
        "false" => "false".to_string(),
        _ => { let mut s = String::new(); write_json_string(&mut s, literal); s }
    };
    return Some(VariantEntry {
        json_key: parsed.key_path.to_string(),
        body_json: json_value,
    });
}
```

The tag's text content is discarded when `value()` is used on a direct tag — the content goes to the variant body instead (handled by card serialization's body rendering pipeline).

### Step 4: Implement `set()` in tag emission

`set()` is the most complex transform. When a tag like `[+Choice text]` has jsonKey `choices[]|set(isCorrect=true)`:

1. The key path `choices[]` identifies the target array
2. The tag content becomes the `choice` field (singular of `choices`)
3. The `isCorrect` field is set to `true`
4. Chain child tags (item, lead, hint, instruction, example) become sibling fields

**Content field derivation**: Strip trailing `[]` from the array name, then singularize:

- `choices[]` → `choice`
- `responses[]` → `response`

**Implementation approach**: Rather than emitting inline, collect all `set()` tags targeting the same array into a builder, then emit the array once:

```rust
// Pseudocode
struct SetCollector {
    array_key: String,           // e.g., "choices"
    content_field: String,       // e.g., "choice"
    items: Vec<SetItem>,
}

struct SetItem {
    content_json: String,        // ProseMirror JSON of tag text
    fixed_fields: Vec<(String, String)>,  // e.g., [("isCorrect", "true")]
    chain_fields: Vec<(String, String)>,  // e.g., [("item", "[]"), ("hint", "[]")]
}
```

In the card variant serializer:

1. Scan tags for `set()` transforms
2. Group by array key
3. For each group, emit `"choices": [{ "choice": <PM>, "isCorrect": true, ... }, ...]`

### Step 5: Update `collect_legacy_text_tag()` to use config

Replace the hardcoded `json_key` assignment with config lookup:

```rust
fn collect_legacy_text_tag(&self, tag: &Tag<'_>, config: &BitConfig, ...) {
    let (tag_name, text, span) = match tag {
        Tag::True(t) => ("+", t.text.as_deref(), t.span),
        Tag::False(t) => ("-", t.text.as_deref(), t.span),
        Tag::Gap(t) => ("_", t.text.as_deref(), t.span),
        Tag::Mark(t) => ("=", t.text.as_deref(), t.span),
        // ... existing item/instruction/hint cases unchanged
        _ => return,
    };

    // Resolve tag config
    let tc = match self.resolve_tag(tag_name, config) {
        Some(tc) => tc,
        None => return,
    };
    let parsed = parse_json_key(tc.json_key());

    // Apply transform
    match &parsed.transform {
        Some(Transform::Value(literal)) => {
            // Emit fixed value at key_path
            let json_value = literal_to_json(literal);
            collected.push(CollectedTagEntry {
                tag_id: tc.id,
                json_key: parsed.key_path.to_string(),
                value_json: json_value,
                span,
            });
        }
        Some(Transform::Set { field, value }) => {
            // Build array element (handled by card serializer)
            // ... collect into set collector
        }
        None => {
            // Simple key — render text as ProseMirror
            let mut value_json = String::new();
            prosemirror::write_text_tag_pm(&mut value_json, text);
            collected.push(CollectedTagEntry {
                tag_id: tc.id,
                json_key: parsed.key_path.to_string(),
                value_json,
                span,
            });
        }
        _ => {}
    }
}
```

### Step 6: Update `bitmark.json` config

After the TypeScript config generator exports the new `jsonKey` values, update `resources/bitmark-configurator/bitmark.json` with the new values. The tag entries will change from:

```json
{ "id": 135, "name": "+", "jsonKey": "true_todo" }
{ "id": 136, "name": "-", "jsonKey": "false_todo" }
{ "id": 130, "name": "_", "jsonKey": "gap_todo" }
{ "id": 23,  "name": "=", "jsonKey": "mark_todo" }
```

To:

```json
{ "id": 135, "name": "+", "jsonKey": "choices[]|set(isCorrect=true)" }
{ "id": 136, "name": "-", "jsonKey": "choices[]|set(isCorrect=false)" }
{ "id": 130, "name": "_", "jsonKey": "solutions[]" }
{ "id": 23,  "name": "=", "jsonKey": "solution" }
```

Context-specific overrides (statements, ingredients) get separate tag IDs with their own `jsonKey` values:

```json
{ "id": 363, "name": "+", "jsonKey": "isCorrect|value(true)" }   // statements
{ "id": 364, "name": "-", "jsonKey": "isCorrect|value(false)" }  // statements
{ "id": 558, "name": "+", "jsonKey": "checked|value(true)" }     // ingredients
{ "id": 559, "name": "-", "jsonKey": "checked|value(false)" }    // ingredients
```

### Step 7: Update codegen to handle new transforms

**File**: `crates/app/bitmark_codegen/src/gen_tag_registry.rs`

The codegen writes `json_key_raw` as a static string. No changes needed — the new jsonKey strings are just longer strings with `|` characters. However, verify that the `tag_by_json_key()` match function handles the pipe character correctly (it should, since it's a plain string match).

---

## Testing Strategy

1. **Unit test `parse_transform()`** — verify `value(true)`, `value(false)`, `set(isCorrect=true)` parse correctly
2. **Unit test `parse_json_key()`** — verify `choices[]|set(isCorrect=true)`, `isCorrect|value(true)` decompose correctly
3. **Fixture tests** — existing `multiple-choice`, `true-false`, `cloze-and-multiple-choice-text` fixtures should produce identical JSON output
4. **Integration** — round-trip test: parse bitmark → JSON → verify against expected JSON for:
   - `multiple-choice-1` (choices with isCorrect)
   - `true-false-1` (statement with scalar isCorrect)
   - `cook-ingredients` (checked boolean)
   - `cloze-list` (gap with solutions[])
   - `highlight-text` or similar (mark with solution)

---

## Files Changed

| File                  | Change                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `json_serializer.rs`  | Add `Value`/`Set` to `Transform`, update `parse_transform()`, refactor `collect_legacy_text_tag()` |
| `gen_tag_registry.rs` | Verify pipe chars in jsonKey strings pass through codegen                                          |
| `bitmark.json`        | Update tag jsonKey values                                                                          |
| Fixture `.json` files | No changes expected (output should be identical)                                                   |

---

## Migration Notes

- The `collect_legacy_text_tag()` hardcoded mapping can be removed incrementally — start by adding transform support, then switch tags one at a time to config-driven
- The `set()` transform for card-context `[+]`/`[-]` is the most complex piece; consider implementing `value()` first as it's simpler and covers `statements` + `ingredients`
- `gap` (`solutions[]`) and `mark` (`solution`) only need simple key path handling — no new transforms required
