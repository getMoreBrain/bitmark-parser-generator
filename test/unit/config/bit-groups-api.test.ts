/**
 * PLAN-020: bit-group / resource-group / translated-name API tests.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';
import { Config } from '../../../src/config/Config.ts';
import { InfoType } from '../../../src/model/info/enum/InfoType.ts';
import { TRANSLATIONS } from '../../../src/translations.ts';

const bpg = new BitmarkParserGenerator();

describe('PLAN-020 bit-group API', () => {
  test('getBitTypesForBitGroups: union, deduped, sorted (g=cloze&g=tables)', () => {
    const res = bpg.getBitTypesForBitGroups(['cloze', 'tables']);
    expect(res).toContain('cloze');
    expect(res).toContain('cloze-list');
    expect(res).toContain('gap-text'); // D5 family assignment (baseBitType cloze)
    expect(res).toContain('table');
    expect(res).toContain('table-extended');
    expect(res).toEqual([...new Set(res)].sort());
  });

  test('getBitTypesForBitGroups: unknown group keys are ignored, never throw', () => {
    expect(bpg.getBitTypesForBitGroups(['no-such-group'])).toEqual([]);
    expect(bpg.getBitTypesForBitGroups([])).toEqual([]);
  });

  test('D6: deprecated *-collapsible bits derive membership from their migration target', () => {
    const warning = bpg.getBitTypesForBitGroups(['warning']);
    expect(warning).toContain('bug');
    expect(warning).toContain('bug-collapsible'); // derived from 'bug'
    const nonDeprecated = bpg.getBitTypesForBitGroups(['warning'], { includeDeprecated: false });
    expect(nonDeprecated).toContain('bug');
    expect(nonDeprecated).not.toContain('bug-collapsible');
  });

  test('getBitGroupsForBitTypes: returns groups with resolved members', () => {
    const groups = bpg.getBitGroupsForBitTypes(['cloze', 'table']);
    const keys = groups.map((g) => g.key);
    expect(keys).toContain('cloze');
    expect(keys).toContain('quizzes');
    expect(keys).toContain('tables');
    expect(keys).toContain('static');
    for (const g of groups) {
      expect(g.title).toBeTruthy();
      expect(g.bitTypes.length).toBeGreaterThan(0);
    }
  });

  test('getBitGroups: unknown subgroupOf filter matches nothing (not the top-level groups)', () => {
    expect(bpg.getBitGroups({ subgroupOf: 'no-such-group' })).toEqual([]);
  });

  test('getBitGroups: full catalog; subgroupOf filter yields quiz categories (D11)', () => {
    const all = bpg.getBitGroups();
    expect(all.map((g) => g.key)).toContain('quizzes');
    const quizCategories = bpg.getBitGroups({ subgroupOf: 'quizzes' });
    const keys = quizCategories.map((g) => g.key);
    expect(keys).toContain('cloze');
    expect(keys).toContain('match');
    expect(keys).toContain('flashcard');
    expect(keys).not.toContain('quizzes');
    expect(keys).not.toContain('static');
  });

  test('resource groups: canonical members only; reverse lookup works', () => {
    const image = bpg.getResourceTypesForResourceGroups(['image']);
    expect(image).toContain('image');
    expect(image).toContain('image-link');
    expect(image).not.toContain('imageLink'); // D10: canonical only
    expect(bpg.getResourceGroupsForResourceTypes(['image-link'])).toContain('image');
    expect(bpg.getResourceGroupsForResourceTypes(['still-image-film-link'])).toEqual(
      expect.arrayContaining(['still-image-film', 'video']),
    );
  });

  test('bitConfig carries title and bitGroups', () => {
    const config = Config.getBitConfig(Config.getBitType('cloze'));
    expect(config.title).toBe('Cloze');
    expect(config.bitGroups).toEqual(expect.arrayContaining(['cloze', 'quizzes']));
  });

  test('info() supports bitGroups / resourceGroups types', () => {
    const pojo = bpg.info({ type: InfoType.bitGroups, outputFormat: 'pojo' }) as { key: string }[];
    expect(pojo.map((g) => g.key)).toContain('tables');
    const text = bpg.info({ type: InfoType.resourceGroups }) as string;
    expect(text).toContain('image');
  });
});

describe('PLAN-020 translated names (D8/D9)', () => {
  beforeAll(() => {
    bpg.registerTranslations(TRANSLATIONS);
  });

  test('English titles resolve without registration (inline)', () => {
    expect(bpg.getBitTitle('cloze')).toBe('Cloze');
    expect(bpg.getBitTitle('cloze', 'en')).toBe('Cloze');
    expect(bpg.getBitGroupTitle('tables')).toBe('Tables');
  });

  test('registered translations resolve; BCP-47 subtags fall back (de-CH → de)', () => {
    expect(bpg.getBitGroupTitle('tables', 'de')).toBe('Tabellen');
    expect(bpg.getBitGroupTitle('tables', 'de-CH')).toBe('Tabellen');
    expect(bpg.getBitGroupTitle('tables', 'DE')).toBe('Tabellen'); // case-insensitive
    expect(bpg.getBitTitle('cloze', 'fr')).toBe(TRANSLATIONS['cloze'].fr);
  });

  test('unknown language falls back to English title', () => {
    expect(bpg.getBitGroupTitle('tables', 'xx')).toBe('Tables');
  });

  test('unknown key falls back to the technical key', () => {
    expect(bpg.getBitTitle('no-such-bit', 'de')).toBe('no-such-bit');
    expect(bpg.getBitGroupTitle('no-such-group', 'de')).toBe('no-such-group');
  });

  test('bit without a translation falls back title → key', () => {
    // survey-1 has no entry in translations and no inline title
    expect(bpg.getBitTitle('survey-1', 'de')).toBe('survey-1');
  });
});
