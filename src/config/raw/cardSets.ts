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
            exportJsonKey: [{ '@absent': { question: {} } }, { question: { text: '$' } }],
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
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example marker for the flashcard question.',
                format: TagFormat.bitmarkText,
                nullable: true,
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
            exportJsonKey: [{ '@absent': { answer: {} } }, { answer: { text: '$' } }],
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
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example marker for the flashcard answer.',
                format: TagFormat.bitmarkText,
                nullable: true,
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
  // flashcard1 — single-card variant of flashcard. Same shape, but capped
  // at one card via `sections.default.maxCount = 1` (PLAN-085). Used by
  // the `flashcard-1` bit type; the multi-card `flashcard` and
  // `q-and-a-card` bit types continue to use the unbounded `flashcard`
  // cardset.
  //
  [CardSetConfigKey.flashcard1]: {
    jsonKey: 'cards',
    exportJsonKey: { cards: '$' },
    sections: {
      default: {
        jsonKey: 'cards',
        exportJsonKey: { cards: '$' },
        isDefault: true,
        maxCount: 1,
      },
    },
    sides: [
      {
        name: 'question',
        variants: [
          {
            jsonKey: 'question.text',
            exportJsonKey: [{ '@absent': { question: {} } }, { question: { text: '$' } }],
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
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example marker for the flashcard question.',
                format: TagFormat.bitmarkText,
                nullable: true,
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
            exportJsonKey: [{ '@absent': { answer: {} } }, { answer: { text: '$' } }],
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
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example marker for the flashcard answer.',
                format: TagFormat.bitmarkText,
                nullable: true,
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
            exportJsonKey: [{ '@absent': { term: {} } }, { term: { text: '$' } }],
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
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example marker for the definition term.',
                format: TagFormat.bitmarkText,
                nullable: true,
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
            exportJsonKey: [{ '@absent': { definition: {} } }, { definition: { text: '$' } }],
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
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example marker for the definition.',
                format: TagFormat.bitmarkText,
                nullable: true,
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
  // definition-list-plain
  //
  // Same shape as `definitionList`, but every variant body is rendered as
  // plain text (string), not bitmark+ AST. Used by
  // `meta-search-default-terms` / `meta-search-default-topics`, which need
  // term/definition text emitted verbatim instead of as a ProseMirror tree.
  //
  [CardSetConfigKey.definitionListPlain]: {
    jsonKey: 'definitions',
    exportJsonKey: { definitions: '$' },
    sides: [
      {
        name: 'term',
        variants: [
          {
            jsonKey: 'term.text',
            exportJsonKey: [{ '@absent': { term: {} } }, { term: { text: '$' } }],
            format: TextFormat.plainText,
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
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example marker for the definition term.',
                format: TagFormat.bitmarkText,
                nullable: true,
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
            exportJsonKey: [{ '@absent': { definition: {} } }, { definition: { text: '$' } }],
            format: TextFormat.plainText,
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
              {
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { '@absent': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example marker for the definition.',
                format: TagFormat.bitmarkText,
                nullable: true,
              },
            ],
          },
          {
            jsonKey: 'alternativeDefinitions[].text',
            exportJsonKey: { alternativeDefinitions: [{ text: '$' }] },
            format: TextFormat.plainText,
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
            format: TextFormat.plainText,
            tags: [
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the match pair.',
              },
              {
                // Pair-level example: emit `isExample` alongside `example`
                // (matches OLD parser's per-pair allow-list behaviour).
                //
                // PLAN-074: a valued cascade source (`[@example:V]` anywhere
                // in the cardset) fills each pair's `example` with `V`
                // once per pair from the keys-side cascade fire (single
                // parsed_variant per pair — no per-value duplication).
                //
                // PLAN-076 NOTE: matchPairs (TAG 415) KEEPS `example: '$'`
                // at the pair-object level. BPG `parseMatchPairs`
                // (`CardContentProcessor.ts:714-723`) emits ONE example
                // per PAIR (the `exampleCard` accumulator), placed at the
                // pair object. Unlike matchMatrix (per-cell example),
                // matchPairs has no nested per-cell layer, so the pair-key
                // `[@example:V]` must double-emit as the visible field.
                // Confirmed via `chaining` fixture: `match-solution-grouped`
                // expects `example: "packen"` at pair-object level from
                // `die Koffer[%1][@example:packen]`. Original PLAN-076
                // draft applied to both keys-side tags; the matchPairs
                // half was reverted after fixture parity testing.
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, '@bit': { isExample: true } } },
                  {
                    predicates: ['@absent', { $cascade: '*' }],
                    rule: {
                      isExample: true,
                      example: '$cascade',
                      '@bit': { isExample: true },
                    },
                  },
                  { '@absent': { isExample: true } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description: 'Example marker / value on the match pair.',
                format: TagFormat.bitmarkText,
                nullable: true,
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the match pair.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forKeys',
                exportJsonKey: { '@bit': { heading: { forKeys: '$' } } },
              },
              {
                // PLAN-084: gate the key-side `@absent → $ancestor` cascade
                // synth with `@variantLacksTag=isCaseSensitive` so the rule
                // only fires when NO variant in the active card explicitly
                // carries `[@isCaseSensitive]`. When a value-side variant
                // carries the tag (e.g. `[@isCaseSensitive:false]`), the
                // synth is skipped here; the value-side explicit fire owns
                // the pair-level emission.
                key: ConfigKey.property_isCaseSensitive,
                exportJsonKey: [
                  {
                    predicates: ['@absent', { '@variantLacksTag': '@isCaseSensitive' }],
                    rule: { isCaseSensitive: '$ancestor' },
                  },
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
            format: TextFormat.plainText,
            tags: [
              {
                // PLAN-084: value-side excludes item/lead/pageNumber/marginNumber.
                // BPG `parseMatchPairs` does `delete tags.item; delete tags.lead;`
                // for sideIdx > 0; the schema-side equivalent is to use a
                // group_standardTags variant that omits group_standardItemLead.
                key: ConfigKey.group_standardTagsNoItemLead,
                description: 'Standard tags for the match pair (values side, no item/lead).',
              },
              {
                // PLAN-072 + ALIGN-EXAMPLE-CASCADE §3.6: cascade-fired
                // `@example` from the bit header fills each pair's
                // `example` with the pair's first value (mirrors BPG's
                // `fillStringExample(pairs, __defaultExample=values[0])`).
                //
                // PLAN-074: the cascade-source-VALUE branch is handled by
                // TAG 415 (keys side) which fires once per pair — keeping
                // it here would emit `example` twice per pair (one per
                // values-side parsed_variant) and merge them into a
                // multi-paragraph array.
                //
                // PLAN-075: bare `$parent` reads the parent variant fire's
                // source `$` value (the current `++`-iteration's value
                // text). For single-value pairs this matches the old
                // `$parent.values[0]`; for multi-value pairs with
                // `[@example]` attached to a non-first value, it correctly
                // resolves to that value.
                //
                // PLAN-077: dual `[@absent, { '$cascade': '*' }]` rule
                // routes pair-key `[@example:V]` (a per-pair cascade
                // source, bound via per-card CascadeCounters scope) and
                // bit-header `[@example:V]` (cardset cascade) into the
                // pair-level `example` via `$cascade`. The aggregator in
                // `populate_variants` fires this rule ONCE per pair (BPG
                // `parseMatchPairs` `exampleCard` precedence), avoiding
                // per-iter pollution.
                key: ConfigKey.property_example,
                exportJsonKey: [
                  // PLAN-084: bare `[@example]` on a values-side variant fires
                  // once per pair (first-wins, mirrors BPG `parseMatchPairs`
                  // `exampleCard` + `pushDownTree` set-if-null semantic).
                  // `maxEmits: 1` enforced inside the per-pair cascade-counter
                  // scope opened by `build_card_item`.
                  {
                    predicates: ['@keyonly'],
                    maxEmits: 1,
                    rule: {
                      isExample: true,
                      example: '$parent',
                      '@bit': { isExample: true },
                    },
                  },
                  {
                    predicates: ['@absent', { $cascade: '*' }],
                    rule: {
                      isExample: true,
                      example: '$cascade',
                      '@bit': { isExample: true },
                    },
                  },
                  {
                    '@absent': {
                      isExample: true,
                      example: '$parent',
                      '@bit': { isExample: true },
                    },
                  },
                  // PLAN-084: same cap applies to the explicit-value `[@example:V]`
                  // form so per-`++`-iter values-side fires also first-win.
                  {
                    predicates: [],
                    maxEmits: 1,
                    rule: { isExample: true, example: '$', '@bit': { isExample: true } },
                  },
                ],
                description: 'Example marker / value on the match pair (values side).',
                format: TagFormat.bitmarkText,
                nullable: true,
              },
              {
                key: ConfigKey.tag_title,
                description: 'Title of the match pair.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forValues',
                exportJsonKey: { '@bit': { heading: { forValues: '$' } } },
              },
              {
                // PLAN-084: symmetric @variantLacksTag gating with the key-side.
                key: ConfigKey.property_isCaseSensitive,
                exportJsonKey: [
                  {
                    predicates: ['@absent', { '@variantLacksTag': '@isCaseSensitive' }],
                    rule: { isCaseSensitive: '$ancestor' },
                  },
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
            format: TextFormat.plainText,
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
            format: TextFormat.plainText,
            tags: [
              {
                // PLAN-084: value-side excludes item/lead/pageNumber/marginNumber.
                key: ConfigKey.group_standardTagsNoItemLead,
                description: 'Standard tags for the audio match pair (values side, no item/lead).',
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
            format: TextFormat.plainText,
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
            format: TextFormat.plainText,
            tags: [
              {
                // PLAN-084: value-side excludes item/lead/pageNumber/marginNumber.
                key: ConfigKey.group_standardTagsNoItemLead,
                description: 'Standard tags for the image match pair (values side, no item/lead).',
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
            format: TextFormat.plainText,
            tags: [
              {
                key: ConfigKey.group_standardItemLeadInstructionHint,
                description: 'Standard tags for lead, instruction, and hint.',
              },
              {
                // PLAN-076: drop `example: '$'` from valued rule — pair-key
                // `[@example:V]` is consumed as the per-pair cascade source.
                // PLAN-077 R14 follow-up: investigation showed the fixture
                // reference is INCONSISTENT — bits without a cardset-level
                // cascade (e.g. bit 3 `[@example:Y]should be...`) expect
                // pair-level `example: V` at pair scope, but bits WITH a
                // cardset cascade (e.g. bit 8 `[@example:99]` in title-row
                // PLUS pair-key `[@example:Y]`) expect NO pair-level
                // example. Emitting `example: $` here satisfies bit 3 but
                // breaks bit 8; dropping it satisfies bit 8 but breaks bit
                // 3. Conditional emission would require runtime gating on
                // the cardset cascade scope state. Left dropped pending a
                // dedicated plan — accepted divergence on bit 3's pair-
                // level emission (cells still get the per-cell `example`
                // correctly via PLAN-077 §4.2 + §4.3).
                key: ConfigKey.property_example,
                exportJsonKey: [
                  {
                    '@keyonly': {
                      isExample: true,
                      '@bit': { isExample: true },
                      '@card': { isExample: true },
                    },
                  },
                  {
                    '@absent': {
                      isExample: true,
                      '@bit': { isExample: true },
                      '@card': { isExample: true },
                    },
                  },
                  { isExample: true, '@bit': { isExample: true }, '@card': { isExample: true } },
                ],
                description: 'Example text for the match matrix.',
                format: TagFormat.plainText,
                nullable: true,
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
            exportJsonKey: [
              // PLAN-085 / R14: the positional-blank emission for an
              // effectively-absent cell side fires ONLY when the active
              // card has at least one `[#]` variant fire. This matches
              // BPG `extractHeadingCard`'s `isHeading` gate: when no
              // `[#]` exists anywhere in the title card, BPG returns
              // undefined and no `heading` is emitted. The phantom
              // `forValues:['']` placeholder is appropriate only when
              // the card is being treated as a title-row.
              {
                predicates: ['@absent', { '@variantHasTag': '#' }],
                rule: { '@bit': { heading: { forValues: [''] } } },
              },
              { cells: { $s: { values: ['$'] } } },
            ],
            format: TextFormat.plainText,
            tags: [
              {
                key: ConfigKey.group_standardItemLeadInstructionHint,
                description: 'Standard tags for lead, instruction, and hint.',
              },
              {
                // PLAN-075: bare `$parent` reads the parent variant fire's
                // source `$` value (the current `++`-iteration's cell text).
                // Replaces `$parent.values[0]` which pinned to position 0
                // regardless of which `++`-value `[@example]` was on.
                //
                // PLAN-077: dual `[@absent, { '$cascade': '*' }]` rule
                // routes pair-key `[@example:V]` (a per-pair cascade
                // source, bound via per-card CascadeCounters scope) and
                // bit-header `[@example:V]` (cardset cascade) into the
                // per-cell `example` via `$cascade`. The aggregator in
                // `populate_variants` fires this rule ONCE per cell (BPG
                // `parseMatchMatrix` `exampleSide` precedence), avoiding
                // per-iter pollution.
                // @card scope-shift writes matrix-row container isExample.
                key: ConfigKey.property_example,
                exportJsonKey: [
                  {
                    '@keyonly': {
                      cells: { $s: { isExample: true, example: '$parent' } },
                      '@bit': { isExample: true },
                      '@card': { isExample: true },
                    },
                  },
                  {
                    predicates: ['@absent', { $cascade: '*' }],
                    rule: {
                      cells: { $s: { isExample: true, example: '$cascade' } },
                      '@bit': { isExample: true },
                      '@card': { isExample: true },
                    },
                  },
                  {
                    '@absent': {
                      cells: { $s: { isExample: true, example: '$parent' } },
                      '@bit': { isExample: true },
                      '@card': { isExample: true },
                    },
                  },
                  {
                    cells: { $s: { isExample: true, example: '$' } },
                    '@bit': { isExample: true },
                    '@card': { isExample: true },
                  },
                ],
                description: 'Example text for the match matrix.',
                format: TagFormat.bitmarkText,
                nullable: true,
              },
              {
                // PLAN-085 / R14: bare `[#]` on a value-side emits the
                // empty-string positional blank into `forValues` so the
                // array stays aligned with the cell positions (matches BPG
                // `extractHeadingCard`'s "all value-side headings present"
                // shape). The `@keyonly` rule is required for two reasons:
                // 1) it provides an emission for bare `[#]` (the `$` sigil
                //    in the unconditional rule has no source for bare); and
                // 2) the presence of any `@keyonly` rule disables the
                //    optimised-mode `should_suppress_outcome` strip (see
                //    `forward_emit.rs`) so the resulting `forValues: [""]`
                //    survives the all-natural-defaults check.
                key: ConfigKey.tag_title,
                description: 'Title of the match matrix.',
                format: TagFormat.plainText,
                jsonKey: '^heading.forValues',
                exportJsonKey: [
                  { '@keyonly': { '@bit': { heading: { forValues: [''] } } } },
                  { '@bit': { heading: { forValues: ['$'] } } },
                ],
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
              {
                // PLAN-072: cascade-fired `@example` from the bit header
                // fills each statement entry's `example` with the entry's
                // own `isCorrect`, mirroring BPG's `pushExampleDownTree`
                // for the statements cardset. Per-array-item strip removes
                // `example: false` from incorrect entries so only correct
                // entries retain `example: true`.
                key: ConfigKey.property_example,
                exportJsonKey: [
                  {
                    '@keyonly': {
                      isExample: true,
                      example: true,
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
                description:
                  'Example marker on the statement. Bare `[@example]` emits the boolean marker; valued `[@example:true|false]` emits the literal value. Cascade from bit-header fills `example` with the entry’s own `isCorrect`.',
                format: TagFormat.boolean,
                nullable: true,
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
              {
                // ALIGN-EXAMPLE-CASCADE §3.2: variant-level cascade for
                // quiz choices is delegated to group_trueFalse's
                // chain-child `@example` (`+` chain with maxEmits:1 +
                // `@parent.isCorrect=true`). Variant-level `@absent`
                // would over-fire on subsequent correct choices and on
                // incorrect ones — drop it.
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, '@bit': { isExample: true } } },
                  { isExample: true, '@bit': { isExample: true } },
                ],
                description:
                  'Example marker on the quiz choice (entry-local only; cascade handled by group_trueFalse chain-children).',
                format: TagFormat.boolean,
                nullable: true,
              },
            ],
            bodyAllowed: false,
          },
        ],
      },
    ],
  },

  //
  // quiz (responses)
  //
  [CardSetConfigKey.quizResponses]: {
    jsonKey: 'quizzes',
    exportJsonKey: { quizzes: '$' },
    sides: [
      {
        name: 'responses',
        variants: [
          {
            jsonKey: null,
            tags: [
              {
                key: ConfigKey.group_trueFalseResponses,
                description: 'Group for true/false questions.',
              },
              {
                key: ConfigKey.group_standardTags,
                description: 'Standard tags for the quiz.',
              },
              {
                // PLAN-072: cascade-fired `@example` from the bit header
                // fills each response entry's `example` with the entry's
                // own `isCorrect`, mirroring BPG's `pushExampleDownTree`
                // for the quiz-responses cardset (statements-style).
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, '@bit': { isExample: true } } },
                  {
                    '@absent': {
                      isExample: true,
                      example: '$parent.isCorrect',
                      '@bit': { isExample: true },
                    },
                  },
                  { isExample: true, '@bit': { isExample: true } },
                ],
                description:
                  'Example marker on the quiz response; cascade from bit-header fills `example` with the entry’s own `isCorrect`.',
                format: TagFormat.boolean,
                nullable: true,
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
                // Feedback choices: `[+]` / `[-]` map to choice + `requireReason`
                // (NOT `isCorrect` like trueFalse). Shadow the inherited
                // `tag_true` / `tag_false` from `group_trueFalse` to emit the
                // feedback-specific shape.
                //
                // Chain @example: `[+ X][@example]` writes
                // `isExample/example` onto the X choice only. BPG's
                // `setIsExampleFlags` (Builder.ts:4041-4172) does NOT
                // iterate `cardNode.feedbacks` — so unlike multipleChoice,
                // there is no bubble to bit-level or feedbacks-level
                // isExample. Pattern omits `@bit` scope-shift accordingly.
                // No `@absent`/`@parent.isCorrect` cascade rules either:
                // BPG's `pushExampleDownTree` (Builder.ts:3777-3849) has
                // no feedback dispatch, so bit-header `[@example]` does
                // not flow into feedback choices.
                key: ConfigKey.tag_true,
                exportJsonKey: { choices: [{ choice: '$', requireReason: true }] },
                description: 'Reason-required choice for feedback (`[+]`).',
                maxCount: Count.infinity,
                format: TagFormat.plainText,
                chain: [
                  {
                    key: ConfigKey.property_example,
                    exportJsonKey: [
                      { '@keyonly': { isExample: true, example: true } },
                      { isExample: true, example: '$' },
                    ],
                    description: 'Per-choice example marker for feedback `[+]`.',
                    format: TagFormat.boolean,
                    maxCount: 1,
                    nullable: true,
                  },
                  {
                    // `[+ X][! foo]` chains `!` (instruction) onto the
                    // choice; same for `[?]` (hint), `[%]` (item),
                    // `[%2]`/`[%3]`/`[%4]` (lead/pageNumber/marginNumber).
                    // Mirrors group_trueFalse's `+` chain shape.
                    key: ConfigKey.group_standardItemLeadInstructionHint,
                    description:
                      'Item, lead, page number, margin number, instruction and hint chained onto the feedback choice.',
                  },
                ],
              },
              {
                key: ConfigKey.tag_false,
                exportJsonKey: { choices: [{ choice: '$', requireReason: false }] },
                description: 'Reason-not-required choice for feedback (`[-]`).',
                maxCount: Count.infinity,
                format: TagFormat.plainText,
                chain: [
                  {
                    key: ConfigKey.property_example,
                    exportJsonKey: [
                      { '@keyonly': { isExample: true, example: true } },
                      { isExample: true, example: '$' },
                    ],
                    description: 'Per-choice example marker for feedback `[-]`.',
                    format: TagFormat.boolean,
                    maxCount: 1,
                    nullable: true,
                  },
                  {
                    key: ConfigKey.group_standardItemLeadInstructionHint,
                    description:
                      'Item, lead, page number, margin number, instruction and hint chained onto the feedback choice.',
                  },
                ],
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
            // PLAN: feedback.reason — Object-only variant pattern. Per
            // SYNTAX.md §8.1, sibling tag emissions do NOT auto-wrap
            // under `reason.*`; each tag here spells out the full path.
            // Body is a plain string (BPG `parseFeedback` uses
            // `cardBodyStr ?? ''` for `reason.text`).
            jsonKey: 'reason.text',
            exportJsonKey: { reason: { text: '$' } },
            format: TextFormat.plainText,
            tags: [
              {
                // Instruction lands under reason. Hint/item/lead/etc.
                // omitted: not exercised by any fixture and BPG's
                // `parseFeedback` spreads only the tags actually present
                // — adding the rest can be done lazily as fixtures
                // require them, with the same `{reason: {…}}` wrapper.
                key: ConfigKey.tag_instruction,
                exportJsonKey: { reason: { instruction: '$' } },
                description: 'Instruction for the feedback reason.',
                format: TagFormat.bitmarkText,
              },
              {
                key: ConfigKey.property_reasonableNumOfChars,
                exportJsonKey: [
                  { '@absent': { reason: { reasonableNumOfChars: '$ancestor' } } },
                  { reason: { reasonableNumOfChars: '$' } },
                ],
                description: 'Property for reasonable number of characters.',
                format: TagFormat.number,
              },
              {
                // ALIGN-EXAMPLE-CASCADE §3.9: `feedback.reason` is NOT in
                // BPG's `pushExampleDownTree` dispatch — no bit-header
                // cascade. Local emission only.
                //
                // Both `reason.example` and `feedbacks[].example` are
                // `TextAst` per BPG's schema — paragraph arrays. Format
                // here is `bitmarkText` so `$` coerces to a paragraph
                // array at both write sites.
                key: ConfigKey.property_example,
                exportJsonKey: [
                  {
                    // Bare `[@example]`: reason.example is TextAst — BPG
                    // coerces the boolean default to a paragraph
                    // containing the string "true". feedbacks[].example
                    // is not TextAst, stays a boolean. Two literal writes.
                    '@keyonly': {
                      reason: {
                        isExample: true,
                        example: [{ type: 'paragraph', content: [{ text: 'true', type: 'text' }] }],
                      },
                      isExample: true,
                      example: true,
                      '@bit': { isExample: true },
                    },
                  },
                  {
                    reason: { isExample: true, example: '$' },
                    isExample: true,
                    example: '$',
                    '@bit': { isExample: true },
                  },
                ],
                description:
                  'Example text for the feedback reason (entry-local only; no bit-header cascade).',
                format: TagFormat.bitmarkText,
                nullable: true,
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
              {
                // ALIGN-EXAMPLE-CASCADE §3.10: `questions` is NOT in BPG's
                // `pushExampleDownTree` dispatch — bit-header `[@example]`
                // does not propagate `example`/`isExample` onto question
                // entries. Only entry-local `[@example]` fires.
                //
                // BPG's `BaseBuilder.toExample` for interview questions
                // (Builder.ts:2575,2588) uses `data.__sampleSolutionAst`
                // as `defaultExample` — bare `[@example]` (which sets
                // `__isDefaultExample=true, example=undefined`) emits the
                // parsed sample-solution AST in the `example` slot. The
                // `@keyonly` rule mirrors that runtime behaviour via
                // `$parent.sampleSolution` — the chain-walker's post-walk
                // retry resolves this once the sibling `[@sampleSolution]`
                // chain has merged into the shared scope (interview's
                // `[@example]` typically precedes `[@sampleSolution]` in
                // source). Format coercion turns the resolved string
                // value into a PM tree.
                key: ConfigKey.property_example,
                exportJsonKey: [
                  {
                    '@keyonly': {
                      isExample: true,
                      example: '$parent.sampleSolution',
                      '@bit': { isExample: true },
                    },
                  },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description:
                  'Example marker for the question (entry-local only; no bit-header cascade).',
                format: TagFormat.bitmarkText,
                nullable: true,
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
                // ALIGN-EXAMPLE-CASCADE §3.11: `elements` is NOT in BPG's
                // `pushExampleDownTree` dispatch — no bit-header cascade.
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description:
                  'Example text for the element (entry-local only; no bit-header cascade).',
                format: TagFormat.plainText,
                nullable: true,
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
  // PLAN-079: supports BOTH source formats and collapses to the same basic
  // output (`{ columns?, data, columnWidths? }`):
  //
  // 1. Basic format — first card carries `[#X]` markers (fire `tag_title`
  //    → `^table.columns[]`); subsequent cards are body rows. Cards have
  //    no qualifier, so they route to the `table-body` (default) section.
  //
  // 2. Extended format — `==== table-header ====` / `==== table-footer ====`
  //    qualifiers. The `table-header` section uses `@cardIndex=0` to route
  //    the first header card's cells to `columns` and demote remaining
  //    header cards (rows) into `data`. Per-cell `[@tableRowSpan]` /
  //    `[@tableScope]` / `[@tableCellType]` tags are valid-but-unmapped
  //    here (no per-cell metadata in basic shape) — declared on the cell
  //    variant below.
  //
  [CardSetConfigKey.table]: {
    jsonKey: null,
    exportJsonKey: null,
    // PLAN-109 / HTML.md §8 — idiomatic HTML mapping. The classic (non-extended)
    // table produces the same `<table>`/`<thead>`/`<tbody>`/`<tfoot>` structure as
    // table-extended, so the structural htmlKeys mirror that cardSet. NOTE: the
    // JSON side routes the FIRST header card → `columns` (header) and SUBSEQUENT
    // header cards → `data` (body); HTML uses a uniform `<thead>` for the whole
    // `table-header` section, so a multi-card header (e.g. a second header card
    // that JSON sends to `data`) renders as additional `<thead>` rows rather than
    // moving to `<tbody>`. Per-card header/body splitting needs engine-level
    // routing not yet expressible in the pattern vocabulary — see PLAN-109.
    htmlKey: { '@el': 'table', '@children': '$' },
    sections: {
      'table-header': {
        // First header card's row of cells → `columns`. Subsequent header
        // cards' rows → `data` (per-card append; `[$]` shape because
        // per-card emission fires once per card, multiple fires deep_merge-
        // append). PLAN-079 + PLAN-080: predicates inside exportJsonKey
        // both ROUTE cards to this section (when no explicit `==== table-
        // header ====` qualifier) and SELECT the rule body once routed.
        // First rule = first card with any `[#]` → `columns`; second rule
        // = subsequent cards in this section → `data` (per-row append).
        jsonKey: 'table.columns',
        exportJsonKey: [
          {
            predicates: [{ '@cardIndex': 0 }, { '@variantHasTag': '#' }],
            rule: { '@bit': { table: { columns: '$' } } },
          },
          { '@cardIndex=0': { '@bit': { table: { columns: '$' } } } },
          { '@bit': { table: { data: ['$'] } } },
        ],
        // Header section → `<thead>` rows of `<th>`; `@tableColWidth` bubbles a
        // `width` attr onto the enclosing `<th>` (HTML-C2).
        htmlKey: { '@el': 'thead', '@children': { '@el': 'tr', '@children': '$' } },
        sideHtmlKey: { '@el': 'th', '@children': '$' },
      },
      'table-body': {
        // Batched emission: `$` is the entire 2D array of body card rows.
        // This is the default section (no qualifier → cards land here).
        jsonKey: 'table.data',
        exportJsonKey: { '@bit': { table: { data: '$' } } },
        htmlKey: { '@el': 'tbody', '@children': { '@el': 'tr', '@children': '$' } },
        isDefault: true,
      },
      'table-footer': {
        // Batched emission: `$` is the entire 2D array of footer rows.
        jsonKey: 'table.data',
        exportJsonKey: { '@bit': { table: { data: '$' } } },
        // Footer cells route to `data` (not `columns`), so they are `<td>` (no
        // sideHtmlKey override — the cell side default applies).
        htmlKey: { '@el': 'tfoot', '@children': { '@el': 'tr', '@children': '$' } },
      },
    },
    sides: [
      {
        name: 'cell',
        repeat: true,
        // Default (body/footer) cell → `<td>`; the header section overrides to
        // `<th>` via its sideHtmlKey (HTML.md §8).
        htmlKey: { '@el': 'td', '@children': '$' },
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
                // HTML.md §8: first-match predicate selecting `<th>` vs `<td>`.
                htmlKey: [{ '@value=th': { '@el': 'th' } }, { '@absent': { '@el': 'td' } }],
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
                jsonKey: '^table.columnWidths[{s}]',
                exportJsonKey: { '@bit': { table: { columnWidths: { $s: '$' } } } },
                // HTML.md §8 + HTML-C2: contribute a `width` attribute onto the
                // enclosing cell element (`<th>`/`<td>`).
                htmlKey: { '@el': { '@attr': { width: '$' } } },
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
    // PLAN-109 / HTML.md §8 — idiomatic HTML mapping for the extended table.
    // The card-set container is the `<table>` element; each section is a
    // table section element (`<thead>`/`<tbody>`/`<tfoot>`) whose children are
    // `<tr>` rows, and each cell side is a `<td>` (body) or `<th>` (header /
    // footer, via the section sideHtmlKey override).
    htmlKey: { '@el': 'table', '@children': '$' },
    sections: {
      'table-header': {
        jsonKey: 'table.header.rows',
        // PLAN-080: section dispatch via predicates inside exportJsonKey.
        // Cards with no explicit `==== table-header ====` qualifier
        // route here if FIRST CARD contains any `[#]` tag in any
        // variant. Explicit-qualifier cards fall through to the
        // unconditional fallback rule. Both rules use the per-card
        // append shape `rows: ['$']` — the runtime triggers per-card
        // emission whenever the pattern carries predicates, and each
        // fire appends a single-element array (multi-fire deep-merge
        // concatenates).
        exportJsonKey: [
          {
            predicates: [{ '@cardIndex': 0 }, { '@variantHasTag': '#' }],
            rule: { table: { header: { rows: ['$'] } } },
          },
          { table: { header: { rows: ['$'] } } },
        ],
        htmlKey: { '@el': 'thead', '@children': { '@el': 'tr', '@children': '$' } },
        sideJsonKey: 'cells[{s}]|set(title=true)',
        sideExportJsonKey: { cells: { $s: { title: true, $: '$' } } },
        // Header cells are `<th>`. The `width` attribute is contributed by the
        // `@tableColWidth` tag, which bubbles it onto the enclosing `<th>`
        // (HTML-C2) — so it is not repeated here.
        sideHtmlKey: { '@el': 'th', '@children': '$' },
      },
      'table-body': {
        jsonKey: 'table.body.rows',
        exportJsonKey: { table: { body: { rows: '$' } } },
        htmlKey: { '@el': 'tbody', '@children': { '@el': 'tr', '@children': '$' } },
        isDefault: true,
      },
      'table-footer': {
        jsonKey: 'table.footer.rows',
        exportJsonKey: { table: { footer: { rows: '$' } } },
        htmlKey: { '@el': 'tfoot', '@children': { '@el': 'tr', '@children': '$' } },
        sideJsonKey: 'cells[{s}]|set(title=true)',
        sideExportJsonKey: { cells: { $s: { title: true, $: '$' } } },
        // Footer cells render as `<th>` (mirrors the header `title: true`
        // mapping); §8 lists only the header side, so this parallels it.
        sideHtmlKey: { '@el': 'th', '@children': '$' },
      },
    },
    sides: [
      {
        name: 'cell',
        repeat: true,
        jsonKey: 'cells[{s}]',
        exportJsonKey: { cells: { $s: '$' } },
        // Default (body) cell → `<td>`; the header/footer sections override the
        // side to `<th>` via their sideHtmlKey (HTML.md §8).
        htmlKey: { '@el': 'td', '@children': '$' },
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
                // PLAN-080: the `[#]` tag writes its text to the cell's
                // `content` field. When the card is in the `table-header`
                // section, the section's sideExportJsonKey wraps each
                // cell with `title: true` automatically.
                jsonKey: 'content',
                exportJsonKey: { content: '$' },
                description: 'Title text of the table cell (header rows).',
              },
              {
                key: ConfigKey.property_tableCellType,
                jsonKey: 'title|bool(th)',
                exportJsonKey: [{ '@value=th': { title: true } }],
                // HTML.md §8: same first-match predicate machinery selecting
                // `<th>` vs `<td>` instead of `title:true` vs nothing.
                htmlKey: [{ '@value=th': { '@el': 'th' } }, { '@absent': { '@el': 'td' } }],
                description: 'Table cell type (th/td).',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.property_tableRowSpan,
                jsonKey: 'rowspan',
                exportJsonKey: { rowspan: '$' },
                // HTML-C2: contribute a `rowspan` attribute onto the enclosing
                // cell element (`<th>`/`<td>`).
                htmlKey: { '@el': { '@attr': { rowspan: '$' } } },
                description: 'Number of rows the cell spans.',
                format: TagFormat.number,
              },
              {
                key: ConfigKey.property_tableColSpan,
                jsonKey: 'colspan',
                exportJsonKey: { colspan: '$' },
                // HTML-C2: contribute a `colspan` attribute onto the enclosing
                // cell element (`<th>`/`<td>`).
                htmlKey: { '@el': { '@attr': { colspan: '$' } } },
                description: 'Number of columns the cell spans.',
                format: TagFormat.number,
              },
              {
                key: ConfigKey.property_tableScope,
                jsonKey: 'scope',
                exportJsonKey: { scope: '$' },
                // HTML-C2: contribute a `scope` attribute onto the enclosing
                // cell element (`<th>`/`<td>`).
                htmlKey: { '@el': { '@attr': { scope: '$' } } },
                description: 'Scope attribute for header cells.',
                format: TagFormat.plainText,
              },
              {
                key: ConfigKey.property_tableColWidth,
                // PLAN-080: write to the cell's `colwidth` field.
                jsonKey: 'colwidth',
                exportJsonKey: { colwidth: '$' },
                // HTML.md §8 + HTML-C2: contribute a `width` attribute onto the
                // enclosing cell element (`<th>`/`<td>`).
                htmlKey: { '@el': { '@attr': { width: '$' } } },
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
                exportJsonKey: { audio: { type: 'audio', audio: { src: '$' } } },
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
                // ALIGN-EXAMPLE-CASCADE §3.12: `bot-action-responses` is
                // NOT in BPG's `pushExampleDownTree` dispatch — no bit-
                // header cascade.
                key: ConfigKey.property_example,
                exportJsonKey: [
                  { '@keyonly': { isExample: true, example: true, '@bit': { isExample: true } } },
                  { isExample: true, example: '$', '@bit': { isExample: true } },
                ],
                description:
                  'Example text for the bot action response (entry-local only; no bit-header cascade).',
                format: TagFormat.plainText,
                nullable: true,
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
  // page-footer-sections — mirrors example-bit-list but emits cards under
  // `sections` instead of `listItems`. BPG's JsonGenerator special-cases
  // BitType.pageFooter in code; this dedicated cardSet expresses the same
  // routing as pure config so the Rust serializer can pick it up.
  //
  [CardSetConfigKey.pageFooterSections]: {
    jsonKey: 'sections',
    exportJsonKey: { sections: '$' },
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
                description: 'Standard tags for page-footer section bits.',
              },
              {
                exportJsonKey: { title: '$' },
                key: ConfigKey.tag_title,
                description: 'Title of the page-footer section.',
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
