# PLAN-005: Validation and Testing for Advanced Tables

**Spec**: SPEC-table-advanced.md
**Layer**: Cross-cutting (All Layers)
**Dependencies**: PLAN-001, PLAN-002, PLAN-003, PLAN-004
**Status**: Not Started

## Overview

Comprehensive validation and testing strategy for advanced tables, covering all layers from grammar to generator, including edge cases, error handling, and backwards compatibility verification.

## Objectives

- Validate table structure and properties
- Comprehensive test coverage (>95%)
- Edge case handling
- Error message clarity
- Backwards compatibility verification
- Performance benchmarking

## Validation Rules

### 1. Table Structure Validation

#### At Parser Level

**Location**: `src/parser/bitmark/peg/validators/TableValidator.ts` (NEW)

```typescript
export class TableValidator {
  static validateTableJson(
    table: TableJson,
    context: ValidationContext
  ): void {
    // Rule: Table must have at least one section
    if (!table.head && !table.body && !table.foot &&
        !table.columns && !table.data) {
      context.addError('Table must have at least one section or data');
    }

    // Validate each section
    if (table.head) {
      this.validateSection('head', table.head, context);
    }
    if (table.body) {
      this.validateSection('body', table.body, context);
    }
    if (table.foot) {
      this.validateSection('foot', table.foot, context);
    }
  }

  static validateSection(
    sectionName: string,
    section: TableSectionJson,
    context: ValidationContext
  ): void {
    if (!section.rows || section.rows.length === 0) {
      // Empty section is valid, but may want to warn
      context.addWarning(`Table ${sectionName} section is empty`);
      return;
    }

    // Validate row consistency
    const cellCounts: number[] = [];
    for (const row of section.rows) {
      const count = this.validateRow(row, context);
      cellCounts.push(count);
    }

    // Check if all rows have same cell count (accounting for colspan)
    // This is a warning, not error, as colspan can make counts vary
    const uniqueCounts = new Set(cellCounts);
    if (uniqueCounts.size > 1) {
      context.addWarning(
        `Table ${sectionName} rows have inconsistent cell counts: ` +
        `${Array.from(uniqueCounts).join(', ')}. ` +
        `This may be intentional with colspan/rowspan.`
      );
    }
  }

  static validateRow(
    row: TableRowJson,
    context: ValidationContext
  ): number {
    if (!row.cells || row.cells.length === 0) {
      context.addError('Table row must have at least one cell');
      return 0;
    }

    let effectiveCellCount = 0;
    for (const cell of row.cells) {
      this.validateCell(cell, context);
      effectiveCellCount += cell.colspan || 1;
    }

    return effectiveCellCount;
  }

  static validateCell(
    cell: TableCellJson,
    context: ValidationContext
  ): void {
    // Rule: Cell must have content
    if (!cell.content) {
      context.addError('Table cell must have content');
    }

    // Validate rowspan
    if (cell.rowspan !== undefined) {
      if (!Number.isInteger(cell.rowspan) || cell.rowspan < 1) {
        context.addError(
          `Invalid rowspan: ${cell.rowspan}. Must be integer >= 1`
        );
      }
    }

    // Validate colspan
    if (cell.colspan !== undefined) {
      if (!Number.isInteger(cell.colspan) || cell.colspan < 1) {
        context.addError(
          `Invalid colspan: ${cell.colspan}. Must be integer >= 1`
        );
      }
    }

    // Validate scope
    if (cell.scope !== undefined) {
      const validScopes = ['row', 'col', 'rowgroup', 'colgroup'];
      if (!validScopes.includes(cell.scope)) {
        context.addError(
          `Invalid scope: ${cell.scope}. ` +
          `Must be one of: ${validScopes.join(', ')}`
        );
      }
    }

    // Validate title (boolean)
    if (cell.title !== undefined && typeof cell.title !== 'boolean') {
      context.addError(`Invalid title: ${cell.title}. Must be boolean`);
    }
  }
}
```

### 2. Qualifier Validation

Already implemented in PLAN-003, but ensure comprehensive:

```typescript
export function validateQualifier(
  qualifier: string | null,
  bitType: BitTypeType,
  context: ValidationContext
): void {
  if (!qualifier) return;

  // Check if bit supports qualifiers
  const validQualifiers = getValidQualifiersForBitType(bitType);

  if (validQualifiers.length === 0) {
    context.addWarning(
      `Bit type '${bitType}' does not support qualifiers. ` +
      `Ignoring qualifier '${qualifier}'.`
    );
    return;
  }

  // Check if qualifier is valid for this bit
  if (!validQualifiers.includes(qualifier)) {
    context.addWarning(
      `Invalid qualifier '${qualifier}' for bit type '${bitType}'. ` +
      `Valid qualifiers: ${validQualifiers.join(', ')}`
    );
  }
}
```

## Test Suite Structure

### Directory Structure

```
test/
├── standard/
│   ├── table-advanced/
│   │   ├── input/
│   │   │   ├── bitmark/
│   │   │   │   ├── simple-tbody.bit
│   │   │   │   ├── with-thead.bit
│   │   │   │   ├── all-sections.bit
│   │   │   │   ├── cell-properties.bit
│   │   │   │   ├── complex-example.bit
│   │   │   │   └── edge-cases/
│   │   │   └── json/
│   │   │       ├── simple-tbody.json
│   │   │       ├── with-thead.json
│   │   │       ├── all-sections.json
│   │   │       ├── cell-properties.json
│   │   │       ├── complex-example.json
│   │   │       ├── old-format.json
│   │   │       └── edge-cases/
│   │   └── expected/
│   │       ├── bitmark/
│   │       └── json/
│   └── table-backwards-compat/
│       └── (existing table tests)
└── unit/
    ├── parser/
    │   └── table-advanced.test.ts
    ├── generator/
    │   └── table-advanced.test.ts
    ├── validator/
    │   └── table-validator.test.ts
    └── model/
        └── table-utils.test.ts
```

### Test Categories

## 1. Unit Tests

### 1.1 Model Layer Tests

**File**: `test/unit/model/table-utils.test.ts`

```typescript
describe('Table Utils', () => {
  describe('isOldTableFormat', () => {
    it('returns true for old format', () => {
      const table: TableJson = {
        columns: [['A']],
        data: [[['1']]]
      };
      expect(isOldTableFormat(table)).toBe(true);
    });

    it('returns false for new format', () => {
      const table: TableJson = {
        body: { rows: [{ cells: [{ content: [['1']] }] }] }
      };
      expect(isOldTableFormat(table)).toBe(false);
    });
  });

  describe('convertOldToNewTableFormat', () => {
    it('converts columns to thead', () => {
      const old: TableJson = {
        columns: [['Name'], ['Age']],
        data: [[['Alice'], ['30']]]
      };
      const converted = convertOldToNewTableFormat(old);

      expect(converted.head).toBeDefined();
      expect(converted.head!.rows).toHaveLength(1);
      expect(converted.head!.rows[0].cells).toHaveLength(2);
      expect(converted.head!.rows[0].cells[0].title).toBe(true);
    });

    it('converts data to tbody', () => {
      const old: TableJson = {
        columns: [['H1']],
        data: [[['R1']], [['R2']]]
      };
      const converted = convertOldToNewTableFormat(old);

      expect(converted.body).toBeDefined();
      expect(converted.body!.rows).toHaveLength(2);
    });
  });
});
```

### 1.2 Parser Tests

**File**: `test/unit/parser/table-advanced.test.ts`

```typescript
describe('Table Parser - Advanced', () => {
  describe('Section parsing', () => {
    it('parses single tbody section', () => {
      const bitmark = `
[.table]

====
Cell 1
====
      `.trim();

      const result = parser.parse(bitmark);
      const table = result.bits[0].table!;

      expect(table.body).toBeDefined();
      expect(table.body!.rows).toHaveLength(1);
      expect(table.head).toBeUndefined();
      expect(table.foot).toBeUndefined();
    });

    it('parses thead and tbody sections', () => {
      const bitmark = `
[.table]

==== thead ====
Header
====
Data
====
      `.trim();

      const result = parser.parse(bitmark);
      const table = result.bits[0].table!;

      expect(table.head).toBeDefined();
      expect(table.body).toBeDefined();
      expect(table.head!.rows).toHaveLength(1);
      expect(table.body!.rows).toHaveLength(1);
    });

    it('parses all three sections', () => {
      const bitmark = `
[.table]

==== thead ====
Header
====
Data
==== tfoot ====
Footer
====
      `.trim();

      const result = parser.parse(bitmark);
      const table = result.bits[0].table!;

      expect(table.head).toBeDefined();
      expect(table.body).toBeDefined();
      expect(table.foot).toBeDefined();
    });

    it('handles interleaved sections', () => {
      const bitmark = `
[.table]

==== thead ====
H1
==== tbody ====
D1
==== thead ====
H2
==== tbody ====
D2
====
      `.trim();

      const result = parser.parse(bitmark);
      const table = result.bits[0].table!;

      // Both sections should contain merged rows
      expect(table.head!.rows).toHaveLength(2);
      expect(table.body!.rows).toHaveLength(2);
    });
  });

  describe('Cell properties', () => {
    it('parses @tableCellType', () => {
      const bitmark = `
[.table]

====
[@tableCellType:th]
Header Cell
====
      `.trim();

      const result = parser.parse(bitmark);
      const cell = result.bits[0].table!.body!.rows[0].cells[0];

      expect(cell.title).toBe(true);
    });

    it('parses @tableRowSpan', () => {
      const bitmark = `
[.table]

====
[@tableRowSpan:2]
Spanning Cell
====
      `.trim();

      const result = parser.parse(bitmark);
      const cell = result.bits[0].table!.body!.rows[0].cells[0];

      expect(cell.rowspan).toBe(2);
    });

    it('parses @tableColSpan', () => {
      const bitmark = `
[.table]

====
[@tableColSpan:3]
Wide Cell
====
      `.trim();

      const result = parser.parse(bitmark);
      const cell = result.bits[0].table!.body!.rows[0].cells[0];

      expect(cell.colspan).toBe(3);
    });

    it('parses @tableScope', () => {
      const bitmark = `
[.table]

==== thead ====
[@tableScope:col]
Column Header
====
      `.trim();

      const result = parser.parse(bitmark);
      const cell = result.bits[0].table!.head!.rows[0].cells[0];

      expect(cell.scope).toBe('col');
    });

    it('parses multiple properties on same cell', () => {
      const bitmark = `
[.table]

====
[@tableRowSpan:2]
[@tableColSpan:3]
[@tableScope:colgroup]
[@tableCellType:th]
Complex Cell
====
      `.trim();

      const result = parser.parse(bitmark);
      const cell = result.bits[0].table!.body!.rows[0].cells[0];

      expect(cell.rowspan).toBe(2);
      expect(cell.colspan).toBe(3);
      expect(cell.scope).toBe('colgroup');
      expect(cell.title).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('warns on invalid qualifier', () => {
      const bitmark = `
[.table]

==== invalid ====
Cell
====
      `.trim();

      const result = parser.parse(bitmark);

      expect(result.warnings).toContain(
        expect.stringContaining('Unknown table section qualifier')
      );
    });

    it('warns on invalid rowspan', () => {
      const bitmark = `
[.table]

====
[@tableRowSpan:0]
Cell
====
      `.trim();

      const result = parser.parse(bitmark);

      expect(result.warnings).toContain(
        expect.stringContaining('Invalid @tableRowSpan value')
      );
    });
  });
});
```

### 1.3 Generator Tests

**File**: `test/unit/generator/table-advanced.test.ts`

```typescript
describe('Table Generator - Advanced', () => {
  describe('Qualified dividers', () => {
    it('generates thead qualifier', () => {
      const table: TableJson = {
        head: {
          rows: [{ cells: [{ content: [['Header']], title: true }] }]
        }
      };

      const bitmark = generator.generateTable(table);

      expect(bitmark).toContain('==== thead ====');
    });

    it('omits tbody qualifier when no other sections', () => {
      const table: TableJson = {
        body: {
          rows: [{ cells: [{ content: [['Data']] }] }]
        }
      };

      const bitmark = generator.generateTable(table);

      expect(bitmark).not.toContain('tbody');
      expect(bitmark).toContain('====\nData');
    });

    it('includes tbody qualifier when thead exists', () => {
      const table: TableJson = {
        head: {
          rows: [{ cells: [{ content: [['Header']], title: true }] }]
        },
        body: {
          rows: [{ cells: [{ content: [['Data']] }] }]
        }
      };

      const bitmark = generator.generateTable(table);

      expect(bitmark).toContain('==== thead ====');
      expect(bitmark).toContain('====\nData'); // tbody is implicit
    });
  });

  describe('Cell properties', () => {
    it('generates @tableRowSpan when > 1', () => {
      const table: TableJson = {
        body: {
          rows: [{
            cells: [{ content: [['Cell']], rowspan: 2 }]
          }]
        }
      };

      const bitmark = generator.generateTable(table);

      expect(bitmark).toContain('[@tableRowSpan:2]');
    });

    it('omits @tableRowSpan when = 1', () => {
      const table: TableJson = {
        body: {
          rows: [{
            cells: [{ content: [['Cell']], rowspan: 1 }]
          }]
        }
      };

      const bitmark = generator.generateTable(table);

      expect(bitmark).not.toContain('@tableRowSpan');
    });

    it('omits @tableCellType when default for section', () => {
      const table: TableJson = {
        head: {
          rows: [{
            cells: [{ content: [['Header']], title: true }]
          }]
        }
      };

      const bitmark = generator.generateTable(table);

      // thead defaults to th, so no need for tag
      expect(bitmark).not.toContain('@tableCellType');
    });

    it('includes @tableCellType when different from default', () => {
      const table: TableJson = {
        head: {
          rows: [{
            cells: [{ content: [['Data']], title: false }]
          }]
        }
      };

      const bitmark = generator.generateTable(table);

      // thead defaults to th, but this is td
      expect(bitmark).toContain('[@tableCellType:td]');
    });
  });

  describe('Old format conversion', () => {
    it('converts old format to new bitmark', () => {
      const table: TableJson = {
        columns: [['Name'], ['Age']],
        data: [[['Alice'], ['30']]]
      };

      const bitmark = generator.generateTable(table);

      expect(bitmark).toContain('==== thead ====');
      expect(bitmark).toContain('Name');
      expect(bitmark).toContain('Alice');
    });
  });
});
```

## 2. Integration Tests

### 2.1 Round-Trip Tests

**File**: `test/standard/table-advanced-roundtrip.test.ts`

```typescript
describe('Table Advanced - Round Trip', () => {
  describe('Bitmark → JSON → Bitmark', () => {
    it('preserves simple table', () => {
      const original = `
[.table]

====
A
--
B
====
      `.trim();

      const json = parser.toJson(original);
      const regenerated = generator.toBitmark(json);

      expect(normalize(regenerated)).toBe(normalize(original));
    });

    it('preserves table with sections', () => {
      const original = `
[.table]

==== thead ====
Header
====
Data
==== tfoot ====
Footer
====
      `.trim();

      const json = parser.toJson(original);
      const regenerated = generator.toBitmark(json);

      expect(normalize(regenerated)).toBe(normalize(original));
    });

    it('preserves cell properties', () => {
      const original = `
[.table]

====
[@tableRowSpan:2]
[@tableColSpan:3]
[@tableScope:colgroup]
Cell
====
      `.trim();

      const json = parser.toJson(original);
      const regenerated = generator.toBitmark(json);

      expect(normalize(regenerated)).toBe(normalize(original));
    });
  });

  describe('JSON → Bitmark → JSON', () => {
    it('preserves new format', () => {
      const original: BitJson = {
        type: 'table',
        table: {
          head: {
            rows: [{ cells: [{ content: [['H1']], title: true }] }]
          },
          body: {
            rows: [{ cells: [{ content: [['D1']] }] }]
          }
        }
      };

      const bitmark = generator.toBitmark(original);
      const regenerated = parser.toJson(bitmark);

      expect(regenerated).toEqual(original);
    });
  });
});
```

### 2.2 Complex Example Test

Parse the full example from the spec (Section 4):

**File**: `test/standard/table-advanced/input/bitmark/complex-example.bit`

Contains the full "Sample Quarterly Summary" table from the spec.

**Test**:
```typescript
it('parses complex spec example correctly', () => {
  const bitmark = fs.readFileSync(
    'test/standard/table-advanced/input/bitmark/complex-example.bit',
    'utf-8'
  );

  const result = parser.toJson(bitmark);
  const table = result.bits[0].table!;

  // Verify structure
  expect(table.head).toBeDefined();
  expect(table.body).toBeDefined();
  expect(table.foot).toBeDefined();

  // Verify head has 2 rows
  expect(table.head!.rows).toHaveLength(2);

  // Verify first head row has rowspan/colspan
  const firstHeadCell = table.head!.rows[0].cells[0];
  expect(firstHeadCell.rowspan).toBe(2);
  expect(firstHeadCell.scope).toBe('col');

  // Verify foot has 2 rows
  expect(table.foot!.rows).toHaveLength(2);

  // Verify totals row
  const totalCell = table.foot!.rows[0].cells[0];
  expect(totalCell.colspan).toBe(5);
  expect(totalCell.scope).toBe('row');
});
```

## 3. Backwards Compatibility Tests

### 3.1 Existing Table Tests

**Critical**: All existing table tests must pass without modification.

Run existing tests:
```bash
npm test -- test/standard/bitmark-parser.test.ts -t "table"
```

Expected: **Zero failures**.

### 3.2 Old Format Conversion Tests

**File**: `test/standard/table-backwards-compat.test.ts`

```typescript
describe('Table Backwards Compatibility', () => {
  it('converts old JSON format', () => {
    const oldJson: BitJson = {
      type: 'table',
      table: {
        columns: [['Name'], ['Email']],
        data: [[['John'], ['john@example.com']]]
      }
    };

    const bitmark = generator.toBitmark(oldJson);
    const newJson = parser.toJson(bitmark);

    // Should have new format
    expect(newJson.bits[0].table!.head).toBeDefined();
    expect(newJson.bits[0].table!.body).toBeDefined();

    // Old format should not be present
    expect(newJson.bits[0].table!.columns).toBeUndefined();
    expect(newJson.bits[0].table!.data).toBeUndefined();
  });

  it('handles [#title] tag (legacy)', () => {
    const bitmark = `
[.table]

====
[#title]
Header 1
--
[#title]
Header 2
====
Row 1 Cell 1
--
Row 1 Cell 2
====
    `.trim();

    const json = parser.toJson(bitmark);
    const table = json.bits[0].table!;

    // First row with [#title] should become thead
    expect(table.head).toBeDefined();
    expect(table.head!.rows).toHaveLength(1);
    expect(table.head!.rows[0].cells).toHaveLength(2);

    // Second row should be tbody
    expect(table.body).toBeDefined();
    expect(table.body!.rows).toHaveLength(1);
  });
});
```

## 4. Edge Case Tests

### 4.1 Empty Sections

```typescript
it('handles empty thead section', () => {
  const table: TableJson = {
    head: { rows: [] },
    body: { rows: [{ cells: [{ content: [['Data']] }] }] }
  };

  const bitmark = generator.generateTable(table);

  // Empty section should not generate divider
  expect(bitmark).not.toContain('thead');
});
```

### 4.2 Section Transitions

```typescript
it('handles multiple tbody → thead → tbody transitions', () => {
  const bitmark = `
[.table]

====
D1
==== thead ====
H1
====
D2
==== thead ====
H2
====
D3
====
  `.trim();

  const result = parser.toJson(bitmark);
  const table = result.bits[0].table!;

  expect(table.head!.rows).toHaveLength(2);
  expect(table.body!.rows).toHaveLength(3);
});
```

### 4.3 Whitespace Variations

```typescript
describe('Qualifier whitespace', () => {
  it('rejects no spaces', () => {
    const bitmark = '====thead====';
    // Should parse as text, not qualified divider
  });

  it('rejects multiple spaces', () => {
    const bitmark = '====  thead  ====';
    // Should parse as text
  });

  it('rejects uneven spaces', () => {
    const bitmark = '==== thead====';
    // Should parse as text
  });

  it('accepts exactly one space', () => {
    const bitmark = '==== thead ====';
    // Should parse as qualified divider
  });
});
```

### 4.4 Malformed Cell Properties

```typescript
describe('Invalid cell properties', () => {
  it('warns on negative rowspan', () => {
    const table: TableJson = {
      body: {
        rows: [{ cells: [{ content: [['']], rowspan: -1 }] }]
      }
    };

    const result = validator.validate(table);
    expect(result.errors).toContain(
      expect.stringContaining('rowspan')
    );
  });

  it('warns on zero colspan', () => {
    const table: TableJson = {
      body: {
        rows: [{ cells: [{ content: [['']], colspan: 0 }] }]
      }
    };

    const result = validator.validate(table);
    expect(result.errors).toContain(
      expect.stringContaining('colspan')
    );
  });

  it('warns on invalid scope', () => {
    const table: TableJson = {
      body: {
        rows: [{
          cells: [{
            content: [['']],
            scope: 'invalid' as any
          }]
        }]
      }
    };

    const result = validator.validate(table);
    expect(result.errors).toContain(
      expect.stringContaining('scope')
    );
  });
});
```

## Test Data Files

Create comprehensive test data covering all scenarios:

### Input Files

```
test/standard/table-advanced/input/bitmark/
├── 01-simple-tbody.bit
├── 02-with-thead.bit
├── 03-with-tfoot.bit
├── 04-all-sections.bit
├── 05-cell-properties.bit
├── 06-rowspan-colspan.bit
├── 07-scope-variations.bit
├── 08-complex-example.bit (from spec)
├── 09-empty-sections.bit
├── 10-interleaved-sections.bit
└── edge-cases/
    ├── whitespace-variations.bit
    ├── unknown-qualifier.bit
    ├── invalid-properties.bit
    └── mixed-cell-types.bit
```

## Performance Tests

### Benchmark Suite

**File**: `test/performance/table-advanced.perf.ts`

```typescript
describe('Table Advanced - Performance', () => {
  it('parses large table efficiently', () => {
    const largeTable = generateTableBitmark({
      rows: 1000,
      cols: 20,
      withProperties: true
    });

    const start = performance.now();
    const result = parser.parse(largeTable);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(1000); // < 1 second
    expect(result.bits[0].table).toBeDefined();
  });

  it('generates large table efficiently', () => {
    const largeTable = generateTableJson({
      rows: 1000,
      cols: 20,
      withProperties: true
    });

    const start = performance.now();
    const bitmark = generator.generate(largeTable);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(1000); // < 1 second
    expect(bitmark).toContain('====');
  });
});
```

## Coverage Requirements

### Target: >95% Coverage

Run coverage:
```bash
npm run test:coverage
```

### Critical Paths

Must have 100% coverage:
- `parseTableWithSections()`
- `parseTableRow()`
- `parseTableCell()`
- `extractCellProperties()`
- `generateTable()`
- `generateTableSection()`
- `buildCellPropertyTags()`
- `TableValidator.validate*()`

## Continuous Integration

### GitHub Actions

Add to `.github/workflows/test.yml`:

```yaml
- name: Run Table Advanced Tests
  run: npm test -- test/standard/table-advanced --coverage

- name: Check Coverage
  run: |
    COVERAGE=$(npm run test:coverage:json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 95" | bc -l) )); then
      echo "Coverage $COVERAGE% is below 95%"
      exit 1
    fi
```

## Acceptance Criteria

- [ ] TableValidator implemented and tested
- [ ] All unit tests implemented and passing
- [ ] All integration tests implemented and passing
- [ ] Round-trip tests pass for all formats
- [ ] Complex spec example test passes
- [ ] All existing table tests pass (backwards compat)
- [ ] Edge case tests implemented and passing
- [ ] Performance benchmarks meet requirements
- [ ] Test coverage >95%
- [ ] All validation rules implemented
- [ ] Error messages are clear and actionable
- [ ] Documentation for test suite created
