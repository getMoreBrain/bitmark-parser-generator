# Card Configuration Schema

This document defines a schema for describing how bitmark card data maps to JSON output. The schema models the `card > side > variant` tree and attaches configuration parameters — most importantly `jsonKey` — to each node, fully describing the mappings documented in [CARD_MAPPING.md](CARD_MAPPING.md).

## Background

The existing card configs in `assets/config/cards/` define **parser input constraints** — what tags are allowed, their formats, and cardinality (see `assets/config/partials/` for shared tag groups like `standard-tags`, `standard-item-lead-instruction-hint`, `true-false`, `gap`, `resource-icon`). What they don't describe is the **JSON output mapping** — which side/variant maps to which JSON key. This document fills that gap using the same `card > side > variant` tree, but extended with `jsonKey` paths at each node.

---

## Tree Structure

Every bit type that uses cards has this hierarchy:

```
CardConfig
└── cards[]                          Array of card type definitions
    └── CardType
        ├── side[0]                       "question" side
        │   ├── variant[0]     ← V1 (S1V1)
        │   └── variant[1..]   ← S1V2+ (overflow via ++)
        ├── side[1]                       "answer" side
        │   ├── variant[0]     ← V2 (S2V1)
        │   └── variant[1..]   ← S2V2+ (overflow via ++)
        └── side[2..]                     additional sides (e.g., matrix columns)
            └── ...
```

- **CardType** — A named card type within `cards[]`. Most card sets have a single default entry. Multi-section cards (e.g., `table-extended`) have multiple entries — one per section (body, header, footer). Delimited by `====` (optionally qualified, e.g., `==== table-header ====`).
- **Side** — Delimited by `--`. A new side starts when `--` is encountered.
- **Variant** — Delimited by `++`. A new variant within the current side when `++` is encountered.

> The parser flattens sides and variants into a linear sequence (V1, V2, V3…). The `SxVx` notation describes the author's structural intent; the JSON output depends solely on the flattened position. See [Variant Notation](#variant-notation).

### Variant Notation

| Notation | Meaning | How reached |
|----------|---------|-------------|
| `S1V1` | Side 1, Variant 1 | First content in the card |
| `S2V1` | Side 2, Variant 1 | After the first `--` |
| `S2V2` | Side 2, Variant 2 | After `++` within side 2 |
| `S3V1` | Side 3, Variant 1 | After the second `--` |

**Flattened mapping:** `S1V1`→V1, `S2V1`→V2, `S2V2`→V3, `S3V1`→V4, etc.

The flattening means `--` and `++` produce identical JSON. An author using `--` where `++` was intended (or vice versa) gets the same output.

---

## Path Expressions

JSON paths use dot notation with array brackets. All paths on `side` and `variant` nodes are **relative to the card item** (i.e., relative to `card.jsonKey[N]`).

| Syntax | Meaning | Example |
|--------|---------|---------|
| `key` | Object property | `question` |
| `key.subkey` | Nested property | `question.text` |
| `key[]` | Array — append item | `alternativeAnswers[]` |
| `key[].subkey` | Array of objects — append | `alternativeAnswers[].text` |
| `{s}` | Repeating side offset (0-based) | `cells[{s}]` |
| `{v}` | Repeating variant offset (0-based) | `values[{v}]` |

**Special cases:**
- When `card.jsonKey` is `null`, variant paths are relative to the **bit root** (not a card item).
- When `card.itemType` is `"array"`, each side/variant creates an element in the card item (which is itself an array).

---

## Node Properties

### CardConfig

Top-level configuration object.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | yes | Configuration identifier (matches `assets/config/cards/*.jsonc` key) |
| `bits` | string[] | yes | Bit types that use this configuration |

### CardTypeNode

A card type entry within `cards[]`. Most card sets have a single default entry. Multi-section cards have one entry per section.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | yes | Identifier for this card type (e.g., `"default"`, `"table-header"`, `"table-footer"`). For qualified card dividers, the name matches the qualifier string. |
| `isDefault` | boolean | no | `true` for the unqualified `====` divider. Exactly one entry per card set should be default. Default: `false`. |
| `jsonKey` | string \| null | yes | JSON array key for card items (e.g., `cards`, `pairs`). `null` if the card doesn't create a sub-object. |
| `itemType` | `"object"` \| `"array"` | no | Shape of each card item. Default: `"object"`. Use `"array"` when each card is a row of cells. |
| `sides` | [SideNode](#sidenode)[] | yes | Ordered side definitions |
| `tags` | [TagMapping][] | no | Card-level tag-to-JSON mappings (apply to tags found anywhere in the card). Tag schema follows existing `assets/config/` conventions. May include group references (e.g., `{ group: standard-tags }`). |

### SideNode

A side definition within a card. Sides are separated by `--` in bitmark.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | yes | Human-readable label (e.g., `"question"`, `"key"`, `"cell"`) |
| `repeat` | boolean | no | If `true`, this side definition repeats for all remaining `--` dividers. Used for dynamic column/cell patterns. |
| `variants` | [VariantNode](#variantnode)[] | yes | Ordered variant definitions within this side. First entry is the default (V1 of this side). |
| `tags` | [TagMapping][] | no | Side-level tag-to-JSON mappings |

### VariantNode

A variant within a side. The first variant handles the side's initial content; subsequent variants handle `++` overflow.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `jsonKey` | string \| null | no | JSON path for body text, relative to card item. `null` if this variant has no body text (all content via tags). |
| `repeat` | boolean | no | If `true`, this variant repeats for all remaining `++` within the side. |
| `tags` | [TagMapping][] | no | Variant-level tag-to-JSON mappings |

### Heading Cards via `secondaryJsonKey`

Some card types use the **first card** as a heading row (e.g., column headers in match/matrix/table). Rather than a separate heading config, this is handled by a `secondaryJsonKey` property on the tag.

When a tag has `secondaryJsonKey`:

1. The **first card** becomes a heading card — it does not create an entry in the card array.
2. In that first card, the tag writes to `secondaryJsonKey` (relative to the **bit root**) instead of its normal `jsonKey`.
3. In **subsequent cards**, the tag uses its normal `jsonKey` (relative to the card item) as usual.
4. When `secondaryJsonKey` appears on a tag inside a side with `repeat: true`, the values form an array automatically.

> **Tag handling** (`key`, `jsonKey`, `format`, `min`, `max`, nested `tags`, group references) follows the existing schema defined in the card config files (`assets/config/cards/*.jsonc`) and shared partials (`assets/config/partials/`). This schema does not redefine tag properties — see those files for the tag definition format.

---

## Configurations

### flashcard

```yaml
name: flashcard
bits: [flashcard, q-and-a-card]

cards:
  - name: default
    isDefault: true
    jsonKey: cards
    tags:
      - { group: standard-tags }

    sides:
      - name: question
        variants:
          - jsonKey: question.text              # V1 (S1V1) body → cards[N].question.text
            tags:
              - { group: resource-icon, jsonKey: question.icon }

      - name: answer
        variants:
          - jsonKey: answer.text                # V2 (S2V1) body → cards[N].answer.text
            tags:
              - { group: resource-icon, jsonKey: answer.icon }
          - jsonKey: alternativeAnswers[].text   # V3+ (S2V2+) → cards[N].alternativeAnswers[M].text
            repeat: true
```

---

### definition-list

```yaml
name: definition-list
bits: [definition-list, figure, image-figure, legend, meta-search-default-terms]

cards:
  - name: default
    isDefault: true
    jsonKey: definitions           # or "descriptions" depending on bit type
    tags:
      - { group: standard-tags }

    sides:
      - name: term
        variants:
          - jsonKey: term.text                    # V1 (S1V1) body
            tags:
              - { group: resource-icon, jsonKey: term.icon }
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forKeys, type: bitmark-- }

      - name: definition
        variants:
          - jsonKey: definition.text              # V2 (S2V1) body
            tags:
              - { group: resource-icon, jsonKey: definition.icon }
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forValues, type: bitmark-- }
          - jsonKey: alternativeDefinitions[].text  # V3+ (S2V2+)
            repeat: true
```

---

### match-pairs

```yaml
name: match-pairs
bits: [match, match-reverse, match-all, match-all-reverse, match-solution-grouped]

cards:
  - name: default
    isDefault: true
    jsonKey: pairs
    tags:
      - { group: standard-tags }
      - { tag: "[@isCaseSensitive]", jsonKey: isCaseSensitive, type: boolean }

    sides:
      - name: key
        variants:
          - jsonKey: key                          # V1 (S1V1) body → pairs[N].key
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forKeys }
              - { resource: "[&audio]", jsonKey: keyAudio }
              - { resource: "[&image]", jsonKey: keyImage }

      - name: values
        repeat: true
        variants:
          - jsonKey: values[]                     # V2+ (S2V1+) → pairs[N].values[M]
            repeat: true
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forValues }
```

---

### match-audio-pairs

```yaml
name: match-audio-pairs
bits: [match-audio]

cards:
  - name: default
    isDefault: true
    jsonKey: pairs
    tags:
      - { group: standard-tags }

    sides:
      - name: key
        variants:
          - jsonKey: key
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forKeys }
              - { resource: "[&audio]", jsonKey: keyAudio }

      - name: values
        repeat: true
        variants:
          - jsonKey: values[]
            repeat: true
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forValues }
```

---

### match-image-pairs

```yaml
name: match-image-pairs
bits: [match-picture]

cards:
  - name: default
    isDefault: true
    jsonKey: pairs
    tags:
      - { group: standard-tags }

    sides:
      - name: key
        variants:
          - jsonKey: key
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forKeys }
              - { resource: "[&image]", jsonKey: keyImage }

      - name: values
        repeat: true
        variants:
          - jsonKey: values[]
            repeat: true
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forValues }
```

---

### match-matrix

```yaml
name: match-matrix
bits: [match-matrix]

cards:
  - name: default
    isDefault: true
    jsonKey: matrix
    tags:
      - { tag: "[@isCaseSensitive]", jsonKey: cells[{s}].isCaseSensitive, type: boolean }
      - { tag: "[@example]", jsonKey: cells[{s}].isExample, type: boolean }
      - { tag: "[@example:*]", jsonKey: cells[{s}].example }
      - { tag: "[!]", jsonKey: cells[{s}].instruction }

    sides:
      - name: key
        variants:
          - jsonKey: key                         # V1 (S1V1) body → matrix[N].key
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forKeys }

      - name: cell
        repeat: true                             # Repeats for all remaining -- dividers (columns)
        variants:
          - jsonKey: cells[{s}].values[]          # Each variant's body → matrix[N].cells[S].values[V]
            repeat: true                          # ++ within a cell adds more values
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forValues }
```

---

### statements

```yaml
name: statements
bits: [true-false, true-false-1]

cards:
  - name: default
    isDefault: true
    jsonKey: statements
    tags:
      - { group: standard-tags }

    sides:
      - name: statement
        variants:
          - jsonKey: statement
            tags:
              - { tag: "[+]", jsonKey: isCorrect, value: true }
              - { tag: "[-]", jsonKey: isCorrect, value: false }
```

> Note: The `[+...]` / `[-...]` tags both wrap the statement text AND set `isCorrect`. The body text (inside the tag) maps to `statement`; the `+`/`-` prefix maps to `isCorrect`.

---

### quiz

```yaml
name: quiz
bits: [multiple-choice, multiple-choice-text, multiple-response, multiple-response-text]

cards:
  - name: default
    isDefault: true
    jsonKey: quizzes
    tags:
      - { group: standard-tags }

    sides:
      - name: choices
        variants:
        - jsonKey: null                         # No body text — all content via inline choice tags
          tags:
            - tag: "[+]"
              jsonKey: choices[]
              creates: { array: choices, content: choice, sets: { isCorrect: true } }
            - tag: "[-]"
              jsonKey: choices[]
              creates: { array: choices, content: choice, sets: { isCorrect: false } }
```

---

### questions

```yaml
name: questions
bits: [interview]

cards:
  - name: default
    isDefault: true
    jsonKey: questions
    tags:
      - { group: standard-tags }

    sides:
      - name: question
        variants:
          - jsonKey: question
            tags:
              - { tag: "[$]", jsonKey: sampleSolution, type: bitmark-- }
              - { tag: "[@sampleSolution:*]", jsonKey: sampleSolution }
              - { tag: "[@additionalSolutions:*]", jsonKey: additionalSolutions[], repeatable: true }
              - { tag: "[@partialAnswer:*]", jsonKey: partialAnswer }
              - { tag: "[@reasonableNumOfChars:*]", jsonKey: reasonableNumOfChars, type: number }
```

---

### feedback

```yaml
name: feedback
bits: [feedback]

cards:
  - name: default
    isDefault: true
    jsonKey: feedbacks

    sides:
      - name: choices
        variants:
          - jsonKey: null                          # No body text on side 1
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forKeys }
              - { tag: "[!]", jsonKey: instruction }
              - { tag: "[%]", jsonKey: item }
              - tag: "[+]"
                jsonKey: choices[]
                creates: { array: choices, content: choice, sets: { isCorrect: true } }
              - tag: "[-]"
                jsonKey: choices[]
                creates: { array: choices, content: choice, sets: { isCorrect: false } }
              # [@requireReason] is a modifier on the preceding [+]/[-] tag:
              # it sets requireReason: true on the most recently created choice.

      - name: reason
        variants:
          - jsonKey: reason.text                    # V2 (S2V1) body → feedbacks[N].reason.text
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: heading.forValues }
              - { tag: "[!]", jsonKey: reason.instruction }
              - { tag: "[@reasonableNumOfChars:*]", jsonKey: reason.reasonableNumOfChars, type: number }
```

---

### bot-action-responses

```yaml
name: bot-action-responses
bits: [bot-action-response]

cards:
  - name: default
    isDefault: true
    jsonKey: responses
    tags:
      - { tag: "[%]", jsonKey: item }
      - { tag: "[!]", jsonKey: response }         # [!] maps to "response" (the user-facing label), not "instruction"
      - { tag: "[@reaction:*]", jsonKey: reaction }

    sides:
      - name: response
        variants:
          - jsonKey: feedback                     # V1 body → responses[N].feedback
```

> Note: `[!]` is repurposed here — it maps to `response` (not `instruction`).

---

### cloze-list

```yaml
name: cloze-list
bits: [cloze-list]

cards:
  - name: default
    isDefault: true
    jsonKey: listItems
    tags:
      - { group: standard-tags }

    sides:
      - name: content
        variants:
          - jsonKey: body                         # V1 body → listItems[N].body (contains gap/cloze markup)
```

---

### elements

```yaml
name: elements
bits: [sequence]

cards:
  - name: default
    isDefault: true
    jsonKey: null                                 # Card doesn't create a sub-object

    sides:
      - name: element
        repeat: true                              # Each -- creates the next element
        variants:
          - jsonKey: elements[]                   # Body → elements[V] at the bit level
            repeat: true                          # ++ also appends to elements[]
```

> Note: `jsonKey: null` means variant paths are relative to the bit root. Each variant appends to a flat `elements[]` array.

---

### table

```yaml
name: table
bits: [table]

cards:
  - name: default
    isDefault: true
    jsonKey: table.data
    itemType: array                               # Each card = table.data[N] (a row array of strings)

    sides:
      - name: cell
        repeat: true
        variants:
          - jsonKey: null                         # Body text appended as scalar string element in the row array
            tags:
              - { tag: "[#]", jsonKey: title, secondaryJsonKey: table.columns[] }
```

> Note: `itemType: array` means each card item is a flat array. Each variant's body text is pushed into that array as a string. In the heading card (first card), the `[#]` tag's `secondaryJsonKey` writes to `table.columns[]` at the bit root.

---

### table-extended

```yaml
name: table-extended
bits: [table-extended]

cards:
  - name: default
    isDefault: true
    jsonKey: tableExtended.body.rows

    sides:
      - name: cell
        repeat: true
        variants:
          - jsonKey: content                      # Cell body → rows[N].cells[{s}].content
            tags:
              - { tag: "[@tableCellType:th]", jsonKey: title, value: true }
              - { tag: "[@tableRowSpan:*]", jsonKey: rowspan, type: number }
              - { tag: "[@tableColSpan:*]", jsonKey: colspan, type: number }
              - { tag: "[@tableScope:*]", jsonKey: scope }

  - name: table-header
    jsonKey: tableExtended.header.rows

    sides:
      - name: cell
        repeat: true
        variants:
          - jsonKey: content
            tags:
              - { tag: "[@tableCellType:th]", jsonKey: title, value: true }
              - { tag: "[@tableRowSpan:*]", jsonKey: rowspan, type: number }
              - { tag: "[@tableColSpan:*]", jsonKey: colspan, type: number }
              - { tag: "[@tableScope:*]", jsonKey: scope }

  - name: table-footer
    jsonKey: tableExtended.footer.rows

    sides:
      - name: cell
        repeat: true
        variants:
          - jsonKey: content
            tags:
              - { tag: "[@tableCellType:th]", jsonKey: title, value: true }
              - { tag: "[@tableRowSpan:*]", jsonKey: rowspan, type: number }
              - { tag: "[@tableColSpan:*]", jsonKey: colspan, type: number }
              - { tag: "[@tableScope:*]", jsonKey: scope }
```

> Note: The qualified card divider (e.g., `==== table-header ====`) selects the matching card type by `name`. Each card type has its own `jsonKey` and independent `sides`. Within each row, variant tag paths are relative to the cell object `rows[N].cells[{s}]`.

---

### pronunciation-table

```yaml
name: pronunciation-table
bits: [pronunciation-table]

cards:
  - name: default
    isDefault: true
    jsonKey: pronunciationTable.data
    itemType: array                               # Each card = data[N] (a row array of cell objects)

    sides:
      - name: cell
        repeat: true
        variants:
          - jsonKey: body                         # Cell body → data[N][{s}].body
            tags:
              - { tag: "[#]", jsonKey: title }     # [#title] → data[N][{s}].title
              - { resource: "[&audio]", jsonKey: audio }  # [&audio:...] → data[N][{s}].audio
```

> Note: `itemType: array` — each card is a row (array). Each side creates a cell object within that array. Paths on the variant/tags are relative to the cell object.

---

### ingredients

```yaml
name: ingredients
bits: [cook-ingredients]

cards:
  - name: default
    isDefault: true
    jsonKey: ingredients
    tags:
      - { tag: "[#]", jsonKey: title, type: bitmark-- }
      - { tag: "[!]", jsonKey: quantity, type: number }       # [!] repurposed: maps to quantity, not instruction
      - { tag: "[+]", jsonKey: checked, value: true }
      - { tag: "[-]", jsonKey: checked, value: false }
      - { tag: "[@unit:*]", jsonKey: unit }
      - { tag: "[@unitAbbr:*]", jsonKey: unitAbbr }
      - { tag: "[@decimalPlaces:*]", jsonKey: decimalPlaces, type: number }
      - { tag: "[@disableCalculation]", jsonKey: disableCalculation, value: true, type: boolean }

    sides:
      - name: ingredient
        variants:
          - jsonKey: ingredient                    # V1 body → ingredients[N].ingredient
```

> Note: `[!]` maps to `quantity` (not `instruction`), and `[+]`/`[-]` map to `checked` (not choices).

---

### book-reference-list

```yaml
name: book-reference-list
bits: [book-reference-list]

cards:
  - name: default
    isDefault: true
    jsonKey: bookReferences
    tags:
      - { tag: "[@refAuthor:*]", jsonKey: refAuthor[], repeatable: true }
      - { tag: "[@refBookTitle:*]", jsonKey: refBookTitle }
      - { tag: "[@refPublisher:*]", jsonKey: refPublisher[], repeatable: true }
      - { tag: "[@refPublicationYear:*]", jsonKey: refPublicationYear }
      - { tag: "[@citationStyle:*]", jsonKey: citationStyle }
      - { tag: "[@lang:*]", jsonKey: lang }

    sides:
      - name: reference
        variants:
          - jsonKey: null                          # No body text — all data via property tags
```

---

### example-bit-list

```yaml
name: example-bit-list
bits: [example-list, page-footer]

cards:
  - name: default
    isDefault: true
    jsonKey: listItems
    tags:
      - { group: standard-tags }
      - { tag: "[#]", jsonKey: title, type: bitmark-- }

    sides:
      - name: item
        variants:
          - jsonKey: body                          # V1 body → listItems[N].body
```

---

## Reading the Schema — Worked Example

Given the `flashcard` configuration:

```yaml
cards:
  - name: default
    isDefault: true
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

| Step | Bitmark | Node | Resolved JSON path |
|------|---------|------|--------------------|
| 1 | `====` | Card 1 created | `cards[0]` |
| 2 | `What is 2+2?` | side[0] / variant[0] — body | `cards[0].question.text` |
| 3 | `[&icon:...]` | side[0] / variant[0] — tag `resource-icon` (jsonKey) | `cards[0].question.icon` |
| 4 | `--` | Advance to side[1] | — |
| 5 | `4` | side[1] / variant[0] — body | `cards[0].answer.text` |
| 6 | `++` | Advance to side[1] / variant[1] (repeat) | — |
| 7 | `four` | side[1] / variant[1] — body | `cards[0].alternativeAnswers[0].text` |

JSON output:

```json
{
  "cards": [{
    "question": { "text": "What is 2+2?", "icon": { "src": "https://img.io/q.svg" } },
    "answer": { "text": "4" },
    "alternativeAnswers": [{ "text": "four" }]
  }]
}
```

---

## Schema Summary

| Node | Key property | What it resolves to |
|------|-------------|---------------------|
| `cards[]` | `name` | Identifies the card type (e.g., `"default"`, `"table-header"`). Qualified `====` dividers select by name. |
| `cards[]` | `isDefault` | Marks the unqualified `====` card type. |
| `cards[]` | `jsonKey` | Top-level JSON array (e.g., `cards`, `pairs`, `matrix`) |
| `side` | `name` + position | Determines which JSON "section" within a card item |
| `variant` | `jsonKey` | Specific JSON path for body text within the card item |
| `variant` / `side` / `cards[]` | `tags[]` | Tag-to-JSON mappings with optional `jsonKey` overrides (inherited: card type → side → variant) |
| tag | `jsonKey` | Override the default JSON key for this tag (e.g., resource → custom path) |
| tag | `secondaryJsonKey` | In the first card, writes to this bit-root path instead of normal `jsonKey` |
| `side` | `repeat: true` | Dynamic number of sides (e.g., matrix columns) |
| `variant` | `repeat: true` | Dynamic number of variants (e.g., multiple values, alternative answers) |
