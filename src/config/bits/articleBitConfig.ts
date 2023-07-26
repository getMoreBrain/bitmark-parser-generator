import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const ARTICLE_CONFIG: BitTypeMetadata = {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
};
BitType.setMetadata<BitTypeMetadata>(BitType.article, ARTICLE_CONFIG);

// Aliases
BitType.setMetadata<BitTypeMetadata>(BitType.aiPrompt, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.articleAttachment, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.assignment, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.blogArticle, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bug, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.correction, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.danger, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.details, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.editorial, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.example, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.featured, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.help, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.hint, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.info, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.message, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.newspaperArticle, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.note, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.notebookArticle, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.page, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.preparationNote, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.releaseNotesSummary, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.remark, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.selfAssessment, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.sideNote, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.statement, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.warning, ARTICLE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.workbookArticle, ARTICLE_CONFIG);
