import { describe, expect, test } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';
import { type BitWrapperJson, type GroupTagJson } from '../../src/index.ts';

const bpg = new BitmarkParserGenerator();

const toJson = (bitmark: string): BitWrapperJson[] => bpg.convert(bitmark) as BitWrapperJson[];
const toJsonWithWarnings = (bitmark: string): BitWrapperJson[] =>
  bpg.convert(bitmark, { jsonOptions: { enableWarnings: true } }) as BitWrapperJson[];
const toBitmark = (json: BitWrapperJson[]): string => bpg.convert(json) as string;

const groupTags = (bitmark: string): GroupTagJson[] | undefined =>
  toJson(bitmark)[0].bit.accessibilityGroupTag;

/** Bit types that carry `group_accessibilityDecorative` and so default to image/decorative */
const DEFAULTED_BIT_TYPES = [
  'separator',
  'separator-alt',
  'image-separator',
  'image-separator-alt',
  'image-mood',
];

const DECORATIVE_IMAGE: GroupTagJson[] = [{ name: 'image', tags: ['decorative'] }];

describe('accessibility tags', () => {
  describe('bitmark => JSON', () => {
    test('standalone @accessibilityTag is emitted as an array', () => {
      const bit = toJson('[.article]\n[@accessibilityTag:standard]\n\nContent')[0].bit;
      expect(bit.accessibilityTag).toEqual(['standard']);
      expect(bit.accessibilityGroupTag).toBeUndefined();
    });

    test('@accessibilityGroupTag with a chained @accessibilityTag', () => {
      expect(
        groupTags('[.article]\n[@accessibilityGroupTag:image][@accessibilityTag:decorative]'),
      ).toEqual(DECORATIVE_IMAGE);
    });

    test('@accessibilityGroupTag with no chained tag yields an empty array', () => {
      expect(groupTags('[.article]\n[@accessibilityGroupTag:diagram]')).toEqual([
        { name: 'diagram', tags: [] },
      ]);
    });

    test('repeated group names fold into one entry, merging tags as a set', () => {
      expect(
        groupTags(
          '[.article]\n' +
            '[@accessibilityGroupTag:image][@accessibilityTag:decorative][@accessibilityTag:complex]\n' +
            '[@accessibilityGroupTag:image][@accessibilityTag:complex][@accessibilityTag:functional]\n' +
            '[@accessibilityGroupTag:photo][@accessibilityTag:standard]',
        ),
      ).toEqual([
        { name: 'image', tags: ['decorative', 'complex', 'functional'] },
        { name: 'photo', tags: ['standard'] },
      ]);
    });

    test('enum: valueless / empty tags resolve to the defaultValue, or empty string', () => {
      // An enumeration is string-valued and never null. With no defaultValue
      // (the standalone tag), empty and valueless resolve to ''.
      expect(toJson('[.article]\n[@accessibilityTag]\nX')[0].bit.accessibilityTag).toEqual(['']);
      expect(toJson('[.article]\n[@accessibilityTag:]\nX')[0].bit.accessibilityTag).toEqual(['']);
      expect(toJson('[.article]\n[@accessibilityTag:   ]\nX')[0].bit.accessibilityTag).toEqual([
        '',
      ]);
    });

    test('enum: valueless chained tag resolves to the defaultValue on a defaulted bit', () => {
      // On [.separator] the chain carries defaultValue 'decorative' via
      // group_accessibilityDecorative; on [.article] there is no default.
      expect(
        toJson('[.separator]\n[@accessibilityGroupTag:image][@accessibilityTag]\nX')[0].bit
          .accessibilityGroupTag,
      ).toEqual([{ name: 'image', tags: ['decorative'] }]);
      expect(
        toJson('[.article]\n[@accessibilityGroupTag:image][@accessibilityTag]\nX')[0].bit
          .accessibilityGroupTag,
      ).toEqual([{ name: 'image', tags: [''] }]);
    });

    test('enum: out-of-vocabulary values warn but pass through', () => {
      const json = toJsonWithWarnings('[.article]\n[@accessibilityTag:bogus]\nX');
      expect(json[0].bit.accessibilityTag).toEqual(['bogus']);
      expect(json[0].parser?.warnings?.map((w) => w.message)).toEqual([
        "Invalid value 'bogus' for property [@accessibilityTag]. Valid values: complex | functional | decorative | standard",
      ]);
    });

    test('enum: valid values do not warn', () => {
      const json = toJsonWithWarnings('[.article]\n[@accessibilityTag:standard]\nX');
      expect(json[0].parser?.warnings).toBeUndefined();
    });

    test('enum: @allowPrint behaves identically (the enum model)', () => {
      expect(toJson('[.book]\n[@allowPrint]\nX')[0].bit.allowPrint).toBe('useSpaceConfiguration');
      const json = toJsonWithWarnings('[.book]\n[@allowPrint:bogus]\nX');
      expect(json[0].bit.allowPrint).toBe('bogus');
      expect(json[0].parser?.warnings?.map((w) => w.message)).toEqual([
        "Invalid value 'bogus' for property [@allowPrint]. Valid values: enforceFalse | enforceTrue | useSpaceConfiguration",
      ]);
    });

    test('absent on an ordinary bit => neither key emitted', () => {
      const bit = toJson('[.article]\n\nContent')[0].bit;
      expect(bit.accessibilityGroupTag).toBeUndefined();
      expect(bit.accessibilityTag).toBeUndefined();
    });
  });

  describe('defaults', () => {
    test.each(DEFAULTED_BIT_TYPES)('[.%s] defaults to image/decorative', (bitType) => {
      expect(groupTags(`[.${bitType}]\nContent`)).toEqual(DECORATIVE_IMAGE);
    });

    test.each(DEFAULTED_BIT_TYPES)('[.%s] an authored value overrides the default', (bitType) => {
      expect(
        groupTags(
          `[.${bitType}]\n[@accessibilityGroupTag:photo][@accessibilityTag:complex]\nContent`,
        ),
      ).toEqual([{ name: 'photo', tags: ['complex'] }]);
    });

    test('the default fills only accessibilityGroupTag, not the standalone tag', () => {
      expect(toJson('[.separator]\nContent')[0].bit.accessibilityTag).toBeUndefined();
    });

    test('print-page-break does not inherit the default (it is based on article)', () => {
      const bit = toJson('[.print-page-break]\nContent')[0].bit;
      expect(bit.accessibilityGroupTag).toBeUndefined();
      expect(bit.accessibilityTag).toBeUndefined();
    });

    test('other separator descendants of article are unaffected', () => {
      expect(toJson('[.article]\nContent')[0].bit.accessibilityGroupTag).toBeUndefined();
    });
  });

  describe('JSON => bitmark', () => {
    test('JSON input trims and string-coerces the enum value, matching @tag', () => {
      const json = [
        {
          bit: {
            type: 'article',
            format: 'bitmark++',
            bitLevel: 1,
            accessibilityTag: '  standard  ',
            body: 'X',
          },
        },
      ] as unknown as BitWrapperJson[];
      expect(toBitmark(json)).toContain('[@accessibilityTag: standard ]');
    });

    test('both tags are written', () => {
      const bitmark = toBitmark(
        toJson('[.article]\n[@accessibilityGroupTag:image][@accessibilityTag:decorative]'),
      );
      expect(bitmark).toContain('[@accessibilityGroupTag: image ]');
      expect(bitmark).toContain('[@accessibilityTag: decorative ]');
    });

    test('a defaulted bit writes the materialised default', () => {
      const bitmark = toBitmark(toJson('[.separator]\nContent'));
      expect(bitmark).toContain('[@accessibilityGroupTag: image ][@accessibilityTag: decorative ]');
    });

    test('a non-defaulted bit writes nothing', () => {
      expect(toBitmark(toJson('[.print-page-break]\nContent'))).not.toContain('accessibility');
    });
  });

  describe('round-trip', () => {
    test.each([
      '[.article]\n[@accessibilityTag:standard]\n\nContent',
      '[.article]\n[@accessibilityGroupTag:image][@accessibilityTag:decorative]\n\nContent',
      '[.separator]\nContent',
      '[.image-mood]\n[@accessibilityGroupTag:photo][@accessibilityTag:complex]',
      '[.print-page-break]\nContent',
    ])('bitmark => JSON => bitmark => JSON is stable: %s', (original) => {
      const json = toJson(original);
      const roundTripped = toJson(toBitmark(json));
      expect(roundTripped[0].bit.accessibilityGroupTag).toEqual(json[0].bit.accessibilityGroupTag);
      expect(roundTripped[0].bit.accessibilityTag).toEqual(json[0].bit.accessibilityTag);
    });
  });
});
