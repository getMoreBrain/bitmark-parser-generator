import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

import { cliTmpDir } from './setup/tmpDirRef.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_PATH = path.resolve(__dirname, '../../bin/dev');
const TMP_DIR = cliTmpDir;

const HTML_TABLE = '<table><tr><th>Name</th></tr><tr><td>John</td></tr></table>';

describe('convertHtmlTable command', () => {
  it('converts an HTML string to bitmark (default)', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convertHtmlTable', HTML_TABLE]);
    expect(stdout).toContain('[.table-extended]');
    expect(stdout).toContain('John');
  });

  it('converts HTML to JSON with -f json', async () => {
    const { stdout } = await execa('node', [
      CLI_PATH,
      'convertHtmlTable',
      HTML_TABLE,
      '-f',
      'json',
    ]);
    const json = JSON.parse(stdout);
    expect(json[0].bit.type).toBe('table-extended');
    expect(json[0].bit.table.body.rows[0].cells[0].content).toBeDefined();
  });

  it('reads HTML from stdin', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convertHtmlTable'], { input: HTML_TABLE });
    expect(stdout).toContain('[.table-extended]');
  });

  it('converts bitmark back to HTML', async () => {
    const { stdout: bitmark } = await execa('node', [CLI_PATH, 'convertHtmlTable', HTML_TABLE]);
    const { stdout: html } = await execa('node', [CLI_PATH, 'convertHtmlTable', bitmark]);
    expect(html).toContain('<table>');
    expect(html).toContain('<th>Name</th>');
    expect(html).toContain('<td>John</td>');
  });

  it('reads from a file and writes to a file', async () => {
    const inputFile = path.join(TMP_DIR, 'html-table-input.html');
    const outputFile = path.join(TMP_DIR, 'html-table-output.bitmark');
    await fs.writeFile(inputFile, HTML_TABLE);

    await execa('node', [CLI_PATH, 'convertHtmlTable', inputFile, '-o', outputFile]);

    const content = await fs.readFile(outputFile, 'utf8');
    expect(content).toContain('[.table-extended]');
  });

  it('emits [.table] with --tableFormat table', async () => {
    const { stdout } = await execa('node', [
      CLI_PATH,
      'convertHtmlTable',
      '<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>',
      '--tableFormat',
      'table',
    ]);
    expect(stdout).toContain('[.table]');
    expect(stdout).not.toContain('[.table-extended]');
  });

  it('keeps unknown tags with --keepUnknownTags', async () => {
    const { stdout } = await execa('node', [
      CLI_PATH,
      'convertHtmlTable',
      '<table><tr><td>a <span class="x">b</span> c</td></tr></table>',
      '--keepUnknownTags',
    ]);
    expect(stdout).toContain('<span class="x">');
  });

  it('errors when converting bitmark input to JSON', async () => {
    const result = await execa(
      'node',
      [CLI_PATH, 'convertHtmlTable', '[.table-extended]\n====\nH\n', '-f', 'json'],
      { reject: false },
    );
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('convertHtmlTable');
  });
});
