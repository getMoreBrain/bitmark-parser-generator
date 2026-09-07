/**
 * PLAN-022 T2: bug #10567 end to end through the public API.
 *
 * A bit whose body JSON carries a textStyle mark with an empty colour (as produced by the TipTap
 * editor) must convert to bitmark without the literal '|color:|' chain, and convert back to
 * plain text nodes.
 */
import { describe, expect, it } from 'vitest';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';

const bpg = new BitmarkParserGenerator();

const LINES = [
  'Du entwickelst ein eigenes kaltes Kaffeegetränk, das zu eurem Angebot passt.',
  'Du setzt deine Rezeptur genau und mit dem passenden Werkzeug um.',
  'Du schaffst mit einem bewussten Spezialeffekt ein Erlebnis für den Gast.',
  'Du kalkulierst deine Kreation und erklärst dem Gast den Preis.',
  'Du prüfst deine Kreation sensorisch und korrigierst, wo nötig.',
];

const taskItem = (text: string) => ({
  type: 'taskItem',
  attrs: { checked: false },
  content: [
    {
      type: 'paragraph',
      attrs: {},
      content: [{ marks: [{ type: 'textStyle', attrs: { color: '' } }], text, type: 'text' }],
    },
  ],
});

const BIT_JSON = [
  {
    bit: {
      type: 'info',
      format: 'bitmark++',
      bitLevel: 1,
      id: '6388085',
      instruction: 'Leitziel',
      body: [{ type: 'taskList', attrs: {}, content: LINES.map(taskItem) }],
    },
  },
];

describe('bitmark generator: invalid text JSON (#10567)', () => {
  it('does not write the empty colour chain, and the text round-trips as plain text', () => {
    const bitmark = bpg.convert(JSON.stringify(BIT_JSON)) as string;

    expect(bitmark).not.toContain('|color:|');
    expect(bitmark).not.toContain('==');
    for (const line of LINES) expect(bitmark).toContain(`•- ${line}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = bpg.convert(bitmark) as any[];
    const body = json[0].bit.body;
    expect(body[0].type).toBe('taskList');
    const items = body[0].content;
    expect(items).toHaveLength(LINES.length);
    items.forEach(
      (item: { content: { content: { text: string; marks?: unknown }[] }[] }, i: number) => {
        const textNode = item.content[0].content[0];
        expect(textNode.text).toBe(LINES[i]);
        expect(textNode.marks).toBeUndefined();
      },
    );

    // A second round trip is stable
    expect(bpg.convert(JSON.stringify(json))).toBe(bitmark);
  });
});
