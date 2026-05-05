# PLAN: `[@tableColWidth]` for `[.table]` Bits

## Context

`[@tableColWidth:<number>]` already works in `[.table-extended]`:

- Parser stores it per‑cell as `TableCellJson.colwidth`.
- Generator emits it from `cell.colwidth`.

For `[.table]` bits the parser drops it because:

- `[.table]` JSON uses the basic format (`columns` + `data`), not per‑cell objects.
- `convertExtendedToBasicTableFormat` (`src/parser/json/TableUtils.ts`) discards `cell.colwidth`.

This plan adds first‑class support for `[@tableColWidth]` in `[.table]` via a new
table‑level array `columnWidths`, and makes the table ↔ table‑extended converter
lossless for column widths.

## JSON Shape

```ts
interface TableJson {
  columns: JsonText[];
  data: JsonText[][];
  columnWidths?: (number | null)[]; // NEW
}
```

`columnWidths`:

- Length always equals number of columns (`columns.length`).
- Each entry is `number` if a width is set for that column, otherwise `null`.
- Omitted entirely when no width is set on any column.
- `[.table-extended]` JSON shape is unchanged (still per‑cell `colwidth`).

## Functional Requirements

### Parser (Bitmark → JSON, `[.table]`)

1. `[@tableColWidth:N]` is accepted on any cell (header card or data card). No warning when used on data cards.
2. Aggregation rule per column index `c`:
   - Iterate cells row‑by‑row, in card order; within a row, by sequential cell index.
   - Each cell with `tableColWidth` sets `columnWidths[c] = N`. Later writes override earlier ones.
   - Cell column index is the sequential cell index within its row (`[.table]` does not support spans; any `tableColSpan`/`tableRowSpan` on `[.table]` cells is dropped, as today).
3. After aggregation:
   - If any width is set, emit `columnWidths` with length = number of columns; unset entries are `null`.
   - If no widths are set, omit `columnWidths`.
4. Per‑cell `colwidth` is **not** emitted on `[.table]` JSON (it's table‑level only).
5. `[.table-extended]` parsing is unchanged.

### JSON → AST (`Builder.buildTable`)

6. When normalising input JSON for `[.table]`:
   - Pass through `columnWidths` unchanged on `TableJson`.
   - Validate entries are `number | null`; ignore other values with a warning (see Validation).
   - If length > number of columns, truncate; if shorter, treat missing tail as all‑`null`.

### Format Conversion (`src/parser/json/TableUtils.ts`)

7. `convertBasicToExtendedTableFormat` (basic → extended):
   - For each `i` where `columnWidths[i]` is a positive number, set `cell.colwidth = columnWidths[i]` on:
     - the column header cell at index `i` (i.e. `header.rows[0].cells[i]`), if a header row was produced from `columns`;
     - otherwise on `body.rows[0].cells[i]` if a body row exists;
     - otherwise no destination — drop silently.
8. `convertExtendedToBasicTableFormat` (extended → basic):
   - Build `columnWidths` by walking all rows (header → body → footer) in order; for each cell at sequential index `c` with `cell.colwidth > 0`, set `columnWidths[c] = colwidth` (later overrides earlier).
   - Length = `columns.length` (or, when there is no header, the maximum cell count seen across rows).
   - If no widths found, omit `columnWidths`.

### Generator (AST/JSON → Bitmark, `[.table]`)

9. No new logic required: `BitmarkGenerator.writeAdvancedTable` already
   normalises to extended format via `normalizeTableFormat(BitType.tableExtended, …)`. With (7) in place, widths land on the header cells and the existing `writeTableCell` path emits `[@tableColWidth:N]`.

### Generator (AST → JSON)

10. JSON output for `[.table]` AST nodes already serialises the `TableJson` verbatim. No change beyond the new optional field. Verify `null` entries serialise as JSON `null`.

### Round‑trip Preservation

11. `[.table]` bitmark with widths → JSON → bitmark: widths preserved.
12. `[.table-extended]` JSON with `cell.colwidth` → AST → `[.table-extended]` JSON: unchanged (existing behaviour).
13. Cross‑format conversion (when consumers swap `bitType` between `.table` and `.table-extended` in JSON):
    - `[.table-extended]` JSON → `[.table]` bit: per‑cell `colwidth` is collapsed into table‑level `columnWidths` via (8).
    - `[.table]` JSON with `columnWidths` → `[.table-extended]` bit: widths placed on header cells via (7).

## Non‑Functional Requirements

### Validation

| Rule                                          | Action                                |
| --------------------------------------------- | ------------------------------------- |
| `tableColWidth` value not a number ≥ 1        | warning; ignore that occurrence       |
| `columnWidths[i]` not `number \| null`        | warning; coerce entry to `null`       |
| `columnWidths` length > columns count         | truncate; warning                     |
| `tableColWidth` on a `[.table]` data card     | accepted; **no** warning              |
| `tableColSpan` / `tableRowSpan` on `[.table]` | dropped (existing behaviour)          |

### Compatibility

- `TableJson` gains an optional field; existing JSON without `columnWidths` is unaffected.
- `[.table-extended]` JSON shape unchanged.
- Schema: `BitJson.schema.json` `TableJson` definition gets `columnWidths`.

## Files to Touch

| File                                                                | Change                                                         |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| `src/model/json/BitJson.ts`                                         | Add `columnWidths?: (number \| null)[]` to `TableJson`         |
| `src/model/json/BitJson.schema.json`                                | Schema entry for `columnWidths`                                |
| `src/parser/json/TableUtils.ts`                                     | Update both converters; preserve widths both ways              |
| `src/ast/Builder.ts` (`buildTable`)                                 | Carry `columnWidths` through; validate entries                 |
| `src/parser/bitmark/peg/contentProcessors/CardContentProcessor.ts`  | No change needed if conversion in `TableUtils` runs downstream — verify path |
| `src/config/raw/cardSets.ts`                                        | `tableColWidth` already present for `[.table]` (line 673); no change |
| `test/standard/input/bitmark/table.bitmark`                         | Add `[@tableColWidth:N]` examples (header card + data card)    |
| `test/standard/input/bitmark/json/table.json`                       | Expected output with `columnWidths`                            |
| Round‑trip fixtures                                                 | Regenerate via `npm run regenerate-bitmark-test-json`          |

## Implementation Steps

1. Add `columnWidths?: (number \| null)[]` to `TableJson` (TS + JSON schema).
2. Update `convertExtendedToBasicTableFormat` to aggregate `cell.colwidth` → `columnWidths`.
3. Update `convertBasicToExtendedTableFormat` to write `columnWidths[i]` → `cell.colwidth` on the chosen target cell (header > body).
4. Update `Builder.buildTable` to validate and pass through `columnWidths` for `[.table]`.
5. Verify the parser path: bitmark → `parseTable` → `TableExtendedJson` → `normalizeTableFormat` → basic with `columnWidths`. Adjust if the conversion isn't on this path.
6. Add bitmark/JSON test fixtures covering:
   - header card only with widths;
   - data card overriding header card;
   - mixed (some columns set, others not — verify `null` entries);
   - no widths (no `columnWidths` in JSON);
   - cross‑format: `[.table-extended]` JSON with `cell.colwidth` parsed into `[.table]` bit (and vice versa).
7. Run `npm run regenerate-bitmark-test-json`, `npm run check`, `npm test`.

## Out of Scope

- Visual width units / px vs %.
- Per‑cell width on `[.table]` JSON (table‑level only).
- Span‑aware column indexing on `[.table]` (spans not supported there).
- Changes to `[.table-extended]` per‑cell semantics.
