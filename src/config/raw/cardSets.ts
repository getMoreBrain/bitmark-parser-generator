import { _CardSetsConfig } from '../../model/config/_Config';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey';
import { ConfigKey } from '../../model/config/enum/ConfigKey';
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
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
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
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
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
              configKey: ConfigKey._tag_true,
              maxCount: 1,
            },
            {
              type: BitTagType.tag,
              configKey: ConfigKey._tag_false,
              maxCount: 1,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
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
              configKey: ConfigKey._group_trueFalse,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
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
              type: BitTagType.tag,
              configKey: ConfigKey._tag_sampleSolution,
            },
            {
              type: BitTagType.property,
              configKey: ConfigKey._property_sampleSolution,
            },
            {
              type: BitTagType.property,
              configKey: ConfigKey._property_shortAnswer,
            },
            {
              type: BitTagType.property,
              configKey: ConfigKey._property_longAnswer,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
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
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
            },
            {
              type: BitTagType.tag,
              configKey: ConfigKey._tag_title,
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
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
            },
            {
              type: BitTagType.tag,
              configKey: ConfigKey._tag_title,
            },
            {
              type: BitTagType.resource,
              configKey: ConfigKey._resource_audio,
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
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
            },
            {
              type: BitTagType.tag,
              configKey: ConfigKey._tag_title,
            },
            {
              type: BitTagType.resource,
              configKey: ConfigKey._resource_image,
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
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
            },
            {
              type: BitTagType.tag,
              configKey: ConfigKey._tag_title,
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
              configKey: ConfigKey._property_reaction,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              configKey: ConfigKey._group_standardExample,
            },
          ],
          bodyAllowed: true,
        },
      ],
    ],
  },
};

export { CARDSETS as CARDS };
