import { describe, expect, it } from 'vitest';

import { Config } from '../../src/config/Config.ts';
import { BitType, type BitTypeType } from '../../src/model/enum/BitType.ts';

interface ExtendedTableVariant {
  bitType: BitTypeType;
  since: string;
  directBaseBitType: BitTypeType;
  extendedBaseBitType: BitTypeType;
}

describe('extended table bit types', () => {
  const variants: ExtendedTableVariant[] = [
    {
      bitType: BitType.smartStandardRemarkTableExtendedImageNonNormative,
      since: '1.28.0',
      directBaseBitType: BitType.standardRemarkTableExtendedImageNonNormative,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.smartStandardRemarkTableExtendedImageNonNormativeCollapsible,
      since: '1.28.0',
      directBaseBitType: BitType.smartStandardRemarkTableExtendedImageNonNormative,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.smartStandardRemarkTableExtendedImageNormative,
      since: '1.28.0',
      directBaseBitType: BitType.standardRemarkTableExtendedImageNormative,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.smartStandardRemarkTableExtendedImageNormativeCollapsible,
      since: '1.28.0',
      directBaseBitType: BitType.smartStandardRemarkTableExtendedImageNormative,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.smartStandardRemarkTableExtendedNonNormative,
      since: '1.28.0',
      directBaseBitType: BitType.standardRemarkTableExtendedNonNormative,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.smartStandardRemarkTableExtendedNonNormativeCollapsible,
      since: '1.28.0',
      directBaseBitType: BitType.smartStandardRemarkTableExtendedNonNormative,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.smartStandardRemarkTableExtendedNormative,
      since: '1.28.0',
      directBaseBitType: BitType.standardRemarkTableExtendedNormative,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.smartStandardRemarkTableExtendedNormativeCollapsible,
      since: '1.28.0',
      directBaseBitType: BitType.smartStandardRemarkTableExtendedNormative,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.smartStandardTableExtendedImageNonNormative,
      since: '1.28.0',
      directBaseBitType: BitType.standardTableExtendedImageNonNormative,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.smartStandardTableExtendedImageNonNormativeCollapsible,
      since: '1.28.0',
      directBaseBitType: BitType.smartStandardTableExtendedImageNonNormative,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.smartStandardTableExtendedImageNormative,
      since: '1.28.0',
      directBaseBitType: BitType.standardTableExtendedImageNormative,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.smartStandardTableExtendedImageNormativeCollapsible,
      since: '1.28.0',
      directBaseBitType: BitType.smartStandardTableExtendedImageNormative,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.smartStandardTableExtendedNonNormative,
      since: '1.28.0',
      directBaseBitType: BitType.standardTableExtendedNonNormative,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.smartStandardTableExtendedNonNormativeCollapsible,
      since: '1.28.0',
      directBaseBitType: BitType.smartStandardTableExtendedNonNormative,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.smartStandardTableExtendedNormative,
      since: '1.28.0',
      directBaseBitType: BitType.standardTableExtendedNormative,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.smartStandardTableExtendedNormativeCollapsible,
      since: '1.28.0',
      directBaseBitType: BitType.smartStandardTableExtendedNormative,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.standardRemarkTableExtendedImageNonNormative,
      since: '1.17.0',
      directBaseBitType: BitType.tableExtendedImage,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.standardRemarkTableExtendedImageNormative,
      since: '1.17.0',
      directBaseBitType: BitType.tableExtendedImage,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.standardRemarkTableExtendedNonNormative,
      since: '1.17.0',
      directBaseBitType: BitType.tableExtended,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.standardRemarkTableExtendedNormative,
      since: '1.17.0',
      directBaseBitType: BitType.tableExtended,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.standardTableExtendedImageNonNormative,
      since: '1.16.0',
      directBaseBitType: BitType.tableExtendedImage,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.standardTableExtendedImageNormative,
      since: '1.16.0',
      directBaseBitType: BitType.tableExtendedImage,
      extendedBaseBitType: BitType.tableExtendedImage,
    },
    {
      bitType: BitType.standardTableExtendedNonNormative,
      since: '1.16.0',
      directBaseBitType: BitType.tableExtended,
      extendedBaseBitType: BitType.tableExtended,
    },
    {
      bitType: BitType.standardTableExtendedNormative,
      since: '1.16.0',
      directBaseBitType: BitType.tableExtended,
      extendedBaseBitType: BitType.tableExtended,
    },
  ];

  it('supports all requested extended table variants', () => {
    for (const variant of variants) {
      expect(Config.getBitType(variant.bitType)).toBe(variant.bitType);

      const bitConfig = Config.getBitConfig(variant.bitType);
      expect(bitConfig.since).toBe(variant.since);
      expect(bitConfig.inheritedBitTypes[1]).toBe(variant.directBaseBitType);
      expect(Config.isOfBitType(variant.bitType, variant.extendedBaseBitType)).toBe(true);
    }
  });
});
