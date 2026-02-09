import { Config } from '../../config/Config.ts';
import { BitType, type BitTypeType } from '../../model/enum/BitType.ts';
import type {
  TableCellJson,
  TableExtendedJson,
  TableJson,
  TableSectionJson,
} from '../../model/json/BitJson.ts';

/**
 * Type guard to check if table uses old format (columns/data)
 * @param table - Table JSON to check
 * @returns true if table uses old format
 */
export function isTableBasicFormat(table: TableJson | TableExtendedJson): boolean {
  const t = table as TableJson & TableExtendedJson;
  return !!(t.columns || t.data) && !(t.header || t.body || t.footer);
}

/**
 * Type guard to check if table uses new format (head/body/foot)
 * @param table - Table JSON to check
 * @returns true if table uses new format
 */
export function isTableExtendedFormat(table: TableJson | TableExtendedJson): boolean {
  const t = table as TableJson & TableExtendedJson;
  return !!(t.header || t.body || t.footer);
}

/**
 * Type guard to check if table uses mixed format (has both old and new fields)
 * @param table - Table JSON to check
 * @returns true if table has both old and new format fields
 */
export function isMixedTableFormat(table: TableJson | TableExtendedJson): boolean {
  const t = table as TableJson & TableExtendedJson;
  const hasOld = !!(t.columns || t.data);
  const hasNew = !!(t.header || t.body || t.footer);
  return hasOld && hasNew;
}

/**
 * Convert old table format (columns/data) to new format (head/body/foot)
 * @param table - Table in basic format
 * @returns Table in new format
 */
export function convertBasicToExtendedTableFormat(table: TableJson): TableExtendedJson {
  const tableExtended: TableExtendedJson = {};

  // Convert columns to table-header
  if (table.columns && table.columns.length > 0) {
    tableExtended.header = {
      rows: [
        {
          cells: table.columns.map((col) => ({
            content: col,
            title: true,
          })),
        },
      ],
    };
  }

  // Convert data to body
  if (table.data && table.data.length > 0) {
    tableExtended.body = {
      rows: table.data.map((row) => ({
        cells: row.map((cell) => ({
          content: cell,
        })),
      })),
    };
  }

  return tableExtended;
}

/**
 * Convert extended table format (header/body/footer) to basic format (columns/data)
 * @param table - Table in extended format
 * @returns Table in basic format
 */
export function convertExtendedToBasicTableFormat(tableExtended: TableExtendedJson): TableJson {
  const table = {} as TableJson;

  type LegacyRow = TableCellJson['content'][];

  const extractRowCells = (row: TableSectionJson['rows'][number] | undefined): LegacyRow => {
    if (!row || !Array.isArray(row.cells)) {
      return [];
    }

    return row.cells
      .map((cell) => cell?.content)
      .filter((content): content is TableCellJson['content'] => content !== undefined);
  };

  const dataRows: LegacyRow[] = [];

  const headRows = tableExtended.header?.rows ?? [];
  if (headRows.length > 0) {
    const primaryHeader = extractRowCells(headRows[0]);

    if (primaryHeader.length > 0) {
      table.columns = primaryHeader;
    }

    const remainingHeadRows = headRows.slice(1);
    remainingHeadRows.forEach((row) => {
      const cells = extractRowCells(row);
      if (cells.length > 0) {
        dataRows.push(cells);
      }
    });
  }

  const appendSectionRows = (section: TableSectionJson | undefined): void => {
    if (!section || !Array.isArray(section.rows)) {
      return;
    }

    section.rows.forEach((row) => {
      const cells = extractRowCells(row);
      if (cells.length > 0) {
        dataRows.push(cells);
      }
    });
  };

  appendSectionRows(tableExtended.body);
  appendSectionRows(tableExtended.footer);

  if (dataRows.length > 0) {
    table.data = dataRows;
  }

  return table;
}

/**
 * Validate TableCellJson properties
 * @param cell - Table cell to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateTableCell(cell: TableCellJson): string[] {
  const errors: string[] = [];

  // Validate content exists
  if (!cell.content) {
    errors.push('Cell content is required');
  }

  // Validate rowspan
  if (cell.rowspan !== undefined) {
    if (!Number.isInteger(cell.rowspan) || cell.rowspan < 1) {
      errors.push('rowspan must be an integer >= 1');
    }
  }

  // Validate colspan
  if (cell.colspan !== undefined) {
    if (!Number.isInteger(cell.colspan) || cell.colspan < 1) {
      errors.push('colspan must be an integer >= 1');
    }
  }

  // Validate scope
  if (cell.scope !== undefined) {
    const validScopes = ['row', 'col', 'rowgroup', 'colgroup'];
    if (!validScopes.includes(cell.scope)) {
      errors.push(`scope must be one of: ${validScopes.join(', ')}`);
    }
  }

  return errors;
}

/**
 * Validate TableSectionJson structure
 * @param section - Table section to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateTableSection(section: TableSectionJson): string[] {
  const errors: string[] = [];

  if (!section.rows) {
    errors.push('Section must have rows array');
    return errors;
  }

  if (!Array.isArray(section.rows)) {
    errors.push('Section rows must be an array');
    return errors;
  }

  // Validate each row
  section.rows.forEach((row, rowIndex) => {
    if (!row.cells || !Array.isArray(row.cells)) {
      errors.push(`Row ${rowIndex}: cells must be an array`);
      return;
    }

    // Validate each cell
    row.cells.forEach((cell, cellIndex) => {
      const cellErrors = validateTableCell(cell);
      cellErrors.forEach((err) => {
        errors.push(`Row ${rowIndex}, Cell ${cellIndex}: ${err}`);
      });
    });
  });

  return errors;
}

/**
 * Validate TableJson structure
 * @param table - Table to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateTable(table: TableJson | TableExtendedJson): string[] {
  const errors: string[] = [];
  const t = table as TableJson & TableExtendedJson;

  // Check if table has any data
  const hasOld = !!(t.columns || t.data);
  const hasNew = !!(t.header || t.body || t.footer);

  if (!hasOld && !hasNew) {
    errors.push('Table must have either old format (columns/data) or new format (head/body/foot)');
    return errors;
  }

  // Validate new format sections
  if (t.header) {
    const headErrors = validateTableSection(t.header);
    headErrors.forEach((err) => errors.push(`head: ${err}`));
  }

  if (t.body) {
    const bodyErrors = validateTableSection(t.body);
    bodyErrors.forEach((err) => errors.push(`body: ${err}`));
  }

  if (t.footer) {
    const footErrors = validateTableSection(t.footer);
    footErrors.forEach((err) => errors.push(`foot: ${err}`));
  }

  return errors;
}

/**
 * Normalize table to new format if it uses old format
 * @param table - Table in either format
 * @returns Table in new format
 */
export function normalizeTableFormat(
  bitType: BitTypeType,
  table: TableJson | TableExtendedJson,
): TableJson | TableExtendedJson {
  // If mixed format, new takes precedence (ignore old)
  if (isMixedTableFormat(table)) {
    const t = table as Partial<TableJson> & TableExtendedJson;
    delete t.columns;
    delete t.data;
  }

  const isExtended =
    Config.isOfBitType(bitType, BitType.tableExtended) ||
    Config.isOfBitType(bitType, BitType.tableImage);

  // If old format only, but .table-extended bit, convert to new
  if (isExtended && isTableBasicFormat(table)) {
    return convertBasicToExtendedTableFormat(table as TableJson);
  }

  // If new format only, but .table bit, convert to new
  if (!isExtended && isTableExtendedFormat(table)) {
    return convertExtendedToBasicTableFormat(table as TableExtendedJson);
  }

  // Already in correct (new) format
  return table;
}
