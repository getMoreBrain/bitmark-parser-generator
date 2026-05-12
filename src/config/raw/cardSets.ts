import { type _CardSetsConfig } from '../../model/config/_Config.ts';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey.ts';
import { ConfigKey } from '../../model/config/enum/ConfigKey.ts';
import { Count } from '../../model/enum/Count.ts';
import { TagFormat } from '../../model/enum/TagFormat.ts';
import { TextFormat } from '../../model/enum/TextFormat.ts';

const CARDSETS: _CardSetsConfig = {
  //
  // flashcard
  //
  [CardSetConfigKey.flashcard]: {
    jsonKey: 'cards',
    exportJsonKey: { cards: '$' },
    sides: [
      {
        name: 'question',
        variants: [
          {
            jsonKey: 'question.text',
            exportJsonKey: { question: { text: '$' } },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the flashcard.',
              },
              {
                exportJsonKey: { title: '$' },
                key: ConfigKey.tag_title,
                description: 'Title of the flashcard.',
              },
              {
                key: ConfigKey.group_resourceIcon,
                description: 'Icon resource for the flashcard.',
                jsonKey: 'question.icon|resource(type=image, key=image)',
                exportJsonKey: { question: { icon: { type: 'image', image: { src: '$' } } } },
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
            exportJsonKey: { answer: { text: '$' } },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the flashcard.',
              },
              {
                exportJsonKey: { title: '$' },
                key: ConfigKey.tag_title,
                description: 'Title of the flashcard.',
              },
              {
                key: ConfigKey.group_resourceIcon,
                description: 'Icon resource for the flashcard.',
                jsonKey: 'answer.icon|resource(type=image, key=image)',
                exportJsonKey: { answer: { icon: { type: 'image', image: { src: '$' } } } },
              },
            ],
          },
          {
            jsonKey: 'alternativeAnswers[].text',
            exportJsonKey: { alternativeAnswers: [{ text: '$' }] },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the flashcard.',
              },
              {
                exportJsonKey: { title: '$' },
                key: ConfigKey.tag_title,
                description: 'Title of the flashcard.',
              },
              {
                key: ConfigKey.group_resourceIcon,
                description: 'Icon resource for the flashcard.',
                jsonKey: 'alternativeAnswers[].icon|resource(type=image, key=image)',
                exportJsonKey: {
                  alternativeAnswers: [{ icon: { type: 'image', image: { src: '$' } } }],
                },
              },
            ],
            repeatCount: Count.infinity,
          },
        ],
      },
    ],
  },

  //
  // definition-list
  //
  [CardSetConfigKey.definitionList]: {
    jsonKey: 'definitions',
    exportJsonKey: { definitions: '$' },
    sides: [
      {
        name: 'term',
        variants: [
          {
            jsonKey: 'term.text',
            exportJsonKey: { term: { text: '$' } },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the definition.',
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the definition.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forKeys',
                exportJsonKey: { '@bit': { heading: { forKeys: '$' } } },
              },
              {
                key: ConfigKey.group_resourceIcon,
                description: 'Icon resource for the definition.',
                format: TagFormat.plainText,
                jsonKey: 'term.icon|resource(type=image, key=image)',
                exportJsonKey: { term: { icon: { type: 'image', image: { src: '$' } } } },
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
            exportJsonKey: { definition: { text: '$' } },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the definition.',
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the definition.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forValues',
                exportJsonKey: { '@bit': { heading: { forValues: '$' } } },
              },
              {
                key: ConfigKey.group_resourceIcon,
                description: 'Icon resource for the definition.',
                jsonKey: 'definition.icon|resource(type=image, key=image)',
                exportJsonKey: { definition: { icon: { type: 'image', image: { src: '$' } } } },
              },
            ],
          },
          {
            jsonKey: 'alternativeDefinitions[].text',
            exportJsonKey: { alternativeDefinitions: [{ text: '$' }] },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the definition.',
              },
              {
                exportJsonKey: { title: '$' },
                key: ConfigKey.tag_title,
                description: 'Title of the definition.',
              },
              {
                key: ConfigKey.group_resourceIcon,
                description: 'Icon resource for the definition.',
                jsonKey: 'alternativeDefinitions[].icon|resource(type=image, key=image)',
                exportJsonKey: {
                  alternativeDefinitions: [{ icon: { type: 'image', image: { src: '$' } } }],
                },
              },
            ],
            repeatCount: Count.infinity,
          },
        ],
      },
    ],
  },

  //
  // match-pairs
  //
  [CardSetConfigKey.matchPairs]: {
    jsonKey: 'pairs',
    exportJsonKey: { pairs: '$' },
    sides: [
      {
        name: 'key',
        variants: [
          {
            jsonKey: 'key',
            exportJsonKey: { key: '$' },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the match pair.',
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the match pair.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forKeys',
                exportJsonKey: { '@bit': { heading: { forKeys: '$' } } },
              },
              {
                key: ConfigKey.property_isCaseSensitive,
                exportJsonKey: [
                  { '@absent': { isCaseSensitive: '$ancestor' } },
                  { isCaseSensitive: '$' },
                ],
                description: 'Property to indicate if the match is case sensitive.',
                format: TagFormat.boolean,
              },
              {
                key: ConfigKey.resource_audio,
                description: 'Audio resource for the match pair.',
                jsonKey: 'keyAudio',
                exportJsonKey: { keyAudio: '$' },
              },
              {
                key: ConfigKey.resource_image,
                description: 'Image resource for the match pair.',
                jsonKey: 'keyImage',
                exportJsonKey: { keyImage: '$' },
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
            exportJsonKey: { values: ['$'] },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the match pair.',
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the match pair.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forValues',
                exportJsonKey: { '@bit': { heading: { forValues: '$' } } },
              },
              {
                key: ConfigKey.property_isCaseSensitive,
                exportJsonKey: [
                  { '@absent': { isCaseSensitive: '$ancestor' } },
                  { isCaseSensitive: '$' },
                ],
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

  //
  // match-audio-pairs
  //
  [CardSetConfigKey.matchAudioPairs]: {
    jsonKey: 'pairs',
    exportJsonKey: { pairs: '$' },
    sides: [
      {
        name: 'key',
        variants: [
          {
            jsonKey: 'key',
            exportJsonKey: { key: '$' },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the audio match pair.',
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the audio match pair.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forKeys',
                exportJsonKey: { '@bit': { heading: { forKeys: '$' } } },
              },
              {
                key: ConfigKey.resource_audio,
                description: 'Audio resource for the match pair.',
                jsonKey: 'keyAudio',
                exportJsonKey: { keyAudio: '$' },
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
            exportJsonKey: { values: ['$'] },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the audio match pair.',
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the audio match pair.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forValues',
                exportJsonKey: { '@bit': { heading: { forValues: '$' } } },
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

  //
  // match-image-pairs
  //
  [CardSetConfigKey.matchImagePairs]: {
    jsonKey: 'pairs',
    exportJsonKey: { pairs: '$' },
    sides: [
      {
        name: 'key',
        variants: [
          {
            jsonKey: 'key',
            exportJsonKey: { key: '$' },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the image match pair.',
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the image match pair.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forKeys',
                exportJsonKey: { '@bit': { heading: { forKeys: '$' } } },
              },
              {
                key: ConfigKey.resource_image,
                description: 'Image resource for the match pair.',
                jsonKey: 'keyImage',
                exportJsonKey: { keyImage: '$' },
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
            exportJsonKey: { values: ['$'] },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the image match pair.',
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the image match pair.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forValues',
                exportJsonKey: { '@bit': { heading: { forValues: '$' } } },
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

  //
  // match-matrix
  //
  [CardSetConfigKey.matchMatrix]: {
    jsonKey: 'matrix',
    exportJsonKey: { matrix: '$' },
    sides: [
      {
        name: 'key',
        variants: [
          {
            jsonKey: 'key',
            exportJsonKey: { key: '$' },
            tags: [
              {
                key: ConfigKey.group_standardItemLeadInstructionHint,
                description: 'Standard tags for lead, instruction, and hint.',
              },
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example text for the match matrix.',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the match matrix.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forKeys',
                exportJsonKey: { '@bit': { heading: { forKeys: '$' } } },
              },
              {
                key: ConfigKey.property_isCaseSensitive,
                exportJsonKey: [
                  { '@absent': { isCaseSensitive: '$ancestor' } },
                  { isCaseSensitive: '$' },
                ],
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
            exportJsonKey: { cells: { $s: { values: ['$'] } } },
            tags: [
              {
                key: ConfigKey.group_standardItemLeadInstructionHint,
                description: 'Standard tags for lead, instruction, and hint.',
              },
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  {
                    '@keyonly': {
                      cells: { $s: { isExample: true, example: '$parent.values[0]' } },
                      '@bit': { isExample: true },
                    },
                  },
                  {
                    '@absent': { cells: { $s: { isExample: true, example: '$parent.values[0]' } } },
                  },
                  { cells: { $s: { isExample: true, example: '$' } }, '@bit': { isExample: true } },
                ],
                description: 'Example text for the match matrix.',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the match matrix.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forValues',
                exportJsonKey: { '@bit': { heading: { forValues: '$' } } },
              },
              {
                key: ConfigKey.property_isCaseSensitive,
                exportJsonKey: [
                  { '@absent': { isCaseSensitive: '$ancestor' } },
                  { isCaseSensitive: '$' },
                ],
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

  //
  // statements
  //
  [CardSetConfigKey.statements]: {
    jsonKey: 'statements',
    exportJsonKey: { statements: '$' },
    sides: [
      {
        name: 'statement',
        variants: [
          {
            jsonKey: 'statement',
            exportJsonKey: { statement: '$' },
            tags: [
              {
                key: ConfigKey.tag_true,
                description: 'Tag for true statements.',
                jsonKey: 'statement|set(isCorrect=true)',
                exportJsonKey: { statement: '$', isCorrect: true },
                maxCount: 1,
              },
              {
                key: ConfigKey.tag_false,
                description: 'Tag for false statements.',
                jsonKey: 'statement|set(isCorrect=false)',
                exportJsonKey: { statement: '$', isCorrect: false },
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

  //
  // quiz
  //
  [CardSetConfigKey.quiz]: {
    jsonKey: 'quizzes',
    exportJsonKey: { quizzes: '$' },
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

  //
  // feedback
  //
  [CardSetConfigKey.feedback]: {
    jsonKey: 'feedbacks',
    exportJsonKey: { feedbacks: '$' },
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
                format: TagFormat.plainText,
                jsonKey: '^heading.forKeys',
                exportJsonKey: { '@bit': { heading: { forKeys: '$' } } },
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
            exportJsonKey: { reason: { text: '$' } },
            tags: [
              {
                key: ConfigKey.group_standardItemLeadInstructionHint,
                description: 'Standard tags for lead, instruction, and hint.',
              },
              {
                key: ConfigKey.property_reasonableNumOfChars,
                exportJsonKey: [
                  { '@absent': { reasonableNumOfChars: '$ancestor' } },
                  { reasonableNumOfChars: '$' },
                ],
                description: 'Property for reasonable number of characters.',
                format: TagFormat.number,
              },
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example text for the feedback.',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the feedback.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forValues',
                exportJsonKey: { '@bit': { heading: { forValues: '$' } } },
              },
            ],
            bodyAllowed: true,
          },
        ],
      },
    ],
  },

  //
  // questions
  //
  [CardSetConfigKey.questions]: {
    jsonKey: 'questions',
    exportJsonKey: { questions: '$' },
    sides: [
      {
        name: 'question',
        variants: [
          {
            jsonKey: 'question',
            exportJsonKey: { question: '$' },
            tags: [
              {
                key: ConfigKey.property_reasonableNumOfChars,
                exportJsonKey: [
                  { '@absent': { reasonableNumOfChars: '$ancestor' } },
                  { reasonableNumOfChars: '$' },
                ],
                description: 'Property for reasonable number of characters.',
                format: TagFormat.number,
              },
              {
                exportJsonKey: { sampleSolution: '$' },
                key: ConfigKey.tag_sampleSolution,
                description: 'Sample solution for the question.',
                format: TagFormat.plainText,
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

  //
  // elements
  //
  [CardSetConfigKey.elements]: {
    jsonKey: null,
    sides: [
      {
        name: 'element',
        repeat: true,
        variants: [
          {
            jsonKey: 'elements[]',
            exportJsonKey: { elements: ['$'] },
            tags: [
              {
                key: ConfigKey.group_standardItemLeadInstructionHint,
                description: 'Standard tags for lead, instruction, and hint.',
              },
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
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

  //
  // table
  //
  [CardSetConfigKey.table]: {
    jsonKey: 'table.data',
    exportJsonKey: { table: { data: '$' } },
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
                jsonKey: '^table.columns[]',
                exportJsonKey: { '@bit': { table: { columns: ['$'] } } },
                description: 'Title of the table.',
              },
              {
                key: ConfigKey.property_tableCellType,
                description: 'Table cell type (th/td).',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.property_tableRowSpan,
                description: 'Number of rows the cell spans.',
                format: TagFormat.number,
              },
              {
                key: ConfigKey.property_tableColSpan,
                description: 'Number of columns the cell spans.',
                format: TagFormat.number,
              },
              {
                key: ConfigKey.property_tableScope,
                description: 'Scope attribute for header cells.',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.property_tableColWidth,
                description: 'Width for the column.',
                format: TagFormat.number,
              },
            ],
            repeatCount: Count.infinity,
          },
        ],
      },
    ],
  },

  //
  // table-extended
  //
  [CardSetConfigKey.tableExtended]: {
    jsonKey: null,
    sections: {
      'table-header': {
        jsonKey: 'table.header.rows',
        exportJsonKey: { table: { header: { rows: '$' } } },
        sideJsonKey: 'cells[{s}]|set(title=true)',
        sideExportJsonKey: { cells: { $s: { title: true, $: '$' } } },
      },
      'table-body': {
        jsonKey: 'table.body.rows',
        exportJsonKey: { table: { body: { rows: '$' } } },
        isDefault: true,
      },
      'table-footer': {
        jsonKey: 'table.footer.rows',
        exportJsonKey: { table: { footer: { rows: '$' } } },
        sideJsonKey: 'cells[{s}]|set(title=true)',
        sideExportJsonKey: { cells: { $s: { title: true, $: '$' } } },
      },
    },
    sides: [
      {
        name: 'cell',
        repeat: true,
        jsonKey: 'cells[{s}]',
        exportJsonKey: { cells: { $s: '$' } },
        variants: [
          {
            jsonKey: 'content',
            exportJsonKey: { content: '$' },
            tags: [
              {
                key: ConfigKey.group_standardItemLeadInstructionHint,
                description: 'Standard tags for lead, instruction, and hint.',
              },
              {
                key: ConfigKey.tag_title,
                jsonKey: '.',
                exportJsonKey: {
                  '@bit': {
                    table: { header: { rows: { cells: { cells: { $s: { content: '$' } } } } } },
                  },
                },
                description: 'Title of the table cell.',
              },
              {
                key: ConfigKey.property_tableCellType,
                jsonKey: 'title|bool(th)',
                exportJsonKey: [{ '@value=th': { title: true } }],
                description: 'Table cell type (th/td).',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.property_tableRowSpan,
                jsonKey: 'rowspan',
                exportJsonKey: { rowspan: '$' },
                description: 'Number of rows the cell spans.',
                format: TagFormat.number,
              },
              {
                key: ConfigKey.property_tableColSpan,
                jsonKey: 'colspan',
                exportJsonKey: { colspan: '$' },
                description: 'Number of columns the cell spans.',
                format: TagFormat.number,
              },
              {
                key: ConfigKey.property_tableScope,
                jsonKey: 'scope',
                exportJsonKey: { scope: '$' },
                description: 'Scope attribute for header cells.',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.property_tableColWidth,
                description: 'Width for the column.',
                format: TagFormat.number,
              },
            ],
            repeatCount: Count.infinity,
          },
        ],
      },
    ],
  },

  //
  // pronunciation-table
  //
  [CardSetConfigKey.pronunciationTable]: {
    jsonKey: 'pronunciationTable.data',
    exportJsonKey: { pronunciationTable: { data: '$' } },
    sides: [
      {
        name: 'cell',
        repeat: true,
        variants: [
          {
            jsonKey: 'body',
            exportJsonKey: { body: '$' },
            tags: [
              {
                key: ConfigKey.group_standardItemLeadInstructionHint,
                description: 'Standard tags for lead, instruction, and hint.',
              },
              {
                exportJsonKey: { title: '$' },
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

  //
  // bot-action-responses
  //
  [CardSetConfigKey.botActionResponses]: {
    jsonKey: 'responses',
    exportJsonKey: { responses: '$' },
    sides: [
      {
        name: 'response',
        variants: [
          {
            jsonKey: 'feedback',
            exportJsonKey: { feedback: '$' },
            format: TextFormat.plainText,
            tags: [
              {
                key: ConfigKey.property_reaction,
                description: 'Reaction to the bot action.',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.tag_item,
                jsonKey: 'item',
                exportJsonKey: { item: '$' },
                format: TagFormat.plainText,
                description: 'The item for the bit',
                chain: [
                  {
                    key: ConfigKey.tag_item,
                    jsonKey: 'lead',
                    exportJsonKey: { lead: '$' },
                    description: 'The lead for the bit',
                    maxCount: 1,
                    chain: [
                      {
                        key: ConfigKey.tag_item,
                        jsonKey: 'pageNumber',
                        exportJsonKey: { pageNumber: '$' },
                        description: 'The page number for the bit',
                        maxCount: 1,
                        chain: [
                          {
                            key: ConfigKey.tag_item,
                            jsonKey: 'marginNumber',
                            exportJsonKey: { marginNumber: '$' },
                            description: 'The margin number for the bit',
                            maxCount: 1,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                key: ConfigKey.tag_instruction,
                description: 'The response label for the bot action.',
                jsonKey: 'response',
                exportJsonKey: { response: '$' },
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example text for the bot action response.',
                format: TagFormat.plainText,
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
    jsonKey: 'listItems',
    exportJsonKey: { listItems: '$' },
    sides: [
      {
        name: 'content',
        variants: [
          {
            jsonKey: 'body',
            exportJsonKey: { body: '$' },
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

  //
  // example-bit-list
  //
  [CardSetConfigKey.exampleBitList]: {
    jsonKey: 'listItems',
    exportJsonKey: { listItems: '$' },
    sides: [
      {
        name: 'item',
        variants: [
          {
            jsonKey: 'body',
            exportJsonKey: { body: '$' },
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for example bits.',
              },
              {
                exportJsonKey: { title: '$' },
                key: ConfigKey.tag_title,
                description: 'Title of the example bit.',
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
    jsonKey: 'ingredients',
    exportJsonKey: { ingredients: '$' },
    sides: [
      {
        name: 'ingredient',
        variants: [
          {
            jsonKey: 'ingredient',
            exportJsonKey: { ingredient: '$' },
            tags: [
              {
                exportJsonKey: { title: '$' },
                key: ConfigKey.tag_title,
                description: 'Title of the ingredient.',
              },
              {
                key: ConfigKey.tag_true,
                description: 'Checked state for the ingredient.',
                jsonKey: '|set(checked=true)',
                exportJsonKey: { checked: true, $: '$' },
                maxCount: 1,
                // nullable: true,
              },
              {
                key: ConfigKey.tag_false,
                description: 'Unchecked state for the ingredient.',
                jsonKey: '|set(checked=false)',
                exportJsonKey: { checked: false, $: '$' },
                maxCount: 1,
                // nullable: true,
              },
              {
                key: ConfigKey.group_standardItemLead,
                description: 'Item, lead, page number, and margin number for the ingredient.',
              },
              {
                key: ConfigKey.tag_instruction,
                description: 'The quantity of the ingredient.',
                jsonKey: 'quantity',
                exportJsonKey: { quantity: '$' },
                format: TagFormat.number,
              },
              {
                exportJsonKey: { hint: '$' },
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

  //
  // book-reference-list
  //
  [CardSetConfigKey.bookReferenceList]: {
    jsonKey: 'bookReferences',
    exportJsonKey: { bookReferences: '$' },
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
};

export { CARDSETS as CARDS };
