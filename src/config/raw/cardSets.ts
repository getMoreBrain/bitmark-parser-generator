import { type _CardSetsConfig } from '../../model/config/_Config.ts';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey.ts';
import { ConfigKey } from '../../model/config/enum/ConfigKey.ts';
import { Count } from '../../model/enum/Count.ts';
import { TagFormat } from '../../model/enum/TagFormat.ts';

const CARDSETS: _CardSetsConfig = {
  [CardSetConfigKey.definitionList]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
            {
              key: ConfigKey.tag_title,
            },
            {
              key: ConfigKey.group_resourceIcon,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.flashcard]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
            {
              key: ConfigKey.tag_title,
            },
            {
              key: ConfigKey.group_resourceIcon,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.elements]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.statements]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.tag_true,
              maxCount: 1,
            },
            {
              key: ConfigKey.tag_false,
              maxCount: 1,
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
          ],
          bodyAllowed: false,
        },
      ],
    ],
  },
  [CardSetConfigKey.quiz]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.group_trueFalse,
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
          ],
          bodyAllowed: false,
        },
      ],
    ],
  },
  [CardSetConfigKey.feedback]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_trueFalse,
            },
            {
              key: ConfigKey.tag_title,
            },
          ],
          bodyAllowed: false,
        },
      ],
      // Side 2
      [
        // Variant 1..N
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.property_reasonableNumOfChars,
              format: TagFormat.number,
            },
            {
              key: ConfigKey.group_standardExample,
            },
            {
              key: ConfigKey.tag_title,
            },
          ],
          bodyAllowed: true,
        },
      ],
    ],
  },
  [CardSetConfigKey.questions]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.property_reasonableNumOfChars,
              format: TagFormat.number,
            },
            {
              key: ConfigKey.tag_sampleSolution,
            },
            {
              key: ConfigKey.property_sampleSolution,
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_additionalSolutions,
              format: TagFormat.plainText,
              maxCount: Count.infinity,
            },
            {
              key: ConfigKey.property_partialAnswer,
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
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

  [CardSetConfigKey.matchPairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
            {
              key: ConfigKey.tag_title,
            },
            {
              key: ConfigKey.property_isCaseSensitive,
              format: TagFormat.boolean,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.matchAudioPairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
            {
              key: ConfigKey.tag_title,
            },
            {
              key: ConfigKey.resource_audio,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.matchImagePairs]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
            {
              key: ConfigKey.tag_title,
            },
            {
              key: ConfigKey.resource_image,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.matchMatrix]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
            {
              key: ConfigKey.tag_title,
            },
            {
              key: ConfigKey.property_isCaseSensitive,
              format: TagFormat.boolean,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.table]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.tag_title,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.pronunciationTable]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.tag_title,
            },
            {
              key: ConfigKey.resource_audio,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.botActionResponses]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.property_reaction,
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.group_standardExample,
            },
          ],
        },
      ],
    ],
  },
  [CardSetConfigKey.clozeList]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.group_standardTags,
            },
            {
              key: ConfigKey.group_gap,
            },
          ],
        },
      ],
    ],
  },
  [CardSetConfigKey.exampleBitList]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.group_standardTags,
            },
            {
              key: ConfigKey.tag_title,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  [CardSetConfigKey.ingredients]: {
    variants: [
      [
        {
          tags: [
            {
              key: ConfigKey.tag_title,
            },
            {
              key: ConfigKey.group_trueFalse,
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
            },
            {
              key: ConfigKey.property_unit,
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_unitAbbr,
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_decimalPlaces,
              format: TagFormat.number,
              defaultValue: '1',
            },
            {
              key: ConfigKey.property_disableCalculation,
              format: TagFormat.boolean,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
  // DEPRECATED - TO BE REMOVED IN THE FUTURE
  // [CardSetConfigKey._captionDefinitionsList]: {
  //   variants: [
  //     // Side 1
  //     [
  //       // Variant 1..N
  //       {
  //         tags: [
  //           {
  //             type: BitTagType.tag,
  //             configKey: TagConfigKey.title,
  //           },
  //         ],
  //         repeatCount: Count.infinity,
  //       },
  //     ],
  //   ],
  // },
  [CardSetConfigKey.bookReferenceList]: {
    variants: [
      // Side 1
      [
        // Variant 1..N
        {
          tags: [
            {
              key: ConfigKey.group_standardTags,
            },
            {
              key: ConfigKey.property_refAuthor,
              format: TagFormat.plainText,
              maxCount: Count.infinity,
            },
            {
              key: ConfigKey.property_refBookTitle,
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_refPublisher,
              format: TagFormat.plainText,
              maxCount: Count.infinity,
            },
            {
              key: ConfigKey.property_refPublicationYear,
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_citationStyle,
              format: TagFormat.plainText,
            },
          ],
          repeatCount: Count.infinity,
        },
      ],
    ],
  },
};

export { CARDSETS as CARDS };
