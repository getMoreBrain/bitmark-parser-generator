# PLAN-001: Model Layer Updates for Advanced Tables

**Spec**: SPEC-table-advanced.md
**Layer**: Model Layer
**Dependencies**: None
**Status**: Not Started

## Overview

Update TypeScript type definitions to support the new enhanced table JSON structure with semantic sections (thead, tbody, tfoot) and cell-level properties (rowspan, colspan, scope, cell type).

## Objectives

- Define new table JSON interfaces
- Maintain backwards compatibility with old format
- Support cell-level properties
- Enable section-based table structure

## Changes Required

### 1. New Interfaces in `src/model/json/BitJson.ts`

#### Add TableSectionJson
```typescript
export interface TableSectionJson {
  rows: TableRowJson[];
}
```

#### Add TableRowJson
```typescript
export interface TableRowJson {
  cells: TableCellJson[];
}
```

#### Add TableCellJson
```typescript
export interface TableCellJson {
  content: JsonText;        // Cell content as bitmark text
  title?: boolean;          // true if th, false/undefined if td
  rowspan?: number;         // Omit if 1
  colspan?: number;         // Omit if 1
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup';
}
```

#### Update TableJson Interface
```typescript
export interface TableJson {
  // LEGACY: Backwards compatible (deprecated but supported)
  columns?: JsonText[];  // Old format: first row as columns
  data?: JsonText[][];   // Old format: remaining rows as data

  // NEW: Semantic table structure
  head?: TableSectionJson;
  body?: TableSectionJson;
  foot?: TableSectionJson;
}
```

### 2. AST Node Extensions in `src/model/ast/`

#### Update CardData Interface
```typescript
export interface CardData {
  cardIndex: number;
  cardSideIndex: number;
  cardVariantIndex: number;
  value: string;
  qualifier?: string;  // NEW: 'thead' | 'tbody' | 'tfoot' | custom
}
```

### 3. Type Guards and Utilities

Add utility functions in appropriate location:

```typescript
// Type guards for old vs new format
export function isOldTableFormat(table: TableJson): boolean {
  return !!(table.columns || table.data) &&
         !(table.head || table.body || table.foot);
}

export function isNewTableFormat(table: TableJson): boolean {
  return !!(table.head || table.body || table.foot);
}

// Conversion utility
export function convertOldToNewTableFormat(oldTable: TableJson): TableJson {
  const newTable: TableJson = {};

  if (oldTable.columns) {
    newTable.head = {
      rows: [{
        cells: oldTable.columns.map(col => ({
          content: col,
          title: true
        }))
      }]
    };
  }

  if (oldTable.data) {
    newTable.body = {
      rows: oldTable.data.map(row => ({
        cells: row.map(cell => ({
          content: cell
        }))
      }))
    };
  }

  return newTable;
}
```

## Files to Modify

- `src/model/json/BitJson.ts` - Add new interfaces
- `src/model/ast/Nodes.ts` - Update CardData interface
- `src/model/json/TableUtils.ts` (NEW) - Add utility functions

## Validation Rules

- `content` is required in TableCellJson
- `title`, `rowspan`, `colspan`, `scope` are optional
- `rowspan` and `colspan` must be ≥ 1 if present
- `scope` must be one of: 'row', 'col', 'rowgroup', 'colgroup'
- At least one of old format or new format fields must be present

## Testing Requirements

- Unit tests for type guards
- Unit tests for conversion utilities
- Validation tests for invalid values
- JSON schema validation tests

## Non-Functional Requirements

- All interfaces must extend or compose existing types
- No breaking changes to existing TableJson usage
- Full TypeScript type safety
- JSDoc comments for all new interfaces

## Acceptance Criteria

- [ ] All new interfaces defined with complete JSDoc
- [ ] CardData interface updated with qualifier field
- [ ] Type guards implemented and tested
- [ ] Conversion utility implemented and tested
- [ ] Backwards compatibility maintained
- [ ] TypeScript compilation successful
- [ ] All tests passing
