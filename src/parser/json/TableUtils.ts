import type { TableCellJson, TableJson, TableSectionJson } from '../../model/json/BitJson.ts';

/**
 * Type guard to check if table uses old format (columns/data)
 * @param table - Table JSON to check
 * @returns true if table uses old format
 */
export function isOldTableFormat(table: TableJson): boolean {
  return !!(table.columns || table.data) && !(table.head || table.body || table.foot);
}

/**
 * Type guard to check if table uses new format (head/body/foot)
 * @param table - Table JSON to check
 * @returns true if table uses new format
 */
export function isNewTableFormat(table: TableJson): boolean {
  return !!(table.head || table.body || table.foot);
}

/**
 * Type guard to check if table uses mixed format (has both old and new fields)
 * @param table - Table JSON to check
 * @returns true if table has both old and new format fields
 */
export function isMixedTableFormat(table: TableJson): boolean {
  const hasOld = !!(table.columns || table.data);
  const hasNew = !!(table.head || table.body || table.foot);
  return hasOld && hasNew;
}

/**
 * Convert old table format (columns/data) to new format (head/body/foot)
 * @param oldTable - Table in old format
 * @returns Table in new format
 */
export function convertOldToNewTableFormat(oldTable: TableJson): TableJson {
  const newTable: TableJson = {};

  // Convert columns to thead
  if (oldTable.columns && oldTable.columns.length > 0) {
    newTable.head = {
      rows: [
        {
          cells: oldTable.columns.map((col) => ({
            content: col,
            title: true,
          })),
        },
      ],
    };
  }

  // Convert data to tbody
  if (oldTable.data && oldTable.data.length > 0) {
    newTable.body = {
      rows: oldTable.data.map((row) => ({
        cells: row.map((cell) => ({
          content: cell,
        })),
      })),
    };
  }

  return newTable;
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
export function validateTable(table: TableJson): string[] {
  const errors: string[] = [];

  // Check if table has any data
  const hasOld = !!(table.columns || table.data);
  const hasNew = !!(table.head || table.body || table.foot);

  if (!hasOld && !hasNew) {
    errors.push('Table must have either old format (columns/data) or new format (head/body/foot)');
    return errors;
  }

  // Validate new format sections
  if (table.head) {
    const headErrors = validateTableSection(table.head);
    headErrors.forEach((err) => errors.push(`head: ${err}`));
  }

  if (table.body) {
    const bodyErrors = validateTableSection(table.body);
    bodyErrors.forEach((err) => errors.push(`body: ${err}`));
  }

  if (table.foot) {
    const footErrors = validateTableSection(table.foot);
    footErrors.forEach((err) => errors.push(`foot: ${err}`));
  }

  return errors;
}

/**
 * Normalize table to new format if it uses old format
 * @param table - Table in either format
 * @returns Table in new format
 */
export function normalizeTableFormat(table: TableJson): TableJson {
  // If mixed format, new takes precedence (ignore old)
  if (isMixedTableFormat(table)) {
    return {
      head: table.head,
      body: table.body,
      foot: table.foot,
    };
  }

  // If old format only, convert to new
  if (isOldTableFormat(table)) {
    return convertOldToNewTableFormat(table);
  }

  // Already new format
  return table;
}
