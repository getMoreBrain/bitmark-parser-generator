# Bitmark Card Data Mapping

This document describes how card data in bitmark markup maps to JSON for each bit type that uses cards.

## Key Concepts

### Dividers

Cards are delimited by block-level dividers:

| Symbol | Name | Usage |
|--------|------|-------|
| `====` | Card divider | Separates individual cards |
| `--` | Side divider | Advances to the **next side** within a card |
| `++` | Variant divider | Adds another **variant within the current side** |

> **Important:** Although bitmark distinguishes between "sides" (`--`) and "variants within a side" (`++`), the parser **flattens both into a single linear sequence** in JSON. Only the variant position (V1, V2, V3…) matters for the JSON output. End-user mistakes using `--` where `++` was intended (or vice versa) produce identical JSON.

### Variant Notation

In the mappings below:

- **SxVx** — The human (bitmark) position. `S1V1` = first variant of side 1; `S2V1` = first variant of side 2 (reached via `--`); `S2V2` = second variant within side 2 (reached via `++` inside side 2).
- **Vx** — The flattened (JSON) variant index. V1 is the first variant overall, V2 the second, and so on — regardless of which side it belongs to. `S1V1`=V1, `S2V1`=V2, `S2V2`=V3, etc.
- **Card N** — Refers to the Nth card, separated by `====`.

### Qualified Card Dividers

Some bits use a named qualifier on the card divider:

```
==== table-header ====
```

This produces a special section in the output (e.g., `table-extended` header/body/footer sections).

---

## [.flashcard], [.q-and-a-card]

**Card config:** `flashcard`
**Bits using this card:** `flashcard`, `q-and-a-card`
**Card divider:** `====`
**Variant dividers within card:** `--` / `++`

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N (delimited by `====`) | `cards[N-1]` |
| V1 (S1V1) body | `cards[N-1].question.text` |
| V1 `[&icon:...]` resource | `cards[N-1].question.icon` |
| V2 (S2V1) body — first `--` | `cards[N-1].answer.text` |
| V2 `[&icon:...]` resource | `cards[N-1].answer.icon` |
| V3+ (S2V2+) body — additional `--` / `++` | `cards[N-1].alternativeAnswers[].text` |
| `[%...]` item tag on any V | `cards[N-1].item` |
| `[?...]` hint tag on any V | `cards[N-1].hint` |
| `[!...]` instruction tag on any V | `cards[N-1].instruction` |
| `[@example]` / `[@example:value]` | `cards[N-1].isExample` / `cards[N-1].example` |

### Example

```
[.flashcard]

Body text
====
Question 1?
[&icon:https://image.io/question1.svg]
--
Answer 1
++
Alternative Answer 2
====
Question 2?
--
Answer 2
====
```

```json
{
  "body": "Body text",
  "cards": [
    {
      "question": { "text": "Question 1?", "icon": { ... } },
      "answer": { "text": "Answer 1" },
      "alternativeAnswers": [{ "text": "Alternative Answer 2" }]
    },
    {
      "question": { "text": "Question 2?" },
      "answer": { "text": "Answer 2" },
      "alternativeAnswers": []
    }
  ]
}
```

---

## [.definition-list]

**Card config:** `definition-list`
**Bits using this card:** `definition-list`, `figure`, `image-figure`, `legend`, `meta-search-default-terms`
**Card divider:** `====`
**Variant dividers within card:** `--` / `++`

Card content maps to `definitions[]` (for `definition-list`) or `descriptions[]` depending on the bit type. The structure mirrors `flashcard` but uses term/definition semantics.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N (delimited by `====`) | `definitions[N-1]` (or `descriptions[N-1]`) |
| V1 (S1V1) body | `definitions[N-1].term.text` |
| V1 `[&icon:...]` resource | `definitions[N-1].term.icon` |
| V2 (S2V1) body — first `--` | `definitions[N-1].definition.text` |
| V2 `[&icon:...]` resource | `definitions[N-1].definition.icon` |
| V3+ (S2V2+) body — additional `--` / `++` | `definitions[N-1].alternativeDefinitions[].text` |
| `[%...]` item tag | `definitions[N-1].item` |
| `[?...]` hint tag | `definitions[N-1].hint` |
| `[!...]` instruction tag | `definitions[N-1].instruction` |
| `[@example]` / `[@example:value]` | `definitions[N-1].isExample` / `definitions[N-1].example` |
| `[#title]` title tag on V1 | `definitions[N-1].title` (heading title for the term) |
| First `====` card (heading card) | `heading.forKeys` (V1 `[#...]`) / `heading.forValues` (V2 `[#...]`) |

### Example

```
[.definition-list]

Somebody
====
[#title 1]
--
[#title 2]
====
Term 1?
Card 1, Side 1
[&icon:https://image.io/term1.svg]
--
Definition 1
Card 1, Side 2
====
```

```json
{
  "heading": { "forKeys": "title 1", "forValues": "title 2" },
  "definitions": [
    {
      "term": { "text": "Term 1?\nCard 1, Side 1", "icon": { ... } },
      "definition": { "text": "Definition 1\nCard 1, Side 2" },
      "alternativeDefinitions": []
    }
  ]
}
```

---

## [.match], [.match-reverse], [.match-all], [.match-all-reverse], [.match-solution-grouped]

**Card config:** `match-pairs`
**Bits using this card:** `match`
**Card divider:** `====`
**Variant dividers within card:** `--` / `++`

The first `====` block is treated as the **heading card**.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| First card — V1 (S1V1) `[#...]` tag | `heading.forKeys` |
| First card — V2 (S2V1) `[#...]` tag (after `--`) | `heading.forValues` (string if one, array if multiple `--`) |
| Card N (N>1) — V1 (S1V1) body | `pairs[N-2].key` (plain string, bitmark-- format) |
| Card N (N>1) — V1 `[&audio:...]` | `pairs[N-2].keyAudio` |
| Card N (N>1) — V1 `[&image:...]` | `pairs[N-2].keyImage` |
| Card N (N>1) — V2+ (S2V1+) body (each `--` / `++`) | `pairs[N-2].values[]` (array of plain strings) |
| `[%...]` item tag | `pairs[N-2].item` |
| `[!...]` instruction tag | `pairs[N-2].instruction` |
| `[@isCaseSensitive:...]` | `pairs[N-2].isCaseSensitive` |
| `[@example]` / `[@example:value]` | `pairs[N-2].isExample` / `pairs[N-2].example` |

### Example

```
[.match]
====
[#Year]
--
[#CHF]
====
[%1.]
2008
--
- 150'000.00
====
2009
--
- 70'000.00
--
- 80'000.00
====
```

```json
{
  "heading": { "forKeys": "Year", "forValues": "CHF" },
  "pairs": [
    { "key": "2008", "item": "1.", "values": ["- 150'000.00"] },
    { "key": "2009", "values": ["- 70'000.00", "- 80'000.00"] }
  ]
}
```

---

## [.match-audio]

**Card config:** `match-audio-pairs`
**Bits using this card:** `match-audio`
**Card divider:** `====`
**Variant dividers within card:** `--` / `++`

Same structure as `match-pairs` but the key side carries an audio resource.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N — V1 `[&audio:...]` resource | `pairs[N-2].keyAudio` |
| Card N — V1 body text | `pairs[N-2].key` |
| Card N — V2+ body (each `--`) | `pairs[N-2].values[]` |

### Example

```
[.match-audio]
====
[#Audio]
--
[#Answer]
====
[&audio:https://cdn.example.com/cat.mp3]
--
cat
====
```

```json
{
  "heading": { "forKeys": "Audio", "forValues": "Answer" },
  "pairs": [
    { "keyAudio": { ... }, "values": ["cat"] }
  ]
}
```

---

## [.match-picture]

**Card config:** `match-image-pairs`
**Bits using this card:** `match-picture`
**Card divider:** `====`
**Variant dividers within card:** `--` / `++`

Same structure as `match-pairs` but the key side carries an image resource.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N — V1 `[&image:...]` / `\|image:...\|` resource | `pairs[N-2].keyImage` |
| Card N — V1 body text | `pairs[N-2].key` |
| Card N — V2+ body (each `--`) | `pairs[N-2].values[]` |

### Example

```
[.match-picture]
====
[&image:https://example.com/cat.png]
--
cat
====
```

```json
{
  "pairs": [
    { "keyImage": { ... }, "values": ["cat"] }
  ]
}
```

---

## [.match-matrix]

**Card config:** `match-matrix`
**Bits using this card:** `match-matrix`
**Card divider:** `====`
**Variant dividers within card:** `--` / `++`

The matrix extends the `match-pairs` pattern to support multiple value columns. The heading card defines column headers and each subsequent card defines a key row with multiple cells.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| First card — V1 (S1V1) `[#...]` | `heading.forKeys` |
| First card — V2 (S2V1) `[#...]` (first `--`) | `heading.forValues[0]` |
| First card — V3 (S3V1) `[#...]` (second `--`) | `heading.forValues[1]` |
| First card — Vn (SnV1) `[#...]` | `heading.forValues[N-2]` |
| Card N — V1 (S1V1) body | `matrix[N-2].key` |
| Card N — V2 (S2V1) body (first `--`) | `matrix[N-2].cells[0].values[]` |
| Card N — V3 (S3V1) body (second `--`) | `matrix[N-2].cells[1].values[]` |
| Card N — Vn (SnV1) body | `matrix[N-2].cells[N-2].values[]` |
| Additional `++` within a side block | Additional value in `cells[x].values[]` (S_nV2+) |
| `[@isCaseSensitive:...]` on a cell | `matrix[N-2].cells[x].isCaseSensitive` |
| `[@example]` on a cell | `matrix[N-2].cells[x].isExample` / `.example` |
| `[!...]` on a cell | `matrix[N-2].cells[x].instruction` |

### Example

```
[.match-matrix]
====
[#Verb]
--
[#Future, 1st Person, Singular]
--
[#Past, 3rd Person, Plural]
====
gehen
--
ich werde gehen[@example]
--
sie gingen
====
```

```json
{
  "heading": {
    "forKeys": "Verb",
    "forValues": ["Future, 1st Person, Singular", "Past, 3rd Person, Plural"]
  },
  "matrix": [
    {
      "key": "gehen",
      "cells": [
        { "values": ["ich werde gehen"], "isExample": true },
        { "values": ["sie gingen"] }
      ]
    }
  ]
}
```

---

## [.true-false], [.true-false-1]

**Card config:** `statements`
**Bits using this card:** `true-false`
**Card divider:** `====`
**Variant dividers within card:** N/A (single variant per card)

Each card contains a single statement. The correctness is indicated by `[+...]` (true) or `[-...]` (false) tags applied to the card body.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N (single variant) | `statements[N-1]` |
| V1 body (without `+`/`-` prefix) | `statements[N-1].statement` |
| `[+...]` prefix on statement | `statements[N-1].isCorrect = true` |
| `[-...]` prefix on statement | `statements[N-1].isCorrect = false` |
| `[%...]` item tag | `statements[N-1].item` |
| `[?...]` hint tag | `statements[N-1].hint` |
| `[!...]` instruction tag | `statements[N-1].instruction` |
| `[@example]` / `[@example:value]` | `statements[N-1].isExample` / `statements[N-1].example` |

### Example

```
[.true-false]
[@labelTrue:rather yes][@labelFalse:rather no]
====
[+A house is bigger than a car.]
====
[-A cow is bigger than a dog.]
====
```

```json
{
  "labelTrue": "rather yes",
  "labelFalse": "rather no",
  "statements": [
    { "statement": "A house is bigger than a car.", "isCorrect": true },
    { "statement": "A cow is bigger than a dog.",  "isCorrect": false }
  ]
}
```

---

## [.multiple-choice], [.multiple-choice-text], [.multiple-response], [.multiple-response-text], and variants

**Card config:** `quiz`
**Bits using this card:** `multiple-choice`, `multiple-response`
**Card divider:** `====`
**Variant dividers within card:** N/A (single variant per card — choices are inline tags)

Each card is one quiz item. Choices are embedded as `[+correct]` / `[-wrong]` inline tags within the single variant.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N | `quizzes[N-1]` |
| V1 `[!...]` instruction tag | `quizzes[N-1].instruction` |
| V1 `[%...]` item tag | `quizzes[N-1].item` |
| V1 `[?...]` hint tag | `quizzes[N-1].hint` |
| V1 `[+choice text]` inline tag | `quizzes[N-1].choices[].choice` with `isCorrect: true` |
| V1 `[-choice text]` inline tag | `quizzes[N-1].choices[].choice` with `isCorrect: false` |
| V1 `[@reaction:...]` on choice | `quizzes[N-1].responses[].reaction` (for multiple-response) |
| `[@example]` | `quizzes[N-1].isExample` |

### Example

```
[.multiple-choice]
====
[!Which animal says "meow"?]
[-dog]
[-fish]
[+cat]
====
```

```json
{
  "quizzes": [
    {
      "instruction": "Which animal says \"meow\"?",
      "choices": [
        { "choice": "dog",  "isCorrect": false },
        { "choice": "fish", "isCorrect": false },
        { "choice": "cat",  "isCorrect": true }
      ]
    }
  ]
}
```

---

## [.interview], and variants

**Card config:** `questions`
**Bits using this card:** `interview`
**Card divider:** `====`
**Variant dividers within card:** N/A (single variant per card)

Each card is one open-ended question. The question body is the card body; the sample solution and other metadata come from per-card property tags.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N | `questions[N-1]` |
| V1 body | `questions[N-1].question` |
| V1 `[$...]` sample solution tag | `questions[N-1].sampleSolution` |
| V1 `[@sampleSolution:...]` | `questions[N-1].sampleSolution` |
| V1 `[@additionalSolutions:...]` (repeatable) | `questions[N-1].additionalSolutions[]` |
| V1 `[@partialAnswer:...]` | `questions[N-1].partialAnswer` |
| V1 `[@reasonableNumOfChars:N]` | `questions[N-1].reasonableNumOfChars` |
| V1 `[%...]` item tag | `questions[N-1].item` |
| V1 `[?...]` hint tag | `questions[N-1].hint` |
| V1 `[!...]` instruction tag | `questions[N-1].instruction` |
| V1 `[@example]` / `[@example:value]` | `questions[N-1].isExample` / `questions[N-1].example` |

### Example

```
[.interview]
[!Explain the concept of tax shifting.]
====
[$Tax shifting is the transfer of the tax payment burden from the taxpayer to the tax bearer.]
[@reasonableNumOfChars:101]
====
```

```json
{
  "instruction": "Explain the concept of tax shifting.",
  "questions": [
    {
      "question": [],
      "sampleSolution": "Tax shifting is the transfer of the tax payment burden from the taxpayer to the tax bearer.",
      "reasonableNumOfChars": 101
    }
  ]
}
```

---

## [.feedback], and variants

**Card config:** `feedback`
**Bits using this card:** `feedback`
**Card divider:** `====`
**Variant dividers within card:** `--` / `++` (separates the choices side from the reason/text side)

The feedback card has **two sides**. V1 contains the choice options (true/false style with `[+...]` / `[-...]`). V2 (after `--`) contains the open-text reason.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| First card (heading) | `heading` — V1 `[#...]` → `heading.forKeys`, V2 `[#...]` → `heading.forValues` |
| Card N | `feedbacks[N-1]` (or `N-2` if heading card used) |
| V1 (S1V1) `[!...]` instruction | `feedbacks[N-1].instruction` |
| V1 `[%...]` item | `feedbacks[N-1].item` |
| V1 `[+choice]` inline tag | `feedbacks[N-1].choices[].choice` with `requireReason: true`/`false` |
| V1 `[-choice]` inline tag | `feedbacks[N-1].choices[].choice` |
| V2 (S2V1) body — after `--` | `feedbacks[N-1].reason.text` |
| V2 `[@reasonableNumOfChars:N]` | `feedbacks[N-1].reason.reasonableNumOfChars` |
| V2 `[!...]` instruction | `feedbacks[N-1].reason.instruction` |

### Example

```
[.feedback]
====
[#Category]
--
[#Reason]
====
[%1.]
[!I PREFER …]
[+Beer][@requireReason]
[-Wine]
--
[!Why?]
[@reasonableNumOfChars:100]
Please answer in keywords
====
```

```json
{
  "heading": { "forKeys": "Category", "forValues": "Reason" },
  "feedbacks": [
    {
      "item": "1.",
      "instruction": "I PREFER …",
      "choices": [
        { "choice": "Beer", "requireReason": true },
        { "choice": "Wine", "requireReason": false }
      ],
      "reason": {
        "text": "Please answer in keywords",
        "instruction": "Why?",
        "reasonableNumOfChars": 100
      }
    }
  ]
}
```

---

## [.bot-action-response], and variants

**Card config:** `bot-action-responses`
**Bits using this card:** `bot-action-response`
**Card divider:** `====`
**Variant dividers within card:** N/A (single variant per card)

Each card is one bot response choice. The card body is the feedback text shown after the user picks that response.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N | `responses[N-1]` |
| V1 `[!...]` instruction tag | `responses[N-1].response` (the user-facing label for the choice) |
| V1 `[@reaction:...]` | `responses[N-1].reaction` |
| V1 body | `responses[N-1].feedback` |
| V1 `[%...]` item | `responses[N-1].item` |

### Example

```
[.bot-action-response]
[!What did you know?]

Body paragraph.
====
[%A]
[!Yes, I knew that]
[@reaction:celebrate]
👍 Cool!
====
[%B]
[!I didn't know]
[@reaction:like]
😅
====
```

```json
{
  "instruction": "What did you know?",
  "body": "Body paragraph.",
  "responses": [
    { "item": "A", "response": "Yes, I knew that", "reaction": "celebrate", "feedback": "👍 Cool!" },
    { "item": "B", "response": "I didn't know",    "reaction": "like",      "feedback": "😅" }
  ]
}
```

---

## [.cloze-list]

**Card config:** `cloze-list`
**Bits using this card:** `cloze-list`
**Card divider:** `====`
**Variant dividers within card:** N/A (single variant per card — body contains gap/cloze markup)

Each card is one list item containing a cloze-style body with `[_gap]` placeholders.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N | `listItems[N-1]` |
| V1 body (with `[_gap]` placeholders) | `listItems[N-1].body` |
| V1 `[%...]` item tag | `listItems[N-1].item` |
| V1 `[?...]` hint tag | `listItems[N-1].hint` |
| V1 `[!...]` instruction tag | `listItems[N-1].instruction` |

### Example

```
[.cloze-list]
[!Instruction]

Some body
====
[%1.] This is a [_gap] text with another [_cloze][?hint].
====
[%2.] This is another [_gap] text.
====
```

```json
{
  "instruction": "Instruction",
  "body": "Some body",
  "listItems": [
    { "item": "1.", "body": ["This is a ", { "type": "gap", "solutions": ["gap"] }, " text..."] },
    { "item": "2.", "body": ["This is another ", { "type": "gap", "solutions": ["gap"] }, " text."] }
  ]
}
```

---

## [.sequence]

**Card config:** `elements`
**Bits using this card:** `sequence`
**Card divider:** `====`
**Variant dividers within card:** `--` / `++`

Each card contains a sequence of ordered elements. The variants within a card become the individual elements.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N | One sequence entry — `elements[]` |
| V1 body | `elements[0]` |
| V2 body (after `--` / `++`) | `elements[1]` |
| Vn body | `elements[N-1]` |

### Example

```
[.sequence]
====
Ein Elefant
--
ist
--
grösser als
--
eine Maus.
====
```

```json
{
  "elements": ["Ein Elefant", "ist", "grösser als", "eine Maus."]
}
```

---

## [.table]

**Card config:** `table`
**Bits using this card:** `table`
**Card divider:** `====`
**Variant dividers within card:** `--` (separates columns)

The first `====…====` block defines the column headers. Each subsequent block is a data row. Within each block, `--` separates the cells.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| First card — V1, V2… (separated by `--`) | `table.columns[0]`, `table.columns[1]`, … |
| Card N (N>1) — V1, V2… (separated by `--`) | `table.data[N-2][0]`, `table.data[N-2][1]`, … |

### Example

```
[.table]
====
[#Name]
--
[#Email]
--
[#Phone]
====
John
--
john@example.com
--
(353) 01 222 3333
====
```

```json
{
  "table": {
    "columns": ["Name", "Email", "Phone"],
    "data": [
      ["John", "john@example.com", "(353) 01 222 3333"]
    ]
  }
}
```

---

## [.table-extended]

**Card config:** `table-extended`
**Bits using this card:** `table-extended`
**Card divider:** `====` (optionally with qualifier: `==== table-header ====`)
**Variant dividers within card:** `--` (separates cells within a row)

Supports full HTML-table-like semantics including rowspan, colspan, header/body/footer sections, and cell scoping.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| `==== table-header ====` block | `tableExtended.header.rows[]` (each such block is a row) |
| `====` block (body row) | `tableExtended.body.rows[]` |
| `==== table-footer ====` block | `tableExtended.footer.rows[]` |
| Cell (delimited by `--`) | `.rows[N].cells[M]` |
| Cell body | `.rows[N].cells[M].content` |
| `[@tableCellType:th]` on cell | `.rows[N].cells[M].title = true` |
| `[@tableRowSpan:N]` on cell | `.rows[N].cells[M].rowspan` |
| `[@tableColSpan:N]` on cell | `.rows[N].cells[M].colspan` |
| `[@tableScope:col\|row\|colgroup\|rowgroup]` | `.rows[N].cells[M].scope` |

### Example

```
[.table-extended]
==== table-header ====
[@tableScope:col]
Region
--
[@tableScope:col]
Area
====
West
--
Coastal
====
```

```json
{
  "tableExtended": {
    "header": {
      "rows": [
        { "cells": [
            { "content": "Region", "scope": "col" },
            { "content": "Area",   "scope": "col" }
          ]
        }
      ]
    },
    "body": {
      "rows": [
        { "cells": [
            { "content": "West" },
            { "content": "Coastal" }
          ]
        }
      ]
    }
  }
}
```

---

## [.pronunciation-table]

**Card config:** `pronunciation-table`
**Bits using this card:** `pronunciation-table`
**Card divider:** `====`
**Variant dividers within card:** `--` (separates cells across columns)

Each `====` block is a row. Within a row, `--` separates the cells. Each cell has a title (`[#...]`), a body (text), and optionally an audio resource.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N | `pronunciationTable.data[N-1][]` (a row of cells) |
| Cell (delimited by `--` within a card) | `pronunciationTable.data[N-1][M]` |
| Cell `[#title]` tag | `pronunciationTable.data[N-1][M].title` |
| Cell body text | `pronunciationTable.data[N-1][M].body` |
| Cell `[&audio:...]` resource | `pronunciationTable.data[N-1][M].audio` |

### Example

```
[.pronunciation-table]
[!Diphthongs]
====
[#ɪə]
**ea**r
[&audio:https://pronunciation.ef.com/uk-phoneme.mp3]
--
[#eɪ]
c**a**ke
[&audio:https://pronunciation.ef.com/uk-phoneme2.mp3]
====
```

```json
{
  "pronunciationTable": {
    "data": [
      [
        { "title": "ɪə", "body": "**ea**r", "audio": { ... } },
        { "title": "eɪ", "body": "c**a**ke",  "audio": { ... } }
      ]
    ]
  }
}
```

---

## [.cook-ingredients]

**Card config:** `ingredients`
**Bits using this card:** `cook-ingredients`
**Card divider:** `====`
**Variant dividers within card:** N/A (single variant per card)

Each card is one ingredient entry. Quantity, unit, and other metadata come from property tags within the card variant. A `[#title]` tag (with no quantity) marks a title/section header ingredient.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N | `ingredients[N-1]` |
| V1 `[#title]` tag | `ingredients[N-1].title` |
| V1 `[!quantity]` instruction tag | `ingredients[N-1].quantity` |
| V1 body text | `ingredients[N-1].ingredient` |
| V1 `[+]` prefix | `ingredients[N-1].checked = true` |
| V1 `[-]` prefix | `ingredients[N-1].checked = false` |
| V1 `[@unit:...]` | `ingredients[N-1].unit` |
| V1 `[@unitAbbr:...]` | `ingredients[N-1].unitAbbr` |
| V1 `[@decimalPlaces:N]` | `ingredients[N-1].decimalPlaces` |
| V1 `[@disableCalculation]` | `ingredients[N-1].disableCalculation = true` |

### Example

```
[.cook-ingredients]
====
[#Section Title]
====
[+][!2][@unit:Litre][@unitAbbr:L] Chicken stock
====
[-][!300][@unit:grams][@unitAbbr:g] Tomatoes
====
```

```json
{
  "ingredients": [
    { "title": "Section Title" },
    { "checked": true,  "quantity": 2,   "unit": "Litre",  "unitAbbr": "L", "ingredient": "Chicken stock" },
    { "checked": false, "quantity": 300, "unit": "grams",  "unitAbbr": "g", "ingredient": "Tomatoes" }
  ]
}
```

---

## [.book-reference-list]

**Card config:** `book-reference-list`
**Bits using this card:** `book-reference-list`
**Card divider:** `====`
**Variant dividers within card:** N/A (single variant per card — all data via property tags)

Each card is one book reference entry, defined entirely via property tags. No body text is used.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N | `bookReferences[N-1]` |
| V1 `[@refAuthor:...]` (repeatable) | `bookReferences[N-1].refAuthor[]` |
| V1 `[@refBookTitle:...]` | `bookReferences[N-1].refBookTitle` |
| V1 `[@refPublisher:...]` (repeatable) | `bookReferences[N-1].refPublisher[]` |
| V1 `[@refPublicationYear:...]` | `bookReferences[N-1].refPublicationYear` |
| V1 `[@citationStyle:...]` | `bookReferences[N-1].citationStyle` |
| V1 `[@lang:...]` | `bookReferences[N-1].lang` |

### Example

```
[.book-reference-list]
====
[@refAuthor:Philippe Pointet]
[@refBookTitle:The Content-First Standard "bitmark"]
[@refPublisher:kpmg]
[@refPublicationYear:2025]
[@citationStyle:APA]
====
```

```json
{
  "bookReferences": [
    {
      "refAuthor":          ["Philippe Pointet"],
      "refBookTitle":       "The Content-First Standard \"bitmark\"",
      "refPublisher":       ["kpmg"],
      "refPublicationYear": "2025",
      "citationStyle":      "APA"
    }
  ]
}
```

---

## [.example-list], [.page-footer]

**Card config:** `example-bit-list`
**Bits using this card:** `example-list`, `page-footer`
**Card divider:** `====`
**Variant dividers within card:** N/A (single variant per card)

Each card is one list item with a title and body.

### Mapping

| Bitmark position | JSON path |
|-----------------|-----------|
| Card N | `listItems[N-1]` |
| V1 `[#title]` tag | `listItems[N-1].title` (or mapped per bit type) |
| V1 body | `listItems[N-1].body` |
| V1 `[%...]` item tag | `listItems[N-1].item` |
| V1 `[?...]` hint tag | `listItems[N-1].hint` |
| V1 `[!...]` instruction tag | `listItems[N-1].instruction` |

---

## Divider Reference Summary

### Which Card Divider Does Each Bit Use?

| Card divider | Bit types |
|-------------|-----------|
| `====` | `flashcard`, `q-and-a-card`, `definition-list`, `cloze-list`, `table`, `table-extended`, `pronunciation-table`, `cook-ingredients`, `book-reference-list`, `example-list`, `page-footer`, `sequence`, `match`, `match-audio`, `match-picture`, `match-matrix`, `true-false`, `multiple-choice`, `multiple-response`, `interview`, `feedback`, `bot-action-response` |

### Variant Divider Equivalence (Sides vs. Variants)

Bitmark distinguishes two intra-card dividers:

| Divider | Human semantic | JSON effect |
|---------|---------------|-------------|
| `--` | Start a new **side** | Advance to the next variant slot |
| `++` | Add a **variant within the current side** | Advance to the next variant slot |

Both produce identical JSON — the flattened position (V1, V2, V3…) is all that matters. This means an author using `--` where `++` was intended (or vice versa) produces the same output.

```
====
Side 1 content
--
Side 2 content
====
```

is equivalent to:

```
====
Side 1 content
++
Side 2 content
====
```

Both map to:

```json
{
  "question": { "text": "Side 1 content" },
  "answer":   { "text": "Side 2 content" }
}
```
