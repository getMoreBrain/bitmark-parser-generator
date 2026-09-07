/**
 * PLAN-022: the "no leaked markup" and idempotence oracles over every existing text parser
 * fixture (parser-produced JSON, which must always be representable) and over the bit-level
 * API with invalid JSON in tag fields.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';
import { TextLocation, type TextLocationType } from '../../../src/model/enum/TextLocation.ts';
import { expectRepresentable } from './textRoundTrip.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const FIXTURE_DIRS: [string, TextLocationType][] = [
  ['../../standard/input/text-bitmark-body-parser/json', TextLocation.body],
  ['../../standard/input/text-bitmark-tag-parser/json', TextLocation.tag],
];

describe('TextGenerator oracles over parser fixtures', () => {
  for (const [dir, location] of FIXTURE_DIRS) {
    const abs = path.resolve(dirname, dir);
    const files = fs.readdirSync(abs).filter((f) => f.endsWith('.json'));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      it(`${path.basename(dir)}/${file}`, () => {
        const json = JSON.parse(fs.readFileSync(path.resolve(abs, file), 'utf8'));
        // Parser error nodes are not part of the round trip
        const ast = Array.isArray(json) ? json.filter((n) => n?.type !== 'error') : json;
        expectRepresentable(ast, {}, location);
      });
    }
  }
});

describe('bit-level API with invalid text JSON in tag fields', () => {
  const bpg = new BitmarkParserGenerator();
  const badText = (text: string) => [
    {
      type: 'paragraph',
      attrs: {},
      content: [
        { type: 'text', text, marks: [{ type: 'textStyle', attrs: { color: '' } }] },
        { type: 'text', text: ' more', marks: [{ type: 'var', attrs: { name: 'a|b' } }] },
      ],
    },
  ];

  it('instruction, item, lead and hint never carry invalid chains into the bitmark', () => {
    const bit = {
      bit: {
        type: 'article',
        format: 'bitmark++',
        bitLevel: 1,
        item: badText('Item'),
        lead: badText('Lead'),
        instruction: badText('Instruction'),
        hint: badText('Hint'),
        body: badText('Body'),
      },
    };
    const bitmark = bpg.convert(JSON.stringify([bit])) as string;
    expect(bitmark).not.toContain('|color:|');
    expect(bitmark).not.toContain('|var:');
    expect(bitmark).not.toContain('==');
    for (const s of ['Item more', 'Lead more', 'Instruction more', 'Hint more', 'Body more']) {
      expect(bitmark).toContain(s);
    }

    // Round trip is stable
    const json = bpg.convert(bitmark);
    expect(bpg.convert(JSON.stringify(json))).toBe(bitmark);
  });
});
