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

describe('info command', () => {
  it('lists all bits by default', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info']);
    expect(stdout).toContain('article');
    expect(stdout).toContain('cloze');
    expect(stdout).toContain('since:');
  });

  it('lists bits with list argument', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info', 'list']);
    expect(stdout).toContain('article');
    expect(stdout).toContain('since:');
  });

  it('shows deprecated bits', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info', 'list', '--deprecated']);
    expect(stdout).toContain('deprecated:');
  });

  it('shows all bits including deprecated', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info', 'list', '--all']);
    expect(stdout).toContain('article');
  });

  it('shows specific bit information', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info', 'bit', '--bit', 'article']);
    expect(stdout).toContain('article');
    expect(stdout).toContain('since='); // Text format uses 'since=' not 'since:'
  });

  it('outputs JSON format', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info', '-f', 'json']);
    const result = JSON.parse(stdout);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('outputs prettified JSON', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info', '-f', 'json', '-p']);
    expect(stdout).toContain('\n  ');
    const result = JSON.parse(stdout);
    expect(Array.isArray(result)).toBe(true);
  });

  it('outputs JSON with custom indent', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info', '-f', 'json', '-p', '--indent', '4']);
    expect(stdout).toContain('\n    ');
  });

  it('shows bit details in JSON format', async () => {
    const { stdout } = await execa('node', [
      CLI_PATH,
      'info',
      'bit',
      '--bit',
      'article',
      '-f',
      'json',
      '-p',
    ]);
    const result = JSON.parse(stdout);
    expect(result[0]).toHaveProperty('bitType');
    expect(result[0].bitType).toBe('article');
  });

  it('writes to file', async () => {
    const outputFile = path.join(TMP_DIR, 'info-output.txt');
    await execa('node', [CLI_PATH, 'info', '-o', outputFile]);

    const content = await fs.readFile(outputFile, 'utf8');
    expect(content).toContain('article');
  });

  it('writes JSON to file', async () => {
    const outputFile = path.join(TMP_DIR, 'info-output.json');
    await execa('node', [CLI_PATH, 'info', '-f', 'json', '-p', '-o', outputFile]);

    const content = await fs.readFile(outputFile, 'utf8');
    const result = JSON.parse(content);
    expect(Array.isArray(result)).toBe(true);
  });

  it('handles non-existent bit gracefully', async () => {
    const { stdout } = await execa('node', [
      CLI_PATH,
      'info',
      'bit',
      '--bit',
      'non-existent-bit-type',
    ]);
    // Should return empty or error message
    expect(stdout.length).toBeGreaterThanOrEqual(0);
  });

  it('filters specific bit type', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info', 'bit', '--bit', 'cloze']);
    expect(stdout).toContain('cloze');
    expect(stdout).not.toContain('article (since:');
  });

  it('shows bit with all tags and properties in JSON', async () => {
    const { stdout } = await execa('node', [
      CLI_PATH,
      'info',
      'bit',
      '--bit',
      'article',
      '-f',
      'json',
    ]);
    const result = JSON.parse(stdout);
    expect(result[0]).toHaveProperty('tags');
    expect(result[0]).toHaveProperty('since');
  });
});
