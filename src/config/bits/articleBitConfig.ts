import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { ExampleType } from '../../model/enum/ExampleType';
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
const ARTICLE_WITH_EXAMPLE_CONFIG: BitTypeMetadata = {
  ...ARTICLE_CONFIG,
  rootExampleType: ExampleType.string,
};
BitType.setMetadata<BitTypeMetadata>(BitType.article, ARTICLE_CONFIG);

// Aliases

BitType.setMetadata<BitTypeMetadata>(BitType.appAiPrompt, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.aiPrompt, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.articleAi, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.articleAttachment, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.assignment, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.audioTranscript, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bitmarkExample, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.blogArticle, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bug, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.checklist, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.coachAudioTranscript, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.coachCallToActionChecklist, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.coachHomeRules, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.coachVideoTranscript, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.correction, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookPreparation, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookStep, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookIngredients, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookRemark, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookVariation, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookInsert, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookArrangement, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookPracticeAdvise, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookPlate, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookRecommendation, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookPersonalRecommendation, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookSideDrink, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookSideDish, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.cookTimer, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.danger, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.details1, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.details, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.editorial, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.example, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.editorNote, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.featured, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.help, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.hint, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.info, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLearningOutcomes, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langEnablingLanguageSkills, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLifeSkills, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langEnglishAroundWorld, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langGoodToKnow, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLearningGoal, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLearningStrategy, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLikeALocal, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langMaterial, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langUsefulPhrases, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLevelDown, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langLevelUp, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langExtraActivity, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langVideoScript, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langAudioScript, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langVocabulary, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langHomework, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langTeacherNote, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.langTeacherPronunciation, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.message, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.newspaperArticle, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.note, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.noteAi, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.notebookArticle, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.page, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.preparationNote, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.releaseNotesSummary, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.remark, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.selfAssessment, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.sideNote, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.statement, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.summary, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.summaryAi, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.videoTranscript, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.warning, ARTICLE_WITH_EXAMPLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.workbookArticle, ARTICLE_WITH_EXAMPLE_CONFIG);
