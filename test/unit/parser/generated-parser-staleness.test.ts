import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, '../../..');

// The generated parsers are gitignored build artifacts. Each generation script appends
// a '// grammar-sha256: <hash>' footer with the hash of the grammar it was built from.
// These tests fail when a grammar has been edited without regenerating its parser -
// otherwise the whole test suite silently runs against the stale parser.
const PARSERS = [
  {
    name: 'bitmark',
    grammar: 'assets/grammar/bitmark/bit-grammar.pegjs',
    generated: 'src/generated/parser/bitmark/bitmark-peggy-parser.js',
    build: 'npm run build-grammar-bit',
  },
  {
    name: 'text',
    grammar: 'assets/grammar/text/text-grammar.pegjs',
    generated: 'src/generated/parser/text/text-peggy-parser.js',
    build: 'npm run build-grammar-text',
  },
];

describe('generated parser staleness', () => {
  for (const p of PARSERS) {
    it(`${p.name} parser is generated from the current grammar`, () => {
      const generatedFile = path.resolve(root, p.generated);

      expect(
        fs.existsSync(generatedFile),
        `Generated parser is missing: ${p.generated}. Run '${p.build}'`,
      ).toBe(true);

      const grammar = fs.readFileSync(path.resolve(root, p.grammar), 'utf8');
      const grammarHash = crypto.createHash('sha256').update(grammar).digest('hex');

      const generated = fs.readFileSync(generatedFile, 'utf8');
      const embeddedHash = generated.match(/\/\/ grammar-sha256: ([0-9a-f]{64})/)?.[1];

      expect(
        embeddedHash,
        `No grammar hash found in ${p.generated} - it was built before hash stamping existed. Run '${p.build}'`,
      ).toBeDefined();

      expect(
        embeddedHash,
        `${p.generated} is STALE: it was not generated from the current ${p.grammar}. Run '${p.build}'`,
      ).toBe(grammarHash);
    });
  }
});
