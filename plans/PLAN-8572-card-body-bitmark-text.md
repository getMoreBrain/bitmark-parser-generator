# PLAN-8572: Migrate Card Body from Plain String to Bitmark++ Styled Text

**Issue**: https://github.com/getMoreBrain/cosmic/issues/8572

## Problem Statement

Card sets content can be either plain string (`cardBodyStr`) or bitmark++ styled text (`cardBody`). Currently, some bits return plain strings for card bodies instead of styled text, limiting formatting capabilities and creating inconsistency across bit types.

## Strategy Overview

### Key Principles

1. **Consistent Output Format** (Bitmark → JSON)
   - Parser **always** generates `TextAst` for card body content
   - Even plain text without formatting becomes `TextAst` structure
   - No conditional logic based on formatting presence
   - Result: Predictable, consistent JSON structure

2. **Backward Compatible Input** (JSON → Bitmark)
   - Generator **accepts both** `string` (legacy) and `TextAst` (new)
   - Legacy JSON with plain strings continues to work
   - New JSON with TextAst structures works identically
   - Result: Smooth migration path, no breaking changes for consumers

3. **Type Safety**
   - TypeScript types reflect the new reality: `TextAst` (not `string | TextAst`)
   - Clear, unambiguous type definitions
   - Easier to reason about data structures

## Current State Analysis

### Card Set Types & Body Usage

| Card Set Type | Uses Plain String | Uses Bitmark++ Text | Parsing Function |
|---------------|------------------|---------------------|------------------|
| `questions` | ✅ YES | ❌ NO | `parseQuestions()` |
| `elements` | ✅ YES | ❌ NO | `parseElements()` |
| `matchPairs` | ✅ YES (partially) | ✅ YES (partially) | `parseMatchPairs()` |
| `matchAudioPairs` | ✅ YES (partially) | ✅ YES (partially) | `parseMatchPairs()` |
| `matchImagePairs` | ✅ YES (partially) | ✅ YES (partially) | `parseMatchPairs()` |
| `matchMatrix` | ✅ YES (partially) | ✅ YES (partially) | `parseMatchMatrix()` |
| `botActionResponses` | ✅ YES | ❌ NO | `parseBotActionResponses()` |
| `ingredients` | ✅ YES (partially) | ✅ YES (partially) | `parseIngredients()` |
| `flashcard` | ❌ NO | ✅ YES | `parseFlashcardOrDefinitionList()` |
| `definitionList` | ❌ NO | ✅ YES | `parseFlashcardOrDefinitionList()` |
| `statements` | ✅ YES (mixed) | ❌ NO | `parseStatements()` |
| `feedback` | ✅ YES (mixed) | ✅ YES (mixed) | `parseFeedback()` |
| `quiz` | ✅ YES (mixed) | ✅ YES (mixed) | `parseQuiz()` |
| `table` | ❌ NO | ✅ YES | `parseTable()` |
| `pronunciationTable` | ❌ NO | ✅ YES | `parsePronunciationTable()` |
| `clozeList` | ❌ NO | ✅ YES | `parseCardBits()` |
| `exampleBitList` | ❌ NO | ✅ YES | `parseCardBits()` |
| `bookReferenceList` | ❌ NO | ✅ YES | `parseCardBits()` |

### Bits Affected by Plain String Usage

**CardSetConfigKey.questions** (PLAIN STRING):
- `[.interview]`
- `[.interview-instruction-grouped]`
- `[.bot-interview]`

**CardSetConfigKey.elements** (PLAIN STRING):
- `[.sequence]`
- `[.sequence-content]`

**CardSetConfigKey.botActionResponses** (PLAIN STRING):
- `[.bot-action-send]`
- `[.bot-action-send-payment]`
- `[.bot-action-response]`
- `[.bot-action-show-image]`

**CardSetConfigKey.matchPairs** (MIXED - pair values use plain string):
- `[.match]`
- `[.match-all]`
- `[.match-reverse]`
- `[.match-all-reverse]`
- `[.match-solution-grouped]`

**CardSetConfigKey.matchAudioPairs** (MIXED):
- `[.match-audio]`

**CardSetConfigKey.matchImagePairs** (MIXED):
- `[.match-picture]`

**CardSetConfigKey.matchMatrix** (MIXED):
- `[.match-matrix]`

**CardSetConfigKey.ingredients** (MIXED):
- `[.cooking-ingredient]`

**CardSetConfigKey.statements** (MIXED):
- `[.true-false]`
- `[.true-false-1]`

**CardSetConfigKey.feedback** (MIXED):
- `[.feedback]`
- `[.learning-documentation-feedback]`
- `[.hand-in-feedback-expert]`

**CardSetConfigKey.quiz** (MIXED):
- `[.multiple-choice]`
- `[.multiple-choice-text]`
- `[.multiple-response]`
- `[.multiple-response-text]`

## Architecture Impact

### Files Modified

1. **Parser Layer**:
   - `src/parser/bitmark/peg/contentProcessors/CardContentProcessor.ts` - Update parsing functions

2. **Model Layer**:
   - `src/model/json/BitJson.ts` - Update JSON type definitions

3. **Generator Layer**:
   - `src/generator/json/JsonGenerator.ts` - Handle new body structure
   - `src/generator/bitmark/BitmarkGenerator.ts` - Handle new body structure

### Breaking Changes

**JSON API Changes**:
- `QuestionJson.question` changes from `string` to `JsonText` (TextAst | string)
- `BotResponseJson.response` changes from `string` to `JsonText`
- `BotResponseJson.reaction` changes from `string` to `JsonText`
- `BotResponseJson.feedback` changes from `string` to `JsonText`
- Array element types change from `string[]` to `JsonText[]` for elements

**Parser Changes**:
- Card body parsing will use `cardBody.body` instead of `cardBodyStr`
- Backward compatibility needed for existing content

## Migration Strategy

### Phase 1: Parser Layer (Priority: HIGH)

#### 1.1 Update `parseQuestions()`
```typescript
// BEFORE:
question: tags.cardBodyStr ?? ''

// AFTER:
question: tags.cardBody?.body ?? ''
```

#### 1.2 Update `parseElements()`
```typescript
// BEFORE:
elements.push(tags.cardBodyStr ?? '')

// AFTER:
elements.push(tags.cardBody?.body ?? '')
```

#### 1.3 Update `parseBotActionResponses()`
```typescript
// BEFORE:
response: __instructionString ?? Breakscape.EMPTY_STRING,
reaction: reaction ?? Breakscape.EMPTY_STRING,
feedback: cardBodyStr ?? Breakscape.EMPTY_STRING

// AFTER:
response: __instructionString ?? '',
reaction: reaction ?? '',
feedback: cardBody?.body ?? ''
```

#### 1.4 Update `parseMatchPairs()` - Pair Values
```typescript
// BEFORE:
const value = cardBodyStr ?? '';

// AFTER:
const value = cardBody?.body ?? '';
```

#### 1.5 Update `parseMatchMatrix()` - Matrix Cell Values
```typescript
// BEFORE:
const value = cardBodyStr ?? Breakscape.EMPTY_STRING;

// AFTER:
const value = cardBody?.body ?? '';
```

### Phase 2: Model Layer (Priority: HIGH)

#### 2.1 Update `QuestionJson` interface
```typescript
// src/model/json/BitJson.ts
export interface QuestionJson {
  question: TextAst; // Changed from: string - ALWAYS TextAst
  // ... other properties
}
```

#### 2.2 Update `BotResponseJson` interface
```typescript
export interface BotResponseJson {
  response: TextAst; // Changed from: string - ALWAYS TextAst
  reaction: TextAst; // Changed from: string - ALWAYS TextAst
  feedback: TextAst; // Changed from: string - ALWAYS TextAst
  // ... other properties
}
```

#### 2.3 Update Element Arrays
```typescript
// In CardNode interface
elements?: TextAst[]; // Changed from: string[] - ALWAYS TextAst array
```

#### 2.4 Update `PairJson` interface
```typescript
export interface PairJson {
  keyAudio?: AudioResourceWrapperJson;
  keyImage?: ImageResourceWrapperJson;
  key: TextAst; // Changed from: string - ALWAYS TextAst
  values: TextAst[]; // Changed from: string[] - ALWAYS TextAst array
  // ... other properties
}
```

#### 2.5 Update `MatrixCellJson` interface
```typescript
export interface MatrixCellJson {
  key: TextAst; // Changed from: string - ALWAYS TextAst
  values: TextAst[]; // Changed from: string[] - ALWAYS TextAst array
  // ... other properties
}
```

### Phase 3: Generator Layer (Priority: MEDIUM)

#### 3.1 Update `JsonGenerator`
- Card body properties are now always `TextAst` (never plain strings)
- Ensure proper serialization of TextAst structure

#### 3.2 Update `BitmarkGenerator`
- Accept both `string` (legacy JSON input) and `TextAst` (new JSON input)
- Use `writeTextOrValue()` for card bodies to handle both formats during generation

### Phase 4: Backward Compatibility (Priority: HIGH)

#### 4.1 Bitmark → JSON: Always Output TextAst
**Strategy**: Parser always generates TextAst (even for plain text without formatting)

```typescript
// CardContentProcessor.ts
// ALWAYS use cardBody.body (TextAst), never cardBodyStr
question: tags.cardBody?.body ?? ''
```

**Result**:
- Simple text like `"Hello"` becomes `TextAst` with single paragraph node
- Formatted text like `"**Hello**"` becomes `TextAst` with bold marks
- Consistent structure regardless of formatting presence

#### 4.2 JSON → Bitmark: Accept Both String and TextAst
**Strategy**: JSON parser accepts both formats for backward compatibility

```typescript
// src/parser/json/JsonParser.ts
// Accept both string and TextAst for card body properties
export class JsonParser {
  private normalizeJsonText(value: JsonText | undefined): TextAst {
    if (!value) return this.createEmptyTextAst();

    // If already TextAst, return as-is
    if (Array.isArray(value)) return value;

    // If string (legacy format), convert to TextAst
    return this.stringToTextAst(value);
  }

  private stringToTextAst(text: string): TextAst {
    return [{
      type: 'paragraph',
      content: [{
        type: 'text',
        text: text
      }]
    }];
  }
}
```

**Result**:
- Legacy JSON with `"question": "Hello"` (string) → parsed successfully
- New JSON with `"question": [TextAst]` → parsed successfully
- Both generate identical bitmark output

### Phase 5: Testing (Priority: HIGH)

#### 5.1 Unit Tests
- Test parsing of plain string card bodies
- Test parsing of bitmark++ styled card bodies
- Test round-trip conversion: bitmark → JSON → bitmark
- Test backward compatibility with existing JSON

#### 5.2 Integration Tests
- Test all affected bit types
- Verify no regression in existing functionality

#### 5.3 Test Data
- Create test files for each affected bit type with both formats
- Add to `test/assets/` directory

## Implementation Order

1. ✅ **Phase 1**: Update parser layer (CardContentProcessor.ts)
2. ✅ **Phase 2**: Update model layer (type definitions)
3. ✅ **Phase 4**: Implement backward compatibility
4. ✅ **Phase 5**: Add comprehensive tests
5. ✅ **Phase 3**: Update generator layer

## Validation Criteria

- [ ] All affected parsing functions use `cardBody.body` instead of `cardBodyStr`
- [ ] Type definitions updated to use `TextAst` instead of `string`
- [ ] **Bitmark → JSON**: Parser always outputs `TextAst` (even for plain text)
- [ ] **JSON → Bitmark**: Generator accepts both `string` (legacy) and `TextAst` (new)
- [ ] Round-trip tests pass: bitmark → JSON → bitmark
- [ ] Backward compatibility maintained for legacy JSON input (string values)
- [ ] No breaking changes to bitmark syntax
- [ ] All existing tests pass
- [ ] New tests added for styled text in card bodies

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing JSON API consumers | HIGH | Implement backward compatibility in JSON parser (accept both string and TextAst) |
| Legacy JSON content won't parse | MEDIUM | JSON parser normalizes both formats to TextAst internally |
| Increased JSON output size | LOW | TextAst structure is more verbose, but enables rich formatting |
| Performance impact | LOW | TextAst is already used elsewhere in the codebase |
| Complex nested structures | MEDIUM | Thorough testing of all bit types |

## Success Metrics

1. All card set types consistently use TextAst for card bodies
2. Parser always outputs TextAst (regardless of formatting presence)
3. Generator accepts both string (legacy) and TextAst (new) input
4. No regression in existing functionality
5. Backward compatibility maintained for legacy JSON
6. Clear migration path for existing content

## Non-Functional Requirements

- **Performance**: No significant performance degradation
- **Maintainability**: Consistent code patterns across all card parsers
- **Documentation**: Update API documentation with type changes
- **Testing**: 100% coverage for affected parsing functions

## Examples: Current State (Plain String) vs Target State (Bitmark++)

### CardSetConfigKey.questions - Interview Bits

#### Example 1.1: `[.interview]` - Basic Questions

#### Bitmark
```bitmark
[.interview]
[@id:187612]
[%12]
[!Datum / Unterschriften]
===
Dieser Bildungsbericht wurde am
===
besprochen.
**Unterschrift der verantwortlichen Berufsbildnerin / des verantwortlichen Berufsbildners:**
===
**Unterschrift der lernenden Person:**
===
```

#### Current JSON (Plain String) ⚠️
```json
{
  "questions": [
    {
      "question": "Dieser Bildungsbericht wurde am",  // ⚠️ PLAIN STRING
      "item": [],
      "hint": [],
      "instruction": []
    },
    {
      "question": "besprochen.\n**Unterschrift der verantwortlichen Berufsbildnerin / des verantwortlichen Berufsbildners:**",  // ⚠️ PLAIN STRING (no bold formatting)
      "item": [],
      "hint": [],
      "instruction": []
    },
    {
      "question": "**Unterschrift der lernenden Person:**",  // ⚠️ PLAIN STRING (no bold formatting)
      "item": [],
      "hint": [],
      "instruction": []
    }
  ]
}
```

#### Target JSON (Always TextAst) ✅
```json
{
  "questions": [
    {
      "question": [  // ✅ TextAst with bold formatting
        {
          "type": "paragraph",
          "content": [
            {
              "text": "besprochen.",
              "type": "text"
            },
            {
              "type": "hardBreak"
            },
            {
              "marks": [{"type": "bold"}],
              "text": "Unterschrift der verantwortlichen Berufsbildnerin / des verantwortlichen Berufsbildners:",
              "type": "text"
            }
          ]
        }
      ],
      "item": [],
      "hint": [],
      "instruction": []
    },
    {
      "question": [  // ✅ TextAst with bold formatting
        {
          "type": "paragraph",
          "content": [
            {
              "marks": [{"type": "bold"}],
              "text": "Unterschrift der lernenden Person:",
              "type": "text"
            }
          ]
        }
      ],
      "item": [],
      "hint": [],
      "instruction": []
    }
  ]
}
```

**Note**: Plain text like "Dieser Bildungsbericht wurde am" also becomes TextAst with the same structure (without marks).

---

#### Example 1.2: `[.interview-instruction-grouped]` - Same as `[.interview]`

Uses the same `CardSetConfigKey.questions` configuration, so the same plain string issue applies.

---

#### Example 1.3: `[.bot-interview]` - Same as `[.interview]`

Uses the same `CardSetConfigKey.questions` configuration, so the same plain string issue applies.

---

### CardSetConfigKey.elements - Sequence Bits

#### Example 2.1: `[.sequence]` - Elements Array

#### Bitmark
```bitmark
[.sequence]
[%32][%sequence]
[@id:285747]
[@example]
===
Ein Elefant
--
ist
--
grösser als
--
eine Maus.
===
```

#### Current JSON (Plain String Array) ⚠️
```json
{
  "type": "sequence",
  "id": ["285747"],
  "elements": [
    "Ein Elefant",     // ⚠️ PLAIN STRING
    "ist",             // ⚠️ PLAIN STRING
    "grösser als",     // ⚠️ PLAIN STRING
    "eine Maus."       // ⚠️ PLAIN STRING
  ],
  "isExample": true
}
```

#### Target JSON (Always TextAst Array) ✅
```json
{
  "type": "sequence",
  "id": ["285747"],
  "elements": [
    [  // ✅ TextAst with bold formatting
      {
        "type": "paragraph",
        "content": [
          {
            "marks": [{"type": "bold"}],
            "text": "zu oberst",
            "type": "text"
          }
        ]
      }
    ],
    [  // ✅ TextAst without formatting
      {
        "type": "paragraph",
        "content": [
          {
            "text": "Dach",
            "type": "text"
          }
        ]
      }
    ]
  ],
  "isExample": true
}
```

**Note**: Plain text elements like "Ein Elefant", "ist", etc. also become TextAst with the same structure (without marks).

---

#### Example 2.2: `[.sequence-content]` - Same as `[.sequence]`

Uses the same `CardSetConfigKey.elements` configuration, so the same plain string issue applies.

---

### CardSetConfigKey.botActionResponses - Bot Action Bits

#### Example 3.1: `[.bot-action-response]` - Response/Reaction/Feedback

#### Bitmark
```bitmark
[.bot-action-response]
[!Wusstest du, dass du einen **Teil der Kosten selbst bezahlen** musst?]

Der Entscheid darüber liegt nicht bei der Versicherung, sondern ist **gesetzlich vorgeschrieben.**

===
[%A]
[!Ja, das weiss ich]
[@reaction:celebrate]
👍 Cool!
===
[%B]
[!Das war mir nicht bewusst]
😅
[@reaction:like]
===
```

#### Current JSON (Plain Strings) ⚠️
```json
{
  "type": "bot-action-response",
  "instruction": [ /* TextAst - correctly formatted */ ],
  "body": [ /* TextAst - correctly formatted */ ],
  "responses": [
    {
      "response": "Ja, das weiss ich",        // ⚠️ PLAIN STRING
      "reaction": "celebrate",                // ⚠️ PLAIN STRING
      "feedback": "👍 Cool!",                 // ⚠️ PLAIN STRING
      "item": [ /* TextAst */ ]
    },
    {
      "response": "Das war mir nicht bewusst", // ⚠️ PLAIN STRING
      "reaction": "like",                      // ⚠️ PLAIN STRING
      "feedback": "😅",                        // ⚠️ PLAIN STRING
      "item": [ /* TextAst */ ]
    }
  ]
}
```

#### Target JSON (Always TextAst) ✅
```json
{
  "type": "bot-action-response",
  "instruction": [ /* TextAst - already correct */ ],
  "body": [ /* TextAst - already correct */ ],
  "responses": [
    {
      "response": [  // ✅ TextAst with bold formatting
        {
          "type": "paragraph",
          "content": [
            {
              "text": "Ja, ",
              "type": "text"
            },
            {
              "marks": [{"type": "bold"}],
              "text": "das weiss ich",
              "type": "text"
            }
          ]
        }
      ],
      "reaction": [  // ✅ TextAst (plain text)
        {
          "type": "paragraph",
          "content": [
            {
              "text": "celebrate",
              "type": "text"
            }
          ]
        }
      ],
      "feedback": [  // ✅ TextAst (plain text)
        {
          "type": "paragraph",
          "content": [
            {
              "text": "� Cool!",
              "type": "text"
            }
          ]
        }
      ],
      "item": [ /* TextAst */ ]
    }
  ]
}
```

**Note**: All response, reaction, and feedback fields become TextAst, whether they contain formatting or not.

---

#### Example 3.2: `[.bot-action-send]` - Same as `[.bot-action-response]`

Uses the same `CardSetConfigKey.botActionResponses` configuration.

---

#### Example 3.3: `[.bot-action-send-payment]` - Same as `[.bot-action-response]`

Uses the same `CardSetConfigKey.botActionResponses` configuration.

---

#### Example 3.4: `[.bot-action-show-image]` - Same as `[.bot-action-response]`

Uses the same `CardSetConfigKey.botActionResponses` configuration.

---

### CardSetConfigKey.matchPairs - Match Bits

#### Example 4.1: `[.match]` - Pair Keys and Values

#### Bitmark
```bitmark
[.match]
[@id:213782]
[!Ordnen Sie die Bedürfnisse zu.]

A. Grundbedürfnisse
B. Sicherheitsbedürfnisse
===
[#Aussage]
==
[#Bedürfnis]
===
Herr De Weck kauft Milch und Brot im Supermarkt.
==
A
===
Marcel Rossi geht samstags in sein Stammlokal.
==
C
===
```

#### Current JSON (Plain Strings in values) ⚠️
```json
{
  "type": "match",
  "body": [ /* TextAst - correctly formatted */ ],
  "heading": {
    "forKeys": "Aussage",
    "forValues": "Bedürfnis"
  },
  "pairs": [
    {
      "key": "Herr De Weck kauft Milch und Brot im Supermarkt.",  // ⚠️ PLAIN STRING
      "values": ["A"],                                            // ⚠️ PLAIN STRING ARRAY
      "item": [],
      "hint": [],
      "instruction": []
    },
    {
      "key": "Marcel Rossi geht samstags in sein Stammlokal.",    // ⚠️ PLAIN STRING
      "values": ["C"],                                            // ⚠️ PLAIN STRING ARRAY
      "item": [],
      "hint": [],
      "instruction": []
    }
  ]
}
```

#### Target JSON (Always TextAst) ✅
```json
{
  "type": "match",
  "body": [ /* TextAst - already correct */ ],
  "heading": {
    "forKeys": "Aussage",
    "forValues": "Bedürfnis"
  },
  "pairs": [
    {
      "key": [  // ✅ TextAst with italic formatting
        {
          "type": "paragraph",
          "content": [
            {
              "text": "Marcel Rossi geht ",
              "type": "text"
            },
            {
              "marks": [{"type": "italic"}],
              "text": "samstags",
              "type": "text"
            },
            {
              "text": " in sein Stammlokal.",
              "type": "text"
            }
          ]
        }
      ],
      "values": [
        [  // ✅ TextAst with bold formatting
          {
            "type": "paragraph",
            "content": [
              {
                "marks": [{"type": "bold"}],
                "text": "C",
                "type": "text"
              }
            ]
          }
        ]
      ],
      "item": [],
      "hint": [],
      "instruction": []
    }
  ]
}
```

**Note**: Plain text keys/values (e.g., "Herr De Weck kauft Milch...", "A") also become TextAst with the same structure (without marks).

---

#### Example 4.2: `[.match-all]` - Same as `[.match]`

Uses the same `CardSetConfigKey.matchPairs` configuration.

---

#### Example 4.3: `[.match-reverse]` - Same as `[.match]`

Uses the same `CardSetConfigKey.matchPairs` configuration.

---

#### Example 4.4: `[.match-all-reverse]` - Same as `[.match]`

Uses the same `CardSetConfigKey.matchPairs` configuration.

---

#### Example 4.5: `[.match-solution-grouped]` - Same as `[.match]`

Uses the same `CardSetConfigKey.matchPairs` configuration.

---

### CardSetConfigKey.matchAudioPairs - Match Audio Bits

#### Example 5.1: `[.match-audio]` - Pair Keys and Values (Same Issue)

Uses similar structure to `[.match]` but with audio resources. The plain string issue for `key` and `values` properties is identical.

**Bitmark Example:**
```bitmark
[.match-audio]
===
[#Song]
==
[#Artist]
===
[&audio:https://example.com/song1.mp3]
==
Artist Name
===
```

**Current JSON:** `key` and `values` arrays contain plain strings

**Target JSON:** `key` and `values` arrays always contain `TextAst` (even for plain text)

---

### CardSetConfigKey.matchImagePairs - Match Picture Bits

#### Example 6.1: `[.match-picture]` - Pair Keys and Values (Same Issue)

Uses similar structure to `[.match]` but with image resources. The plain string issue for `key` and `values` properties is identical.

**Bitmark Example:**
```bitmark
[.match-picture]
===
[#Animal]
==
[#Name]
===
[&image:https://example.com/cat.jpg]
==
Cat
===
```

**Current JSON:** `key` and `values` arrays contain plain strings

**Target JSON:** `key` and `values` arrays always contain `TextAst` (even for plain text)

---

### CardSetConfigKey.matchMatrix - Match Matrix Bits

#### Example 7.1: `[.match-matrix]` - Matrix Cell Keys and Values

#### Bitmark
```bitmark
[.match-matrix]
[@id:287966]
[!Bring the german verbs into the correct tense.]
===
[#Verb]
==
[#Future, 1st Person, Singular]
==
[#Past, 3rd Person, Plural]
===
gehen
==
ich werde gehen
==
sie gingen
===
sprechen
==
ich werde **sprechen**
==
sie sprachen
===
```

#### Current JSON (Plain Strings in Matrix) ⚠️
```json
{
  "type": "match-matrix",
  "instruction": [ /* TextAst - correctly formatted */ ],
  "heading": {
    "forKeys": "Verb",
    "forValues": ["Future, 1st Person, Singular", "Past, 3rd Person, Plural"]
  },
  "matrix": [
    {
      "key": "gehen",  // ⚠️ PLAIN STRING
      "cells": [
        {
          "values": ["ich werde gehen"],  // ⚠️ PLAIN STRING ARRAY
          "item": []
        },
        {
          "values": ["sie gingen"],  // ⚠️ PLAIN STRING ARRAY
          "item": []
        }
      ]
    },
    {
      "key": "sprechen",  // ⚠️ PLAIN STRING
      "cells": [
        {
          "values": ["ich werde **sprechen**"],  // ⚠️ PLAIN STRING (no bold formatting)
          "item": []
        },
        {
          "values": ["sie sprachen"],  // ⚠️ PLAIN STRING
          "item": []
        }
      ]
    }
  ]
}
```

#### Target JSON (Always TextAst in Matrix) ✅
```json
{
  "type": "match-matrix",
  "instruction": [ /* TextAst - already correct */ ],
  "heading": {
    "forKeys": "Verb",
    "forValues": ["Future, 1st Person, Singular", "Past, 3rd Person, Plural"]
  },
  "matrix": [
    {
      "key": [  // ✅ TextAst (plain text)
        {
          "type": "paragraph",
          "content": [
            {
              "text": "sprechen",
              "type": "text"
            }
          ]
        }
      ],
      "cells": [
        {
          "values": [
            [  // ✅ TextAst with bold formatting
              {
                "type": "paragraph",
                "content": [
                  {
                    "text": "ich werde ",
                    "type": "text"
                  },
                  {
                    "marks": [{"type": "bold"}],
                    "text": "sprechen",
                    "type": "text"
                  }
                ]
              }
            ]
          ],
          "item": []
        }
      ]
    }
  ]
}
```

**Note**: All keys and values become TextAst, whether they contain formatting or not (e.g., "gehen", "ich werde gehen", "sie gingen").

---

### CardSetConfigKey.statements - True/False Bits

#### Example 8.1: `[.true-false]` - Statement Text

#### Bitmark
```bitmark
[.true-false]
[@id:287883]
[@labelTrue:rather yes][@labelFalse:rather no]
===
[+A house is bigger than a car.]
===
[+A **tiger** is bigger than a cat.]
===
[-A cow is bigger than a dog.]
===
```

#### Current JSON (Plain Strings) ⚠️
```json
{
  "type": "true-false",
  "labelTrue": "rather yes",
  "labelFalse": "rather no",
  "statements": [
    {
      "statement": "A house is bigger than a car.",  // ⚠️ PLAIN STRING
      "isCorrect": true
    },
    {
      "statement": "A **tiger** is bigger than a cat.",  // ⚠️ PLAIN STRING (no bold formatting)
      "isCorrect": true
    },
    {
      "statement": "A cow is bigger than a dog.",  // ⚠️ PLAIN STRING
      "isCorrect": false
    }
  ]
}
```

#### Target JSON (Always TextAst) ✅
```json
{
  "type": "true-false",
  "labelTrue": "rather yes",
  "labelFalse": "rather no",
  "statements": [
    {
      "statement": [  // ✅ TextAst with bold formatting
        {
          "type": "paragraph",
          "content": [
            {
              "text": "A ",
              "type": "text"
            },
            {
              "marks": [{"type": "bold"}],
              "text": "tiger",
              "type": "text"
            },
            {
              "text": " is bigger than a cat.",
              "type": "text"
            }
          ]
        }
      ],
      "isCorrect": true
    }
  ]
}
```

**Note**: Plain text statements (e.g., "A house is bigger than a car.") also become TextAst with the same structure (without marks).

---

#### Example 8.2: `[.true-false-1]` - Same as `[.true-false]`

Uses the same `CardSetConfigKey.statements` configuration.

---

### CardSetConfigKey.quiz - Multiple Choice Bits

#### Example 9.1: `[.multiple-choice]` - Choice Text

#### Bitmark
```bitmark
[.multiple-choice]
[@id:187003]
===
[!1. Were you invited to an interview?]
[-no]
[-rather **no**]
[-rather yes]
[+yes]
===
```

#### Current JSON (Plain Strings) ⚠️
```json
{
  "type": "multiple-choice",
  "quizzes": [
    {
      "instruction": [ /* TextAst - correctly formatted */ ],
      "choices": [
        {
          "choice": "no",  // ⚠️ PLAIN STRING
          "isCorrect": false
        },
        {
          "choice": "rather **no**",  // ⚠️ PLAIN STRING (no bold formatting)
          "isCorrect": false
        },
        {
          "choice": "rather yes",  // ⚠️ PLAIN STRING
          "isCorrect": false
        },
        {
          "choice": "yes",  // ⚠️ PLAIN STRING
          "isCorrect": true
        }
      ]
    }
  ]
}
```

#### Target JSON (Always TextAst) ✅
```json
{
  "type": "multiple-choice",
  "quizzes": [
    {
      "instruction": [ /* TextAst - already correct */ ],
      "choices": [
        {
          "choice": [  // ✅ TextAst with bold formatting
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "rather ",
                  "type": "text"
                },
                {
                  "marks": [{"type": "bold"}],
                  "text": "no",
                  "type": "text"
                }
              ]
            }
          ],
          "isCorrect": false
        }
      ]
    }
  ]
}
```

**Note**: Plain text choices (e.g., "no", "rather yes", "yes") also become TextAst with the same structure (without marks).

---

#### Example 9.2: `[.multiple-choice-text]` - Same as `[.multiple-choice]`

Uses the same `CardSetConfigKey.quiz` configuration.

---

#### Example 9.3: `[.multiple-response]` - Same as `[.multiple-choice]`

Uses the same `CardSetConfigKey.quiz` configuration.

---

#### Example 9.4: `[.multiple-response-text]` - Same as `[.multiple-choice]`

Uses the same `CardSetConfigKey.quiz` configuration.

---

### CardSetConfigKey.feedback - Feedback Bits

#### Example 10.1: `[.feedback]` - Choice and Reason Text

#### Bitmark
```bitmark
[.feedback]
[@id:67915]
[@reasonableNumOfChars:100]
====
[#Question]
--
[#Reason]
====
[!I PREFER …]
[+ Beer]
[+ Wine]
--
[!Why?]
Please answer with **keywords**
====
```

#### Current JSON (Mixed - Some Plain Strings) ⚠️
```json
{
  "type": "feedback",
  "heading": {
    "forKeys": "Question",
    "forValues": "Reason"
  },
  "feedbacks": [
    {
      "instruction": [ /* TextAst - correctly formatted */ ],
      "choices": [
        {
          "choice": "Beer",  // ⚠️ PLAIN STRING
          "requireReason": true
        },
        {
          "choice": "Wine",  // ⚠️ PLAIN STRING
          "requireReason": true
        }
      ],
      "reason": {
        "text": "Please answer with **keywords**",  // ⚠️ PLAIN STRING (no bold formatting)
        "reasonableNumOfChars": 100,
        "instruction": [ /* TextAst - correctly formatted */ ]
      }
    }
  ]
}
```

#### Target JSON (Always TextAst) ✅
```json
{
  "type": "feedback",
  "heading": {
    "forKeys": "Question",
    "forValues": "Reason"
  },
  "feedbacks": [
    {
      "instruction": [ /* TextAst - already correct */ ],
      "choices": [
        {
          "choice": [  // ✅ TextAst (plain text)
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "Beer",
                  "type": "text"
                }
              ]
            }
          ],
          "requireReason": true
        }
      ],
      "reason": {
        "text": [  // ✅ TextAst with bold formatting
          {
            "type": "paragraph",
            "content": [
              {
                "text": "Please answer with ",
                "type": "text"
              },
              {
                "marks": [{"type": "bold"}],
                "text": "keywords",
                "type": "text"
              }
            ]
          }
        ],
        "reasonableNumOfChars": 100,
        "instruction": [ /* TextAst - already correct */ ]
      }
    }
  ]
}
```

**Note**: All choices become TextAst, whether they contain formatting or not (e.g., "Beer", "Wine").

---

#### Example 10.2: `[.learning-documentation-feedback]` - Same as `[.feedback]`

Uses the same `CardSetConfigKey.feedback` configuration.

---

#### Example 10.3: `[.hand-in-feedback-expert]` - Same as `[.feedback]`

Uses the same `CardSetConfigKey.feedback` configuration.

---

### CardSetConfigKey.ingredients - Cooking Ingredient Bits

#### Example 11.1: `[.cooking-ingredient]` - Ingredient Text

**Bitmark Example:**
```bitmark
[.cooking-ingredient]
===
[!Recipe]
[%1]Flour
[@unit:g]
==
[%2]Sugar
[@unit:g]
===
```

**Current JSON:** The `ingredient` field contains a plain string from `cardBodyStr`

**Target JSON:** The `ingredient` field always contains `TextAst` (even for plain text) from `cardBody.body`

**Note**: This is partially mixed because the ingredient parsing also involves `select` body bits for quantity selection. The main issue is the ingredient name text itself.

---

## Summary of ALL Affected Bits

### Complete List by CardSet Type

| CardSet Type | Bits Affected | Properties Using Plain String |
|--------------|---------------|-------------------------------|
| **questions** | `[.interview]`<br>`[.interview-instruction-grouped]`<br>`[.bot-interview]` | `QuestionJson.question` |
| **elements** | `[.sequence]`<br>`[.sequence-content]` | `CardNode.elements[]` |
| **botActionResponses** | `[.bot-action-send]`<br>`[.bot-action-send-payment]`<br>`[.bot-action-response]`<br>`[.bot-action-show-image]` | `BotResponseJson.response`<br>`BotResponseJson.reaction`<br>`BotResponseJson.feedback` |
| **matchPairs** | `[.match]`<br>`[.match-all]`<br>`[.match-reverse]`<br>`[.match-all-reverse]`<br>`[.match-solution-grouped]` | `PairJson.key`<br>`PairJson.values[]` |
| **matchAudioPairs** | `[.match-audio]` | `PairJson.key`<br>`PairJson.values[]` |
| **matchImagePairs** | `[.match-picture]` | `PairJson.key`<br>`PairJson.values[]` |
| **matchMatrix** | `[.match-matrix]` | `MatrixCellJson.key`<br>`MatrixCellJson.values[]` |
| **statements** | `[.true-false]`<br>`[.true-false-1]` | `StatementJson.statement` |
| **quiz** | `[.multiple-choice]`<br>`[.multiple-choice-text]`<br>`[.multiple-response]`<br>`[.multiple-response-text]` | `ChoiceJson.choice` |
| **feedback** | `[.feedback]`<br>`[.learning-documentation-feedback]`<br>`[.hand-in-feedback-expert]` | `FeedbackChoiceJson.choice`<br>`FeedbackReasonJson.text` |
| **ingredients** | `[.cooking-ingredient]` | `IngredientJson.ingredient` |

**Total Affected Bits: 28 bit types**

---

## Summary of Type Changes

| Property | Current Type | Target Type | Notes |
|----------|--------------|-------------|-------|
| `QuestionJson.question` | `string` | `TextAst` | **Always TextAst** - enables **bold**, _italic_, etc. in questions |
| `BotResponseJson.response` | `string` | `TextAst` | **Always TextAst** - enables formatting in responses |
| `BotResponseJson.reaction` | `string` | `TextAst` | **Always TextAst** - enables formatting in reactions |
| `BotResponseJson.feedback` | `string` | `TextAst` | **Always TextAst** - enables formatting in feedback |
| `CardNode.elements` | `string[]` | `TextAst[]` | **Always TextAst array** - enables formatting in sequence elements |
| `PairJson.key` | `string` | `TextAst` | **Always TextAst** - enables formatting in match pair keys |
| `PairJson.values` | `string[]` | `TextAst[]` | **Always TextAst array** - enables formatting in match pair values |
| `MatrixCellJson.key` | `string` | `TextAst` | **Always TextAst** - enables formatting in matrix cell keys |
| `MatrixCellJson.values` | `string[]` | `TextAst[]` | **Always TextAst array** - enables formatting in matrix cell values |

**Important Notes**:
- **Bitmark → JSON**: Parser **always** generates `TextAst`, even for plain text without formatting
- **JSON → Bitmark**: Parser **accepts both** `string` (legacy) and `TextAst` (new) for backward compatibility
- **Consistency**: All card body content uses the same structure regardless of formatting presence
