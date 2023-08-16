import { CardSetConfig } from '../../../model/enum/BitType';
import { CardSetType } from '../../../model/enum/CardSetType';
import { PropertyKey } from '../../../model/enum/PropertyKey';
import { ResourceType } from '../../../model/enum/ResourceType';
import { TagType } from '../../../model/enum/TagType';

import { TAGS_CHAIN_TRUE_FALSE } from './chainBitConfigs';
import { TAGS_ITEM_LEAD_INSTRUCTION_HINT, TAGS_PROPERTY_EXAMPLE } from './standardBitConfigs';

// flashcards

const CARD_SET_FLASHCARDS: CardSetConfig = {
  type: CardSetType.flashcards,
  variants: [
    [
      {
        tags: {
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
        },
        bodyAllowed: true,
        infiniteRepeat: true,
      },
    ],
  ],
};

// elements

const CARD_SET_ELEMENTS: CardSetConfig = {
  type: CardSetType.elements,
  variants: [
    [
      {
        tags: {
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
        },
        bodyAllowed: true,
        infiniteRepeat: true,
      },
    ],
  ],
};

// statements

const CARD_SET_STATEMENTS: CardSetConfig = {
  type: CardSetType.statements,
  variants: [
    [
      {
        tags: {
          [TagType.True]: { maxCount: 1 },
          [TagType.False]: { maxCount: 1 },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
        },
      },
    ],
  ],
};

// quiz

const CARD_SET_QUIZ: CardSetConfig = {
  type: CardSetType.quiz,
  variants: [
    [
      {
        tags: {
          ...TAGS_CHAIN_TRUE_FALSE,
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
        },
      },
    ],
  ],
};

// questions

const CARD_SET_QUESTIONS: CardSetConfig = {
  type: CardSetType.questions,
  variants: [
    [
      {
        tags: {
          [TagType.SampleSolution]: {}, // 16.08.2023 Deprecated, but currently still supported
          [PropertyKey.sampleSolution]: { isProperty: true },
          [PropertyKey.shortAnswer]: { isProperty: true },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
        },
        bodyAllowed: true,
      },
    ],
  ],
};

// matchPairs
// TODO: We actually need to allow for different card configurations, because titles are valid on the first card only.
// For now we allow them to be valid on all cards, but we need to change this.

const CARD_SET_MATCH_PAIRS: CardSetConfig = {
  type: CardSetType.matchPairs,
  variants: [
    // Side 1
    [
      // Variant 1..N
      {
        tags: {
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
          [TagType.Title]: {},
        },
        bodyAllowed: true,
        infiniteRepeat: true,
      },
    ],
  ],
};

const CARD_SET_MATCH_AUDIO_PAIRS: CardSetConfig = {
  type: CardSetType.matchPairs,
  variants: [
    // Side 1
    [
      // Variant 1..N
      {
        tags: {
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
          [TagType.Title]: {},
          [ResourceType.audio]: { isResource: true },
        },
        bodyAllowed: true,
        infiniteRepeat: true,
      },
    ],
  ],
};

const CARD_SET_MATCH_IMAGE_PAIRS: CardSetConfig = {
  type: CardSetType.matchPairs,
  variants: [
    // Side 1
    [
      // Variant 1..N
      {
        tags: {
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
          [TagType.Title]: {},
          [ResourceType.image]: { isResource: true },
        },
        bodyAllowed: true,
        infiniteRepeat: true,
      },
    ],
  ],
};

// matchMatrix

const CARD_SET_MATCH_MATRIX: CardSetConfig = {
  type: CardSetType.matchMatrix,
  variants: [
    // Side 1
    [
      // Variant 1..N
      {
        tags: {
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
          [TagType.Title]: {},
        },
        bodyAllowed: true,
        infiniteRepeat: true,
      },
    ],
  ],
};

// botActionResponses

const CARD_SET_BOT_ACTION_RESPONSES: CardSetConfig = {
  type: CardSetType.botActionResponses,
  variants: [
    [
      {
        tags: {
          [PropertyKey.reaction]: { isProperty: true },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
          ...TAGS_PROPERTY_EXAMPLE,
        },
        bodyAllowed: true,
      },
    ],
  ],
};

export {
  CARD_SET_FLASHCARDS,
  CARD_SET_ELEMENTS,
  CARD_SET_STATEMENTS,
  CARD_SET_QUIZ,
  CARD_SET_QUESTIONS,
  CARD_SET_MATCH_PAIRS,
  CARD_SET_MATCH_AUDIO_PAIRS,
  CARD_SET_MATCH_IMAGE_PAIRS,
  CARD_SET_MATCH_MATRIX,
  CARD_SET_BOT_ACTION_RESPONSES,
};
