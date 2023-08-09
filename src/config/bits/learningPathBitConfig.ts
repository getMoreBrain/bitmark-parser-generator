import { INFINITE_COUNT, TagDataMap } from '../../model/config/TagData';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { PropertyKey } from '../../model/enum/PropertyKey';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const TAGS_LEARNING_PATH_RESOURCE: TagDataMap = {
  [PropertyKey.action]: { isProperty: true },
  [PropertyKey.duration]: { isProperty: true },
  [PropertyKey.date]: { isProperty: true },
  [PropertyKey.location]: { isProperty: true },
  [PropertyKey.list]: { isProperty: true, maxCount: INFINITE_COUNT },
  [PropertyKey.textReference]: { isProperty: true },
  [PropertyKey.isTracked]: { isProperty: true },
  [PropertyKey.isInfoOnly]: { isProperty: true },
  // Not sure if @book belongs to all learning paths, but for now assume it does
  [PropertyKey.book]: {
    isProperty: true,
    chain: {
      [TagType.Reference]: { maxCount: 2 },
    },
  },
};

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.learningPathBook, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.learningPathExternalLink, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
    [PropertyKey.externalLink]: { isProperty: true },
    [PropertyKey.externalLinkText]: { isProperty: true },
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.learningPathVideoCall, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
    [PropertyKey.videoCallLink]: { isProperty: true },
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});
