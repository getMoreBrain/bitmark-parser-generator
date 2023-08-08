import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_GAP } from './generic/chainBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const CLOZE_CONFIG: BitTypeMetadata = {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_GAP, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
};

BitType.setMetadata<BitTypeMetadata>(BitType.cloze, CLOZE_CONFIG);

// Aliases

BitType.setMetadata<BitTypeMetadata>(BitType.clozeInstructionGrouped, CLOZE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.clozeSolutionGrouped, CLOZE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.coachSelfReflectionCloze, CLOZE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.coachCallToActionCloze, CLOZE_CONFIG);
