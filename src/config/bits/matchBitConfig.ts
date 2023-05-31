import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

import {
  CARD_SET_MATCH_AUDIO_PAIRS,
  CARD_SET_MATCH_IMAGE_PAIRS,
  CARD_SET_MATCH_MATRIX,
  CARD_SET_MATCH_PAIRS,
} from './generic/cardSetBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.match, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.matchAll, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.matchReverse, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.matchAllReverse, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.matchSolutionGrouped, {
  tags: { ...TAGS_DEFAULT },
  resourceAttachmentAllowed: false,
  cardSet: CARD_SET_MATCH_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.matchMatrix, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_MATRIX,
  bodyAllowed: true,
  footerAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.matchAudio, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_AUDIO_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.matchPicture, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_IMAGE_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});
