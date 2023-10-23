import { _CardSetsConfig } from '../../model/config/_Config';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey';
import { GroupConfigKey } from '../../model/config/enum/GroupConfigKey';
import { PropertyConfigKey } from '../../model/config/enum/PropertyConfigKey';
import { ResourceConfigKey } from '../../model/config/enum/ResourceConfigKey';
import { TagConfigKey } from '../../model/config/enum/TagConfigKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { Count } from '../../model/enum/Count';

const CARDSETS: _CardSetsConfig = {
  [CardSetConfigKey._flashcards]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._elements]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._statements]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.true,
              maxCount: 1,
            },
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.false,
              maxCount: 1,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
          ],
        },
      ],
    ],
  },
  [CardSetConfigKey._quiz]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_trueFalse,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
          ],
        },
      ],
    ],
  },
  [CardSetConfigKey._questions]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.reasonableNumOfChars,
            },
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.sampleSolution,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.property_sampleSolution,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  // matchPairs
  // TODO: We actually need to allow for different card configurations, because titles are valid on the first card only.
  // For now we allow them to be valid on all cards, but we need to change this.

  [CardSetConfigKey._matchPairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.title,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.isCaseSensitive,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._matchAudioPairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.title,
            },
            {
              type: BitTagType.resource,
              configKey: ResourceConfigKey.audio,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._matchImagePairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.title,
            },
            {
              type: BitTagType.resource,
              configKey: ResourceConfigKey.image,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._matchMatrix]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.title,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.isCaseSensitive,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._botActionResponses]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.reaction,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardExample,
            },
          ],
          bodyAllowed: true,
        },
      ],
    ],
  },
  [CardSetConfigKey._clozeList]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardTags,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_gap,
            },
          ],
          bodyAllowed: true,
        },
      ],
    ],
  },
  [CardSetConfigKey._pageFooterSections]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
};

export { CARDSETS as CARDS };
