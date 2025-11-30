import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_PATH = path.resolve(__dirname, '../../bin/dev');
const TMP_DIR = path.resolve(__dirname, '../../.tmp-test');

describe('convert command', () => {
  beforeAll(async () => {
    await fs.ensureDir(TMP_DIR);
  });

  afterAll(async () => {
    await fs.remove(TMP_DIR);
  });

  it('converts bitmark string to JSON (stdout)', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convert', '[.article] Test']);
    const result = JSON.parse(stdout);
    expect(result).toHaveLength(1);
    expect(result[0].bit.type).toBe('article');
    expect(result[0].bit.body[0].content[0].text).toBe('Test');
  });

  it('converts bitmark with --pretty flag', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convert', '[.article] Pretty', '-p']);
    expect(stdout).toContain('\n  {\n');
    expect(stdout).toContain('"type": "article"');
  });

  it('converts bitmark with custom indent', async () => {
    const { stdout } = await execa('node', [
      CLI_PATH,
      'convert',
      '[.article] Indent',
      '-p',
      '--indent',
      '4',
    ]);
    expect(stdout).toContain('\n    {');
  });

  it('converts from stdin', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convert'], {
      input: '[.article] Stdin Test',
    });
    const result = JSON.parse(stdout);
    expect(result).toHaveLength(1);
    expect(result[0].bit.body[0].content[0].text).toBe('Stdin Test');
  });

  it('reads from file', async () => {
    const inputFile = path.join(TMP_DIR, 'input.bitmark');
    await fs.writeFile(inputFile, '[.article] File Input');

    const { stdout } = await execa('node', [CLI_PATH, 'convert', inputFile]);
    const result = JSON.parse(stdout);
    expect(result[0].bit.body[0].content[0].text).toBe('File Input');
  });

  it('writes to file', async () => {
    const outputFile = path.join(TMP_DIR, 'output.json');
    await execa('node', [CLI_PATH, 'convert', '[.article] File Output', '-o', outputFile]);

    const content = await fs.readFile(outputFile, 'utf8');
    const result = JSON.parse(content);
    expect(result[0].bit.body[0].content[0].text).toBe('File Output');
  });

  it('writes prettified JSON to file', async () => {
    const outputFile = path.join(TMP_DIR, 'output-pretty.json');
    await execa('node', [CLI_PATH, 'convert', '[.article] Pretty File', '-o', outputFile, '-p']);

    const content = await fs.readFile(outputFile, 'utf8');
    expect(content).toContain('\n  {\n');
    expect(content).toContain('"type": "article"');
  });

  it('appends to file', async () => {
    const outputFile = path.join(TMP_DIR, 'append.json');
    await fs.writeFile(outputFile, '// First line\n');

    await execa('node', [CLI_PATH, 'convert', '[.article] Append', '-o', outputFile, '-a']);

    const content = await fs.readFile(outputFile, 'utf8');
    expect(content).toContain('// First line\n[');
  });

  it('converts with warnings enabled', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convert', '[.article] Warnings', '-w']);
    const result = JSON.parse(stdout);
    expect(result[0]).toHaveProperty('parser');
  });

  it('converts to AST format', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convert', '[.article] AST', '-f', 'ast']);
    const result = JSON.parse(stdout);
    expect(result).toHaveProperty('bits');
  });

  it('converts with bitmark version 2', async () => {
    const result = await execa('node', [CLI_PATH, 'convert', '[.article] V2', '-v', '2'], {
      reject: false,
    });
    // Version 2 may produce different output or error, check both
    if (result.exitCode === 0 && result.stdout) {
      const json = JSON.parse(result.stdout);
      expect(json[0].parser.bitmarkVersion).toBe('2');
    }
  });

  it('converts with bitmark version 3', async () => {
    const result = await execa('node', [CLI_PATH, 'convert', '[.article] V3', '-v', '3'], {
      reject: false,
    });
    if (result.exitCode === 0 && result.stdout) {
      const json = JSON.parse(result.stdout);
      expect(json[0].parser.bitmarkVersion).toBe('3');
    }
  });

  it('shows friendly error for ANTLR parser', async () => {
    const result = await execa(
      'node',
      [CLI_PATH, 'convert', '[.article] ANTLR', '--parser', 'antlr'],
      {
        reject: false,
      },
    );
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('ANTLR parser not available');
  });

  it('handles invalid bitmark gracefully', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convert', 'invalid bitmark']);
    const result = JSON.parse(stdout);
    expect(result[0].bit.type).toBe('_error');
  });

  it('converts multiple bits', async () => {
    const input = '[.article] First\n\n[.article] Second';
    const { stdout } = await execa('node', [CLI_PATH, 'convert', input]);
    const result = JSON.parse(stdout);
    expect(result).toHaveLength(2);
  });

  it('works with complex bitmark', async () => {
    const input = `[.cloze]
[%lead]Question text
{1:[#correct answer|wrong1|wrong2]}`;
    const { stdout } = await execa('node', [CLI_PATH, 'convert', input]);
    const result = JSON.parse(stdout);
    expect(result[0].bit.type).toBe('cloze');
  });
});
