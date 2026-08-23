import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { Config } from '../../src/config/Config.ts';
import { BitmarkVersion, type BitWrapperJson } from '../../src/index.ts';
import { BitType, type BitTypeType } from '../../src/model/enum/BitType.ts';

const bpg = new BitmarkParserGenerator();

const COLLAPSIBLE_SUFFIX = '-collapsible';

/** Every `*-collapsible` bit type except the excluded `.collapsible`. */
const migratingBitTypes = (Object.values(BitType) as BitTypeType[])
  .filter((b) => b.endsWith(COLLAPSIBLE_SUFFIX) && b !== BitType.collapsible)
  .sort();

const toJson = (bitmark: string): BitWrapperJson[] =>
  bpg.convert(bitmark, { bitmarkVersion: BitmarkVersion.v2 }) as BitWrapperJson[];

describe('*-collapsible bit type migration', () => {
  test('the migrating set is the full deprecated set minus .collapsible', () => {
    expect(migratingBitTypes).toHaveLength(45);
  });

  describe('mapping convention', () => {
    test('every migrating bit type declares its non-collapsible cousin as baseBitType', () => {
      for (const bitType of migratingBitTypes) {
        const expected = bitType.slice(0, -COLLAPSIBLE_SUFFIX.length);
        expect(Config.getMigratedBitType(bitType), bitType).toBe(expected);
      }
    });

    test('.collapsible is excluded', () => {
      expect(Config.getMigratedBitType(BitType.collapsible)).toBeUndefined();
    });

    test('non-collapsible bit types do not migrate', () => {
      expect(Config.getMigratedBitType(BitType.article)).toBeUndefined();
      expect(Config.getMigratedBitType(BitType.chapter)).toBeUndefined();
    });
  });

  describe('bitmark input', () => {
    test.each(migratingBitTypes)('[.%s] migrates', (bitType) => {
      const target = bitType.slice(0, -COLLAPSIBLE_SUFFIX.length);
      const json = toJson(`[.${bitType}]`);

      expect(json[0].bit.type).toBe(target);
      expect(json[0].bit.isCollapsible).toBe(true);
    });

    test('bitmark => bitmark rewrites the header and adds the tag', () => {
      const json = bpg.convert('[.smart-standard-remark-table-image-normative-collapsible]', {
        bitmarkVersion: BitmarkVersion.v2,
      });
      const bitmark = bpg.convert(json, { bitmarkVersion: BitmarkVersion.v2 }) as string;

      expect(bitmark).toContain('[.smart-standard-remark-table-image-normative]');
      expect(bitmark).not.toContain('-collapsible]');
      expect(bitmark).toMatch(/\[@isCollapsible:\s*true\s*\]/);
    });
  });

  describe('JSON input', () => {
    test('old-format JSON migrates', () => {
      const json = bpg.convert([{ bit: { type: 'info-collapsible', format: 'bitmark++' } }], {
        bitmarkVersion: BitmarkVersion.v2,
        outputFormat: 'json',
      }) as BitWrapperJson[];

      expect(json[0].bit.type).toBe('info');
      expect(json[0].bit.isCollapsible).toBe(true);
    });

    test('old-format JSON => bitmark emits the new form', () => {
      const bitmark = bpg.convert([{ bit: { type: 'info-collapsible', format: 'bitmark++' } }], {
        bitmarkVersion: BitmarkVersion.v2,
        outputFormat: 'bitmark',
      }) as string;

      expect(bitmark).toContain('[.info]');
      expect(bitmark).toMatch(/\[@isCollapsible:\s*true\s*\]/);
    });
  });

  describe('behaviour preserved', () => {
    test('.collapsible passes through unchanged', () => {
      const json = toJson('[.collapsible]\n\nContent');
      expect(json[0].bit.type).toBe('collapsible');
      expect(json[0].bit.isCollapsible).toBe(true);
    });

    test('an explicit @isCollapsible:false still wins (migrated type, no key)', () => {
      const json = toJson('[.info-collapsible]\n[@isCollapsible:false]\n\nContent');
      expect(json[0].bit.type).toBe('info');
      expect(json[0].bit.isCollapsible).toBeUndefined();
    });

    test('a commented old-format bit migrates', () => {
      const json = toJson('[.|info-collapsible]\n\nContent');
      expect(json[0].bit.type).toBe('_comment');
      expect(json[0].bit.originalType).toBe('info');
    });

    test('migration is idempotent: migrated output re-parses unchanged', () => {
      const first = bpg.convert('[.info-collapsible]\n\nContent', {
        bitmarkVersion: BitmarkVersion.v2,
      }) as BitWrapperJson[];
      const bitmark = bpg.convert(first, { bitmarkVersion: BitmarkVersion.v2 }) as string;
      const second = bpg.convert(bitmark, {
        bitmarkVersion: BitmarkVersion.v2,
      }) as BitWrapperJson[];

      // `bitmark` is the verbatim source markup and so differs by design — see the
      // `markup` test below (PLAN-017 FR5).
      const stripMarkup = (w: BitWrapperJson[]) => w.map(({ bit }) => ({ bit }));
      expect(stripMarkup(second)).toEqual(stripMarkup(first));
    });

    test('PLAN-017 FR5: `bitmark` keeps the verbatim source, so it shows the pre-migration form', () => {
      const json = bpg.convert('[.info-collapsible]\n\nContent', {
        bitmarkVersion: BitmarkVersion.v2,
      }) as BitWrapperJson[];

      // The bit migrated...
      expect(json[0].bit.type).toBe('info');
      // ...but `bitmark` is the original source text, not a re-render of the migrated bit.
      expect(json[0].bitmark).toContain('[.info-collapsible]');
    });

    test('the rest of the bit is unaffected', () => {
      const json = toJson('[.info-collapsible]\n[@id:123]\n[%1]\n[!An instruction]\n\nThe body');
      const bit = json[0].bit;

      expect(bit.type).toBe('info');
      expect(bit.id).toEqual(['123']);
      expect(bit.item).toBe('1');
      expect(JSON.stringify(bit.instruction)).toContain('An instruction');
      expect(JSON.stringify(bit.body)).toContain('The body');
    });
  });
});
