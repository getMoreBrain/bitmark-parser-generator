import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { BitmarkVersion, type BitWrapperJson } from '../../src/index.ts';
import type { IngredientJson, ServingsJson } from '../../src/model/json/BitJson.ts';

const bpg = new BitmarkParserGenerator();

const toJson = (bitmark: string): BitWrapperJson[] =>
  bpg.convert(bitmark, { bitmarkVersion: BitmarkVersion.v2 }) as BitWrapperJson[];

const toBitmark = (bitmark: string): string =>
  bpg.convert(toJson(bitmark), { bitmarkVersion: BitmarkVersion.v2 }) as string;

const servings = (bitmark: string): ServingsJson =>
  toJson(bitmark)[0].bit.servings as unknown as ServingsJson;

const ingredients = (bitmark: string): IngredientJson[] =>
  toJson(bitmark)[0].bit.ingredients as unknown as IngredientJson[];

// A tag is written as `[@key: value ]` by the generator, hence the loose whitespace match
const tag = (key: string, value: string) => new RegExp(`\\[@${key}:\\s*${value}\\s*\\]`);

describe('@unitPlural / @unitAbbrPlural', () => {
  describe('[@servings] chain', () => {
    test('both plurals emitted when authored', () => {
      const s = servings(
        '[.cook-ingredients]\n[@servings:2][@unit:Litre][@unitPlural:Litres][@unitAbbr:l][@unitAbbrPlural:ls]\n',
      );
      expect(s.unit).toBe('Litre');
      expect(s.unitPlural).toBe('Litres');
      expect(s.unitAbbr).toBe('l');
      expect(s.unitAbbrPlural).toBe('ls');
    });

    test('plurals omitted when not authored', () => {
      const s = servings('[.cook-ingredients]\n[@servings:2][@unit:Litre][@unitAbbr:l]\n');
      expect(s.unitPlural).toBeUndefined();
      expect(s.unitAbbrPlural).toBeUndefined();
    });

    test('unitPlural without unitAbbr', () => {
      const s = servings('[.cook-ingredients]\n[@servings:2][@unit:Prise][@unitPlural:Prisen]\n');
      expect(s.unitPlural).toBe('Prisen');
      expect(s.unitAbbr).toBeUndefined();
      expect(s.unitAbbrPlural).toBeUndefined();
    });

    test('unit is still always emitted, even when unauthored (unchanged behaviour)', () => {
      const s = servings('[.cook-ingredients]\n[@servings:2]\n');
      expect(s.unit).toBe('');
      expect(s.unitPlural).toBeUndefined();
    });
  });

  describe('ingredient card', () => {
    const bit = (tags: string) => `[.cook-ingredients]\n\n====\n[!1]${tags} Salz\n====\n`;

    test('both plurals emitted when authored', () => {
      const i = ingredients(
        bit('[@unit:Kilogramm][@unitPlural:Kilogramms][@unitAbbr:kg][@unitAbbrPlural:kgs]'),
      )[0];
      expect(i.unit).toBe('Kilogramm');
      expect(i.unitPlural).toBe('Kilogramms');
      expect(i.unitAbbr).toBe('kg');
      expect(i.unitAbbrPlural).toBe('kgs');
    });

    test('plurals omitted when not authored', () => {
      const i = ingredients(bit('[@unit:Stück][@unitAbbr:Stk]'))[0];
      expect(i.unitPlural).toBeUndefined();
      expect(i.unitAbbrPlural).toBeUndefined();
    });

    test('unitPlural without any abbreviation', () => {
      const i = ingredients(bit('[@unit:Prise][@unitPlural:Prisen]'))[0];
      expect(i.unitPlural).toBe('Prisen');
      expect(i.unitAbbr).toBeUndefined();
      expect(i.unitAbbrPlural).toBeUndefined();
    });

    test('unit is still always emitted, even when unauthored (unchanged behaviour)', () => {
      const i = ingredients(bit(''))[0];
      expect(i.unit).toBe('');
      expect(i.unitPlural).toBeUndefined();
    });
  });

  describe('JSON => bitmark', () => {
    test('plurals written only when present', () => {
      const out = toBitmark(
        '[.cook-ingredients]\n[@servings:2][@unit:Litre][@unitPlural:Litres][@unitAbbr:l][@unitAbbrPlural:ls]\n',
      );
      expect(out).toMatch(tag('unit', 'Litre'));
      expect(out).toMatch(tag('unitPlural', 'Litres'));
      expect(out).toMatch(tag('unitAbbr', 'l'));
      expect(out).toMatch(tag('unitAbbrPlural', 'ls'));
    });

    test('no plural tags written when absent', () => {
      const out = toBitmark('[.cook-ingredients]\n[@servings:2][@unit:Litre][@unitAbbr:l]\n');
      expect(out).toMatch(tag('unit', 'Litre'));
      expect(out).not.toMatch(/@unitPlural/);
      expect(out).not.toMatch(/@unitAbbrPlural/);
    });

    test('ingredient plurals written only when present', () => {
      const withPlural = toBitmark(
        '[.cook-ingredients]\n\n====\n[!1][@unit:Prise][@unitPlural:Prisen] Salz\n====\n',
      );
      expect(withPlural).toMatch(tag('unitPlural', 'Prisen'));

      const without = toBitmark('[.cook-ingredients]\n\n====\n[!1][@unit:Prise] Salz\n====\n');
      expect(without).not.toMatch(/@unitPlural/);
    });
  });

  describe('round-trip', () => {
    test('bitmark => JSON => bitmark => JSON is stable', () => {
      const src =
        '[.cook-ingredients]\n[@servings:2][@unit:Litre][@unitPlural:Litres][@unitAbbr:l][@unitAbbrPlural:ls]\n\n====\n[!1][@unit:Prise][@unitPlural:Prisen] Salz\n====\n';
      const json1 = toJson(src);
      const json2 = toJson(toBitmark(src));

      expect(json2[0].bit.servings).toEqual(json1[0].bit.servings);
      expect(json2[0].bit.ingredients).toEqual(json1[0].bit.ingredients);
    });
  });

  describe('recipe inherits the tags from cook-ingredients', () => {
    test('plurals resolve on .recipe', () => {
      const s = toJson('[.recipe]\n[@servings:2][@unit:Litre][@unitPlural:Litres]\n')[0].bit
        .servings as unknown as ServingsJson;
      expect(s.unitPlural).toBe('Litres');
    });
  });
});
