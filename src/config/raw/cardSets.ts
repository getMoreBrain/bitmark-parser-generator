import { type _CardSetsConfig } from '../../model/config/_Config.ts';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey.ts';
import { ConfigKey } from '../../model/config/enum/ConfigKey.ts';
import { Count } from '../../model/enum/Count.ts';
import { TagFormat } from '../../model/enum/TagFormat.ts';

const CARDSETS: _CardSetsConfig = {
  //
  // flashcard
  //
  [CardSetConfigKey.flashcard]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'cards',
        sides: [
          {
            name: 'question',
            variants: [
              {
                jsonKey: 'question.text',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the flashcard.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the flashcard.',
                  },
                  {
                    key: ConfigKey.group_resourceIcon,
                    description: 'Icon resource for the flashcard.',
                    jsonKey: 'question.icon',
                  },
                ],
              },
            ],
          },
          {
            name: 'answer',
            variants: [
              {
                jsonKey: 'answer.text',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the flashcard.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the flashcard.',
                  },
                  {
                    key: ConfigKey.group_resourceIcon,
                    description: 'Icon resource for the flashcard.',
                    jsonKey: 'answer.icon',
                  },
                ],
              },
              {
                jsonKey: 'alternativeAnswers[].text',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the flashcard.',
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
          },
        ],
      },
    ],
  },

  //
  // definition-list
  //
  [CardSetConfigKey.definitionList]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'definitions',
        sides: [
          {
            name: 'term',
            variants: [
              {
                jsonKey: 'term.text',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the definition.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the definition.',
                    jsonKey: '^heading.forKeys',
                  },
                  {
                    key: ConfigKey.group_resourceIcon,
                    description: 'Icon resource for the definition.',
                    jsonKey: 'term.icon',
                  },
                ],
              },
            ],
          },
          {
            name: 'definition',
            variants: [
              {
                jsonKey: 'definition.text',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the definition.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the definition.',
                    jsonKey: '^heading.forValues',
                  },
                  {
                    key: ConfigKey.group_resourceIcon,
                    description: 'Icon resource for the definition.',
                    jsonKey: 'definition.icon',
                  },
                ],
              },
              {
                jsonKey: 'alternativeDefinitions[].text',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the definition.',
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
          },
        ],
      },
    ],
  },

  //
  // match-pairs
  //
  [CardSetConfigKey.matchPairs]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'pairs',
        sides: [
          {
            name: 'key',
            variants: [
              {
                jsonKey: 'key',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the match pair.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the match pair.',
                    jsonKey: '^heading.forKeys',
                  },
                  {
                    key: ConfigKey.property_isCaseSensitive,
                    description: 'Property to indicate if the match is case sensitive.',
                    format: TagFormat.boolean,
                  },
                  {
                    key: ConfigKey.resource_audio,
                    description: 'Audio resource for the match pair.',
                    jsonKey: 'keyAudio',
                  },
                  {
                    key: ConfigKey.resource_image,
                    description: 'Image resource for the match pair.',
                    jsonKey: 'keyImage',
                  },
                ],
              },
            ],
          },
          {
            name: 'values',
            repeat: true,
            variants: [
              {
                jsonKey: 'values[]',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the match pair.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the match pair.',
                    jsonKey: '^heading.forValues[]',
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
          },
        ],
      },
    ],
  },

  //
  // match-audio-pairs
  //
  [CardSetConfigKey.matchAudioPairs]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'pairs',
        sides: [
          {
            name: 'key',
            variants: [
              {
                jsonKey: 'key',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the audio match pair.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the audio match pair.',
                    jsonKey: '^heading.forKeys',
                  },
                  {
                    key: ConfigKey.resource_audio,
                    description: 'Audio resource for the match pair.',
                    jsonKey: 'keyAudio',
                  },
                ],
              },
            ],
          },
          {
            name: 'values',
            repeat: true,
            variants: [
              {
                jsonKey: 'values[]',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the audio match pair.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the audio match pair.',
                    jsonKey: '^heading.forValues[]',
                  },
                  {
                    key: ConfigKey.resource_audio,
                    description: 'Audio resource for the match pair.',
                  },
                ],
                repeatCount: Count.infinity,
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // match-image-pairs
  //
  [CardSetConfigKey.matchImagePairs]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'pairs',
        sides: [
          {
            name: 'key',
            variants: [
              {
                jsonKey: 'key',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the image match pair.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the image match pair.',
                    jsonKey: '^heading.forKeys',
                  },
                  {
                    key: ConfigKey.resource_image,
                    description: 'Image resource for the match pair.',
                    jsonKey: 'keyImage',
                  },
                ],
              },
            ],
          },
          {
            name: 'values',
            repeat: true,
            variants: [
              {
                jsonKey: 'values[]',
                tags: [
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the image match pair.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the image match pair.',
                    jsonKey: '^heading.forValues[]',
                  },
                  {
                    key: ConfigKey.resource_image,
                    description: 'Image resource for the match pair.',
                  },
                ],
                repeatCount: Count.infinity,
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // match-matrix
  //
  [CardSetConfigKey.matchMatrix]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'matrix',
        sides: [
          {
            name: 'key',
            variants: [
              {
                jsonKey: 'key',
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
                    jsonKey: '^heading.forKeys',
                  },
                  {
                    key: ConfigKey.property_isCaseSensitive,
                    description: 'Property to indicate if the match is case sensitive.',
                    format: TagFormat.boolean,
                  },
                ],
              },
            ],
          },
          {
            name: 'cell',
            repeat: true,
            variants: [
              {
                jsonKey: 'cells[{s}].values[]',
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
                    jsonKey: '^heading.forValues[]',
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
          },
        ],
      },
    ],
  },

  //
  // statements
  //
  [CardSetConfigKey.statements]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'statements',
        sides: [
          {
            name: 'statement',
            variants: [
              {
                jsonKey: 'statement',
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
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the statement.',
                  },
                ],
                bodyAllowed: false,
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // quiz
  //
  [CardSetConfigKey.quiz]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'quizzes',
        sides: [
          {
            name: 'choices',
            variants: [
              {
                jsonKey: null,
                tags: [
                  {
                    key: ConfigKey.group_trueFalse,
                    description: 'Group for true/false questions.',
                  },
                  {
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the quiz.',
                  },
                ],
                bodyAllowed: false,
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // feedback
  //
  [CardSetConfigKey.feedback]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'feedbacks',
        sides: [
          {
            name: 'choices',
            variants: [
              {
                jsonKey: null,
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
                    jsonKey: '^heading.forKeys',
                  },
                ],
                bodyAllowed: false,
              },
            ],
          },
          {
            name: 'reason',
            variants: [
              {
                jsonKey: 'reason.text',
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
                    jsonKey: '^heading.forValues',
                  },
                ],
                bodyAllowed: true,
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // questions
  //
  [CardSetConfigKey.questions]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'questions',
        sides: [
          {
            name: 'question',
            variants: [
              {
                jsonKey: 'question',
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
                    key: ConfigKey.group_standardTags,
                    description: 'Standard tags for the question.',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // elements
  //
  [CardSetConfigKey.elements]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: null,
        sides: [
          {
            name: 'element',
            repeat: true,
            variants: [
              {
                jsonKey: 'elements[]',
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
          },
        ],
      },
    ],
  },

  //
  // table
  //
  [CardSetConfigKey.table]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'table.data',
        sides: [
          {
            name: 'cell',
            repeat: true,
            variants: [
              {
                jsonKey: null,
                tags: [
                  {
                    key: ConfigKey.group_standardItemLeadInstructionHint,
                    description: 'Standard tags for lead, instruction, and hint.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the table.',
                    jsonKey: '^table.columns[]',
                  },
                  {
                    key: ConfigKey.property_tableCellType,
                    description: 'Table cell type (th/td).',
                    format: TagFormat.plainText,
                    jsonKey: 'title|bool(th)',
                  },
                  {
                    key: ConfigKey.property_tableRowSpan,
                    description: 'Number of rows the cell spans.',
                    format: TagFormat.number,
                    jsonKey: 'rowspan',
                  },
                  {
                    key: ConfigKey.property_tableColSpan,
                    description: 'Number of columns the cell spans.',
                    format: TagFormat.number,
                    jsonKey: 'colspan',
                  },
                  {
                    key: ConfigKey.property_tableScope,
                    description: 'Scope attribute for header cells.',
                    format: TagFormat.plainText,
                    jsonKey: 'scope',
                  },
                ],
                repeatCount: Count.infinity,
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // table-extended
  //
  [CardSetConfigKey.tableExtended]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'table.body.rows',
        sides: [
          {
            name: 'cell',
            repeat: true,
            jsonKey: 'cells',
            variants: [
              {
                jsonKey: 'content',
                tags: [
                  {
                    key: ConfigKey.group_standardItemLeadInstructionHint,
                    description: 'Standard tags for lead, instruction, and hint.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the table cell.',
                  },
                  {
                    key: ConfigKey.property_tableCellType,
                    description: 'Table cell type (th/td).',
                    format: TagFormat.plainText,
                    jsonKey: 'title|bool(th)',
                  },
                  {
                    key: ConfigKey.property_tableRowSpan,
                    description: 'Number of rows the cell spans.',
                    format: TagFormat.number,
                    jsonKey: 'rowspan',
                  },
                  {
                    key: ConfigKey.property_tableColSpan,
                    description: 'Number of columns the cell spans.',
                    format: TagFormat.number,
                    jsonKey: 'colspan',
                  },
                  {
                    key: ConfigKey.property_tableScope,
                    description: 'Scope attribute for header cells.',
                    format: TagFormat.plainText,
                    jsonKey: 'scope',
                  },
                ],
                repeatCount: Count.infinity,
              },
            ],
          },
        ],
      },
      {
        name: 'table-header',
        jsonKey: 'table.header.rows',
        sides: [
          {
            name: 'cell',
            repeat: true,
            jsonKey: 'cells',
            variants: [
              {
                jsonKey: 'content',
                tags: [
                  {
                    key: ConfigKey.group_standardItemLeadInstructionHint,
                    description: 'Standard tags for lead, instruction, and hint.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the table cell.',
                  },
                  {
                    key: ConfigKey.property_tableCellType,
                    description: 'Table cell type (th/td).',
                    format: TagFormat.plainText,
                    jsonKey: 'title|bool(th)',
                  },
                  {
                    key: ConfigKey.property_tableRowSpan,
                    description: 'Number of rows the cell spans.',
                    format: TagFormat.number,
                    jsonKey: 'rowspan',
                  },
                  {
                    key: ConfigKey.property_tableColSpan,
                    description: 'Number of columns the cell spans.',
                    format: TagFormat.number,
                    jsonKey: 'colspan',
                  },
                  {
                    key: ConfigKey.property_tableScope,
                    description: 'Scope attribute for header cells.',
                    format: TagFormat.plainText,
                    jsonKey: 'scope',
                  },
                ],
                repeatCount: Count.infinity,
              },
            ],
          },
        ],
      },
      {
        name: 'table-footer',
        jsonKey: 'table.footer.rows',
        sides: [
          {
            name: 'cell',
            repeat: true,
            jsonKey: 'cells',
            variants: [
              {
                jsonKey: 'content',
                tags: [
                  {
                    key: ConfigKey.group_standardItemLeadInstructionHint,
                    description: 'Standard tags for lead, instruction, and hint.',
                  },
                  {
                    key: ConfigKey.tag_title,
                    description: 'Title of the table cell.',
                  },
                  {
                    key: ConfigKey.property_tableCellType,
                    description: 'Table cell type (th/td).',
                    format: TagFormat.plainText,
                    jsonKey: 'title|bool(th)',
                  },
                  {
                    key: ConfigKey.property_tableRowSpan,
                    description: 'Number of rows the cell spans.',
                    format: TagFormat.number,
                    jsonKey: 'rowspan',
                  },
                  {
                    key: ConfigKey.property_tableColSpan,
                    description: 'Number of columns the cell spans.',
                    format: TagFormat.number,
                    jsonKey: 'colspan',
                  },
                  {
                    key: ConfigKey.property_tableScope,
                    description: 'Scope attribute for header cells.',
                    format: TagFormat.plainText,
                    jsonKey: 'scope',
                  },
                ],
                repeatCount: Count.infinity,
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // pronunciation-table
  //
  [CardSetConfigKey.pronunciationTable]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'pronunciationTable.data',
        sides: [
          {
            name: 'cell',
            repeat: true,
            variants: [
              {
                jsonKey: 'body',
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
                    jsonKey: 'audio',
                  },
                ],
                repeatCount: Count.infinity,
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // bot-action-responses
  //
  [CardSetConfigKey.botActionResponses]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'responses',
        sides: [
          {
            name: 'response',
            variants: [
              {
                jsonKey: 'feedback',
                tags: [
                  {
                    key: ConfigKey.property_reaction,
                    description: 'Reaction to the bot action.',
                    format: TagFormat.plainText,
                  },
                  {
                    key: ConfigKey.tag_item,
                    description: 'The item for the bot action response.',
                    chain: [
                      {
                        key: ConfigKey.tag_item,
                        description:
                          'The lead, page number, source page number, and margin number.',
                        maxCount: 4,
                      },
                    ],
                  },
                  {
                    key: ConfigKey.tag_instruction,
                    description: 'The response label for the bot action.',
                    jsonKey: 'response',
                  },
                  {
                    key: ConfigKey.property_example,
                    description: 'Example text for the bot action response.',
                    format: TagFormat.plainText,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // cloze-list
  //
  [CardSetConfigKey.clozeList]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'listItems',
        sides: [
          {
            name: 'content',
            variants: [
              {
                jsonKey: 'body',
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
          },
        ],
      },
    ],
  },

  //
  // example-bit-list
  //
  [CardSetConfigKey.exampleBitList]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'listItems',
        sides: [
          {
            name: 'item',
            variants: [
              {
                jsonKey: 'body',
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
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // ingredients
  //
  [CardSetConfigKey.ingredients]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'ingredients',
        sides: [
          {
            name: 'ingredient',
            variants: [
              {
                jsonKey: 'ingredient',
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
                    key: ConfigKey.tag_item,
                    description: 'The item for the ingredient.',
                    chain: [
                      {
                        key: ConfigKey.tag_item,
                        description: 'Lead, page number, source page number, and margin number.',
                        maxCount: 4,
                      },
                    ],
                  },
                  {
                    key: ConfigKey.tag_instruction,
                    description: 'The quantity of the ingredient.',
                    jsonKey: 'quantity',
                  },
                  {
                    key: ConfigKey.tag_hint,
                    description: 'The hint for the ingredient.',
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
              },
            ],
          },
        ],
      },
    ],
  },

  //
  // book-reference-list
  //
  [CardSetConfigKey.bookReferenceList]: {
    cards: [
      {
        name: 'default',
        isDefault: true,
        jsonKey: 'bookReferences',
        sides: [
          {
            name: 'reference',
            variants: [
              {
                jsonKey: null,
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
              },
            ],
          },
        ],
      },
    ],
  },
};

export { CARDSETS as CARDS };
