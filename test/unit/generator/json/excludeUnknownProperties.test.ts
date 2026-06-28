import { describe, expect, it } from 'vitest';

import { JsonObjectGenerator } from '../../../../src/generator/json/JsonObjectGenerator.ts';
import { BitmarkParserType } from '../../../../src/model/enum/BitmarkParserType.ts';
import { BitmarkVersion } from '../../../../src/model/enum/BitmarkVersion.ts';
import { BitmarkParser } from '../../../../src/parser/bitmark/BitmarkParser.ts';

/**
 * Regression for PLAN-014.
 *
 * A property that is only valid inside a tag chain (e.g. `@width`, a chained property of the
 * image resource) must be treated as an unknown property when written at the bit level, even
 * though a dedicated generator handler (`enter_width`) exists for it. Previously the AST walker
 * descended into the `extraProperties` object and fired `enter_width`, emitting it as a
 * first-class `width` field and bypassing the `excludeUnknownProperties` guard.
 */
describe('excludeUnknownProperties + chain-defined property at bit level', () => {
  const bitmarkParser = new BitmarkParser();

  // `@width` has a dedicated generator handler and is a chained image property.
  // `@madeupprop` is a completely novel property (no handler).
  const markup = [
    '[.image]',
    '[&image:https://example.com/x.png]',
    '[@width:999]',
    '[@madeupprop:hello]',
    '',
    'Body.',
  ].join('\n');

  async function generateBit(excludeUnknownProperties: boolean) {
    const ast = bitmarkParser.toAst(markup, { parserType: BitmarkParserType.peggy });
    const generator = new JsonObjectGenerator({
      bitmarkVersion: BitmarkVersion.v3,
      jsonOptions: { textAsPlainText: true, excludeUnknownProperties },
    });
    const json = await generator.generate(ast);
    return json[0].bit as unknown as Record<string, unknown>;
  }

  it('drops the misplaced chain-defined property when excludeUnknownProperties is true', async () => {
    const bit = await generateBit(true);
    expect(bit.width).toBeUndefined();
    expect(bit.madeupprop).toBeUndefined();
    // The legitimately-empty resource width must remain untouched.
    expect((bit.resource as { image?: { width?: unknown } })?.image?.width).toBeNull();
  });

  it('keeps it as an (array-form) extra property when excludeUnknownProperties is false', async () => {
    const bit = await generateBit(false);
    expect(bit.width).toEqual(['999']);
    expect(bit.madeupprop).toEqual(['hello']);
  });
});
