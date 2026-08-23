import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { BitmarkVersion, type BitWrapperJson } from '../../src/index.ts';

const bpg = new BitmarkParserGenerator();

const toJson = (bitmark: string): BitWrapperJson[] =>
  bpg.convert(bitmark, { bitmarkVersion: BitmarkVersion.v2 }) as BitWrapperJson[];

describe('isCollapsible property', () => {
  describe('normal bits (implied default false)', () => {
    test('absent => key not emitted', () => {
      expect(toJson('[.article]\n\nContent')[0].bit.isCollapsible).toBeUndefined();
    });

    test('@isCollapsible:true => emitted as true', () => {
      expect(toJson('[.article]\n[@isCollapsible:true]\n\nContent')[0].bit.isCollapsible).toBe(
        true,
      );
    });

    test('@isCollapsible:false => key not emitted (false is never written)', () => {
      expect(
        toJson('[.article]\n[@isCollapsible:false]\n\nContent')[0].bit.isCollapsible,
      ).toBeUndefined();
    });

    test('available on any bit, not just .chapter', () => {
      expect(toJson('[.note]\n[@isCollapsible:true]\n\nContent')[0].bit.isCollapsible).toBe(true);
      expect(toJson('[.image]\n[@isCollapsible:true]')[0].bit.isCollapsible).toBe(true);
    });

    test('.chapter no longer force-emits false', () => {
      const json = toJson('[.chapter]\n[#Title]');
      expect(json[0].bit.isCollapsible).toBeUndefined();
      // The other chapter defaults are unchanged
      expect(json[0].bit.toc).toBe(true);
      expect(json[0].bit.progress).toBe(true);
    });

    test('round-trip: bitmark => JSON => bitmark', () => {
      const original = '[.article]\n[@isCollapsible:true]\n\nContent';
      const json = bpg.convert(original, { bitmarkVersion: BitmarkVersion.v2 });
      const bitmark = bpg.convert(json, { bitmarkVersion: BitmarkVersion.v2 }) as string;
      expect(bitmark).toMatch(/\[@isCollapsible:\s*true\s*\]/);
    });
  });

  describe('deprecated *-collapsible bits (default true)', () => {
    test('absent => emitted as true', () => {
      expect(toJson('[.info-collapsible]\n\nContent')[0].bit.isCollapsible).toBe(true);
      expect(toJson('[.collapsible]\n\nContent')[0].bit.isCollapsible).toBe(true);
      expect(toJson('[.page-collapsible]\n\nContent')[0].bit.isCollapsible).toBe(true);
      expect(toJson('[.smart-standard-list-collapsible]\n\nContent')[0].bit.isCollapsible).toBe(
        true,
      );
    });

    test('@isCollapsible:false => no key, so the consumer falls back to the bit default (true)', () => {
      expect(
        toJson('[.info-collapsible]\n[@isCollapsible:false]\n\nContent')[0].bit.isCollapsible,
      ).toBeUndefined();
    });

    test('the non-collapsible base bit does not default to true', () => {
      expect(toJson('[.info]\n\nContent')[0].bit.isCollapsible).toBeUndefined();
    });

    // NOTE: the bit type itself is migrated to its non-collapsible cousin by PLAN-017;
    // see isCollapsibleBitTypeMigration.test.ts. These tests only assert the value.
    test('the value survives the PLAN-017 bit type migration', () => {
      const json = bpg.convert('[.info-collapsible]\n\nContent', {
        bitmarkVersion: BitmarkVersion.v2,
      }) as BitWrapperJson[];
      expect(json[0].bit.isCollapsible).toBe(true);
    });
  });
});
