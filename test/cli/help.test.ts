import { execa } from 'execa';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_PATH = path.resolve(__dirname, '../../bin/dev');

describe('help and version', () => {
  it('shows help with --help flag', async () => {
    const { stdout } = await execa('node', [CLI_PATH, '--help']);
    expect(stdout).toContain('Convert to and from bitmark formats.');
    expect(stdout).toContain('convert');
    expect(stdout).toContain('convertText');
    expect(stdout).toContain('breakscape');
    expect(stdout).toContain('unbreakscape');
    expect(stdout).toContain('info');
  });

  it('shows help with help command', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'help']);
    expect(stdout).toContain('Convert to and from bitmark formats.');
    expect(stdout).toContain('convert');
  });

  it('shows version with --version flag', async () => {
    const { stdout } = await execa('node', [CLI_PATH, '--version']);
    expect(stdout).toMatch(/bitmark-parser v\d+\.\d+\.\d+/);
    // Note: Use -V (not -v) to avoid conflict with convert subcommand
  });

  it('shows convert command help', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convert', '--help']);
    expect(stdout).toContain('Convert between bitmark formats');
    expect(stdout).toContain('--format');
    expect(stdout).toContain('--version');
    expect(stdout).toContain('--pretty');
  });

  it('shows convertText command help', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convertText', '--help']);
    expect(stdout).toContain('Convert between bitmark text formats');
    expect(stdout).toContain('--textFormat');
  });

  it('shows breakscape command help', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'breakscape', '--help']);
    expect(stdout).toContain('Breakscape text');
    expect(stdout).toContain('--output');
  });

  it('shows unbreakscape command help', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'unbreakscape', '--help']);
    expect(stdout).toContain('Unbreakscape text');
    expect(stdout).toContain('--output');
  });

  it('shows info command help', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'info', '--help']);
    expect(stdout).toContain('Display information about bitmark');
    expect(stdout).toContain('--format');
    expect(stdout).toContain('--bit');
    expect(stdout).toContain('--all');
    expect(stdout).toContain('--deprecated');
  });
});
