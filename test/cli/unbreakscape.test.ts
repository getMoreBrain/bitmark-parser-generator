import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_PATH = path.resolve(__dirname, '../../bin/dev');
const TMP_DIR = path.resolve(__dirname, '../../.tmp-test');

describe('unbreakscape command', () => {
  beforeAll(async () => {
    await fs.ensureDir(TMP_DIR);
  });

  afterAll(async () => {
    await fs.remove(TMP_DIR);
  });

  it('unescapes bitmark syntax characters', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'unbreakscape', '[^.article] Test']);
    expect(stdout.trim()).toBe('[.article] Test');
  });

  it('unescapes opening bracket', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'unbreakscape', '[^test]']);
    expect(stdout.trim()).toBe('[test]');
  });

  it('processes from stdin', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'unbreakscape'], {
      input: '[^.article] Stdin',
    });
    expect(stdout.trim()).toBe('[.article] Stdin');
  });

  it('reads from file', async () => {
    const inputFile = path.join(TMP_DIR, 'unbreakscape-input.txt');
    await fs.writeFile(inputFile, '[^.article] File Input');

    const { stdout } = await execa('node', [CLI_PATH, 'unbreakscape', inputFile]);
    expect(stdout.trim()).toBe('[.article] File Input');
  });

  it('writes to file', async () => {
    const outputFile = path.join(TMP_DIR, 'unbreakscape-output.txt');
    await execa('node', [CLI_PATH, 'unbreakscape', '[^.article] Output', '-o', outputFile]);

    const content = await fs.readFile(outputFile, 'utf8');
    expect(content.trim()).toBe('[.article] Output');
  });

  it('appends to file', async () => {
    const outputFile = path.join(TMP_DIR, 'unbreakscape-append.txt');
    await fs.writeFile(outputFile, 'Line 1\n');

    await execa('node', [CLI_PATH, 'unbreakscape', '[^.article] Line 2', '-o', outputFile, '-a']);

    const content = await fs.readFile(outputFile, 'utf8');
    expect(content).toBe('Line 1\n[.article] Line 2');
  });

  it('handles empty input', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'unbreakscape', '']);
    expect(stdout.trim()).toBe('');
  });

  it('preserves non-escaped characters', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'unbreakscape', 'Hello World']);
    expect(stdout.trim()).toBe('Hello World');
  });

  it('reverses breakscape operation', async () => {
    const original = '[.article] Test';
    // First breakscape
    const { stdout: escaped } = await execa('node', [CLI_PATH, 'breakscape', original]);
    // Then unbreakscape
    const { stdout: unescaped } = await execa('node', [CLI_PATH, 'unbreakscape', escaped.trim()]);
    expect(unescaped.trim()).toBe(original);
  });
});
