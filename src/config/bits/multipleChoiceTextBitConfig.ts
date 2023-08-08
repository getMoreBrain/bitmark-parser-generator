import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_TRUE_FALSE } from './generic/chainBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const MULTIPLE_CHOICE_TEXT_CONFIG: BitTypeMetadata = {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_TRUE_FALSE, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
};

BitType.setMetadata<BitTypeMetadata>(BitType.multipleChoiceText, MULTIPLE_CHOICE_TEXT_CONFIG);

// Aliases

BitType.setMetadata<BitTypeMetadata>(BitType.coachSelfReflectionMultipleChoiceText, MULTIPLE_CHOICE_TEXT_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.coachCallToActionMultipleChoiceText, MULTIPLE_CHOICE_TEXT_CONFIG);
