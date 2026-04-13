# Card Configuration Schema

This document defines a schema for describing how bitmark card data maps to JSON output. The schema models the `card > side > variant` tree and attaches configuration parameters — most importantly `jsonKey` — to each node, fully describing the mappings documented in [CARD_MAPPING.md](CARD_MAPPING.md).

For the full `jsonKey` mini-language (path expressions, transforms, root escape, etc.), see [JSONKEY_SYNTAX.md](JSONKEY_SYNTAX.md).

## Background

The existing card configs in `assets/config/cards/` define **parser input constraints** — what tags are allowed, their formats, and cardinality (see `assets/config/partials/` for shared tag groups like `standard-tags`, `standard-item-lead-instruction-hint`, `true-false`, `gap`, `resource-icon`). What they don't describe is the **JSON output mapping** — which side/variant maps to which JSON key. This document fills that gap using the same `card > side > variant` tree, but extended with `jsonKey` paths at each node.

---

## Tree Structure

Every bit type that uses cards has this hierarchy:

```
CardConfig
└── card
    ├── side[0]                       "question" side
    │   ├── variant[0]     ← V1 (S1V1)
    │   └── variant[1..]   ← S1V2+ (overflow via ++)
    ├── side[1]                       "answer" side
    │   ├── variant[0]     ← V2 (S2V1)
    │   └── variant[1..]   ← S2V2+ (overflow via ++)
    └── side[2..]                     additional sides (e.g., matrix columns)
        └── ...
```

- **Card** — Delimited by `====`. Contains one or more sides.
- **Side** — Delimited by `--`. A new side starts when `--` is encountered.
- **Variant** — Delimited by `++`. A new variant within the current side when `++` is encountered.

> The parser flattens sides and variants into a linear sequence (V1, V2, V3…). The `SxVx` notation describes the author's structural intent; the JSON output depends solely on the flattened position. See [Variant Notation](#variant-notation).

### Variant Notation

| Notation | Meaning           | How reached               |
| -------- | ----------------- | ------------------------- |
| `S1V1`   | Side 1, Variant 1 | First content in the card |
| `S2V1`   | Side 2, Variant 1 | After the first `--`      |
| `S2V2`   | Side 2, Variant 2 | After `++` within side 2  |
| `S3V1`   | Side 3, Variant 1 | After the second `--`     |

**Flattened mapping:** `S1V1`→V1, `S2V1`→V2, `S2V2`→V3, `S3V1`→V4, etc.

The flattening means `--` and `++` produce identical JSON. An author using `--` where `++` was intended (or vice versa) gets the same output.

---

## Path Expressions

JSON paths use the `jsonKey` mini-language defined in [JSONKEY_SYNTAX.md](JSONKEY_SYNTAX.md). All paths on `side` and `variant` nodes are **relative to the card item** (i.e., relative to `card.jsonKey[N]`).

| Syntax         | Meaning                        | Example                     |
| -------------- | ------------------------------ | --------------------------- |
| `.`            | Transparent (no separate key)  | `.`                         |
| `key`          | Object property                | `question`                  |
| `key.subkey`   | Nested property                | `question.text`             |
| `key[]`        | Array — append item            | `alternativeAnswers[]`      |
| `key[].subkey` | Array of objects — append      | `alternativeAnswers[].text` |
| `key[{s}]`     | Side-indexed array element     | `cells[{s}]`                |
| `key[{v}]`     | Variant-indexed array element  | `values[{v}]`               |
| `^key`         | Emit at bit root (root escape) | `^heading.forKeys`          |

**Special cases:**

- When `card.jsonKey` is `null`, variant paths are relative to the **bit root** (not a card item).

---

## Node Properties

### CardConfig

Top-level configuration object.

| Property | Type     | Required | Description                                                          |
| -------- | -------- | -------- | -------------------------------------------------------------------- |
| `name`   | string   | yes      | Configuration identifier (matches `assets/config/cards/*.jsonc` key) |
| `bits`   | string[] | yes      | Bit types that use this configuration                                |

### card

The card-level node. A card set produces one or more **cards** in the exported config.

When `sections` is defined, each section becomes a separate card entry. Otherwise a single default card is created.

| Property   | Type                                 | Required | Description                                                                                                    |
| ---------- | ------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------- |
| `jsonKey`  | string \| null                       | yes\*    | JSON array key for card items (e.g., `cards`, `pairs`). `null` if the card doesn't create a sub-object.        |
| `sides`    | [SideNode](#sidenode)[]              | yes      | Ordered side definitions                                                                                       |
| `sections` | { [qualifier]: [Section](#section) } | no       | For qualified card dividers (e.g., `==== table-header ====`). When present, each section becomes its own card. |

\* `jsonKey` is required when `sections` is not present. When `sections` is present, each section provides its own `jsonKey`.

### Section

A section within a card set. Each section maps a qualified card divider to its own card entry with a distinct `jsonKey`.

| Property      | Type    | Required | Description                                                                                       |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------- |
| `jsonKey`     | string  | yes      | JSON array key for card items in this section                                                     |
| `isDefault`   | boolean | no       | If `true`, cards without a qualifier use this section. Exactly one section should be the default. |
| `sideJsonKey` | string  | no       | Overrides the side `jsonKey` for cards in this section (e.g., `cells[{s}]\|set(title=true)`)      |

### SideNode

A side definition within a card. Sides are separated by `--` in bitmark.

| Property   | Type                          | Required | Description                                                                                                     |
| ---------- | ----------------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `name`     | string                        | yes      | Human-readable label (e.g., `"question"`, `"key"`, `"cell"`)                                                    |
| `repeat`   | boolean                       | no       | If `true`, this side definition repeats for all remaining `--` dividers. Used for dynamic column/cell patterns. |
| `jsonKey`  | string                        | no       | Side-level jsonKey. When present, variant/tag paths are relative to the side object (e.g., `cells[{s}]`).       |
| `variants` | [VariantNode](#variantnode)[] | yes      | Ordered variant definitions within this side. First entry is the default (V1 of this side).                     |

### VariantNode

A variant within a side. The first variant handles the side's initial content; subsequent variants handle `++` overflow.

| Property        | Type           | Required | Description                                                                                                     |
| --------------- | -------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `jsonKey`       | string \| null | no       | JSON path for body text, relative to card item. `null` if this variant has no body text (all content via tags). |
| `repeat`        | boolean        | no       | If `true`, this variant repeats for all remaining `++` within the side.                                         |
| `tags`          | [TagMapping][] | no       | Variant-level tag-to-JSON mappings                                                                              |
| `bodyForbidden` | boolean        | no       | If `true`, this variant does not accept body text (all content comes from tags like `[+]`/`[-]`).               |

### Heading Cards via Root Escape (`^`)

Some card types use the **first card** as a heading row (e.g., column headers in match/matrix/table). Rather than a separate heading config, this is handled by the `^` root escape prefix on the tag's `jsonKey`.

When a tag has a `jsonKey` starting with `^`:

1. The **first card** becomes a heading card — it does not create an entry in the card array.
2. In that first card, the tag writes to the `^`-prefixed path (relative to the **bit root**) instead of within the card item.
3. In **subsequent cards**, the tag uses its normal `jsonKey` (relative to the card item) as usual.
4. When a `^`-prefixed tag appears inside a side with `repeat: true`, the values form an array automatically.

Example: `jsonKey: "^heading.forKeys"` writes to `heading.forKeys` at the bit root in the first card.

> **Tag handling** (`key`, `jsonKey`, `format`, `min`, `max`, nested `tags`, group references) follows the existing schema defined in the card config files (`assets/config/cards/*.jsonc`) and shared partials (`assets/config/partials/`). This schema does not redefine tag properties — see those files for the tag definition format.

---

## Configurations

### flashcard

```yaml
name: flashcard
bits: [flashcard, q-and-a-card]

card:
  jsonKey: cards

  sides:
    - name: question
      variants:
        - jsonKey: question.text # V1 (S1V1) body → cards[N].question.text
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: title }
            - { group: resource-icon, jsonKey: question.icon }

    - name: answer
      variants:
        - jsonKey: answer.text # V2 (S2V1) body → cards[N].answer.text
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: title }
            - { group: resource-icon, jsonKey: answer.icon }
        - jsonKey: alternativeAnswers[].text # V3+ (S2V2+) → cards[N].alternativeAnswers[M].text
          repeat: true
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: title }
            - { group: resource-icon }
```

---

### definition-list

```yaml
name: definition-list
bits: [definition-list, figure, image-figure, legend, meta-search-default-terms]

card:
  jsonKey: definitions

  sides:
    - name: term
      variants:
        - jsonKey: term.text # V1 (S1V1) body
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: ^heading.forKeys }
            - { group: resource-icon, jsonKey: term.icon }

    - name: definition
      variants:
        - jsonKey: definition.text # V2 (S2V1) body
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: ^heading.forValues }
            - { group: resource-icon, jsonKey: definition.icon }
        - jsonKey: alternativeDefinitions[].text # V3+ (S2V2+)
          repeat: true
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: title }
            - { group: resource-icon }
```

---

### match-pairs

```yaml
name: match-pairs
bits: [match, match-reverse, match-all, match-all-reverse, match-solution-grouped]

card:
  jsonKey: pairs

  sides:
    - name: key
      variants:
        - jsonKey: key # V1 (S1V1) body → pairs[N].key
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: ^heading.forKeys }
            - { tag: '[@isCaseSensitive]', type: boolean }
            - { resource: '[&audio]', jsonKey: keyAudio }
            - { resource: '[&image]', jsonKey: keyImage }

    - name: values
      repeat: true
      variants:
        - jsonKey: values[] # V2+ (S2V1+) → pairs[N].values[M]
          repeat: true
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: ^heading.forValues }
            - { tag: '[@isCaseSensitive]', type: boolean }
```

---

### match-audio-pairs

```yaml
name: match-audio-pairs
bits: [match-audio]

card:
  jsonKey: pairs

  sides:
    - name: key
      variants:
        - jsonKey: key
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: ^heading.forKeys }
            - { resource: '[&audio]', jsonKey: keyAudio }

    - name: values
      repeat: true
      variants:
        - jsonKey: values[]
          repeat: true
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: ^heading.forValues }
            - { resource: '[&audio]' }
```

---

### match-image-pairs

```yaml
name: match-image-pairs
bits: [match-picture]

card:
  jsonKey: pairs

  sides:
    - name: key
      variants:
        - jsonKey: key
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: ^heading.forKeys }
            - { resource: '[&image]', jsonKey: keyImage }

    - name: values
      repeat: true
      variants:
        - jsonKey: values[]
          repeat: true
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: ^heading.forValues }
            - { resource: '[&image]' }
```

---

### match-matrix

```yaml
name: match-matrix
bits: [match-matrix]

card:
  jsonKey: matrix

  sides:
    - name: key
      variants:
        - jsonKey: key # V1 (S1V1) body → matrix[N].key
          tags:
            - { group: standard-item-lead-instruction-hint }
            - { tag: '[@example:*]', type: plain-text }
            - { tag: '[#]', jsonKey: ^heading.forKeys }
            - { tag: '[@isCaseSensitive]', type: boolean }

    - name: cell
      repeat: true # Repeats for all remaining -- dividers (columns)
      variants:
        - jsonKey: cells[{s}].values[] # Each variant's body → matrix[N].cells[S].values[V]
          repeat: true # ++ within a cell adds more values
          tags:
            - { group: standard-item-lead-instruction-hint }
            - { tag: '[@example:*]', type: plain-text }
            - { tag: '[#]', jsonKey: ^heading.forValues }
            - { tag: '[@isCaseSensitive]', type: boolean }
```

---

### statements

```yaml
name: statements
bits: [true-false, true-false-1]

card:
  jsonKey: statements

  sides:
    - name: statement
      variants:
        - jsonKey: statement
          bodyForbidden: true
          tags:
            - { tag: '[+]', jsonKey: statement|set(isCorrect=true) }
            - { tag: '[-]', jsonKey: statement|set(isCorrect=false) }
            - { group: standard-tags }
```

> Note: The `[+...]` / `[-...]` tags use the `set()` transform to emit both the statement text AND the `isCorrect` boolean. The tag content maps to `statement`; the `set()` transform adds `isCorrect` on the card item. Body text is forbidden — all content comes from the `[+]`/`[-]` tags.

---

### quiz

```yaml
name: quiz
bits: [multiple-choice, multiple-choice-text, multiple-response, multiple-response-text]

card:
  jsonKey: quizzes

  sides:
    - name: choices
      variants:
        - jsonKey: null # No body text — all content via inline choice tags
          bodyForbidden: true
          tags:
            - { group: true-false } # [+]/[-] from the true-false group using set() transforms
            - { group: standard-tags }
```

---

### questions

```yaml
name: questions
bits: [interview]

card:
  jsonKey: questions

  sides:
    - name: question
      variants:
        - jsonKey: question
          tags:
            - { tag: '[@reasonableNumOfChars:*]', type: number }
            - { tag: '[$]', jsonKey: sampleSolution }
            - { tag: '[@sampleSolution:*]', type: plain-text }
            - { tag: '[@additionalSolutions:*]', type: plain-text, repeatable: true }
            - { tag: '[@partialAnswer:*]', type: plain-text }
            - { group: standard-tags }
```

---

### feedback

```yaml
name: feedback
bits: [feedback]

card:
  jsonKey: feedbacks

  sides:
    - name: choices
      variants:
        - jsonKey: null # No body text on side 1
          bodyForbidden: true
          tags:
            - { group: standard-item-lead-instruction-hint }
            - { group: true-false }
            - { tag: '[#]', jsonKey: ^heading.forKeys }

    - name: reason
      variants:
        - jsonKey: reason.text # V2 (S2V1) body → feedbacks[N].reason.text
          tags:
            - { group: standard-item-lead-instruction-hint }
            - { tag: '[@reasonableNumOfChars:*]', type: number }
            - { tag: '[@example:*]', type: plain-text }
            - { tag: '[#]', jsonKey: ^heading.forValues }
```

---

### bot-action-responses

```yaml
name: bot-action-responses
bits: [bot-action-response]

card:
  jsonKey: responses

  sides:
    - name: response
      variants:
        - jsonKey: feedback # V1 body → responses[N].feedback
          tags:
            - { tag: '[@reaction:*]', type: plain-text }
            - { group: standard-item-lead }
            - { tag: '[!]', jsonKey: response } # [!] maps to "response", not "instruction"
            - { tag: '[@example:*]', type: plain-text }
```

> Note: `[!]` is repurposed here — it maps to `response` (not `instruction`).

---

### cloze-list

```yaml
name: cloze-list
bits: [cloze-list]

card:
  jsonKey: listItems

  sides:
    - name: content
      variants:
        - jsonKey: body # V1 body → listItems[N].body (contains gap/cloze markup)
          tags:
            - { group: standard-tags }
            - { group: gap }
```

---

### elements

```yaml
name: elements
bits: [sequence]

card:
  jsonKey: null # Card doesn't create a sub-object

  sides:
    - name: element
      repeat: true # Each -- creates the next element
      variants:
        - jsonKey: elements[] # Body → elements[V] at the bit level
          repeat: true # ++ also appends to elements[]
          tags:
            - { group: standard-item-lead-instruction-hint }
            - { tag: '[@example:*]', type: plain-text }
```

> Note: `card.jsonKey: null` means variant paths are relative to the bit root. Each variant appends to a flat `elements[]` array.

---

### table

```yaml
name: table
bits: [table]

card:
  jsonKey: table.data

  sides:
    - name: cell
      repeat: true
      variants:
        - jsonKey: null # Body text appended as scalar string in the row
          repeat: true
          tags:
            - { group: standard-item-lead-instruction-hint }
            - { tag: '[#]', jsonKey: ^table.columns[] }
            - { tag: '[@tableCellType:*]', type: plain-text }
            - { tag: '[@tableRowSpan:*]', type: number }
            - { tag: '[@tableColSpan:*]', type: number }
            - { tag: '[@tableScope:*]', type: plain-text }
            - { tag: '[@tableColWidth:*]', type: number }
```

> Note: The `[#]` tag uses root escape (`^table.columns[]`) to write column headers at the bit root level in the heading card (first card). In subsequent cards, the body text populates the data rows.

---

### table-extended

```yaml
name: table-extended
bits: [table-extended]

card:
  sections:
    table-body: { jsonKey: table.body.rows, isDefault: true }
    table-header: { jsonKey: table.header.rows, sideJsonKey: 'cells[{s}]|set(title=true)' }
    table-footer: { jsonKey: table.footer.rows, sideJsonKey: 'cells[{s}]|set(title=true)' }

  sides:
    - name: cell
      repeat: true
      jsonKey: cells[{s}]
      variants:
        - jsonKey: content # Cell body → rows[N].cells[{s}].content
          repeat: true
          tags:
            - { group: standard-item-lead-instruction-hint }
            - { tag: '[#]', jsonKey: . } # Transparent — merges into variant body (content)
            - { tag: '[@tableCellType:*]', jsonKey: title|bool(th) }
            - { tag: '[@tableRowSpan:*]', jsonKey: rowspan, type: number }
            - { tag: '[@tableColSpan:*]', jsonKey: colspan, type: number }
            - { tag: '[@tableScope:*]', jsonKey: scope }
            - { tag: '[@tableColWidth:*]', type: number }
```

> Note: The qualified card divider (e.g., `==== table-header ====`) determines which section the row belongs to via `card.sections`. The default section (`table-body`) is used for unqualified `====` dividers. For `table-header` and `table-footer` sections, the `sideJsonKey` override adds `|set(title=true)` to mark header/footer cells. The `[#]` tag uses transparent jsonKey (`.`) — its content merges into the variant's `content` field.

---

### pronunciation-table

```yaml
name: pronunciation-table
bits: [pronunciation-table]

card:
  jsonKey: pronunciationTable.data

  sides:
    - name: cell
      repeat: true
      variants:
        - jsonKey: body # Cell body → data[N].body
          repeat: true
          tags:
            - { group: standard-item-lead-instruction-hint }
            - { tag: '[#]', jsonKey: title }
            - { resource: '[&audio]', jsonKey: audio }
```

---

### ingredients

```yaml
name: ingredients
bits: [cook-ingredients]

card:
  jsonKey: ingredients

  sides:
    - name: ingredient
      variants:
        - jsonKey: ingredient # V1 body → ingredients[N].ingredient
          tags:
            - { tag: '[#]', jsonKey: title }
            - { tag: '[+]', jsonKey: ingredient|set(checked=true) }
            - { tag: '[-]', jsonKey: ingredient|set(checked=false) }
            - { group: standard-item-lead }
            - { tag: '[!]', jsonKey: quantity } # [!] repurposed: maps to quantity
            - { tag: '[?]', jsonKey: hint }
            - { tag: '[@unit:*]', type: plain-text }
            - { tag: '[@unitAbbr:*]', type: plain-text }
            - { tag: '[@decimalPlaces:*]', type: number, default: '1' }
            - { tag: '[@disableCalculation]', type: boolean }
```

> Note: `[!]` maps to `quantity` (not `instruction`), and `[+]`/`[-]` use the `set()` transform to emit both the ingredient text and a `checked` boolean.

---

### book-reference-list

```yaml
name: book-reference-list
bits: [book-reference-list]

card:
  jsonKey: bookReferences

  sides:
    - name: reference
      variants:
        - jsonKey: null # No body text — all data via property tags
          tags:
            - { group: standard-tags }
            - { tag: '[@refAuthor:*]', type: plain-text, repeatable: true }
            - { tag: '[@refBookTitle:*]', type: plain-text }
            - { tag: '[@refPublisher:*]', type: plain-text, repeatable: true }
            - { tag: '[@refPublicationYear:*]', type: plain-text }
            - { tag: '[@citationStyle:*]', type: plain-text }
```

---

### example-bit-list

```yaml
name: example-bit-list
bits: [example-list, page-footer]

card:
  jsonKey: listItems

  sides:
    - name: item
      variants:
        - jsonKey: body # V1 body → listItems[N].body
          tags:
            - { group: standard-tags }
            - { tag: '[#]', jsonKey: title }
```

---

## Reading the Schema — Worked Example

Given the `flashcard` configuration:

```yaml
card:
  jsonKey: cards
  sides:
    - name: question
      variants:
        - jsonKey: question.text
          tags:
            - { group: resource-icon, jsonKey: question.icon }
    - name: answer
      variants:
        - jsonKey: answer.text
          tags:
            - { group: resource-icon, jsonKey: answer.icon }
        - jsonKey: alternativeAnswers[].text
          repeat: true
```

And this bitmark input:

```
[.flashcard]
====
What is 2+2?
[&icon:https://img.io/q.svg]
--
4
++
four
====
```

The schema resolves as follows:

| Step | Bitmark        | Node                                                 | Resolved JSON path                    |
| ---- | -------------- | ---------------------------------------------------- | ------------------------------------- |
| 1    | `====`         | Card 1 created                                       | `cards[0]`                            |
| 2    | `What is 2+2?` | side[0] / variant[0] — body                          | `cards[0].question.text`              |
| 3    | `[&icon:...]`  | side[0] / variant[0] — tag `resource-icon` (jsonKey) | `cards[0].question.icon`              |
| 4    | `--`           | Advance to side[1]                                   | —                                     |
| 5    | `4`            | side[1] / variant[0] — body                          | `cards[0].answer.text`                |
| 6    | `++`           | Advance to side[1] / variant[1] (repeat)             | —                                     |
| 7    | `four`         | side[1] / variant[1] — body                          | `cards[0].alternativeAnswers[0].text` |

JSON output:

```json
{
  "cards": [
    {
      "question": { "text": "What is 2+2?", "icon": { "src": "https://img.io/q.svg" } },
      "answer": { "text": "4" },
      "alternativeAnswers": [{ "text": "four" }]
    }
  ]
}
```

---

## Schema Summary

| Node      | Key property      | What it resolves to                                                                        |
| --------- | ----------------- | ------------------------------------------------------------------------------------------ |
| `card`    | `jsonKey`         | Top-level JSON array (e.g., `cards`, `pairs`, `matrix`)                                    |
| `card`    | `sections`        | Qualified card divider routing — each section becomes its own card with distinct `jsonKey` |
| `side`    | `name` + position | Determines which JSON "section" within a card item                                         |
| `side`    | `jsonKey`         | Side-level path (e.g., `cells[{s}]`) — variant/tag paths are relative to it                |
| `side`    | `repeat: true`    | Dynamic number of sides (e.g., matrix columns)                                             |
| `variant` | `jsonKey`         | Specific JSON path for body text within the card item                                      |
| `variant` | `repeat: true`    | Dynamic number of variants (e.g., multiple values, alternative answers)                    |
| `variant` | `bodyForbidden`   | Variant has no body text — all content via tags                                            |
| tag       | `jsonKey`         | Override the default JSON key for this tag (supports full jsonKey mini-language)           |
| tag       | `^` prefix        | Root escape — writes to bit root instead of card item (used for heading cards)             |
| `section` | `sideJsonKey`     | Overrides side `jsonKey` for cards in this section (e.g., adding `\|set(title=true)`)      |
