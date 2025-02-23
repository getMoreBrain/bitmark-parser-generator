import { _CardSetsConfig } from '../../model/config/_Config';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey';
import { GroupConfigKey } from '../../model/config/enum/GroupConfigKey';
import { PropertyConfigKey } from '../../model/config/enum/PropertyConfigKey';
import { ResourceConfigKey } from '../../model/config/enum/ResourceConfigKey';
import { TagConfigKey } from '../../model/config/enum/TagConfigKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { Count } from '../../model/enum/Count';

const CARDSETS: _CardSetsConfig = {
  [CardSetConfigKey._flashcardLike]: {
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
          bodyAllowed: false,
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
          bodyAllowed: false,
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
              type: BitTagType.property,
              configKey: PropertyConfigKey.additionalSolutions,
              maxCount: Count.infinity,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.partialAnswer,
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
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._table]: {
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
              type: BitTagType.tag,
              configKey: TagConfigKey.title,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._pronunciationTable]: {
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
              type: BitTagType.tag,
              configKey: TagConfigKey.title,
            },
            {
              type: BitTagType.resource,
              configKey: ResourceConfigKey.audio,
            },
          ],
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
        },
      ],
    ],
  },
  [CardSetConfigKey._exampleBitList]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardTags,
            },
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.title,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._ingredients]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.title,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_trueFalse,
            },
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.unit,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.unitAbbr,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.decimalPlaces,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.disableCalculation,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._captionDefinitionsList]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.tag,
              configKey: TagConfigKey.title,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey._bookReferenceList]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              configKey: GroupConfigKey.group_standardTags,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.refAuthor,
              maxCount: Count.infinity,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.refBookTitle,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.refPublisher,
              maxCount: Count.infinity,
            },
            {
              type: BitTagType.property,
              configKey: PropertyConfigKey.citationStyle,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
};

export { CARDSETS as CARDS };
