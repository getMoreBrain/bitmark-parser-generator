# PLAN-002: Grammar Layer Updates for Advanced Tables

**Spec**: SPEC-table-advanced.md
**Layer**: Grammar Layer
**Dependencies**: None
**Status**: Not Started

## Overview

Extend the Peggy grammar to support qualified card dividers - a generic parser feature that enables special row types within card-like structures. For tables, qualifiers `thead`, `tbody`, and `tfoot` enable semantic table sections.

## Objectives

- Implement qualified card divider syntax
- Maintain full backwards compatibility with existing card dividers
- Support V1 and V2 card divider versions
- Protect reserved qualifiers (footer, text)

## Card Divider Compatibility Matrix

| Divider Syntax | Can Have Qualifier? | Notes |
|----------------|---------------------|-------|
| `====` | **YES** | `==== qualifier ====` - Primary use case |
| `--` | **YES** | `-- qualifier --` - Cell dividers |
| `++` | **YES** | `++ qualifier ++` - Alternative cell dividers |
| `===` (V1) | **NO** | Legacy syntax, no qualifiers |
| `==` (V1) | **NO** | Legacy syntax, no qualifiers |
| `~~~~` | **NO** | Special footer divider, no qualifiers |
| `$$$$` | **NO** | Special plain text divider, no qualifiers |
| `==== footer ====` | **NO** (reserved) | Already qualified as footer |
| `==== text ====` | **NO** (reserved) | Already qualified as text/plain text |

## Grammar Changes Required

### 1. Update `assets/grammar/bitmark/bit-grammar.pegjs`

#### Define Qualifier Rule

```pegjs
// Qualifier for card dividers
// Must not match reserved keywords
Qualifier
  = !("footer" / "text") qualifier:$([a-z][a-z0-9-]*) {
      return qualifier;
    }
```

#### Update V2 Card Divider Rules

```pegjs
// V2 Card Divider with Optional Qualifier
CardDivider_V2
  = "====" WS+ qualifier:Qualifier WS+ "====" (WNL / WEOL) {
      return {
        type: 'card',
        version: 2,
        qualifier: qualifier,
        location: location()
      };
    }
  / "====" (WNL / WEOL) {
      return {
        type: 'card',
        version: 2,
        qualifier: null,
        location: location()
      };
    }
```

#### Update Cell Divider Rules

```pegjs
// Cell Divider with Optional Qualifier
CellDivider
  = "--" WS+ qualifier:Qualifier WS+ "--" (WNL / WEOL) {
      return {
        type: 'cell',
        qualifier: qualifier,
        location: location()
      };
    }
  / "--" (WNL / WEOL) {
      return {
        type: 'cell',
        qualifier: null,
        location: location()
      };
    }
  / "++" WS+ qualifier:Qualifier WS+ "++" (WNL / WEOL) {
      return {
        type: 'cell-alt',
        qualifier: qualifier,
        location: location()
      };
    }
  / "++" (WNL / WEOL) {
      return {
        type: 'cell-alt',
        qualifier: null,
        location: location()
      };
    }
```

#### Ensure V1 Dividers Unchanged

```pegjs
// V1 Card Divider (No Qualifiers)
CardDivider_V1
  = "===" (WNL / WEOL) {
      return {
        type: 'card',
        version: 1,
        qualifier: null,
        location: location()
      };
    }
  / "==" (WNL / WEOL) {
      return {
        type: 'card',
        version: 1,
        qualifier: null,
        location: location()
      };
    }
```

#### Ensure Special Dividers Protected

```pegjs
// Special dividers matched BEFORE qualified dividers
FooterDivider
  = "~~~~" (WNL / WEOL) {
      return {
        type: 'footer',
        location: location()
      };
    }
  / "====" WS+ "footer" WS+ "====" (WNL / WEOL) {
      return {
        type: 'footer',
        location: location()
      };
    }

PlainTextDivider
  = "$$$$" (WNL / WEOL) {
      return {
        type: 'plaintext',
        location: location()
      };
    }
  / "====" WS+ "text" WS+ "====" (WNL / WEOL) {
      return {
        type: 'plaintext',
        location: location()
      };
    }
```

### 2. Parse Order Matters

**Critical**: Ensure special dividers are matched before qualified dividers:

```pegjs
Divider
  = FooterDivider          // Match special dividers first
  / PlainTextDivider
  / CardDivider_V2         // Then V2 with optional qualifiers
  / CardDivider_V1         // Then V1 without qualifiers
  / CellDivider
```

### 3. Whitespace Requirements

**Strict Rule**: Qualifiers MUST have exactly 1 space before and after.

Invalid patterns:
```
====thead====         ✗ No spaces
====  thead  ====     ✗ Multiple spaces
==== thead====        ✗ Missing trailing space
```

Valid pattern:
```
==== thead ====       ✓ Exactly one space each side
```

## Files to Modify

- `assets/grammar/bitmark/bit-grammar.pegjs` - Main grammar file
- `scripts/grammar/bitmark/generate-bitmark-parser.ts` - May need adjustments for new rules

## Testing Strategy

### Unit Tests (Grammar Level)

Create test file: `test/grammar/qualified-dividers.test.ts`

Test cases:
1. **Valid qualified dividers**
   - `==== thead ====`
   - `-- tbody --`
   - `++ tfoot ++`
   - `==== custom-qualifier ====`

2. **Invalid/Reserved patterns**
   - `==== footer ====` → Should parse as footer divider
   - `==== text ====` → Should parse as plain text divider
   - `====thead====` → Should parse as text (no spaces)
   - `====  thead  ====` → Should parse as text (multiple spaces)

3. **Backwards compatibility**
   - `====` → V2 divider, no qualifier
   - `--` → Cell divider, no qualifier
   - `===` → V1 divider, cannot have qualifier
   - `~~~~` → Footer divider

4. **Qualifier validation**
   - Lowercase letters and hyphens only
   - Must start with letter
   - Cannot be reserved words

### Integration Tests

Test in context of full bit parsing:
- Table bit with qualified dividers
- Interview bit (should ignore qualifiers)
- Flashcard bit (V1, should not accept qualifiers)

## Backwards Compatibility Verification

### Test Suite Coverage

- All existing table tests must pass unchanged
- All existing card-based bit tests must pass
- Special divider tests (footer, plain text) must pass

### Regression Tests

Run full test suite with:
```bash
npm run build-grammar-bit && npm run test
```

Expected: **Zero failures** in existing tests.

## Error Handling

Grammar should:
- Accept unknown qualifiers (validation happens at processor level)
- Reject malformed whitespace patterns
- Parse invalid patterns as text content

## Build Process

After grammar changes:

1. Regenerate parser:
```bash
npm run build-grammar-bit
```

2. Commit generated parser:
```
src/generated/parser/bitmark/bitmark-peggy-parser.js
```

3. Run full test suite:
```bash
npm run test
```

## Performance Considerations

- Qualifier matching adds minimal overhead (simple string check)
- No impact on non-table bits
- No impact on bits without qualifiers
- Parser lookahead remains efficient

## Acceptance Criteria

- [ ] Qualifier rule defined in grammar
- [ ] V2 card dividers support optional qualifiers
- [ ] Cell dividers support optional qualifiers
- [ ] V1 dividers unchanged (no qualifiers)
- [ ] Special dividers protected (footer, text)
- [ ] Whitespace requirements enforced
- [ ] Parse order prevents conflicts
- [ ] Parser regenerated successfully
- [ ] All existing tests pass
- [ ] New grammar tests pass
- [ ] Documentation updated
