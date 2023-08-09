import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

import {
  CARD_SET_MATCH_AUDIO_PAIRS,
  CARD_SET_MATCH_IMAGE_PAIRS,
  CARD_SET_MATCH_MATRIX,
  CARD_SET_MATCH_PAIRS,
} from './generic/cardSetBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.match, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.matchMatrix, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_MATRIX,
  bodyAllowed: true,
  footerAllowed: true,
});

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.matchAudio, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_AUDIO_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.matchPicture, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_MATCH_IMAGE_PAIRS,
  bodyAllowed: true,
  footerAllowed: true,
});
