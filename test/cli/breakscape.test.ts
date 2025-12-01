import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_PATH = path.resolve(__dirname, '../../bin/dev');
const TMP_DIR = path.resolve(__dirname, '../../.tmp-test');

describe('breakscape command', () => {
  beforeAll(async () => {
    await fs.ensureDir(TMP_DIR);
  });

  afterAll(async () => {
    await fs.remove(TMP_DIR);
  });

  it('escapes bitmark syntax characters', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'breakscape', '[.article] Test']);
    expect(stdout.trim()).toBe('[^.article] Test');
  });

  it('does not escape plain brackets without bit syntax', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'breakscape', '[test]']);
    expect(stdout.trim()).toBe('[test]'); // Only escapes bitmark syntax like [.bit]
  });

  it('escapes special characters', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'breakscape', '[.test] & | == ++ --']);
    expect(stdout).toContain('[^.');
  });

  it('processes from stdin', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'breakscape'], {
      input: '[.article] Stdin',
    });
    expect(stdout.trim()).toBe('[^.article] Stdin');
  });

  it('reads from file', async () => {
    const inputFile = path.join(TMP_DIR, 'breakscape-input.txt');
    await fs.writeFile(inputFile, '[.article] File Input');

    const { stdout } = await execa('node', [CLI_PATH, 'breakscape', inputFile]);
    expect(stdout.trim()).toBe('[^.article] File Input');
  });

  it('writes to file', async () => {
    const outputFile = path.join(TMP_DIR, 'breakscape-output.txt');
    await execa('node', [CLI_PATH, 'breakscape', '[.article] Output', '-o', outputFile]);

    const content = await fs.readFile(outputFile, 'utf8');
    expect(content.trim()).toBe('[^.article] Output');
  });

  it('appends to file', async () => {
    const outputFile = path.join(TMP_DIR, 'breakscape-append.txt');
    await fs.writeFile(outputFile, 'Line 1\n');

    await execa('node', [CLI_PATH, 'breakscape', '[.article] Line 2', '-o', outputFile, '-a']);

    const content = await fs.readFile(outputFile, 'utf8');
    expect(content).toBe('Line 1\n[^.article] Line 2');
  });

  it('handles empty input', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'breakscape', '']);
    expect(stdout.trim()).toBe('');
  });

  it('preserves non-special characters', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'breakscape', 'Hello World']);
    expect(stdout.trim()).toBe('Hello World');
  });

  it('escapes complex bitmark', async () => {
    const input = '[.cloze]\n[%lead]Question\n{1:[#answer]}';
    const { stdout } = await execa('node', [CLI_PATH, 'breakscape', input]);
    expect(stdout).toContain('[^.');
  });
});
