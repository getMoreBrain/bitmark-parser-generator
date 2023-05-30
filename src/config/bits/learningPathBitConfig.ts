import { INFINITE_COUNT, TagDataMap } from '../../model/config/TagData';
import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
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

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathBook, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathBotTraining, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathClassroomEvent, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathClassroomTraining, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathClosing, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathExternalLink, {
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

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathFeedback, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathLearningGoal, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathLti, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathSign, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathStep, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathVideoCall, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_LEARNING_PATH_RESOURCE,
    [PropertyKey.videoCallLink]: { isProperty: true },
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});
