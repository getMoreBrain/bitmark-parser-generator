import { Readable } from 'node:stream';

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { formatJson, readInput, writeOutput } from '../../src/cli/utils/io.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TMP_DIR = path.resolve(__dirname, '../.tmp-cli-utils');

describe('cli utils', () => {
  beforeAll(async () => {
    await fs.ensureDir(TMP_DIR);
  });

  afterAll(async () => {
    await fs.remove(TMP_DIR);
  });

  describe('readInput', () => {
    it('returns provided literal when file does not exist', async () => {
      const literal = 'inline bitmark';
      await expect(readInput(literal)).resolves.toBe(literal);
    });

    it('reads file contents when path exists', async () => {
      const filePath = path.join(TMP_DIR, 'input.txt');
      await fs.writeFile(filePath, 'file payload');

      await expect(readInput(filePath)).resolves.toBe('file payload');
    });

    it('reads from stdin when no argument provided', async () => {
      const originalStdin = process.stdin;
      const mock = new Readable({
        read() {
          this.push('stdin data');
          this.push(null);
        },
      });

      Object.defineProperty(process, 'stdin', {
        configurable: true,
        value: mock,
      });

      try {
        await expect(readInput()).resolves.toBe('stdin data');
      } finally {
        Object.defineProperty(process, 'stdin', {
          configurable: true,
          value: originalStdin,
        });
      }
    });
  });

  describe('writeOutput', () => {
    it('logs to stdout when no file provided', async () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await writeOutput('stdout line');

      expect(spy).toHaveBeenCalledWith('stdout line');
      spy.mockRestore();
    });

    it('writes to file and appends when requested', async () => {
      const filePath = path.join(TMP_DIR, 'output.txt');

      await writeOutput('first', filePath);
      await writeOutput(' second', filePath, true);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toBe('first second');
    });
  });

  describe('formatJson', () => {
    it('formats compact JSON by default', () => {
      expect(formatJson({ a: 1 })).toBe('{"a":1}');
    });

    it('respects pretty flag and indent values', () => {
      const pretty = formatJson({ a: 1 }, true, 4);
      expect(pretty).toBe('{\n    "a": 1\n}');
    });
  });
});
