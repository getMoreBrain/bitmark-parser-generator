import { CardKey } from '../../model/config/CardKey';
import { GroupKey } from '../../model/config/GroupKey';
import { CardsConfig } from '../../model/config/NewConfig';
import { ResourceKey } from '../../model/config/ResourceKey';
import { TagKey } from '../../model/config/TagKey';
import { BitTagType } from '../../model/enum/BitTagType';
import { Count } from '../../model/enum/Count';
import { PropertyKey } from '../../model/enum/PropertyKey';

const CARDS: CardsConfig = {
  [CardKey.flashcards]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardKey.elements]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardKey.statements]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.tag,
              id: TagKey.true,
              maxCount: 1,
            },
            {
              type: BitTagType.tag,
              id: TagKey.false,
              maxCount: 1,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
            },
          ],
        },
      ],
    ],
  },
  [CardKey.quiz]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupKey.trueFalse,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
            },
          ],
        },
      ],
    ],
  },
  [CardKey.questions]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.tag,
              id: TagKey.sampleSolution,
            },
            {
              type: BitTagType.property,
              id: PropertyKey.sampleSolution,
            },
            {
              type: BitTagType.property,
              id: PropertyKey.shortAnswer,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
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

  [CardKey.matchPairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
            },
            {
              type: BitTagType.tag,
              id: TagKey.title,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardKey.matchAudioPairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
            },
            {
              type: BitTagType.tag,
              id: TagKey.title,
            },
            {
              type: BitTagType.resource,
              id: ResourceKey.audio,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardKey.matchImagePairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
            },
            {
              type: BitTagType.tag,
              id: TagKey.title,
            },
            {
              type: BitTagType.resource,
              id: ResourceKey.image,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardKey.matchMatrix]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
            },
            {
              type: BitTagType.tag,
              id: TagKey.title,
            },
          ],
          bodyAllowed: true,
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardKey.botActionResponses]: {
    variants: [
      [
        {
          tags: [
            {
              type: BitTagType.property,
              id: PropertyKey.reaction,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardItemLeadInstructionHint,
            },
            {
              type: BitTagType.group,
              id: GroupKey.standardExample,
            },
          ],
          bodyAllowed: true,
        },
      ],
    ],
  },
};

export { CARDS };
