import { INFINITE_COUNT } from '../../../model/config/TagData';
import { CardSetConfig } from '../../../model/enum/BitType';
import { CardSetType } from '../../../model/enum/CardSetType';
import { TagType } from '../../../model/enum/TagType';

import { TAGS_ITEM_LEAD_INSTRUCTION_HINT } from './standardBitConfigs';

// elements

const CARD_SET_ELEMENTS: CardSetConfig = {
  type: CardSetType.elements,
  variants: [
    [
      {
        tags: {
          [TagType.True]: { maxCount: INFINITE_COUNT },
          [TagType.False]: { maxCount: INFINITE_COUNT },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
        },
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
          [TagType.True]: { maxCount: INFINITE_COUNT },
          [TagType.False]: { maxCount: INFINITE_COUNT },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
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
          [TagType.True]: { maxCount: INFINITE_COUNT },
          [TagType.False]: { maxCount: INFINITE_COUNT },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
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
          [TagType.True]: { maxCount: INFINITE_COUNT },
          [TagType.False]: { maxCount: INFINITE_COUNT },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
        },
      },
    ],
  ],
};

// matchPairs

const CARD_SET_MATCH_PAIRS: CardSetConfig = {
  type: CardSetType.matchPairs,
  variants: [
    [
      {
        tags: {
          [TagType.True]: { maxCount: INFINITE_COUNT },
          [TagType.False]: { maxCount: INFINITE_COUNT },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
        },
      },
    ],
  ],
};

// matchMatrix

const CARD_SET_MATCH_MATRIX: CardSetConfig = {
  type: CardSetType.matchMatrix,
  variants: [
    [
      {
        tags: {
          [TagType.True]: { maxCount: INFINITE_COUNT },
          [TagType.False]: { maxCount: INFINITE_COUNT },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
        },
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
          [TagType.True]: { maxCount: INFINITE_COUNT },
          [TagType.False]: { maxCount: INFINITE_COUNT },
          ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
        },
      },
    ],
  ],
};

export {
  CARD_SET_ELEMENTS,
  CARD_SET_STATEMENTS,
  CARD_SET_QUIZ,
  CARD_SET_QUESTIONS,
  CARD_SET_MATCH_PAIRS,
  CARD_SET_MATCH_MATRIX,
  CARD_SET_BOT_ACTION_RESPONSES,
};
