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

describe('convertText command', () => {
  it('converts plain text to JSON', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convertText', 'Hello World']);
    const result = JSON.parse(stdout);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('paragraph');
    expect(result[0].content[0].text).toBe('Hello World');
  });

  it('converts JSON to plain text', async () => {
    const json =
      '[{"type":"paragraph","content":[{"text":"JSON to Text","type":"text"}],"attrs":{}}]';
    const { stdout } = await execa('node', [CLI_PATH, 'convertText', json]);
    expect(stdout.trim()).toBe('JSON to Text');
  });

  it('converts with prettified JSON output', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convertText', 'Pretty Text', '-p']);
    expect(stdout).toContain('\n  {\n');
    expect(stdout).toContain('"type": "paragraph"');
  });

  it('converts with custom indent', async () => {
    const { stdout } = await execa('node', [
      CLI_PATH,
      'convertText',
      'Indent Test',
      '-p',
      '--indent',
      '4',
    ]);
    expect(stdout).toContain('\n    {');
  });

  it('converts from stdin', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convertText'], {
      input: 'Stdin Text',
    });
    const result = JSON.parse(stdout);
    expect(result[0].content[0].text).toBe('Stdin Text');
  });

  it('reads from file', async () => {
    const inputFile = path.join(TMP_DIR, 'text-input.txt');
    await fs.writeFile(inputFile, 'File Input Text');

    const { stdout } = await execa('node', [CLI_PATH, 'convertText', inputFile]);
    const result = JSON.parse(stdout);
    expect(result[0].content[0].text).toBe('File Input Text');
  });

  it('writes to file', async () => {
    const outputFile = path.join(TMP_DIR, 'text-output.json');
    await execa('node', [CLI_PATH, 'convertText', 'File Output', '-o', outputFile]);

    const content = await fs.readFile(outputFile, 'utf8');
    const result = JSON.parse(content);
    expect(result[0].content[0].text).toBe('File Output');
  });

  it('converts text with asterisks as plain text', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convertText', '**Bold** and *italic*']);
    const result = JSON.parse(stdout);
    // bitmark++ treats ** and * as plain text, not markdown
    expect(result[0].content.length).toBeGreaterThanOrEqual(1);
  });

  it('handles multiline text', async () => {
    const input = 'Line 1\nLine 2\nLine 3';
    const { stdout } = await execa('node', [CLI_PATH, 'convertText', input]);
    const result = JSON.parse(stdout);
    // Single paragraph with embedded newlines
    expect(result).toHaveLength(1);
  });

  it('converts JSON array to formatted text', async () => {
    const json = `[
      {"type":"paragraph","content":[{"text":"First","type":"text"}],"attrs":{}},
      {"type":"paragraph","content":[{"text":"Second","type":"text"}],"attrs":{}}
    ]`;
    const { stdout } = await execa('node', [CLI_PATH, 'convertText', json]);
    expect(stdout).toContain('First');
    expect(stdout).toContain('Second');
  });

  // Additional thorough validation tests
  it('validates exact JSON structure for text to JSON conversion', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convertText', 'Hello World']);
    expect(stdout).toContain(
      '[{"type":"paragraph","content":[{"text":"Hello World","type":"text"}],"attrs":{}}]',
    );
  });

  it('validates exact text output for JSON to text conversion', async () => {
    const { stdout } = await execa('node', [
      CLI_PATH,
      'convertText',
      '[{"type":"paragraph","content":[{"text":"Hello World","type":"text"}],"attrs":{}}]',
    ]);
    expect(stdout.replace(/\n/g, '')).toBe('Hello World');
  });
});
