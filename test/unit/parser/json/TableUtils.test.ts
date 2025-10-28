import { describe, expect, it } from 'vitest';

import type { TableExtendedJson } from '../../../../src/model/json/BitJson.ts';
import { convertExtendedToBasicTableFormat } from '../../../../src/parser/json/TableUtils.ts';

describe('convertExtendedToBasicTableFormat', () => {
  it('converts extended format table with head, body, and foot sections', () => {
    const tableExtended: TableExtendedJson = {
      header: {
        rows: [
          {
            cells: [
              { content: 'Name', title: true },
              { content: 'Email', title: true },
            ],
          },
          {
            cells: [{ content: 'Primary Contact' }, { content: 'Secondary Contact' }],
          },
        ],
      },
      body: {
        rows: [
          {
            cells: [{ content: 'John' }, { content: 'john@example.com' }],
          },
          {
            cells: [{ content: 'Jane' }, { content: 'jane@example.com' }],
          },
        ],
      },
      footer: {
        rows: [
          {
            cells: [{ content: 'Total' }, { content: '2' }],
          },
        ],
      },
    };

    const result = convertExtendedToBasicTableFormat(tableExtended);

    expect(result.columns).toEqual(['Name', 'Email']);
    expect(result.data).toEqual([
      ['Primary Contact', 'Secondary Contact'],
      ['John', 'john@example.com'],
      ['Jane', 'jane@example.com'],
      ['Total', '2'],
    ]);
  });

  it('omits columns when head section is missing', () => {
    const tableExtended: TableExtendedJson = {
      body: {
        rows: [
          {
            cells: [{ content: 'Row 1, Column 1' }, { content: 'Row 1, Column 2' }],
          },
        ],
      },
    };

    const result = convertExtendedToBasicTableFormat(tableExtended);
    const resultRecord = result as unknown as Record<string, unknown>;

    expect(resultRecord.columns).toBeUndefined();
    expect(result.data).toEqual([['Row 1, Column 1', 'Row 1, Column 2']]);
  });

  it('ignores empty sections', () => {
    const tableExtended: TableExtendedJson = {
      header: { rows: [] },
      body: { rows: [] },
      footer: { rows: [] },
    };

    const result = convertExtendedToBasicTableFormat(tableExtended);
    const resultRecord = result as unknown as Record<string, unknown>;

    expect(resultRecord.columns).toBeUndefined();
    expect(resultRecord.data).toBeUndefined();
  });
});
