import { type _GroupsConfig } from '../../model/config/_Config.ts';
import { ConfigKey } from '../../model/config/enum/ConfigKey.ts';
import { GroupConfigType } from '../../model/config/enum/GroupConfigType.ts';
import { Count } from '../../model/enum/Count.ts';
import { TagFormat } from '../../model/enum/TagFormat.ts';

const GROUPS: _GroupsConfig = {
  [ConfigKey.group_standardAllBits]: {
    name: 'Standard',
    description: 'Standard tags which apply to all bits',
    type: GroupConfigType.standard,
    tags: [
      {
        key: ConfigKey.property_id,
        description: 'The unique identifier(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_gUri,
        description: 'Global URI for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_customerId,
        description: 'The customer-specific identifier for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_externalId,
        description: 'The external identifier for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_sourceRL,
        description: 'The original location of the information in the original source material',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_isTemplate,
        description: 'If true, the bit is a template',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isTemplateStripTheme,
        description: 'If true, the bit is a template strip theme',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_needsValidation,
        description: 'If true, the bit needs validation',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_validationDate,
        description: 'The date when the bit was validated',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_aiGenerated,
        description: 'If true, the bit is AI-generated',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_machineTranslated,
        description: 'If true, the bit is machine-translated',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_translationOf,
        description: 'Translation source reference',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_spansPageBreak,
        description: 'If true, the bit spans a page break',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_searchIndex,
        description: 'The search index(es) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_analyticsTag,
        description: 'The analytics tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_categoryTag,
        description: 'The category tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_topicTag,
        description: 'The topic tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_reportTag,
        description: 'The report tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_altLangTag,
        description: 'The alternative language tag for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_feedbackEngine,
        description: 'The feedback engine for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_feedbackType,
        description: 'The feedback type for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_disableFeedback,
        description: 'If true, feedback is disabled for the bit',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_diffTo,
        description: 'The diff to version for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffOp,
        description: 'The diff operation for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffRef,
        description: 'The diff reference for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffContext,
        description: 'The diff context for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_diffTime,
        description: 'The diff time for the bit',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_ageRange,
        description: 'The age range for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_lang,
        description: 'The language for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_publisher,
        description: 'The publisher(s) of the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_publisherName,
        description: 'The name of the publisher of the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_theme,
        description: 'The theme(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_rtl,
        description: 'If true, the book is right-to-left',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_target,
        description: 'The target(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_tag,
        description: 'The tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_groupTag,
        jsonKey: 'groupTag.name',
        exportJsonKey: { groupTag: { name: '$' } },
        description: 'The group tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.property_tag,
            exportJsonKey: { tags: ['$'] },
            description: 'The tag(s) for the group',
            format: TagFormat.plainText,
            maxCount: Count.infinity,
          },
        ],
      },
      {
        key: ConfigKey.property_reductionTag,
        description: 'The reduction tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_bubbleTag,
        description: 'The bubble tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_extractorTag,
        description: 'The extractor tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_extractorInternal,
        description: 'Internal metadata used by the extractor for processing purposes',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_sourceBB,
        description: 'The source bounding box(es) for the bit (x, y, x1, y1)',
        format: TagFormat.coordinates,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_levelCEFRp,
        description: 'The CEFRp level for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_levelCEFR,
        description: 'The CEFR level for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_levelILR,
        description: 'The ILR level for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_levelACTFL,
        description: 'The ACTFL level for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_icon,
        description: 'The icon for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_iconTag,
        description: 'The icon tag for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_colorTag,
        description: 'The color tag(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        exportJsonKey: { anchor: '$' },
        key: ConfigKey.tag_anchor,
        name: 'Anchor',
        format: TagFormat.plainText,
        description: 'The anchor for the bit',
      },
      {
        key: ConfigKey.property_search,
        description: 'The search text for the bit',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_showInIndex,
        description: 'If true, the bit is shown in the index',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_layer,
        description: 'The layer(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_layerRole,
        description: 'The layer role(s) for the bit',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [ConfigKey.group_standardItemLead]: {
    type: GroupConfigType.standard,
    description: 'Standard group for item, lead, page number, and margin number tags',
    tags: [
      {
        key: ConfigKey.tag_item,
        jsonKey: 'item',
        exportJsonKey: { item: '$' },
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
    ],
  },
  [ConfigKey.group_standardItemLeadInstructionHint]: {
    type: GroupConfigType.standard,
    description:
      'Standard group for item, lead, page number, margin number, instruction and hint tags',
    tags: [
      {
        key: ConfigKey.group_standardItemLead,
        description: 'Item, lead, page number, and margin number tags',
      },
      {
        exportJsonKey: { instruction: '$' },
        key: ConfigKey.tag_instruction,
        name: 'Instruction',
        description: 'The instruction for the bit',
      },
      {
        exportJsonKey: { hint: '$' },
        key: ConfigKey.tag_hint,
        name: 'Hint',
        description: 'The hint for the bit',
      },
    ],
  },
  [ConfigKey.group_standardTags]: {
    type: GroupConfigType.standard,
    description: 'Standard tags which apply to MOST (but not all) bits',
    tags: [
      {
        key: ConfigKey.group_standardAllBits,
        description: 'All standard tags which apply to all bits',
      },
      {
        key: ConfigKey.group_standardItemLeadInstructionHint,
        description: 'Item, lead, page number, margin number, instruction and hint tags',
      },
      {
        // Bit-level example tag (default — non-`isTopLevelExample` bits):
        // - bare `[@example]`: consume only (records cascade marker, emits
        //   nothing at bit-level — OLD parser scrubs bit-level isExample
        //   for bits NOT in its `isTopLevelExample` allow-list).
        // - synthesized (descendant cascade): still emits `isExample: true`
        //   at the descendant scope.
        // - valued `[@example:text]`: emit the example value only; bit-level
        //   `isExample` is left to bubble from descendants.
        // Bits in the OLD parser's allow-list (flashcard, definitionList,
        // sequence, multipleChoice, trueFalse, cloze*, mark, interview,
        // matchMatrix, match, essay, etc.) override this entry with the
        // legacy emit-isExample shape.
        key: ConfigKey.property_example,
        exportJsonKey: [{ '@keyonly': {} }, { '@absent': { isExample: true } }, { example: '$' }],
        description: 'The example(s) for the bit',
        format: TagFormat.bitmarkText,
      },
    ],
  },
  [ConfigKey.group_imageSource]: {
    type: GroupConfigType.standard,
    description: 'Image source chain',
    tags: [
      {
        key: ConfigKey.property_imageSource,
        jsonKey: 'imageSource.url',
        exportJsonKey: { imageSource: { url: '$' } },
        description: 'The source of an image',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_mockupId,
            description: 'The mockup ID for the image',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_size,
            description: 'The size of the image',
            format: TagFormat.number,
          },
          {
            key: ConfigKey.property_format,
            description: 'The format of the image',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_trim,
            description: 'If true, the image is trimmed',
            format: TagFormat.boolean,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_technicalTerm]: {
    type: GroupConfigType.standard,
    description: 'Technical term chain',
    tags: [
      {
        key: ConfigKey.property_technicalTerm,
        jsonKey: 'technicalTerm.technicalTerm',
        exportJsonKey: { technicalTerm: { technicalTerm: '$' } },
        description: 'The technical term',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_lang,
            description: 'The language of the technical term',
            format: TagFormat.plainText,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_person]: {
    type: GroupConfigType.standard,
    description: 'Person chain',
    tags: [
      {
        key: ConfigKey.property_person,
        jsonKey: 'person.name',
        exportJsonKey: { person: { name: '$' } },
        description: 'A person',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_title,
            description: "The person's title",
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_resourceImage,
            jsonKey: 'avatarImage|resource(type=image, key=image)',
            exportJsonKey: { avatarImage: { type: 'image', image: { src: '$' } } },
            description: 'The image of the person',
          },
        ],
      },
      {
        // Deprecated (parter renamed to person)
        key: ConfigKey.property_partner,
        jsonKey: 'person.name',
        exportJsonKey: { person: { name: '$' } },
        description: 'A partner',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_title,
            description: "The partner's title",
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_resourceImage,
            jsonKey: 'avatarImage|resource(type=image, key=image)',
            exportJsonKey: { avatarImage: { type: 'image', image: { src: '$' } } },
            description: 'The image of the partner',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_gap]: {
    type: GroupConfigType.standard,
    description: 'Gap chain',
    tags: [
      {
        exportJsonKey: { solutions: [['$']] },
        key: ConfigKey.tag_gap,
        description: 'The value of a gap in the content',
        maxCount: Count.infinity,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.tag_gap,
            jsonKey: 'solutions[]',
            exportJsonKey: { solutions: ['$'] },
            description: 'Alternative values for the gaps in the content',
            maxCount: Count.infinity,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
            description: 'Item, lead, page number, margin number, instruction and hint tags',
          },
          {
            key: ConfigKey.property_example,
            jsonKey: 'example',
            exportJsonKey: [
              {
                '@keyonly': {
                  isExample: true,
                  example: '$parent.solutions[0]',
                  '@bit': { isExample: true },
                },
              },
              {
                '@absent': {
                  isExample: true,
                  example: '$parent.solutions[0]',
                  '@bit': { isExample: true },
                },
              },
              { isExample: true, example: '$', '@bit': { isExample: true } },
            ],
            description: 'An example for the gap',
            format: TagFormat.bitmarkText,
          },
          {
            key: ConfigKey.property_isCaseSensitive,
            jsonKey: 'isCaseSensitive',
            exportJsonKey: [
              { '@absent': { isCaseSensitive: '$ancestor' } },
              { isCaseSensitive: '$' },
            ],
            description: 'If true, the gap text is case sensitive',
            format: TagFormat.boolean,
            defaultValue: 'true',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_trueFalse]: {
    type: GroupConfigType.standard,
    description: 'True/False chain',
    tags: [
      {
        exportJsonKey: { choices: [{ choice: '$', isCorrect: true }] },
        key: ConfigKey.tag_true,
        description: 'True value for a true/false statement/question',
        maxCount: Count.infinity,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.tag_true,
            jsonKey: 'choices[]|set(isCorrect=true)',
            exportJsonKey: { choices: [{ choice: '$', isCorrect: true }] },
            description: 'True values for a true/false statement/question',
            maxCount: Count.infinity,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.tag_false,
            jsonKey: 'choices[]|set(isCorrect=false)',
            exportJsonKey: { choices: [{ choice: '$', isCorrect: false }] },
            description: 'False values for a true/false statement/question',
            maxCount: Count.infinity,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
            description: 'Item, lead, page number, margin number, instruction and hint tags',
          },
          {
            key: ConfigKey.property_example,
            jsonKey: 'example',
            exportJsonKey: [
              {
                '@keyonly': {
                  isExample: true,
                  example: '$parent.isCorrect',
                  '@bit': { isExample: true },
                },
              },
              {
                '@absent': {
                  isExample: '$parent.isCorrect',
                  example: '$parent.isCorrect',
                  '@bit': { isExample: '$parent.isCorrect' },
                },
              },
              { isExample: true, example: '$', '@bit': { isExample: true } },
            ],
            description: 'An example for the true/false statement/question',
            format: TagFormat.boolean,
          },
        ],
      },
      {
        exportJsonKey: { choices: [{ choice: '$', isCorrect: false }] },
        key: ConfigKey.tag_false,
        description: 'False value for a true/false statement/question',
        maxCount: Count.infinity,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.tag_true,
            jsonKey: 'choices[]|set(isCorrect=true)',
            exportJsonKey: { choices: [{ choice: '$', isCorrect: true }] },
            description: 'True values for a true/false statement/question',
            maxCount: Count.infinity,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.tag_false,
            jsonKey: 'choices[]|set(isCorrect=false)',
            exportJsonKey: { choices: [{ choice: '$', isCorrect: false }] },
            description: 'False values for a true/false statement/question',
            maxCount: Count.infinity,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
            description: 'Item, lead, page number, margin number, instruction and hint tags',
          },
          {
            key: ConfigKey.property_example,
            jsonKey: 'example',
            exportJsonKey: [
              {
                '@keyonly': {
                  isExample: true,
                  example: '$parent.isCorrect',
                  '@bit': { isExample: true },
                },
              },
              {
                '@absent': {
                  isExample: true,
                  example: '$parent.isCorrect',
                  '@bit': { isExample: true },
                },
              },
              { isExample: true, example: '$', '@bit': { isExample: true } },
            ],
            description: 'An example for the true/false statement/question',
            format: TagFormat.boolean,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_trueFalseResponses]: {
    type: GroupConfigType.standard,
    description: 'True/False Responses chain',
    tags: [
      {
        exportJsonKey: { responses: [{ response: '$', isCorrect: true }] },
        key: ConfigKey.tag_true,
        description: 'True value for a true/false statement/question',
        maxCount: Count.infinity,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.tag_true,
            jsonKey: 'responses[]|set(isCorrect=true)',
            exportJsonKey: { responses: [{ response: '$', isCorrect: true }] },
            description: 'True values for a true/false statement/question',
            maxCount: Count.infinity,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.tag_false,
            jsonKey: 'responses[]|set(isCorrect=false)',
            exportJsonKey: { responses: [{ response: '$', isCorrect: false }] },
            description: 'False values for a true/false statement/question',
            maxCount: Count.infinity,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
            description: 'Item, lead, page number, margin number, instruction and hint tags',
          },
          {
            key: ConfigKey.property_example,
            jsonKey: 'example',
            exportJsonKey: [
              {
                '@keyonly': {
                  isExample: true,
                  example: '$parent.isCorrect',
                  '@bit': { isExample: true },
                },
              },
              {
                '@absent': {
                  isExample: '$parent.isCorrect',
                  example: '$parent.isCorrect',
                  '@bit': { isExample: '$parent.isCorrect' },
                },
              },
              { isExample: true, example: '$', '@bit': { isExample: true } },
            ],
            description: 'An example for the true/false statement/question',
            format: TagFormat.boolean,
          },
        ],
      },
      {
        exportJsonKey: { responses: [{ response: '$', isCorrect: false }] },
        key: ConfigKey.tag_false,
        description: 'False value for a true/false statement/question',
        maxCount: Count.infinity,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.tag_true,
            jsonKey: 'responses[]|set(isCorrect=true)',
            exportJsonKey: { responses: [{ response: '$', isCorrect: true }] },
            description: 'True values for a true/false statement/question',
            maxCount: Count.infinity,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.tag_false,
            jsonKey: 'responses[]|set(isCorrect=false)',
            exportJsonKey: { responses: [{ response: '$', isCorrect: false }] },
            description: 'False values for a true/false statement/question',
            maxCount: Count.infinity,
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.group_standardItemLeadInstructionHint,
            description: 'Item, lead, page number, margin number, instruction and hint tags',
          },
          {
            key: ConfigKey.property_example,
            jsonKey: 'example',
            exportJsonKey: [
              {
                '@keyonly': {
                  isExample: true,
                  example: '$parent.isCorrect',
                  '@bit': { isExample: true },
                },
              },
              {
                '@absent': {
                  isExample: true,
                  example: '$parent.isCorrect',
                  '@bit': { isExample: true },
                },
              },
              { isExample: true, example: '$', '@bit': { isExample: true } },
            ],
            description: 'An example for the true/false statement/question',
            format: TagFormat.boolean,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_markConfig]: {
    type: GroupConfigType.standard,
    description: 'Mark configuration chain',
    tags: [
      {
        key: ConfigKey.property_mark,
        jsonKey: 'marks.mark',
        exportJsonKey: { marks: [{ mark: '$' }] },
        description: 'The mark configuration',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.property_color,
            description: 'The color of the mark',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_emphasis,
            description: 'The emphasis of the mark',
            format: TagFormat.plainText,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_mark]: {
    type: GroupConfigType.standard,
    description: 'Mark chain',
    tags: [
      {
        exportJsonKey: { solution: ['$'] },
        key: ConfigKey.tag_mark,
        description: 'The marked content',
        maxCount: Count.infinity,
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.property_mark,
            jsonKey: 'mark',
            description: 'The mark configuration',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_example,
            jsonKey: 'example',
            exportJsonKey: [
              { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
              { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
              { isExample: true, example: '$', '@bit': { isExample: true } },
            ],
            description: 'An example for the marked content',
            format: TagFormat.bitmarkText,
          },
        ],
      },
    ],
  },
  [ConfigKey.group_bookCommon]: {
    type: GroupConfigType.standard,
    description: 'Common book tags',
    tags: [
      {
        key: ConfigKey.property_language,
        description: 'The language of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_customerExternalId,
        description: 'The customer-specific external identifier for the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_spaceId,
        description: 'The space ID for the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_kind,
        description: 'The kind of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_hasMarkAsDone,
        description: 'If true, the book has a "Mark as done" feature',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_processHandIn,
        description: 'If true, the book will be processed when upon hand-in',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_processHandInLocation,
        description: 'The location where the book was handed-in',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_isPublic,
        description: 'If true, the book is public',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isTemplate,
        description: 'If true, the book is a template',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isTemplateStripTheme,
        description: 'If true, the book is a template strip theme',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_isEditable,
        description: 'If true, the book is editable',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_chatWithBook,
        description: 'If true, the user can chat about the book with an AI assistant',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_chatWithBookBrainKey,
        description: 'The BookBrain key for the book chat',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.tag_title,
        name: 'Title',
        description: 'The title of the book',
        maxCount: 2,
        jsonKey: 'title|multi(count=2, key=subtitle)',
        exportJsonKey: [{ '@level=1': { title: '$' } }, { '@level=2': { subtitle: '$' } }],
      },
      {
        key: ConfigKey.property_subtype,
        description: 'The subtype of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_coverImage,
        description: 'The cover image(s) of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.resource_coverImage,
        jsonKey: 'coverImage|resource(type=image, key=image)',
        exportJsonKey: { coverImage: { type: 'image', image: { src: '$' } } },
        description: 'The cover image of the book',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the cover image resource',
          },
        ],
      },
      {
        key: ConfigKey.property_backgroundImage,
        description: 'The background image(s) of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.resource_backgroundImage,
        jsonKey: 'backgroundImage|resource(type=image, key=image)',
        exportJsonKey: { backgroundImage: { type: 'image', image: { src: '$' } } },
        description: 'The background image of the book',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the background image resource',
          },
        ],
      },
      {
        key: ConfigKey.property_coverColor,
        description: 'The cover color of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_subject,
        description: 'The subject(s) of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_author,
        description: 'The author(s) of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_publications,
        description: 'The publication(s) of the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_relatedBook,
        description: 'Books related to this book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_translationOfBook,
        description: 'External Id of the translated book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_duration,
        description: 'The duration of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_maxTocChapterLevel,
        description: 'The maximum table of contents chapter level',
        format: TagFormat.number,
        defaultValue: '-1',
      },
      {
        key: ConfigKey.property_sourceDocument,
        description: 'Url of the source document for the book (for example, a PDF file)',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_internalPrintPdf,
        description: 'Url of the internal print PDF for the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_allowPrint,
        description: 'If true, the book allows printing',
        format: TagFormat.enumeration,
        values: ['enforceFalse', 'enforceTrue', 'useSpaceConfiguration'],
        defaultValue: 'useSpaceConfiguration',
      },
      {
        key: ConfigKey.property_hasPrintRestriction,
        description: 'If true, the book has print restrictions',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
      {
        key: ConfigKey.property_enforceUpdateOverUserInput,
        description: 'If true, prioritize new content over legacy content from the instance API',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_extractorExtractionTimestamp,
        description: 'Extraction timestamps for book conversion',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [ConfigKey.group_learningPathCommon]: {
    type: GroupConfigType.standard,
    description: 'Common learning path tags',
    tags: [
      {
        key: ConfigKey.property_action,
        description: 'The action for the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_duration,
        description: 'The duration of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_date,
        description: 'The date of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_dateEnd,
        description: 'The end date of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_location,
        description: 'The location of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_list,
        description: 'The list of items in the learning path',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_textReference,
        description: 'The text reference for the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_isTracked,
        description: 'If true, the learning path is tracked',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
      {
        key: ConfigKey.property_isInfoOnly,
        description: 'If true, the learning path is info only',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_deeplink,
        description: 'The deeplink(s) for the learning path',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'The caption for the button of the learning path',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_book,
        description: 'The book(s) associated with the learning path',
        format: TagFormat.plainText,
        chain: [
          {
            exportJsonKey: { reference: '$' },
            key: ConfigKey.tag_reference,
            format: TagFormat.plainText,
            description: 'The reference for the book(s) in the learning path',
            maxCount: 1,
            chain: [
              {
                key: ConfigKey.tag_reference,
                jsonKey: 'referenceEnd',
                exportJsonKey: { referenceEnd: '$' },
                format: TagFormat.plainText,
                description: 'The referenceEnd for the book(s) in the learning path',
                maxCount: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  [ConfigKey.group_advertisingCommon]: {
    type: GroupConfigType.standard,
    description: 'Common advertising tags',
    tags: [
      {
        key: ConfigKey.property_advertisingClickUrl,
        description: 'The URL to which the advertisement should link',
        format: TagFormat.plainText,
      },
    ],
  },
  [ConfigKey.group_platformStylesCommon]: {
    type: GroupConfigType.standard,
    description: 'Common platform styles',
    tags: [
      {
        key: ConfigKey.property_platformPrimaryColor,
        description: 'The platform system primary color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformSecondaryColor,
        description: 'The platform section secondary color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformBackgroundColor,
        description: 'The platform system background color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformButtonPrimaryColor,
        description: 'The platform section header button primary color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformButtonBackgroundColor,
        description: 'The platform section header button background color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformScrollbarColor,
        description: 'The platform main scrollbar color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformSelectionColor,
        description: 'The platform main selection color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformTextSelectionColor,
        description: 'The platform main input text selection color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformSeparatorColor,
        description: 'The platform main separator color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformPlaceholderColor,
        description: 'The platform main input placeholder color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformMessageBackgroundColor,
        description: 'The platform section chat message background color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformBorderColor,
        description: 'The platform border color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformSelectionTextColor,
        description: 'The platform selection text color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformBaseLayerColor,
        description: 'The platform base layer color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_platformMargin,
        description: 'The platform margin',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_platformBorderRadius,
        description: 'The platform border radius',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_platformSelectionBorderRadius,
        description: 'The platform selection border radius',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_platformNeedsShadow,
        description: 'If true, the platform needs shadow',
        format: TagFormat.boolean,
      },
    ],
  },
  [ConfigKey.group_quizCommon]: {
    type: GroupConfigType.standard,
    description: 'Common quiz tags',
    tags: [
      {
        key: ConfigKey.property_revealSolutions,
        description: 'If true, the quiz solutions are revealed',
        format: TagFormat.boolean,
        // defaultValue: 'false',
      },
      {
        key: ConfigKey.property_additionalSolutions,
        description: 'Additional solutions',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [ConfigKey.group_backgroundWallpaper]: {
    type: GroupConfigType.standard,
    description: 'Background wallpaper tags',
    tags: [
      {
        key: ConfigKey.resource_backgroundWallpaper,
        exportJsonKey: { backgroundWallpaper: { type: 'image', image: { src: '$' } } },
        description: 'Background wallpaper for the image, used to set a background for the image',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common resource image tags for images',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_imageNoZoom]: {
    type: GroupConfigType.standard,
    description: 'Image bit tags',
    tags: [
      {
        key: ConfigKey.group_backgroundWallpaper,
        description:
          'Background wallpaper tags for images, used to define background properties for images',
      },
      {
        key: ConfigKey.group_resourceBitTags,
        description:
          'Resource bit tags for images, used to define additional properties for images',
      },
      {
        key: ConfigKey.group_resourceImageNoZoom,
        description: 'Resource image tags for images, used to attach images to the bit',
        minCount: 1,
      },
    ],
  },
  //
  // Resource groups
  //
  [ConfigKey.group_resourceBitTags]: {
    type: GroupConfigType.standard,
    description: 'Resource bit tags',
    tags: [
      {
        key: ConfigKey.resource_imagePlaceholder,
        jsonKey: 'imagePlaceholder|resource(type=image, key=image)',
        exportJsonKey: { imagePlaceholder: { type: 'image', image: { src: '$' } } },
        description: 'Placeholder image for the resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the placeholder image',
          },
        ],
        maxCount: 1,
      },
    ],
  },
  //
  // Common resource properties
  //
  [ConfigKey.group_resourceCommon]: {
    type: GroupConfigType.standard,
    description: 'Common resource properties',
    tags: [
      {
        key: ConfigKey.property_license,
        description: 'The license for the resource',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_copyright,
        description: 'The copyright information for the resource',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_caption,
        description: 'The caption for the resource',
        format: TagFormat.bitmarkText,
      },
      {
        key: ConfigKey.property_showInIndex,
        description: 'If true, the resource is shown in the index',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_search,
        description: 'The search text for the resource',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_selected,
        description: 'If true, the resource is selected',
        format: TagFormat.boolean,
        defaultValue: 'false',
      },
      {
        key: ConfigKey.property_srcAlt,
        description: 'An alternative source for the resource',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [ConfigKey.group_resourceImageCommon]: {
    type: GroupConfigType.standard,
    description: 'Common properties for image resources',
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
        description: 'Common resource properties',
      },
      {
        key: ConfigKey.property_src1x,
        description: 'The source URL for the image at 1x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src2x,
        description: 'The source URL for the image at 2x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src3x,
        description: 'The source URL for the image at 3x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src4x,
        description: 'The source URL for the image at 4x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_width,
        description: 'The width of the image',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height,
        description: 'The height of the image',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_alt,
        description: 'The alternative text for the image',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_zoomDisabled,
        description: 'If true, zooming is disabled for the image',
        format: TagFormat.boolean,
      },
    ],
  },
  [ConfigKey.group_resourceImageCommonNoZoom]: {
    type: GroupConfigType.standard,
    description: 'Common properties for image resources where @zoomDisabled defaults to true',
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
        description: 'Common resource properties',
      },
      {
        key: ConfigKey.property_src1x,
        description: 'The source URL for the image at 1x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src2x,
        description: 'The source URL for the image at 2x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src3x,
        description: 'The source URL for the image at 3x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_src4x,
        description: 'The source URL for the image at 4x resolution',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_width,
        description: 'The width of the image',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height,
        description: 'The height of the image',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_alt,
        description: 'The alternative text for the image',
        format: TagFormat.plainText,
      },
      // @zoomDisabled with a true default
      {
        key: ConfigKey.property_zoomDisabled,
        description: 'If true, zooming is disabled for the image (defaults to true)',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
    ],
  },
  [ConfigKey.group_resourceAudioCommon]: {
    type: GroupConfigType.standard,
    description: 'Common properties for audio resources',
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
        description: 'Common resource properties',
      },
      {
        key: ConfigKey.property_duration,
        description: 'The duration of the audio resource',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_mute,
        description: 'If true, the audio is muted',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_autoplay,
        description: 'If true, the audio plays automatically',
        format: TagFormat.boolean,
      },
    ],
  },
  [ConfigKey.group_resourceVideoCommon]: {
    type: GroupConfigType.standard,
    description: 'Common properties for video resources',
    tags: [
      {
        key: ConfigKey.group_resourceCommon,
        description: 'Common resource properties',
      },
      {
        key: ConfigKey.property_width,
        description: 'The width of the video',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height,
        description: 'The height of the video',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_duration,
        description: 'The duration of the video',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_mute,
        description: 'If true, the video is muted',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_autoplay,
        description: 'If true, the video plays automatically',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_allowSubtitles,
        description: 'If true, subtitles are allowed for the video',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_showSubtitles,
        description: 'If true, subtitles are shown in the video',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_alt,
        description: 'The alternative text for the video',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_posterImage,
        jsonKey: 'posterImage.src',
        exportJsonKey: { posterImage: { src: '$' } },
        description: 'The poster image for the video',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the poster image',
          },
        ],
      },
      {
        key: ConfigKey.property_src1x,
        description: 'The source URL for the video at 1x resolution',
        format: TagFormat.plainText,
        exportJsonKey: { thumbnails: [{ src: '$' }] },
      },
      {
        key: ConfigKey.property_src2x,
        description: 'The source URL for the video at 2x resolution',
        format: TagFormat.plainText,
        exportJsonKey: { thumbnails: [{ src: '$' }] },
      },
      {
        key: ConfigKey.property_src3x,
        description: 'The source URL for the video at 3x resolution',
        format: TagFormat.plainText,
        exportJsonKey: { thumbnails: [{ src: '$' }] },
      },
      {
        key: ConfigKey.property_src4x,
        description: 'The source URL for the video at 4x resolution',
        format: TagFormat.plainText,
        exportJsonKey: { thumbnails: [{ src: '$' }] },
      },
    ],
  },
  //
  // Single resources
  //
  [ConfigKey.group_resourceIcon]: {
    type: GroupConfigType.standard,
    description: 'Common properties for icon resources',
    tags: [
      {
        key: ConfigKey.resource_icon,
        exportJsonKey: { resource: { type: 'icon', icon: { src: '$' } } },
        description: 'The icon resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the icon resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImage]: {
    type: GroupConfigType.resource,
    description: 'Common properties for image resources',
    tags: [
      {
        key: ConfigKey.resource_image,
        exportJsonKey: { resource: { type: 'image', image: { src: '$' } } },
        description: 'The image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageNoZoom]: {
    type: GroupConfigType.resource,
    description: 'Image resource where @zoomDisabled defaults to true',
    tags: [
      {
        key: ConfigKey.resource_image,
        exportJsonKey: { resource: { type: 'image', image: { src: '$' } } },
        description: 'The image resource (no-zoom default)',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommonNoZoom,
            description: 'Common image properties with @zoomDisabled defaulting to true',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImagePortrait]: {
    type: GroupConfigType.resource,
    description: 'Portrait image resource',
    tags: [
      {
        key: ConfigKey.resource_imagePortrait,
        exportJsonKey: { resource: { type: 'image-portrait', imagePortrait: { src: '$' } } },
        description: 'The portrait image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the portrait image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageLandscape]: {
    type: GroupConfigType.resource,
    description: 'Landscape image resource',
    tags: [
      {
        key: ConfigKey.resource_imageLandscape,
        exportJsonKey: { resource: { type: 'image-landscape', imageLandscape: { src: '$' } } },
        description: 'The landscape image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the landscape image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded image resource',
    tags: [
      {
        key: ConfigKey.resource_imageEmbed,
        exportJsonKey: { resource: { type: 'image-embed', imageEmbed: { src: '$' } } },
        description: 'The embedded image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the embedded image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceImageLink]: {
    type: GroupConfigType.resource,
    description: 'Link to an image resource',
    tags: [
      {
        key: ConfigKey.resource_imageLink,
        exportJsonKey: { resource: { type: 'image-link', imageLink: { url: '$' } } },
        description: 'The link to the image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the linked image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAudio]: {
    type: GroupConfigType.resource,
    description: 'Audio resource',
    tags: [
      {
        key: ConfigKey.resource_audio,
        exportJsonKey: { resource: { type: 'audio', audio: { src: '$' } } },
        description: 'The audio resource',
        chain: [
          {
            key: ConfigKey.group_resourceAudioCommon,
            description: 'Common audio properties for the audio resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAudioEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded audio resource',
    tags: [
      {
        key: ConfigKey.resource_audioEmbed,
        exportJsonKey: { resource: { type: 'audio-embed', audioEmbed: { src: '$' } } },
        description: 'The embedded audio resource',
        chain: [
          {
            key: ConfigKey.group_resourceAudioCommon,
            description: 'Common audio properties for the embedded audio resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAudioLink]: {
    type: GroupConfigType.resource,
    description: 'Link to an audio resource',
    tags: [
      {
        key: ConfigKey.resource_audioLink,
        exportJsonKey: { resource: { type: 'audio-link', audioLink: { url: '$' } } },
        description: 'The link to the audio resource',
        chain: [
          {
            key: ConfigKey.group_resourceAudioCommon,
            description: 'Common audio properties for the linked audio resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceVideo]: {
    type: GroupConfigType.resource,
    description: 'Video resource',
    tags: [
      {
        key: ConfigKey.resource_video,
        exportJsonKey: { resource: { type: 'video', video: { src: '$' } } },
        description: 'The video resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the video resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceVideoEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded video resource',
    tags: [
      {
        key: ConfigKey.resource_videoEmbed,
        exportJsonKey: { resource: { type: 'video-embed', videoEmbed: { url: '$' } } },
        description: 'The embedded video resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the embedded video resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceVideoLink]: {
    type: GroupConfigType.resource,
    description: 'Link to a video resource',
    tags: [
      {
        key: ConfigKey.resource_videoLink,
        exportJsonKey: { resource: { type: 'video-link', videoLink: { url: '$' } } },
        description: 'The link to the video resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the linked video resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceStillImageFilmEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded still image film resource',
    tags: [
      {
        key: ConfigKey.resource_stillImageFilmEmbed,
        exportJsonKey: {
          resource: { type: 'still-image-film-embed', stillImageFilmEmbed: { url: '$' } },
        },
        description: 'The embedded still image film resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the embedded still image film resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceStillImageFilmLink]: {
    type: GroupConfigType.resource,
    description: 'Link to a still image film resource',
    tags: [
      {
        key: ConfigKey.resource_stillImageFilmLink,
        exportJsonKey: {
          resource: { type: 'still-image-film-link', stillImageFilmLink: { url: '$' } },
        },
        description: 'The link to the still image film resource',
        chain: [
          {
            key: ConfigKey.group_resourceVideoCommon,
            description: 'Common video properties for the linked still image film resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceArticle]: {
    type: GroupConfigType.resource,
    description: 'Article resource',
    tags: [
      {
        key: ConfigKey.resource_article,
        exportJsonKey: { resource: { type: 'article', article: { body: '$' } } },
        description: 'The article resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the article resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceArticleEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded article resource',
    tags: [
      {
        key: ConfigKey.resource_articleEmbed,
        exportJsonKey: { resource: { type: 'article-embed', articleEmbed: { url: '$' } } },
        description: 'The embedded article resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the embedded article resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceArticleLink]: {
    type: GroupConfigType.resource,
    description: 'Link to an article resource',
    tags: [
      {
        key: ConfigKey.resource_articleLink,
        exportJsonKey: { resource: { type: 'article-link', articleLink: { url: '$' } } },
        description: 'The link to the article resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the linked article resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocument]: {
    type: GroupConfigType.resource,
    description: 'Document resource',
    tags: [
      {
        key: ConfigKey.resource_document,
        exportJsonKey: { resource: { type: 'document', document: { url: '$' } } },
        description: 'The document resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the document resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocumentEmbed]: {
    type: GroupConfigType.resource,
    description: 'Embedded document resource',
    tags: [
      {
        key: ConfigKey.resource_documentEmbed,
        exportJsonKey: { resource: { type: 'document-embed', documentEmbed: { url: '$' } } },
        description: 'The embedded document resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the embedded document resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocumentLink]: {
    type: GroupConfigType.resource,
    description: 'Link to a document resource',
    tags: [
      {
        key: ConfigKey.resource_documentLink,
        exportJsonKey: { resource: { type: 'document-link', documentLink: { url: '$' } } },
        description: 'The link to the document resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the linked document resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceDocumentDownload]: {
    type: GroupConfigType.resource,
    description: 'Downloadable document resource',
    tags: [
      {
        key: ConfigKey.resource_documentDownload,
        exportJsonKey: { resource: { type: 'document-download', documentDownload: { url: '$' } } },
        description: 'The downloadable document resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the downloadable document resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceAppLink]: {
    type: GroupConfigType.resource,
    description: 'Link to an app resource',
    tags: [
      {
        key: ConfigKey.resource_appLink,
        exportJsonKey: { resource: { type: 'app-link', appLink: { url: '$' } } },
        description: 'The link to the app resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the linked app resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_resourceWebsiteLink]: {
    type: GroupConfigType.resource,
    description: 'Link to a website resource',
    tags: [
      {
        key: ConfigKey.resource_websiteLink,
        exportJsonKey: { resource: { type: 'website-link', websiteLink: { url: '$' } } },
        description: 'The link to the website resource',
        chain: [
          {
            key: ConfigKey.group_resourceCommon,
            description: 'Common resource properties for the linked website resource',
          },
        ],
      },
    ],
  },
  //
  // Combo resources - these are resources made up of a combination of multiple resources.
  //
  [ConfigKey.group_resourceStillImageFilm]: {
    type: GroupConfigType.comboResource,
    description: 'Resource for still image film',
    comboResourceConfigKey: ConfigKey.resource_stillImageFilm,
    tags: [
      {
        key: ConfigKey.group_resourceImage,
        description: 'The image resource for the still image film',
        maxCount: 1,
        minCount: 1,
      },
      {
        key: ConfigKey.group_resourceAudio,
        description: 'The audio resource for the still image film',
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
  [ConfigKey.group_resourceImageResponsive]: {
    type: GroupConfigType.comboResource,
    description: 'Responsive image resource',
    comboResourceConfigKey: ConfigKey.resource_imageResponsive,
    tags: [
      {
        key: ConfigKey.group_resourceImagePortrait,
        description: 'The portrait image resource',
        maxCount: 1,
        minCount: 1,
      },
      {
        key: ConfigKey.group_resourceImageLandscape,
        description: 'The landscape image resource',
        maxCount: 1,
        minCount: 1,
      },
    ],
  },
  [ConfigKey.group_previewImages]: {
    type: GroupConfigType.resource,
    description: 'Array of preview images for catalog items',
    tags: [
      {
        key: ConfigKey.resource_previewImage,
        jsonKey: 'previewImage|resource(type=image, key=image)',
        exportJsonKey: { previewImage: { type: 'image', image: { src: '$' } } },
        description: 'The preview image resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the image resource',
          },
        ],
      },
    ],
  },
  [ConfigKey.group_previewVideos]: {
    type: GroupConfigType.resource,
    description: 'Array of preview videos for catalog items',
    tags: [
      {
        key: ConfigKey.resource_previewVideo,
        jsonKey: 'previewVideo|resource(type=video, key=video)',
        exportJsonKey: { previewVideo: { type: 'video', video: { src: '$' } } },
        description: 'The preview video resource',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the image resource',
          },
        ],
      },
    ],
  },
};

export { GROUPS };
