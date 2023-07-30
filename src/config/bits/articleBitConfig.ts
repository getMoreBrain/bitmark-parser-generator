import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const ARTICLE_CONFIG: BitTypeMetadata = {
  tags: {
    ...TAGS_DEFAULT,
    [TagType.Title]: {},
    ...TAGS_CHAIN_ANY_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
};
BitType.setMetadata<BitTypeMetadata>(BitType.article, ARTICLE_CONFIG);

// Aliases
BitType.setMetadata<BitTypeMetadata>(BitType.aiPrompt, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.articleAi, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.articleAttachment, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.assignment, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.blogArticle, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bug, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.correction, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookPreparation, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookStep, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookIngredients, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookRemark, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookVariation, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookInsert, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookArrangement, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookPracticeAdvise, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookPlate, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookRecommendation, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookPersonalRecommendation, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookSideDrink, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookSideDish, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookTimer, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.danger, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.details1, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.details, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.editorial, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.example, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.featured, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.help, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.hint, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.info, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLearningOutcomes, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langEnablingLanguageSkills, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLifeSkills, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langEnglishAroundWorld, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langGoodToKnow, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLearningStrategy, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLikeALocal, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langUsefulPhrases, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLevelDown, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLevelUp, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langExtraActivity, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langVideoScript, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langVideoScript, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langAudioScript, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langVocabulary, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langHomework, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langTeacherNote, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.message, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.newspaperArticle, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.note, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.noteAi, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.notebookArticle, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.page, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.preparationNote, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.releaseNotesSummary, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.remark, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.selfAssessment, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.sideNote, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.statement, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.summary, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.summaryAi, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.warning, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.workbookArticle, ARTICLE_CONFIG);
