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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the definition.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the definition.',
            },
            {
              key: ConfigKey.group_resourceIcon,
              description: 'Icon resource for the definition.',
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the flashcard.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the flashcard.',
            },
            {
              key: ConfigKey.group_resourceIcon,
              description: 'Icon resource for the flashcard.',
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the element.',
              format: TagFormat.plainText,
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
              description: 'Tag for true statements.',
              maxCount: 1,
            },
            {
              key: ConfigKey.tag_false,
              description: 'Tag for false statements.',
              maxCount: 1,
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the statement.',
              format: TagFormat.plainText,
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
              description: 'Group for true/false questions.',
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the quiz question.',
              format: TagFormat.plainText,
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.group_trueFalse,
              description: 'Group for true/false feedback.',
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the feedback.',
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_reasonableNumOfChars,
              description: 'Property for reasonable number of characters.',
              format: TagFormat.number,
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the feedback.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the feedback.',
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
              description: 'Property for reasonable number of characters.',
              format: TagFormat.number,
            },
            {
              key: ConfigKey.tag_sampleSolution,
              description: 'Sample solution for the question.',
            },
            {
              key: ConfigKey.property_sampleSolution,
              description: 'Property for sample solution text.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_additionalSolutions,
              description: 'Property for additional solutions.',
              format: TagFormat.plainText,
              maxCount: Count.infinity,
            },
            {
              key: ConfigKey.property_partialAnswer,
              description: 'Property for partial answer text.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the question.',
              format: TagFormat.plainText,
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the match pair.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the match pair.',
            },
            {
              key: ConfigKey.property_isCaseSensitive,
              description: 'Property to indicate if the match is case sensitive.',
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the audio match pair.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the audio match pair.',
            },
            {
              key: ConfigKey.resource_audio,
              description: 'Audio resource for the match pair.',
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the image match pair.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the image match pair.',
            },
            {
              key: ConfigKey.resource_image,
              description: 'Image resource for the match pair.',
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the match matrix.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the match matrix.',
            },
            {
              key: ConfigKey.property_isCaseSensitive,
              description: 'Property to indicate if the match is case sensitive.',
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the table.',
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
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the pronunciation table.',
            },
            {
              key: ConfigKey.resource_audio,
              description: 'Audio resource for the pronunciation table.',
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
              description: 'Reaction to the bot action.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_example,
              description: 'Example text for the bot action response.',
              format: TagFormat.plainText,
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
              description: 'Standard tags for cloze items.',
            },
            {
              key: ConfigKey.group_gap,
              description: 'Group for gap tags in cloze items.',
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
              description: 'Standard tags for example bits.',
            },
            {
              key: ConfigKey.tag_title,
              description: 'Title of the example bit.',
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
              description: 'Title of the ingredient.',
            },
            {
              key: ConfigKey.group_trueFalse,
              description: 'Group for true/false properties of the ingredient.',
            },
            {
              key: ConfigKey.group_standardItemLeadInstructionHint,
              description: 'Standard tags for lead, instruction, and hint.',
            },
            {
              key: ConfigKey.property_unit,
              description: 'Unit of measurement for the ingredient.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_unitAbbr,
              description: 'Abbreviation for the unit of measurement.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_decimalPlaces,
              description: 'Number of decimal places for the ingredient quantity.',
              format: TagFormat.number,
              defaultValue: '1',
            },
            {
              key: ConfigKey.property_disableCalculation,
              description: 'Disable calculation for the ingredient.',
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
              description: 'Standard tags for book references.',
            },
            {
              key: ConfigKey.property_refAuthor,
              description: 'Author of the book.',
              format: TagFormat.plainText,
              maxCount: Count.infinity,
            },
            {
              key: ConfigKey.property_refBookTitle,
              description: 'Title of the book.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_refPublisher,
              description: 'Publisher of the book.',
              format: TagFormat.plainText,
              maxCount: Count.infinity,
            },
            {
              key: ConfigKey.property_refPublicationYear,
              description: 'Year of publication of the book.',
              format: TagFormat.plainText,
            },
            {
              key: ConfigKey.property_citationStyle,
              description: 'Citation style for the book reference.',
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
