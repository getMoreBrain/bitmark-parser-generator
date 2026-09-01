/**
 * PLAN-020 FR11: bit-group / resource-group config validation.
 *
 * These tests are the enforcement mechanism that stops "forgot to add the new bit to the
 * groups": adding a bit type without declaring `bitGroups` (or deliberately declaring
 * `bitGroups: []`) fails the build.
 */
import { describe, expect, test } from 'vitest';

import { BIT_GROUPS } from '../../../src/config/raw/bitGroups.ts';
import { BITS } from '../../../src/config/raw/bits.ts';
import { RESOURCE_GROUPS } from '../../../src/config/raw/resourceGroups.ts';
import { TRANSLATIONS } from '../../../src/config/raw/translations.ts';
import { BitGroup, type BitGroupType } from '../../../src/model/enum/BitGroup.ts';
import { BitType, type BitTypeType } from '../../../src/model/enum/BitType.ts';
import { ResourceGroup } from '../../../src/model/enum/ResourceGroup.ts';
import { ResourceType } from '../../../src/model/enum/ResourceType.ts';

const COLLAPSIBLE_SUFFIX = '-collapsible';

const allBitTypes = Object.values(BitType) as BitTypeType[];
const bitGroupKeys = new Set<string>(Object.values(BitGroup));
const resourceGroupKeys = new Set<string>(Object.values(ResourceGroup));
const resourceTypeValues = new Set<string>(Object.values(ResourceType));

/** Deprecated bits with a migration target derive membership (D6) and are exempt. */
const derivesMembership = (bt: BitTypeType): boolean =>
  bt !== BitType.collapsible && bt.endsWith(COLLAPSIBLE_SUFFIX);

const isInternal = (bt: BitTypeType): boolean => bt.startsWith('_');

describe('PLAN-020 bit-group config validation (FR11)', () => {
  test('BitGroup enum and BIT_GROUPS registry are in sync', () => {
    expect(Object.keys(BIT_GROUPS).sort()).toEqual([...bitGroupKeys].sort());
  });

  test('ResourceGroup enum and RESOURCE_GROUPS registry are in sync', () => {
    expect(Object.keys(RESOURCE_GROUPS).sort()).toEqual([...resourceGroupKeys].sort());
  });

  test('every non-internal bit declares bitGroups (deprecated-with-target bits exempt)', () => {
    const missing: string[] = [];
    for (const bt of allBitTypes) {
      if (isInternal(bt) || derivesMembership(bt)) continue;
      if (!BITS[bt]?.bitGroups) missing.push(bt);
    }
    expect(
      missing,
      `Bits without a bitGroups declaration (declare [] if deliberately ungrouped): ${missing.join(', ')}`,
    ).toEqual([]);
  });

  test('every declared bit-group key exists in the registry', () => {
    for (const bt of allBitTypes) {
      for (const g of BITS[bt]?.bitGroups ?? []) {
        expect(bitGroupKeys.has(g), `Bit '${bt}' references unknown bit group '${g}'`).toBe(true);
      }
    }
  });

  test('no dead bit groups (no members) unless flagged allowEmpty', () => {
    const members = new Map<string, number>();
    for (const key of bitGroupKeys) members.set(key, 0);
    for (const bt of allBitTypes) {
      for (const g of BITS[bt]?.bitGroups ?? []) members.set(g, (members.get(g) ?? 0) + 1);
    }
    for (const [key, g] of Object.entries(BIT_GROUPS)) {
      if (g.allowEmpty) continue;
      expect(
        members.get(key),
        `Bit group '${key}' has no member bits (flag allowEmpty or add members)`,
      ).toBeGreaterThan(0);
    }
  });

  test('allowEmpty groups actually have no explicit members', () => {
    for (const [key, g] of Object.entries(BIT_GROUPS)) {
      if (!g.allowEmpty) continue;
      const members = allBitTypes.filter((bt) =>
        BITS[bt]?.bitGroups?.includes(key as BitGroupType),
      );
      expect(
        members,
        `Bit group '${key}' is flagged allowEmpty but has members — remove the flag`,
      ).toEqual([]);
    }
  });

  test('aliases do not collide with keys or other aliases', () => {
    const seen = new Set<string>(bitGroupKeys);
    for (const [key, g] of Object.entries(BIT_GROUPS)) {
      for (const alias of g.aliases ?? []) {
        expect(seen.has(alias), `Bit group '${key}' alias '${alias}' collides`).toBe(false);
        seen.add(alias);
      }
    }
    const seenRes = new Set<string>(resourceGroupKeys);
    for (const [key, g] of Object.entries(RESOURCE_GROUPS)) {
      for (const alias of g.aliases ?? []) {
        expect(seenRes.has(alias), `Resource group '${key}' alias '${alias}' collides`).toBe(false);
        seenRes.add(alias);
      }
    }
  });

  test('subgroupOf references exist and members are consistent (D11)', () => {
    for (const [key, g] of Object.entries(BIT_GROUPS)) {
      if (!g.subgroupOf) continue;
      expect(
        bitGroupKeys.has(g.subgroupOf),
        `Bit group '${key}' subgroupOf unknown group '${g.subgroupOf}'`,
      ).toBe(true);
      // Every member of the subgroup must also be in the parent group
      for (const bt of allBitTypes) {
        const groups = BITS[bt]?.bitGroups;
        if (!groups?.includes(key as BitGroupType)) continue;
        expect(
          groups.includes(g.subgroupOf),
          `Bit '${bt}' is in '${key}' (subgroup of '${g.subgroupOf}') but not in '${g.subgroupOf}'`,
        ).toBe(true);
      }
    }
  });

  test('resource groups contain only canonical kebab-case ResourceType values (D10)', () => {
    for (const [key, g] of Object.entries(RESOURCE_GROUPS)) {
      for (const rt of g.resourceTypes) {
        expect(
          resourceTypeValues.has(rt),
          `Resource group '${key}' references unknown resource type '${rt}'`,
        ).toBe(true);
        expect(rt, `Resource group '${key}' member '${rt}' is not canonical kebab-case`).toMatch(
          /^[a-z0-9]+(-[a-z0-9]+)*$/,
        );
      }
      expect(g.resourceTypes.length, `Resource group '${key}' has no members`).toBeGreaterThan(0);
    }
  });

  test('translations module keys all match a bit type / group key (drift guard)', () => {
    const bitTypeValues = new Set<string>(allBitTypes);
    for (const key of Object.keys(TRANSLATIONS)) {
      const known = bitTypeValues.has(key) || bitGroupKeys.has(key) || resourceGroupKeys.has(key);
      expect(
        known,
        `Translations key '${key}' matches no bit type, bit group, or resource group`,
      ).toBe(true);
    }
  });

  test('translation language tags are valid BCP-47 (pragmatic) and never en (en is inline)', () => {
    const bcp47 = /^[a-z]{2,3}(-[a-zA-Z0-9]{2,8})*$/i;
    for (const [key, langs] of Object.entries(TRANSLATIONS)) {
      for (const lang of Object.keys(langs)) {
        expect(lang, `Translations['${key}'] has invalid language tag '${lang}'`).toMatch(bcp47);
        expect(
          lang.toLowerCase(),
          `Translations['${key}'] contains 'en' — English titles live inline in the configs`,
        ).not.toBe('en');
      }
    }
  });

  test('D9 bundle isolation: raw/translations is only imported by the ./translations subpath entry', async () => {
    // The translation payload must stay out of the main bundle: nothing under src/ may
    // import config/raw/translations.ts except the subpath entry src/translations.ts.
    const { execFileSync } = await import('node:child_process');
    const out = execFileSync('grep', ['-rl', 'raw/translations', 'src', '--include=*.ts'], {
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter(Boolean)
      .filter(
        (f) => !f.endsWith('src/translations.ts') && !f.endsWith('src/config/raw/translations.ts'),
      )
      .sort();
    expect(
      out,
      `Files importing raw/translations outside the subpath entry: ${out.join(', ')}`,
    ).toEqual([]);
  });

  test('every bit group has an English title; titles are non-empty', () => {
    for (const [key, g] of Object.entries(BIT_GROUPS)) {
      expect(g.title, `Bit group '${key}' has an empty title`).toBeTruthy();
    }
    for (const [key, g] of Object.entries(RESOURCE_GROUPS)) {
      expect(g.title, `Resource group '${key}' has an empty title`).toBeTruthy();
    }
  });
});
