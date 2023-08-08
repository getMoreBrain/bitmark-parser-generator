import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_GAP, TAGS_CHAIN_TRUE_FALSE } from './generic/chainBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const CLOZE_AND_MULTIPLE_CHOICE_TEXT_CONFIG: BitTypeMetadata = {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_GAP, ...TAGS_CHAIN_TRUE_FALSE, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
};

BitType.setMetadata<BitTypeMetadata>(BitType.clozeAndMultipleChoiceText, CLOZE_AND_MULTIPLE_CHOICE_TEXT_CONFIG);

// Aliases

BitType.setMetadata<BitTypeMetadata>(
  BitType.coachCallToActionClozeAndMultipleChoiceText,
  CLOZE_AND_MULTIPLE_CHOICE_TEXT_CONFIG,
);
