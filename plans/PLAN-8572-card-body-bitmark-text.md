# PLAN-8572: Migrate Card Body from Plain String to Bitmark++ Styled Text

**Issue**: https://github.com/getMoreBrain/cosmic/issues/8572

## Problem Statement

Card sets content can be either plain string (`cardBodyStr`) or bitmark++ styled text (`cardBody`). Currently, four specific card set types return plain strings for card bodies instead of styled text, limiting formatting capabilities and creating inconsistency across bit types.

**Scope**: This plan addresses only the following card set types:
- **questions** (`[.interview]`, `[.interview-instruction-grouped]`, `[.bot-interview]`)
- **elements** (`[.sequence]`, `[.sequence-content]`)
- **statements** (`[.true-false]`, `[.true-false-1]`)
- **ingredients** (`[.cooking-ingredient]`)

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

### Card Set Types Requiring Updates

| Card Set Type | Uses Plain String | Uses Bitmark++ Text | Parsing Function |
|---------------|------------------|---------------------|------------------|
| `questions` | ✅ YES | ❌ NO | `parseQuestions()` |
| `elements` | ✅ YES | ❌ NO | `parseElements()` |
| `statements` | ✅ YES | ❌ NO | `parseStatements()` |
| `ingredients` | ✅ YES (partially) | ✅ YES (partially) | `parseIngredients()` |

### Bits Affected by Plain String Usage

**CardSetConfigKey.questions** (PLAIN STRING):
- `[.interview]`
- `[.interview-instruction-grouped]`
- `[.bot-interview]`

**CardSetConfigKey.elements** (PLAIN STRING):
- `[.sequence]`
- `[.sequence-content]`

**CardSetConfigKey.statements** (PLAIN STRING):
- `[.true-false]`
- `[.true-false-1]`

**CardSetConfigKey.ingredients** (PARTIALLY):
- `[.cooking-ingredient]`

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
- `StatementJson.statement` changes from `string` to `JsonText` (TextAst | string)
- `IngredientJson.ingredient` changes from `string` to `JsonText` (TextAst | string)
- Array element types change from `string[]` to `JsonText[]` for elements in sequences

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

#### 1.3 Update `parseStatements()`
```typescript
// BEFORE:
statement: tags.cardBodyStr ?? ''

// AFTER:
statement: tags.cardBody?.body ?? ''
```

#### 1.4 Update `parseIngredients()`
```typescript
// BEFORE:
ingredient: cardBodyStr ?? ''

// AFTER:
ingredient: cardBody?.body ?? ''
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

#### 2.2 Update `StatementJson` interface
```typescript
export interface StatementJson {
  statement: TextAst; // Changed from: string - ALWAYS TextAst
  // ... other properties
}
```

#### 2.3 Update Element Arrays
```typescript
// In CardNode interface
elements?: TextAst[]; // Changed from: string[] - ALWAYS TextAst array
```

#### 2.4 Update `IngredientJson` interface
```typescript
export interface IngredientJson {
  ingredient: TextAst; // Changed from: string - ALWAYS TextAst
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
- [ ] New tests added for styled text in card bodies (questions, elements, statements, ingredients)

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing JSON API consumers | HIGH | Implement backward compatibility in JSON parser (accept both string and TextAst) |
| Legacy JSON content won't parse | MEDIUM | JSON parser normalizes both formats to TextAst internally |
| Increased JSON output size | LOW | TextAst structure is more verbose, but enables rich formatting |
| Performance impact | LOW | TextAst is already used elsewhere in the codebase |
| Complex nested structures | MEDIUM | Thorough testing of all bit types |

## Success Metrics

1. Four card set types consistently use TextAst for card bodies (questions, elements, statements, ingredients)
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

### CardSetConfigKey.statements - True/False Bits

#### Example 3.1: `[.true-false]` - Statement Text

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

### CardSetConfigKey.ingredients - Cooking Ingredient Bits

#### Example 4.1: `[.cooking-ingredient]` - Ingredient Text

#### Bitmark
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

#### Current JSON (Plain String) ⚠️
```json
{
  "type": "cooking-ingredient",
  "ingredients": [
    {
      "ingredient": "Flour",  // ⚠️ PLAIN STRING
      "quantity": [/* select body */],
      "unit": "g"
    },
    {
      "ingredient": "Sugar",  // ⚠️ PLAIN STRING
      "quantity": [/* select body */],
      "unit": "g"
    }
  ]
}
```

#### Target JSON (Always TextAst) ✅
```json
{
  "type": "cooking-ingredient",
  "ingredients": [
    {
      "ingredient": [  // ✅ TextAst (plain text or with formatting)
        {
          "type": "paragraph",
          "content": [
            {
              "text": "Flour",
              "type": "text"
            }
          ]
        }
      ],
      "quantity": [/* select body */],
      "unit": "g"
    }
  ]
}
```

**Note**: Ingredient names become TextAst, enabling potential formatting like **Flour** or _Sugar_ if needed.

---

## Summary of ALL Affected Bits

### Complete List by CardSet Type

| CardSet Type | Bits Affected | Properties Using Plain String |
|--------------|---------------|-------------------------------|
| **questions** | `[.interview]`<br>`[.interview-instruction-grouped]`<br>`[.bot-interview]` | `QuestionJson.question` |
| **elements** | `[.sequence]`<br>`[.sequence-content]` | `CardNode.elements[]` |
| **statements** | `[.true-false]`<br>`[.true-false-1]` | `StatementJson.statement` |
| **ingredients** | `[.cooking-ingredient]` | `IngredientJson.ingredient` |

**Total Affected Bits: 8 bit types**

---

## Summary of Type Changes

| Property | Current Type | Target Type | Notes |
|----------|--------------|-------------|-------|
| `QuestionJson.question` | `string` | `TextAst` | **Always TextAst** - enables **bold**, _italic_, etc. in questions |
| `StatementJson.statement` | `string` | `TextAst` | **Always TextAst** - enables formatting in statements |
| `IngredientJson.ingredient` | `string` | `TextAst` | **Always TextAst** - enables formatting in ingredient names |
| `CardNode.elements` | `string[]` | `TextAst[]` | **Always TextAst array** - enables formatting in sequence elements |

**Important Notes**:
- **Bitmark → JSON**: Parser **always** generates `TextAst`, even for plain text without formatting
- **JSON → Bitmark**: Parser **accepts both** `string` (legacy) and `TextAst` (new) for backward compatibility
- **Consistency**: All card body content uses the same structure regardless of formatting presence
