import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { CARD_SET_BOT_ACTION_RESPONSES } from './generic/cardSetBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.botActionResponse, {
  tags: { ...TAGS_DEFAULT },
  resourceAttachmentAllowed: false,
  cardSet: CARD_SET_BOT_ACTION_RESPONSES,
  bodyAllowed: true,
  footerAllowed: true,
});
