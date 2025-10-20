# PLAN-003: Parser Layer Updates for Advanced Tables

**Spec**: SPEC-table-advanced.md
**Layer**: Parser Layer
**Dependencies**: PLAN-001 (Model), PLAN-002 (Grammar)
**Status**: Not Started

## Overview

Update the CardContentProcessor and related parser components to handle qualified card dividers and parse cell-level properties (rowspan, colspan, scope, cell type) from bitmark tags, generating the new enhanced table JSON structure.

## Objectives

- Parse qualified dividers from grammar AST
- Extract cell properties from tags
- Generate new table JSON format
- Support old format (auto-convert to new)
- Validate qualifiers per bit type

## Architecture

```
Peggy Parser → CardContentProcessor → parseTable() → New TableJson
                     ↓
          parseTableWithSections()
                     ↓
          extractCellProperties()
```

## Changes Required

### 1. Update `src/parser/bitmark/peg/contentProcessors/CardContentProcessor.ts`

#### 1.1 Import New Types

```typescript
import type {
  TableJson,
  TableSectionJson,
  TableRowJson,
  TableCellJson,
} from '../../../../model/json/BitJson.js';
```

#### 1.2 Update Card Processing

The grammar already returns qualifier in CardData. Update ProcessedCard interface if needed:

```typescript
interface ProcessedCard {
  cardIndex: number;
  qualifier?: string;  // From grammar
  sides: ProcessedCardSide[];
}
```

#### 1.3 Replace parseTable Function

**OLD FUNCTION** (lines 898-947):
```typescript
function parseTable(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  // ... old logic using columns/data format
}
```

**NEW FUNCTION**:
```typescript
function parseTable(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  return parseTableWithSections(context, bitType, cardSet);
}
```

#### 1.4 Implement parseTableWithSections

```typescript
function parseTableWithSections(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const sections: Map<string, TableRowJson[]> = new Map([
    ['thead', []],
    ['tbody', []],
    ['tfoot', []]
  ]);

  let currentSection = 'tbody'; // Default section

  for (const card of cardSet.cards) {
    const qualifier = card.qualifier;

    // Handle section qualifiers
    if (qualifier) {
      if (!sections.has(qualifier)) {
        context.addWarning(
          `Unknown table section qualifier: ${qualifier}. ` +
          `Valid qualifiers: thead, tbody, tfoot`,
          card.location
        );
      } else {
        currentSection = qualifier;
      }
    }

    // Parse the row
    const row = parseTableRow(context, card);
    sections.get(currentSection)!.push(row);
  }

  // Build the table JSON
  const table: TableJson = {};

  const headRows = sections.get('thead')!;
  if (headRows.length > 0) {
    table.head = { rows: headRows };
  }

  const bodyRows = sections.get('tbody')!;
  if (bodyRows.length > 0) {
    table.body = { rows: bodyRows };
  }

  const footRows = sections.get('tfoot')!;
  if (footRows.length > 0) {
    table.foot = { rows: footRows };
  }

  return { table };
}
```

#### 1.5 Implement parseTableRow

```typescript
function parseTableRow(
  context: BitmarkPegParserContext,
  card: ProcessedCard,
): TableRowJson {
  const cells: TableCellJson[] = [];

  for (const side of card.sides) {
    for (const variant of side.variants) {
      const cell = parseTableCell(context, variant);
      cells.push(cell);
    }
  }

  return { cells };
}
```

#### 1.6 Implement parseTableCell

```typescript
function parseTableCell(
  context: BitmarkPegParserContext,
  variant: ProcessedCardVariant,
): TableCellJson {
  const tags = variant.data;
  const { cardBody } = tags;

  // Extract cell content
  const content = (cardBody?.body ?? []) as JsonText;

  // Extract cell properties from tags
  const cellProps = extractCellProperties(context, tags);

  // Build cell JSON
  const cell: TableCellJson = {
    content,
    ...cellProps
  };

  return cell;
}
```

#### 1.7 Implement extractCellProperties

```typescript
interface CellProperties {
  title?: boolean;
  rowspan?: number;
  colspan?: number;
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup';
}

function extractCellProperties(
  context: BitmarkPegParserContext,
  tags: ProcessedCardVariantTags,
): CellProperties {
  const props: CellProperties = {};

  // Extract @tableCellType tag
  const cellType = tags.property?.tableCellType;
  if (cellType) {
    const value = cellType.propertyValue;
    if (value === 'th') {
      props.title = true;
    } else if (value === 'td') {
      props.title = false;
    } else {
      context.addWarning(
        `Invalid @tableCellType value: ${value}. Expected 'th' or 'td'`
      );
    }
  }

  // Extract @tableRowSpan tag
  const rowSpan = tags.property?.tableRowSpan;
  if (rowSpan) {
    const value = parseInt(rowSpan.propertyValue, 10);
    if (isNaN(value) || value < 1) {
      context.addWarning(
        `Invalid @tableRowSpan value: ${rowSpan.propertyValue}. Must be >= 1`
      );
    } else if (value > 1) {
      props.rowspan = value;
    }
  }

  // Extract @tableColSpan tag
  const colSpan = tags.property?.tableColSpan;
  if (colSpan) {
    const value = parseInt(colSpan.propertyValue, 10);
    if (isNaN(value) || value < 1) {
      context.addWarning(
        `Invalid @tableColSpan value: ${colSpan.propertyValue}. Must be >= 1`
      );
    } else if (value > 1) {
      props.colspan = value;
    }
  }

  // Extract @tableScope tag
  const scope = tags.property?.tableScope;
  if (scope) {
    const value = scope.propertyValue as string;
    const validScopes = ['row', 'col', 'rowgroup', 'colgroup'];
    if (validScopes.includes(value)) {
      props.scope = value as 'row' | 'col' | 'rowgroup' | 'colgroup';
    } else {
      context.addWarning(
        `Invalid @tableScope value: ${value}. ` +
        `Expected one of: ${validScopes.join(', ')}`
      );
    }
  }

  return props;
}
```

### 2. Add Cell Property Tags to Config

Update `src/config/raw/bits.ts` to define the new table cell tags:

```typescript
// In the table bit configuration
properties: {
  // ... existing properties
  tableCellType: {
    type: PropertyType.string,
    versions: [BitmarkVersion.v3Plus],
  },
  tableRowSpan: {
    type: PropertyType.number,
    versions: [BitmarkVersion.v3Plus],
  },
  tableColSpan: {
    type: PropertyType.number,
    versions: [BitmarkVersion.v3Plus],
  },
  tableScope: {
    type: PropertyType.string,
    versions: [BitmarkVersion.v3Plus],
  },
}
```

### 3. Update JSON Parser

Update `src/parser/json/JsonParser.ts` to handle both old and new formats:

```typescript
function parseTableFromJson(
  context: JsonParserContext,
  tableJson: TableJson
): ParsedTable {
  // Check format
  const isOld = isOldTableFormat(tableJson);
  const isNew = isNewTableFormat(tableJson);

  if (isOld && isNew) {
    // Mixed format: new takes precedence
    context.addWarning(
      'Table has both old (columns/data) and new (head/body/foot) formats. ' +
      'Using new format.'
    );
    return parseNewTableFormat(tableJson);
  } else if (isOld) {
    // Convert old to new
    const converted = convertOldToNewTableFormat(tableJson);
    return parseNewTableFormat(converted);
  } else if (isNew) {
    return parseNewTableFormat(tableJson);
  } else {
    context.addError('Table has no valid format data');
    return { head: undefined, body: undefined, foot: undefined };
  }
}

function parseNewTableFormat(tableJson: TableJson): ParsedTable {
  // Parse head, body, foot sections
  // Validate cell properties
  // Return structured data for AST building
}
```

## Bit-Specific Qualifier Validation

### Add Validator Module

Create `src/parser/bitmark/peg/validators/QualifierValidator.ts`:

```typescript
import { BitType, type BitTypeType } from '../../../../model/enum/BitType.js';

export function getValidQualifiersForBitType(
  bitType: BitTypeType
): string[] {
  switch (bitType) {
    case BitType.table:
    case BitType.tableAlt:
    case BitType.standardTableNormative:
    case BitType.standardTableNonNormative:
    case BitType.standardRemarkTableNormative:
    case BitType.standardRemarkTableNonNormative:
      return ['thead', 'tbody', 'tfoot'];

    // Future: Other bits can define their own valid qualifiers
    // case BitType.article:
    //   return ['section', 'aside', 'nav'];

    default:
      return []; // No qualifiers supported
  }
}

export function validateQualifier(
  qualifier: string | null,
  bitType: BitTypeType,
  context: BitmarkPegParserContext
): void {
  if (!qualifier) return; // No qualifier is always valid

  const validQualifiers = getValidQualifiersForBitType(bitType);

  if (validQualifiers.length === 0) {
    context.addWarning(
      `Qualifiers are not supported for bit type '${bitType}'. ` +
      `Ignoring qualifier '${qualifier}'.`
    );
  } else if (!validQualifiers.includes(qualifier)) {
    context.addWarning(
      `Qualifier '${qualifier}' is not valid for bit type '${bitType}'. ` +
      `Valid qualifiers: ${validQualifiers.join(', ')}`
    );
  }
}
```

### Integrate Validation

In `parseTableWithSections()`:

```typescript
// Validate qualifier before using it
if (qualifier) {
  validateQualifier(qualifier, bitType, context);

  if (!sections.has(qualifier)) {
    // Invalid qualifier, use default section
    currentSection = 'tbody';
  } else {
    currentSection = qualifier;
  }
}
```

## Default Cell Types by Section

Implement section-aware default cell types:

```typescript
function getDefaultCellType(section: string): boolean | undefined {
  switch (section) {
    case 'thead':
      return true;  // th by default
    case 'tfoot':
      return true;  // th by default
    case 'tbody':
      return undefined;  // td by default (omit property)
    default:
      return undefined;
  }
}

// In parseTableCell, apply default if not explicitly set:
function parseTableCell(
  context: BitmarkPegParserContext,
  variant: ProcessedCardVariant,
  currentSection: string,
): TableCellJson {
  // ... extract properties

  // Apply section defaults if not explicitly set
  if (cellProps.title === undefined) {
    const defaultTitle = getDefaultCellType(currentSection);
    if (defaultTitle !== undefined) {
      cellProps.title = defaultTitle;
    }
  }

  // ... build cell
}
```

## Files to Modify

- `src/parser/bitmark/peg/contentProcessors/CardContentProcessor.ts` - Main parser logic
- `src/parser/bitmark/peg/validators/QualifierValidator.ts` (NEW) - Qualifier validation
- `src/parser/json/JsonParser.ts` - Handle old/new formats
- `src/config/raw/bits.ts` - Add cell property tags

## Testing Strategy

### Unit Tests

Create `test/parser/table-advanced.test.ts`:

1. **Section parsing**
   - Single section (tbody only)
   - Multiple sections (thead + tbody)
   - All sections (thead + tbody + tfoot)
   - Empty sections
   - Interleaved sections

2. **Cell properties**
   - All tag types individually
   - Multiple tags on same cell
   - Invalid tag values
   - Missing tags (defaults)

3. **Qualifier validation**
   - Valid qualifiers (thead, tbody, tfoot)
   - Invalid qualifiers (warning)
   - Unknown qualifiers (warning)
   - No qualifiers (default tbody)

4. **Backwards compatibility**
   - Old format → New AST
   - First row with [#title] → thead

### Integration Tests

- Parse complex table from spec example
- Round-trip: Bitmark → AST → Bitmark
- Round-trip: JSON → AST → JSON
- Cross-format: Bitmark → AST → JSON

## Error Handling

| Error Type | Action | Error Level |
|------------|--------|-------------|
| Unknown qualifier | Use default section | Warning |
| Invalid cell type | Use default | Warning |
| Invalid rowspan/colspan | Clamp to ≥1 | Warning |
| Invalid scope | Omit property | Warning |
| Missing content | Use empty array | Warning |

## Performance Considerations

- Cell property extraction is O(1) per cell
- Section map lookups are O(1)
- No nested iterations
- Memory: ~2x old format (additional metadata)

## Acceptance Criteria

- [ ] parseTableWithSections() implemented
- [ ] parseTableRow() implemented
- [ ] parseTableCell() implemented
- [ ] extractCellProperties() implemented
- [ ] Qualifier validation implemented
- [ ] Default cell types by section
- [ ] JSON parser handles old format
- [ ] JSON parser handles new format
- [ ] All cell property tags supported
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Backwards compatibility verified
- [ ] Error handling complete
