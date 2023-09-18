import { CardConfigKey } from '../../model/config/CardConfigKey';
import { GroupConfigKey } from '../../model/config/GroupConfigKey';
import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { _CardsConfig } from '../../model/config/RawConfig';
import { ResourceConfigKey } from '../../model/config/ResourceConfigKey';
import { TagConfigKey } from '../../model/config/TagConfigKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { Count } from '../../model/enum/Count';

const CARDS: _CardsConfig = {
  [CardConfigKey._flashcards]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardConfigKey._elements]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardConfigKey._statements]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.tag,
              id: TagConfigKey._true,
              maxCount: 1,
            },
            {
              type: BitTagType.tag,
              id: TagConfigKey._false,
              maxCount: 1,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
            },
          ],
        },
      ],
    ],
  },
  [CardConfigKey._quiz]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupConfigKey._trueFalse,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
            },
          ],
        },
      ],
    ],
  },
  [CardConfigKey._questions]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.tag,
              id: TagConfigKey._sampleSolution,
            },
            {
              type: BitTagType.property,
              id: PropertyConfigKey._sampleSolution,
            },
            {
              type: BitTagType.property,
              id: PropertyConfigKey._shortAnswer,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
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

  [CardConfigKey._matchPairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
            },
            {
              type: BitTagType.tag,
              id: TagConfigKey._title,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardConfigKey._matchAudioPairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
            },
            {
              type: BitTagType.tag,
              id: TagConfigKey._title,
            },
            {
              type: BitTagType.resource,
              id: ResourceConfigKey._audio,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardConfigKey._matchImagePairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
            },
            {
              type: BitTagType.tag,
              id: TagConfigKey._title,
            },
            {
              type: BitTagType.resource,
              id: ResourceConfigKey._image,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardConfigKey._matchMatrix]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
            },
            {
              type: BitTagType.tag,
              id: TagConfigKey._title,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardConfigKey._botActionResponses]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.property,
              id: PropertyConfigKey._reaction,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupConfigKey._standardExample,
            },
          ],
          bodyAllowed: true,
        },
      ],
    ],
  },
};

export { CARDS };
