# PLAN-004: Generator Layer Updates for Advanced Tables

**Spec**: SPEC-table-advanced.md
**Layer**: Generator Layer
**Dependencies**: PLAN-001 (Model), PLAN-003 (Parser)
**Status**: Not Started

## Overview

Update the BitmarkGenerator and JsonGenerator to output the new table format with qualified dividers and cell properties, while maintaining backwards compatibility for reading old JSON format.

## Objectives

- Generate qualified card dividers (==== thead ====)
- Generate cell property tags (@tableRowSpan, etc.)
- Handle both old and new JSON formats as input
- Optimize output (omit default values)
- Maintain round-trip fidelity

## Architecture

```
AST → AstWalker → Generator Callbacks → Bitmark/JSON Output
                        ↓
                generateTableSection()
                        ↓
                generateTableCell()
```

## Changes Required

### 1. Update BitmarkGenerator

#### Location
`src/generator/bitmark/BitmarkGenerator.ts`

#### 1.1 Import New Types

```typescript
import type {
  TableJson,
  TableSectionJson,
  TableRowJson,
  TableCellJson,
} from '../../model/json/BitJson.js';
import {
  isOldTableFormat,
  isNewTableFormat,
  convertOldToNewTableFormat
} from '../../model/json/TableUtils.js';
```

#### 1.2 Update Table Generation in AST Walker Callback

Find the table generation code in the AST walker and replace:

**OLD APPROACH**:
```typescript
// Generate table with columns/data format
if (bit.table) {
  if (bit.table.columns) {
    // Generate first row with [#title]
  }
  if (bit.table.data) {
    // Generate data rows
  }
}
```

**NEW APPROACH**:
```typescript
if (bit.table) {
  const table = bit.table;

  // Handle format conversion
  if (isOldTableFormat(table)) {
    // Convert old to new format
    const converted = convertOldToNewTableFormat(table);
    this.generateTable(converted);
  } else if (isNewTableFormat(table)) {
    this.generateTable(table);
  } else {
    // Empty or invalid table
    this.addWarning('Table has no valid format data');
  }
}
```

#### 1.3 Implement generateTable Method

```typescript
private generateTable(table: TableJson): void {
  // Generate thead section
  if (table.head && table.head.rows.length > 0) {
    this.generateTableSection('thead', table.head);
  }

  // Generate tbody section
  if (table.body && table.body.rows.length > 0) {
    // If thead exists, tbody needs explicit qualifier
    // If no thead, tbody can be implicit (no qualifier)
    const needsQualifier = !!table.head || !!table.foot;
    this.generateTableSection('tbody', table.body, !needsQualifier);
  }

  // Generate tfoot section
  if (table.foot && table.foot.rows.length > 0) {
    this.generateTableSection('tfoot', table.foot);
  }
}
```

#### 1.4 Implement generateTableSection Method

```typescript
private generateTableSection(
  sectionName: string,
  section: TableSectionJson,
  omitQualifier: boolean = false
): void {
  for (let i = 0; i < section.rows.length; i++) {
    const row = section.rows[i];
    const isFirstRowInSection = i === 0;

    // Generate card divider
    if (isFirstRowInSection && !omitQualifier) {
      this.output(`==== ${sectionName} ====`);
    } else {
      this.output('====');
    }
    this.newline();

    // Generate cells
    this.generateTableRow(row, sectionName);
  }
}
```

#### 1.5 Implement generateTableRow Method

```typescript
private generateTableRow(
  row: TableRowJson,
  currentSection: string
): void {
  for (let i = 0; i < row.cells.length; i++) {
    const cell = row.cells[i];
    const isFirstCell = i === 0;

    if (!isFirstCell) {
      this.output('--');
      this.newline();
    }

    this.generateTableCell(cell, currentSection);
  }
}
```

#### 1.6 Implement generateTableCell Method

```typescript
private generateTableCell(
  cell: TableCellJson,
  currentSection: string
): void {
  // Generate cell property tags
  const tags = this.buildCellPropertyTags(cell, currentSection);
  for (const tag of tags) {
    this.output(tag);
    this.newline();
  }

  // Generate cell content
  if (cell.content && cell.content.length > 0) {
    this.generateJsonText(cell.content);
  }
}
```

#### 1.7 Implement buildCellPropertyTags Method

```typescript
private buildCellPropertyTags(
  cell: TableCellJson,
  currentSection: string
): string[] {
  const tags: string[] = [];

  // Get default cell type for this section
  const defaultIsTitle = currentSection === 'thead' || currentSection === 'tfoot';

  // Generate @tableCellType if different from default
  if (cell.title !== undefined) {
    const shouldOmit = cell.title === defaultIsTitle;
    if (!shouldOmit) {
      const cellType = cell.title ? 'th' : 'td';
      tags.push(`[@tableCellType:${cellType}]`);
    }
  }

  // Generate @tableRowSpan if > 1
  if (cell.rowspan && cell.rowspan > 1) {
    tags.push(`[@tableRowSpan:${cell.rowspan}]`);
  }

  // Generate @tableColSpan if > 1
  if (cell.colspan && cell.colspan > 1) {
    tags.push(`[@tableColSpan:${cell.colspan}]`);
  }

  // Generate @tableScope if present
  if (cell.scope) {
    tags.push(`[@tableScope:${cell.scope}]`);
  }

  return tags;
}
```

#### 1.8 Implement Closing Divider

Don't forget to close the table:

```typescript
private generateTable(table: TableJson): void {
  // ... generate sections

  // Close table
  this.output('====');
  this.newline();
}
```

### 2. Update JsonGenerator

#### Location
`src/generator/json/JsonGenerator.ts`

#### 2.1 Table JSON Output

The JSON generator reads from AST and outputs JSON. If the AST was built from new format, it should output new format. If built from old format (converted), output new format.

**Key principle**: Always output new format from AST.

```typescript
private generateTableJson(table: TableJson): void {
  // AST should always have new format
  // Old format only exists in legacy JSON input

  if (isNewTableFormat(table)) {
    // Output new format as-is
    return table;
  } else if (isOldTableFormat(table)) {
    // This shouldn't happen if parser works correctly
    // But handle it defensively
    this.addWarning('AST contains old table format, converting to new');
    return convertOldToNewTableFormat(table);
  } else {
    this.addError('Table has no valid format data');
    return {};
  }
}
```

### 3. Optimization: Omit Default Values

To keep output clean, omit properties when they match defaults:

```typescript
function buildTableCellJson(
  cell: ParsedTableCell,
  currentSection: string
): TableCellJson {
  const json: TableCellJson = {
    content: cell.content
  };

  // Section defaults
  const defaultIsTitle =
    currentSection === 'thead' || currentSection === 'tfoot';

  // Only include title if different from section default
  if (cell.title !== undefined && cell.title !== defaultIsTitle) {
    json.title = cell.title;
  }

  // Only include spans if > 1
  if (cell.rowspan && cell.rowspan > 1) {
    json.rowspan = cell.rowspan;
  }
  if (cell.colspan && cell.colspan > 1) {
    json.colspan = cell.colspan;
  }

  // Only include scope if present
  if (cell.scope) {
    json.scope = cell.scope;
  }

  return json;
}
```

### 4. Handle Mixed Format in JSON Generator

If input JSON has both old and new formats:

```typescript
function normalizeTableJson(table: TableJson): TableJson {
  if (isOldTableFormat(table) && isNewTableFormat(table)) {
    // Mixed format: new takes precedence, discard old
    const { columns, data, ...newFormat } = table;
    return newFormat;
  }
  return table;
}
```

## Pretty Printing Considerations

### Spacing

```bitmark
[.table]

==== thead ====
Header 1
--
Header 2
====
Row 1 Cell 1
--
Row 1 Cell 2
====
```

### Indentation

Cell property tags should align:
```bitmark
====
[@tableRowSpan:2]
[@tableColSpan:3]
[@tableScope:colgroup]
Cell content
====
```

## Files to Modify

- `src/generator/bitmark/BitmarkGenerator.ts` - Main bitmark generation
- `src/generator/bitmark/BitmarkStringGenerator.ts` - String output variant
- `src/generator/bitmark/BitmarkFileGenerator.ts` - File output variant
- `src/generator/json/JsonGenerator.ts` - JSON generation
- `src/generator/json/JsonStringGenerator.ts` - String output variant
- `src/generator/json/JsonFileGenerator.ts` - File output variant

## Testing Strategy

### Unit Tests

Create `test/generator/table-advanced.test.ts`:

1. **Section generation**
   - Single section (tbody)
   - Multiple sections (thead + tbody)
   - All sections (thead + tbody + tfoot)
   - Empty sections (omitted)

2. **Cell property generation**
   - All properties individually
   - Multiple properties per cell
   - Default values (omitted)
   - Non-default values (included)

3. **Qualifier generation**
   - First row in section has qualifier
   - Subsequent rows no qualifier
   - Tbody implicit when no other sections

4. **Old format conversion**
   - Old JSON → New bitmark
   - columns → thead
   - data → tbody

### Integration Tests

1. **Round-trip tests**
   - New bitmark → JSON → bitmark (identical)
   - New JSON → bitmark → JSON (identical)
   - Old JSON → bitmark → new JSON (converted)

2. **Complex examples**
   - Spec example table (from SPEC doc)
   - Tables with all cell properties
   - Tables with rowspan/colspan
   - Multi-section tables

### Regression Tests

- All existing table tests must pass
- Generate same output for unchanged tables
- Old format tables should generate new format

## Output Examples

### Simple Table (No Qualifiers Needed)

**Input JSON**:
```json
{
  "table": {
    "body": {
      "rows": [
        {"cells": [{"content": [["A"]]}, {"content": [["B"]]}]},
        {"cells": [{"content": [["1"]]}, {"content": [["2"]]}]}
      ]
    }
  }
}
```

**Output Bitmark**:
```bitmark
[.table]

====
A
--
B
====
1
--
2
====
```

### Table with Header

**Input JSON**:
```json
{
  "table": {
    "head": {
      "rows": [
        {"cells": [{"content": [["Name"]], "title": true}, {"content": [["Age"]], "title": true}]}
      ]
    },
    "body": {
      "rows": [
        {"cells": [{"content": [["Alice"]]}, {"content": [["30"]]}]}
      ]
    }
  }
}
```

**Output Bitmark**:
```bitmark
[.table]

==== thead ====
Name
--
Age
====
Alice
--
30
====
```

### Table with Cell Properties

**Input JSON**:
```json
{
  "table": {
    "body": {
      "rows": [
        {
          "cells": [
            {"content": [["Merged"]], "colspan": 2, "rowspan": 2},
            {"content": [["B"]]}
          ]
        }
      ]
    }
  }
}
```

**Output Bitmark**:
```bitmark
[.table]

====
[@tableColSpan:2]
[@tableRowSpan:2]
Merged
--
B
====
```

## Performance Considerations

- Section iteration is O(n) where n = total cells
- Tag building is O(1) per cell
- String concatenation uses StringBuilder pattern
- No redundant format checks

## Acceptance Criteria

- [ ] generateTable() method implemented
- [ ] generateTableSection() method implemented
- [ ] generateTableRow() method implemented
- [ ] generateTableCell() method implemented
- [ ] buildCellPropertyTags() method implemented
- [ ] Qualified dividers generated correctly
- [ ] Cell property tags generated correctly
- [ ] Default values omitted
- [ ] Old format converted to new
- [ ] JSON generator outputs new format
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Round-trip tests pass
- [ ] Regression tests pass
- [ ] Pretty printing correct
